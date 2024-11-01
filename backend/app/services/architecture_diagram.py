# architecture_service.py

import openai
from backend.config import OPENAI_API_KEY, llm1, llm1_schema

class ArchitectureService:
    openai.api_key = OPENAI_API_KEY

    @staticmethod
    def process_project_description(project_description: str):
        prompt = llm1.format(project_description=project_description)
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
        return architecture

    @staticmethod
    def parse_response(response: str):
        import json
        return json.loads(response)