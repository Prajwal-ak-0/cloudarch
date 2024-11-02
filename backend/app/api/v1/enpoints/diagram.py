# backend/app/api/v1/endpoints/diagram.py

from fastapi import APIRouter, HTTPException, Form
from backend.app.models.schemas import DiagramResponse
from backend.app.services.architecture_diagram import ArchitectureService
from backend.app.services.diagram_service import DiagramService
import os

router = APIRouter()

@router.post("/generate", response_model=DiagramResponse)
async def generate_diagram(
    cloud_provider: str = Form(...),
    project_description: str = Form(...)
):
    try:
        # Process the project description
        architecture = ArchitectureService.process_project_description(project_description, cloud_provider)
        diagram_code = DiagramService.generate_diagram(architecture, cloud_provider)
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