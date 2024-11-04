# backend/app/api/v1/endpoints/diagram.py

from fastapi import APIRouter, HTTPException, Form, BackgroundTasks, Request
from backend.app.models.schemas import DiagramResponse, CodeExecutionResponse, CodeExecutionRequest
from backend.app.services.architecture_diagram import ArchitectureService
from backend.app.services.diagram_service import DiagramService
import os
import shutil
import threading
import time

router = APIRouter()

def cleanup_files(directory: str):
    """Delete all files and subdirectories in the specified directory."""
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')

def delayed_cleanup(directory: str, delay: int = 10):
    """Wait for 'delay' seconds before cleaning up files."""
    def run():
        time.sleep(delay)
        cleanup_files(directory)
    thread = threading.Thread(target=run)
    thread.start()

@router.post("/generate", response_model=DiagramResponse)
async def generate_diagram(
    background_tasks: BackgroundTasks,
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
        image_urls = [f"{server_url}/images/{os.path.basename(image)}" for image in images]

        response = DiagramResponse(
            architectural_description=architecture['architectural_description'],
            icon_category_list=architecture['icon_category_list'],
            diagram_code=diagram_code,
            image_urls=image_urls
        )

        # Schedule the cleanup task with a delay to ensure images are accessible
        execution_dir = os.path.join(os.getcwd(), 'code_exe')
        background_tasks.add_task(delayed_cleanup, execution_dir, delay=20)  # 10-second delay

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/execute-code", response_model=CodeExecutionResponse)
async def execute_code_endpoint(
    background_tasks: BackgroundTasks,
    request_data: CodeExecutionRequest,
):
    try:
        diagram_code = request_data.diagram_code
        architectural_description = request_data.architectural_description

        images = DiagramService.execute_updated_code_and_get_images(diagram_code)

        # Prepend the server URL to image paths
        server_url = os.getenv("SERVER_URL", "http://localhost:8000")
        image_urls = [
            f"{server_url}/updated_images/{os.path.basename(image)}" for image in images
        ]

        response = CodeExecutionResponse(
            diagram_code=diagram_code,
            architectural_description=architectural_description,
            image_urls=image_urls,
        )

        # Schedule the cleanup task
        execution_dir = os.path.join(os.getcwd(), "updated_code_files")
        background_tasks.add_task(delayed_cleanup, execution_dir, delay=20)  # 20-second delay

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))