from app import app
from fastapi.middleware.cors import CORSMiddleware

#python -m uvicorn main:app --reload

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Shape", "X-Dtype"],
)

import routers.blueprint
import routers.fileloader
import ConnectionManager
