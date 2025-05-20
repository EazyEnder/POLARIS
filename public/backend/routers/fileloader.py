from app import app
from fastapi import HTTPException
import numpy as np
import json
from fastapi.responses import StreamingResponse
import io
from astropy.io import fits

@app.get("/load/npy", tags=["Load"], description="Get npy file")
async def load_npy(path: str):
    clean_path = path.replace("\\", "/")
    try:
        arr = np.load(clean_path)

        shape = arr.shape
        dtype = str(arr.dtype)

        if arr.dtype not in [np.uint8, np.float32]:
            arr = arr.astype(np.float32)
        buffer = arr.tobytes()

        headers = {
            "X-Shape": json.dumps(shape),
            "X-Dtype": dtype,
            "Content-Disposition": "attachment; filename=volume.raw",
            "Content-Type": "application/octet-stream"
        }

        return StreamingResponse(io.BytesIO(buffer), headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/load/fits", tags=["Load"], description="Get fits file")
async def load_fits(path: str):
    clean_path = path.replace("\\", "/")
    
    try:
        with fits.open(clean_path) as hdulist:
            data = hdulist[0].data
            if data is None:
                raise ValueError("FITS file contains no data in the primary HDU.")

            shape = data.shape
            dtype = str(data.dtype)

            if data.dtype not in [np.uint8, np.float32]:
                data = data.astype(np.float32)
            buffer = data.tobytes()

            response = StreamingResponse(io.BytesIO(buffer), media_type="application/octet-stream")
            response.headers["X-Shape"] = json.dumps(shape)
            response.headers["X-Dtype"] = dtype
            response.headers["Content-Disposition"] = "attachment; filename=volume.raw"
            return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load FITS file: {str(e)}")