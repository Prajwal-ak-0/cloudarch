# schemas.py

from pydantic import BaseModel
from typing import List, Optional

class ProjectRequest(BaseModel):
    project_description: str
    cloud_provider: Optional[str] = "aws"
    pdf_file: Optional[str] = None  # Assuming base64 encoding or file path

class DiagramResponse(BaseModel):
    architectural_description: str
    icon_category_list: List[str]
    diagram_code: str
    image_urls: List[str]  # New field for image URLs