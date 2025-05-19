from app import app
from fastapi.middleware.cors import CORSMiddleware

#python -m uvicorn main:app --reload

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)

import routers.blueprint
import ConnectionManager
