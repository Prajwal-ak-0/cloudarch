# backend/app/models/schemas.py

from pydantic import BaseModel
from typing import List

class DiagramResponse(BaseModel):
    architectural_description: str
    icon_category_list: List[str]
    diagram_code: str
    image_urls: List[str]