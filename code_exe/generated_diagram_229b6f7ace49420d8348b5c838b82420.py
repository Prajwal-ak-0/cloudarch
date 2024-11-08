```python
# Diagram 1 - General Architecture Overview
from diagrams import Cluster, Diagram
from diagrams.gcp.compute import KubernetesEngine
from diagrams.gcp.ml import AIPlatform
from diagrams.gcp.database import Datastore
from diagrams.onprem.client import User
from diagrams.onprem.compute import Server

with Diagram("DocuExtract Platform Overview", show=False):
    user = User("User")

    with Cluster("Frontend"):
        frontend = Server("Next.js App")

    with Cluster("Backend"):
        api = KubernetesEngine("FastAPI Server")

        with Cluster("Document Processing"):
            doc_chunks = AIPlatform("Document Chunks")
            embedding = AIPlatform("Hugging Face Model")
            reranker = AIPlatform("Reranking Model")

    with Cluster("Storage & Retrieval"):
        vector_db = Datastore("Milvus Vector DB")

    user >> frontend >> api
    api >> doc_chunks >> embedding >> vector_db
    vector_db >> reranker >> api
    api >> user

# Diagram 2 - Highlighting Data Flow and Processing Components
from diagrams import Cluster, Diagram
from diagrams.gcp.compute import KubernetesEngine
from diagrams.gcp.ml import AIHub, AIPlatform
from diagrams.gcp.database import Bigtable
from diagrams.onprem.client import User

with Diagram("DocuExtract Data Flow", show=False):
    user = User("User")

    with Cluster("Frontend App"):
        nextjs = AIHub("Next.js")

    with Cluster("Backend App"):
        fastapi = KubernetesEngine("FastAPI")

        with Cluster("Processing"):
            vectorizing = AIPlatform("Text Vectorization")
            storage = Bigtable("Milvus")

    user >> nextjs >> fastapi
    fastapi >> vectorizing >> storage
    storage >> fastapi >> user

# Diagram 3 - Emphasizing Deployment & Machine Learning Components
from diagrams import Cluster, Diagram
from diagrams.gcp.network import LoadBalancing
from diagrams.gcp.compute import KubernetesEngine
from diagrams.gcp.database import Datastore
from diagrams.gcp.ml import InferenceAPI
from diagrams.onprem.client import User

with Diagram("DocuExtract Deployment Architecture", show=False):
    user = User("User")
    with Cluster("Load Balancing"):
        lb = LoadBalancing("Frontend LB")

    with Cluster("Application Deployment"):
        with Cluster("Frontend"):
            frontend_app = KubernetesEngine("Next.js")

        with Cluster("Backend"):
            backend_app = KubernetesEngine("FastAPI")

    with Cluster("Machine Learning"):
        ml_model = InferenceAPI("Hugging Face")

    with Cluster("Vector Storage"):
        vector_store = Datastore("Milvus")

    user >> lb >> frontend_app >> backend_app
    backend_app >> ml_model >> vector_store
    vector_store >> backend_app
    backend_app >> user
```
