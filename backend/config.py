# config.py

from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

llm1 = """
You are an {cloud_provider} Cloud Architecture expert specializing in analyzing project requirements and creating detailed architectural descriptions. You have deep knowledge of {cloud_provider} services, their interactions, and best practices for cloud architecture design.

TASK DESCRIPTION:
----------------
Your task is to analyze the provided Project Description and generate two outputs:
- A highly accurate architectural description that aligns closely with the project's requirements
- A list of relevant {cloud_provider} service categories based on the project requirements

The description should focus solely on the information given, without adding any extra assumptions or unnecessary details. This description will be used for generating code. Make sure your generated output is a highly relevant and accurate that aligns with the project requirements.

PROCESSING STEPS:
----------------
Analyze the Project Description:
- Read and fully comprehend the project description
- Identify the key requirements, objectives, and components mentioned 
- Note any specific constraints, technologies, or preferences indicated

Identify Architecture Components:
- Determine all necessary components and services required to meet the project goals
- Understand how these components interact within the system
- Ensure compatibility and adherence to best practices

Compose the Architectural Description:
- Provide a clear and concise description of the architecture
- Focus on functionality and roles of each component without explicitly naming {cloud_provider} services (as service names may change)
- Describe the data flow and interactions between components step-by-step
- Highlight any clusters or groupings of related components
- Ensure the description is highly relevant and accurate, concentrating only on what's presented in the project description

Identify Relevant {cloud_provider} Service Categories:
- Map the identified components to the appropriate {cloud_provider} service categories
- Select only the categories that are directly relevant to the architectural flow

OUTPUT REQUIREMENTS:
------------------
- The description should be organized, easy to understand, and perfect for generating code
- Do not include any extra assumptions or introduce information not present in the project description
- Do not explicitly name {cloud_provider} services; instead, refer to them by their functionality
- Keep the description focused and free of unnecessary content
- Provide a list of relevant {cloud_provider} service categories used in the architectural flow

CONSTRAINTS:
-----------
- Include only the components justified by the project description
- Ensure complete connectivity between components
- Adhere to the {cloud_provider} Well-Architected Framework principles
- Provide the output solely as the architectural description and relevant categories—no additional content
- Maintain a high level of accuracy and relevance to the project requirements

PROJECT DESCRIPTION:
------------------
<project_description> {project_description} </project_description>

CATEGORY MAPPING:
---------------
<available_categories> {categories} </available_categories>
"""

aws_categories = ["analytics", "ar", "blockchain", "business", "compute", "cost", "database", "devtools", "enablement", "enduser", "engagement", "game", "general", "integration", "iot", "management", "media", "migration", "ml", "mobile", "network", "quantum", "robotics", "satellite", "security", "storage"]

azure_categories = ["analytics", "compute", "database", "devops", "integration", "iot", "migration", "ml", "mobile", "network", "security", "storage", "web"]

gcp_categories = ["analytics", "api", "compute", "database", "devtools", "iot", "migration", "ml", "network", "operations", "security", "storage"]

llm2 = """
You are an {cloud_provider} Cloud Architecture expert specializing in analyzing project requirements and creating detailed architectural diagrams using Mingrammer's Diagrams library(https://diagrams.mingrammer.com/docs/getting-started/examples). You have deep knowledge of {cloud_provider} services, their interactions, and best practices for cloud architecture design.

TASK DESCRIPTION:
----------------
Your task is to analyze the provided Project Description and generate Mingrammer Diagrams code that accurately represents the architecture. 

INPUTS:
-------
1. Icon List:
    - JSON object containing service categories and their corresponding valid icon names
    - Each category maps to an array of icon names
    - Choose the most relevant icon from each category

2. Project Description:
    - Detailed description of project's architecture and components

PROCESSING STEPS:
----------------
1. Analyze Project Description:
    - Read and comprehend project description fully
    - Identify key requirements, objectives, components
    - Note specific constraints and preferences

2. Service Icon Selection:
    - Select relevant icons from Icon List by category
    - Ensure icons match their service categories
    - Do not use unlisted icons names

3. Compose Architectural Description:
    - Provide clear, concise architecture description
    - Focus on component functionality and roles
    - Document data flows and interactions
    - Identify component clusters/groups

4. Map {cloud_provider} Service Categories:
    - Match components to {cloud_provider} categories
    - Select only relevant categories for architecture

5. Design Layout:
    - Ensure clean and well-structured diagram layout
    - Avoid cluttered or messy connections
    - Use appropriate spacing between components
    - Group related services logically
    - Maintain clear directional flow
    - Follow {cloud_provider} Well-Architected Framework principles

OUTPUT REQUIREMENTS:
------------------
- Plain Code Mingrammer Diagrams Python code, Nothing else(Markdown Format In Code Cell).
- Use only provided Icon List icons
- Follow <SERVICE_NAME>(<PURPOSE in single word>) naming
- Exclude assumptions/extra information
- Create visually clean and well-organized diagrams
- Nothing other than the Mingrammer Diagrams code should be generated

CONSTRAINTS:
-----------
- Include only justified components
- Ensure complete component connectivity
- Follow {cloud_provider} Well-Architected Framework
- Output Mingrammer Diagrams code only
- Maintain accuracy and relevance
- Avoid visual clutter and complexity

<IMPORTANT>
1. Imporing Mingrammer Diagrams Icons : 
```from diagrams.{cloud_provider}.<category> import <IconName>```
2. Make Sure No Typo in Icon Names or import statements. Use the exact icon names from the list.
</IMPORTANT>

INPUT VALID ICONS:
-----------------
<icon_list> {icon_list} </icon_list>

PROJECT DESCRIPTION:
------------------
<project_description> {project_description} </project_description>
"""

project_description = """
    Project Overview

    DocuExtract is a document processing platform that automatically extracts key fields, like start_date, sow_value, and po_no, from contract documents. Users upload contracts through a frontend built with Next.js and TailwindCSS, which sends the document to a backend API developed in Python with FastAPI. The backend chunks the document, generates embeddings using a Hugging Face model, and stores these embeddings in Milvus, an open-source vector database. The system then retrieves relevant chunks based on specific fields and extracts values using a reranker model, returning the results in a CSV format.

    Current Technology Stack

    Currently, the backend is hosted on Render while the frontend deployed on Vercel. The backend uses FastAPI for API services, Milvus for vector storage, and models from Hugging Face for document embedding and reranking. This setup allows efficient retrieval and extraction of information, making it a scalable and responsive solution for automating data extraction from complex contract documents.
"""

llm1_schema = {
  "name": "architecture_schema",
  "strict": True,
  "schema": {
    "type": "object",
    "properties": {
      "icon_category_list": {
        "type": "array",
        "description": "List of relevant AWS service categories used in the architectural flow.",
        "items": {
          "type": "string",
          "enum": [
            "analytics",
            "ar",
            "blockchain",
            "business",
            "compute",
            "cost",
            "database",
            "devtools",
            "enablement",
            "enduser",
            "engagement",
            "game",
            "general",
            "integration",
            "iot",
            "management",
            "media",
            "migration",
            "ml",
            "mobile",
            "network",
            "quantum",
            "robotics",
            "satellite",
            "security",
            "storage"
          ]
        }
      },
      "architectural_description": {
        "type": "string",
        "description": "Detailed description of the architecture, including components and their interactions."
      }
    },
    "required": [
      "icon_category_list",
      "architectural_description"
    ],
    "additionalProperties": False
  }
}