# test.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/", tags=["Test"])
def test_endpoint():
    return {"message": "API is working correctly."}