```python
# Diagram 1: Component Grouping Based on Functionality

from diagrams import Diagram, Cluster
from diagrams.azure.compute import FunctionApps
from diagrams.azure.database import SQLDatabases
from diagrams.azure.ml import MachineLearningServiceWorkspaces
from diagrams.azure.storage import BlobStorage

with Diagram("DocuExtract Architecture - Functional Group", show=False):
    with Cluster("Frontend"):
        frontend = FunctionApps("Next.js Frontend")

    with Cluster("Backend API"):
        api = FunctionApps("FastAPI Backend")

    with Cluster("Compute Services"):
        ml_model = MachineLearningServiceWorkspaces("Hugging Face ML Model")
        reranker = MachineLearningServiceWorkspaces("Reranker Model")

    with Cluster("Storage and Databases"):
        embeddings_db = SQLDatabases("Milvus Vector DB")
        storage = BlobStorage("Document Storage")
        
    frontend >> api >> [ml_model, storage]
    ml_model >> embeddings_db
    reranker >> storage

# Diagram 2: Data Flow Representation

from diagrams import Diagram, Cluster
from diagrams.azure.compute import VM
from diagrams.azure.ml import CognitiveServices
from diagrams.azure.storage import StorageAccounts
from diagrams.azure.database import CosmosDb

with Diagram("DocuExtract Architecture - Data Flow", show=False):
    with Cluster("Frontend"):
        user_interface = VM("Next.js Frontend")

    with Cluster("Backend Services"):
        backend_logic = VM("FastAPI Backend")
        document_chunker = CognitiveServices("Document Chunking")
        
    with Cluster("Embedding and Retrieval"):
        milvus_db = CosmosDb("Milvus Vector DB")
        fetcher = CognitiveServices("Data Fetcher")
        
    storage = StorageAccounts("Document Storage")

    user_interface >> backend_logic >> document_chunker >> [milvus_db, storage]
    milvus_db >> fetcher >> storage
    storage >> user_interface

# Diagram 3: Environmental Clusters Representation

from diagrams import Diagram, Cluster
from diagrams.azure.compute import VMWindows
from diagrams.azure.ml import MachineLearningServiceWorkspaces
from diagrams.azure.storage import QueuesStorage
from diagrams.azure.database import SynapseAnalytics

with Diagram("DocuExtract Architecture - Environmental Clusters", show=False):
    with Cluster("User Environment"):
        user_system = VMWindows("User Interface")

    with Cluster("Processing Environment"):
        processing_vm = VMWindows("FastAPI Backend")
        embedding_service = MachineLearningServiceWorkspaces("Embedding Service")

    with Cluster("Data Management"):
        vector_db = SynapseAnalytics("Milvus Database")
        queue_storage = QueuesStorage("Document Queue")

    user_system >> processing_vm >> embedding_service >> vector_db
    queue_storage >> processing_vm
    vector_db >> user_system
```
