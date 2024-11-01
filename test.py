# test.py

from backend.app.services.architecture_diagram import ArchitectureService
from backend.app.services.diagram_service import DiagramService

def main():
    project_description = """
    Project Overview

    DocuExtract is a document processing platform that automatically extracts key fields, like start_date, sow_value, and po_no, from contract documents. Users upload contracts through a frontend built with Next.js and TailwindCSS, which sends the document to a backend API developed in Python with FastAPI. The backend chunks the document, generates embeddings using a Hugging Face model, and stores these embeddings in Milvus, an open-source vector database. The system then retrieves relevant chunks based on specific fields and extracts values using a reranker model, returning the results in a CSV format.

    Current Technology Stack

    Currently, the backend is hosted on Render while the frontend deployed on Vercel. The backend uses FastAPI for API services, Milvus for vector storage, and models from Hugging Face for document embedding and reranking. This setup allows efficient retrieval and extraction of information, making it a scalable and responsive solution for automating data extraction from complex contract documents.
    """

    try:
        architecture = ArchitectureService.process_project_description(project_description)
        diagram_code = DiagramService.generate_diagram(architecture)
        images = DiagramService.execute_code_and_get_images(diagram_code)
        print("Architectural Description:\n", architecture['architectural_description'])
        print("\nRelevant AWS Service Categories:\n", architecture['icon_category_list'])
        print("\nDiagram Code:\n", diagram_code)
        print("\nGenerated Images:\n", images)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()