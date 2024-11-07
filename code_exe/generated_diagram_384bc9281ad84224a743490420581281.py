```python
# First Diagram: Service Overview Using Fundamental Groupings

from diagrams import Cluster, Diagram, Edge
from diagrams.azure.compute import AppServices, FunctionApps
from diagrams.azure.storage import BlobStorage
from diagrams.azure.network import VirtualNetworks, LoadBalancers
from diagrams.azure.ml import MachineLearningServiceWorkspaces
from diagrams.azure.database import SQLDatabases

with Diagram("DocuExtract Overview", show=False, direction="LR"):
    user = AppServices("User Interface")

    with Cluster("Backend APIs"):
        backend = FunctionApps("FastAPI Backend")
        ml_service = MachineLearningServiceWorkspaces("ML Model")

    with Cluster("Data Storage"):
        blob_storage = BlobStorage("Vector Storage")
        sql_db = SQLDatabases("Query System")

    net = VirtualNetworks("Network Infrastructure")
    
    user >> Edge(label="HTTP Requests") >> backend
    backend >> Edge(label="Document Vectors") >> ml_service
    ml_service >> Edge(label="Store Embeddings") >> blob_storage
    blob_storage >> Edge(label="Retrieve Vectors") >> ml_service
    backend >> Edge(label="Extract Data") >> sql_db
    
    net >> [user, backend, blob_storage, sql_db]

# Second Diagram: Focus on Data Flow and Processing

from diagrams import Cluster, Diagram, Edge
from diagrams.azure.compute import FunctionApps
from diagrams.azure.network import LoadBalancers
from diagrams.azure.integration import LogicApps
from diagrams.azure.storage import BlobStorage
from diagrams.azure.ml import MachineLearningServiceWorkspaces

with Diagram("DocuExtract Data Flow", show=False, direction="LR"):
    frontend = FunctionApps("Next.js Frontend")

    with Cluster("Processing Layer"):
        api_backend = FunctionApps("Python FastAPI")
        embedding_model = MachineLearningServiceWorkspaces("Embedding Model")
        rerank_model = MachineLearningServiceWorkspaces("Reranking Model")

    vector_storage = BlobStorage("Vector Database")

    frontend >> Edge(label="API Call to Backend") >> api_backend
    api_backend >> Edge(label="Send Docs for ML Processing") >> embedding_model
    embedding_model >> Edge(label="Store Generated Vectors") >> vector_storage
    vector_storage << Edge(label="Retrieve Validated Vectors") << rerank_model
    rerank_model << Edge(label="Relevant Data Segments") << api_backend

# Third Diagram: Emphasis on Network and Security

from diagrams import Cluster, Diagram, Edge
from diagrams.azure.network import VirtualNetworks, LoadBalancers, ApplicationSecurityGroups
from diagrams.azure.compute import FunctionApps, AppServices
from diagrams.azure.storage import BlobStorage
from diagrams.azure.ml import BotServices

with Diagram("DocuExtract Network Security", show=False, direction="LR"):
    user_app = AppServices("User Application UI")

    with Cluster("Security and Networking"):
        app_security = ApplicationSecurityGroups("App Security")
        load_balancer = LoadBalancers("Traffic Distribution")
        virtual_net = VirtualNetworks("Virtual Network")
    
    with Cluster("Processing Components"):
        api_server = FunctionApps("FastAPI Backend")
        vector_storage = BlobStorage("Vector Storage")
        ml_rerank = BotServices("Re-ranking Model")
    
    user_app >> Edge(label="Secure Access") >> load_balancer
    load_balancer >> api_server
    api_server >> Edge(label="Generate & Store Vectors") >> vector_storage
    vector_storage >> Edge(label="Re-ranking Queries") >> ml_rerank

    virtual_net >> [app_security, api_server, vector_storage]
```
