from app import app
from fastapi import Depends
from typing import Annotated, Dict,List
from fastapi import HTTPException
from network.builder import BLOCKS

@app.get("/blueprint/blocks", response_model=Dict, tags=["Blueprint"], description="Get available blocks for blueprint view")
async def get_blueprint_blocks():
    if BLOCKS is not None:
        return BLOCKS
    raise HTTPException(status_code=404, detail="Blocks dict not found")