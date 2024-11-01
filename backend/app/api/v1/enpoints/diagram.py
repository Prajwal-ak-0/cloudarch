# diagram.py

from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import ProjectRequest, DiagramResponse
from backend.app.services.architecture_diagram import ArchitectureService
from backend.app.services.diagram_service import DiagramService

import os

router = APIRouter()

@router.post("/generate", response_model=DiagramResponse)
def generate_diagram(request: ProjectRequest):
    try:
        architecture = ArchitectureService.process_project_description(request.project_description)
        diagram_code = DiagramService.generate_diagram(architecture)
        images = DiagramService.execute_code_and_get_images(diagram_code)
        # Prepend the server URL to image paths
        server_url = os.getenv("SERVER_URL", "http://localhost:8000")
        image_urls = [f"{server_url}{image}" for image in images]
        return DiagramResponse(
            architectural_description=architecture['architectural_description'],
            icon_category_list=architecture['icon_category_list'],
            diagram_code=diagram_code,
            image_urls=image_urls
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))