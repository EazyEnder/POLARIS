import { OrbitControls, Sphere} from '@react-three/drei'
import * as THREE from 'three'
import { useFrame, useThree, useLoader, Canvas} from '@react-three/fiber'
import { useEffect ,useRef, Component, useMemo, useState } from 'react'
import { useFBO} from '@react-three/drei'
import { createPortal } from "@react-three/fiber";
import "./CloudViewer.shader"
import { fetchDataFile } from '../../config/utils'
import {Stats} from '@react-three/drei' 
import { getTranslation } from '../../config/Localization'

function create3DTexture({ shape, dtype, buffer }) {
  const [depth, height, width] = shape;
  const TypedArray = Float32Array;
  const data = new TypedArray(buffer);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.log(data[i]+1);
  }
  let maxVal = -Infinity;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > maxVal) maxVal = data[i];
  }

  // Normalize all values to [0,1] by dividing by maxVal
  if (maxVal > 0) {
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i] / maxVal;
    }
  }

  const texture = new THREE.Data3DTexture(data, width, height, depth);

  texture.format = THREE.RedFormat;
  texture.type = THREE.FloatType;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.unpackAlignment = 1;
  texture.needsUpdate = true;

  return texture;
}

function CloudView({path, setLoading}){
  const meshRef = useRef()

  const { camera } = useThree();

  const plan_geometry = useMemo(()=>new THREE.PlaneGeometry(1,1))
  const noise_resolution = 1000

  const [hasTexture, setHasTexture] = useState(false)
  const [volumeTexture, setVolumeTexture] = useState(null)

  const noisesShader = useRef();
  const cloudShaderRef = useRef()

  const [prerender_scene] = useState(() => new THREE.Scene())
  const [prerender_camera] = useState(() => new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow(2,53),1))
  const target = useFBO(noise_resolution+1,noise_resolution+1, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
  })

  useEffect(() => {
    setLoading(getTranslation("ui_loading_cloudview") + " - " + path.split("/")[ path.split("/").length-1]);
    fetchDataFile(path).then(volume => {
      const tex = create3DTexture(volume);
      setVolumeTexture(tex);
      cloudShaderRef.current.uniforms.u_density.value = volumeTexture;
    }).finally(() => {
      setLoading(false);
    });
  }, [path]);

  //Prerender noises
  /**
  useFrame((state)=> {
    if(!hasTexture){
        state.gl.setRenderTarget(target)
        state.gl.clear()
        state.gl.render(prerender_scene, prerender_camera)
        state.gl.setRenderTarget(null)

        setHasTexture(true)
    }

        cloudShaderRef.current.uniforms["u_noises"] = {value:target.texture}
    })
   */

  const BLUE_NOISE = useLoader(THREE.TextureLoader, '/assets/global/bluenoise_512.png');
  useFrame((state) => {
    const { clock } = state;
    cloudShaderRef.current.uniforms.u_time.value = clock.getElapsedTime();
    cloudShaderRef.current.uniforms.u_camPos.value = camera.position;
    cloudShaderRef.current.uniforms.u_bluenoise.value = BLUE_NOISE;
    cloudShaderRef.current.uniforms.u_density.value = volumeTexture;
    meshRef.current.position.set(camera.position.getComponent(0),camera.position.getComponent(1),camera.position.getComponent(2));
  });

  const shader = useMemo(
    ()=>{
      return (
        <cloudShader ref={cloudShaderRef} u_time={0.0} u_camPos={[0.0,0.0,0.0]}side={THREE.BackSide} transparent/>
    )},
    []
  )

  const renderSphere = useMemo(()=>{
    return(
      <mesh ref={meshRef} position={camera.position} scale={5.} transparent>
        {shader}
        <icosahedronGeometry args={[1.0, 10.]}/>
      </mesh>
    )
  }, [hasTexture])

  return (
    <>
        {/**{!hasTexture && createPortal(
            <mesh scale={[2.,2.,2.]}>
              <cloudNoisesShader ref={noisesShader} />
              <bufferGeometry {...plan_geometry}>
              </bufferGeometry>
            </mesh>,
            prerender_scene
          )
        }*/}
        {renderSphere}
    </>
  )
}

function CloudScenePreView(props){
    //Build scene
    let camera_m = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.0001, 5000 );
    camera_m.position.set(0, 0, 7.5);
    camera_m.up.set(0, 0, 1);

    const orbit = useRef();

    const { gl,scene, camera } = useThree();

    const set = useThree((state) => state.set)
    useEffect(() => {
        set({ camera: camera_m})
      }, [])

      //gl.autoClear = true
      //gl.clear();
      gl.antialias = true;
      gl.logarithmicDepthBuffer = true;
      gl.setPixelRatio(window.devicePixelRatio);
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;

      scene.background = new THREE.Color(0x000000);
    
    return(
      <>
        <OrbitControls ref={orbit}
          enableDamping={true} dampingFactor={0.05} screenSpacePanning={true} minDistance={0.05}
          maxDistance={3} panSpeed={0.5} target={[0.5,0.5,0.5]}
        />
      </>
    )
}

export function CloudViewerScene({object, setLoading}){

    return(
        <Canvas>
            <ambientLight intensity={1}/>
            <CloudScenePreView/>
            <CloudView path={object.path} setLoading={setLoading}/>
        </Canvas>
    )

}