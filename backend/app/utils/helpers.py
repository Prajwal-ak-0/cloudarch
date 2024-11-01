# helpers.py

import yaml

def load_aws_services(file_path: str):
    """Load AWS services from a YAML file."""
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def get_icons_by_categories(services: list, categories: list) -> dict:
    """Retrieve icons corresponding to the specified categories."""
    category_icons = {}
    for category in categories:
        for service in services:
            if service.get('category') == category:
                category_icons[category] = service.get('icons', [])
                break
        else:
            category_icons[category] = []
    return category_icons