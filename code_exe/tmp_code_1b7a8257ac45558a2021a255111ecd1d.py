from diagrams import Diagram
from diagrams.azure.compute import FunctionApps
from diagrams.azure.database import CosmosDb
from diagrams.azure.ml import MachineLearningServiceWorkspaces
from diagrams.azure.integration import APIManagement
from diagrams.azure.storage import BlobStorage
from diagrams.azure.network import ApplicationGateway

with Diagram("DocuExtract System Architecture", show=False):
    
    # Frontend and API Gateway
    frontend = ApplicationGateway("FrontendUI")
    api_gateway = APIManagement("APIGateway")
    
    # Backend Function App for API Services
    api_services = FunctionApps("APIServices")
    
    # Document Processing with ML Services
    chunking_module = FunctionApps("ChunkingModule")
    embeddings_generation = MachineLearningServiceWorkspaces("EmbeddingsGeneration")
    
    # Storage Services
    vector_storage = CosmosDb("VectorStorage")
    blob_storage = BlobStorage("BlobStorage")
    
    # Reranker Model
    reranker_model = MachineLearningServiceWorkspaces("RerankerModel")
    
    # Data flow
    frontend >> api_gateway >> api_services >> chunking_module
    chunking_module >> embeddings_generation >> vector_storage
    api_services >> reranker_model >> vector_storage
    reranker_model >> blob_storage
    
    # Output to Frontend
    blob_storage >> frontend