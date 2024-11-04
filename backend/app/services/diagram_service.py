# diagram_service.py

import openai
import os
from backend.config import llm2
from backend.app.utils.helpers import load_aws_services, get_icons_by_categories
from autogen import ConversableAgent
from autogen.coding import LocalCommandLineCodeExecutor
import uuid

class DiagramService:
    @staticmethod
    def generate_diagram(architecture: dict, cloud_provider: str) -> str:
        services = load_aws_services(f'{cloud_provider}.yaml')
        icons = get_icons_by_categories(services, architecture['icon_category_list'])
        prompt = llm2.format(
            icon_list=icons, 
            project_description=architecture['architectural_description'],
            cloud_provider=cloud_provider
        )
        print(f"\n\n\nPrompt: {prompt}")
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Here is Your Task"},
                {"role": "user", "content": prompt}
            ]
        )
        diagram_code = response.choices[0].message.content
        return diagram_code

    @staticmethod
    def execute_code_and_get_images(diagram_code: str) -> list:
        # Create 'code_exe' directory if it doesn't exist
        execution_dir = os.path.join(os.getcwd(), 'code_exe')
        os.makedirs(execution_dir, exist_ok=True)

        unique_id = uuid.uuid4().hex

        # Write the generated code to a file in 'code_exe' directory
        code_file_path = os.path.join(execution_dir, f'generated_diagram_{unique_id}.py')
        with open(code_file_path, 'w') as file:
            file.write(diagram_code)

        # Set up the code executor
        executor = LocalCommandLineCodeExecutor(
            timeout=30,  # Increased timeout for diagram generation
            work_dir=execution_dir,
        )

        # Create a ConversableAgent for code execution
        code_executor_agent = ConversableAgent(
            "code_executor_agent",
            llm_config=False,
            code_execution_config={"executor": executor},
            human_input_mode=None,
        )

        # Execute the generated code
        reply = code_executor_agent.generate_reply(messages=[{"role": "user", "content": diagram_code}])
        print(reply)

        # Collect all image files in 'code_exe' directory
        image_extensions = ['.png', '.jpg', '.jpeg', '.svg']
        images = [
            f"/images/{file}"
            for file in os.listdir(execution_dir)
            if os.path.splitext(file)[1].lower() in image_extensions
        ]

        return images
    
    @staticmethod
    def execute_updated_code_and_get_images(diagram_code: str) -> list:
        # Create 'updated_code_files' directory if it doesn't exist
        execution_dir = os.path.join(os.getcwd(), 'updated_code_files')
        os.makedirs(execution_dir, exist_ok=True)

        unique_id = uuid.uuid4().hex

        # Write the code to a file in 'updated_code_files' directory
        code_file_path = os.path.join(execution_dir, f'generated_diagram_{unique_id}.py')
        with open(code_file_path, 'w') as file:
            file.write(diagram_code)

        # Set up the code executor
        executor = LocalCommandLineCodeExecutor(
            timeout=30,
            work_dir=execution_dir,
        )

        # Create a ConversableAgent for code execution
        code_executor_agent = ConversableAgent(
            "code_executor_agent",
            llm_config=False,
            code_execution_config={"executor": executor},
            human_input_mode=None,
        )

        # Execute the generated code
        try:
            reply = code_executor_agent.generate_reply(
                messages=[{"role": "user", "content": diagram_code}]
            )
            print(reply)
        except Exception as e:
            print("Error executing diagram code:", str(e))
            raise

        # Collect all image files in 'updated_code_files' directory
        image_extensions = ['.png', '.jpg', '.jpeg', '.svg']
        images = [
            file
            for file in os.listdir(execution_dir)
            if os.path.splitext(file)[1].lower() in image_extensions
        ]
        return images