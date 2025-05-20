import * as THREE from 'three'
import { extend } from '@react-three/fiber'

class CloudShader extends THREE.ShaderMaterial {

    constructor(){

     super({
        vertexShader: `
            varying vec2 vUv;
            varying vec3 v_position;
            
            void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                v_position = normalize(position);
            }
        `,

        fragmentShader: `
        
            varying vec2 vUv;
            varying vec3 v_position;

            uniform sampler2D u_noises;
            uniform sampler2D u_bluenoise;
            uniform sampler3D u_density;

            uniform float u_time;
            uniform float u_raymarchSteps;

            uniform vec3 u_camPos;

            float getBlueNoise(vec2 st){
                return texture2D(u_bluenoise,mod(st,512.)).x;
            }

            vec4 getNoise(vec3 pos){

                float random = 2.*(texture2D(u_noises,mod(pos.xy,1.)).z-.5);
                vec4 noise = texture2D(u_noises,mod(mat2(cos(random*pos.z),-sin(random*pos.z),sin(random*pos.z),cos(random*pos.z))*pos.xy,1.));
                return noise;
            }

            vec4 getNoise(vec2 uv){
                return texture2D(u_noises,mod(uv,vec2(1.)));
            }

            float updateIntensity(float I0, vec3 position, float stepSize){

                vec3 time_pos = vec3(cos(u_time*0.005+1.),cos(-u_time*0.003+2.),0.);
                
                float density = pow(texture(u_density,position).x,2.);
                float tau = stepSize*density;
                float exptau = exp(-tau);
                float B = 5.;
                float intensity = I0*exptau+B*(1.-exptau);

                return intensity;
            }

            //-------------------RAYMARCH-------------------------------

            vec2 rayIntersectCube(vec3 origin, vec3 rayDirection, vec3 cubeMin, vec3 cubeMax) {
                vec3 tMin = (cubeMin - origin) / rayDirection;
                vec3 tMax = (cubeMax - origin) / rayDirection;

                vec3 t1 = min(tMin, tMax);
                vec3 t2 = max(tMin, tMax);

                float tNear = max(max(t1.x, t1.y), t1.z);
                float tFar = min(min(t2.x, t2.y), t2.z);

                if (tNear > tFar || tFar < 0.0) {
                    return vec2(-1.0, 0.0);
                }

                if (tNear < 0.0) tNear = 0.0;

                return vec2(tNear, tFar);
            }

            float raymarch() {
                float intensity = 0.0;

                vec3 rayDirection = normalize(v_position);
                vec3 rayOrigin = u_camPos;

                vec2 intersection = rayIntersectCube(rayOrigin, rayDirection, vec3(0.0), vec3(1.0));
                if (intersection.x < 0.0) {
                    return 0.0;
                }

                vec3 entry = rayOrigin + rayDirection * intersection.x;
                vec3 exit = rayOrigin + rayDirection * intersection.y;

                float totalDistance = length(exit - entry);
                float stepSize = totalDistance / float(u_raymarchSteps);

                vec3 samplePos = exit; // Start at the far end
                vec3 backwardsDir = -rayDirection;

                for (float i = 0.0; i < u_raymarchSteps; i++) {
                    float result = updateIntensity(intensity, samplePos, stepSize);
                    intensity = result;
                    samplePos += backwardsDir * stepSize; // march backward
                }

                return intensity;
            }

            vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
            {
                return a + b*cos( 6.28318*(c*t+d) );
            }

            void main() {
                
                float rslt_raymarch = raymarch();

                float intensity = rslt_raymarch;

                vec3 f_color = 1.5*intensity*vec3(83./255.,112./255.,193./255.);
                vec4 f_colorfrag = vec4(f_color, 1.);

                gl_FragColor = f_colorfrag;
            }
        `,

        uniforms: {
            u_noises: {value: null},
            u_raymarchSteps : {value: 200},
            u_density : {value: null},

            u_bluenoise : {value: null},
            u_camPos : {value: new THREE.Vector3(0.,0.,0.)},
            u_time : {value: 0.},
        }
    })

    }

}

extend ({CloudShader})