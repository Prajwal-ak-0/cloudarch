# architecture_service.py

import openai
from backend.config import OPENAI_API_KEY, llm1, llm1_schema, aws_categories, azure_categories, gcp_categories

class ArchitectureService:
    openai.api_key = OPENAI_API_KEY

    @staticmethod
    def process_project_description(project_description: str, cloud_provider:str):

        if cloud_provider == "aws":
            icon_list = aws_categories
        elif cloud_provider == "azure":
            icon_list = azure_categories
        elif cloud_provider == "gcp":
            icon_list = gcp_categories

        prompt = llm1.format(
            project_description=project_description,
            categories=icon_list,
            cloud_provider=cloud_provider
        )
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Here is Your Task"},
                {"role": "user", "content": prompt}
            ],
            response_format={
                "type": "json_schema",
                "json_schema": llm1_schema
            }
        )
        result = response.choices[0].message.content
        architecture = ArchitectureService.parse_response(result)
        print(f"Architecture: {architecture}")
        return architecture

    @staticmethod
    def parse_response(response: str):
        import json
        return json.loads(response)
