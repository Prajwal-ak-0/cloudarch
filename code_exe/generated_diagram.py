```python
# Diagram 1: Overall Architecture with Component Clusters

from diagrams import Diagram, Edge, Cluster
from diagrams.azure.compute import VMWindows
from diagrams.azure.network import ApplicationGateway
from diagrams.azure.integration import APIManagement
from diagrams.azure.storage import BlobStorage
from diagrams.azure.database import CosmosDb

with Diagram("DocuExtract Architecture Overview", show=False, direction="LR"):
    user = VMWindows("User")

    with Cluster("Frontend"):
        frontend = BlobStorage("Web Frontend")

    with Cluster("Backend"):
        backend_api = APIManagement("Backend API")
        data_processing = ApplicationGateway("Data Processing")
        vector_database = CosmosDb("Vector Database")

    user >> frontend >> backend_api >> data_processing >> vector_database

# Diagram 2: Data Flow Representation

from diagrams import Diagram, Edge, Cluster
from diagrams.azure.compute import VMWindows
from diagrams.azure.network import ApplicationGateway
from diagrams.azure.integration import APIManagement
from diagrams.azure.storage import BlobStorage
from diagrams.azure.database import CosmosDb

with Diagram("DocuExtract Data Flow", show=False, direction="LR"):
    user = VMWindows("User")

    with Cluster("Data Processing Pipeline"):
        frontend = BlobStorage("Web Frontend")
        backend_api = APIManagement("Backend API")
        segmentation = ApplicationGateway("Document Segmentation")
        embedding = ApplicationGateway("Embeddings Model")
        vector_database = CosmosDb("Vector Database")
        extraction = ApplicationGateway("Data Extraction")
        formatting = ApplicationGateway("CSV Formatting")

    user >> frontend >> backend_api >> segmentation >> embedding >> vector_database
    vector_database >> extraction >> formatting

# Diagram 3: Security and Storage Emphasis

from diagrams import Diagram, Edge, Cluster
from diagrams.azure.security import SecurityCenter
from diagrams.azure.compute import VMWindows
from diagrams.azure.integration import APIManagement
from diagrams.azure.storage import BlobStorage
from diagrams.azure.database import CosmosDb

with Diagram("DocuExtract Security and Storage Focus", show=False, direction="LR"):
    user = VMWindows("User")

    with Cluster("Secure System"):
        security = SecurityCenter("Security Management")
        frontend = BlobStorage("Web Frontend")
        backend_api = APIManagement("Backend API")
        vector_database = CosmosDb("Vector Database")

    user >> Edge(label="Secure Connection") >> security >> frontend >> backend_api
    backend_api >> Edge(label="Secure Storage") >> vector_database
```