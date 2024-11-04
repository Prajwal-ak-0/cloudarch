# backend/app/models/schemas.py

from pydantic import BaseModel
from typing import List

class DiagramResponse(BaseModel):
    architectural_description: str
    icon_category_list: List[str]
    diagram_code: str
    image_urls: List[str]

class CodeExecutionRequest(BaseModel):
    diagram_code: str
    architectural_description: str

class CodeExecutionResponse(BaseModel):
    diagram_code: str
    architectural_description: str
    image_urls: List[str]