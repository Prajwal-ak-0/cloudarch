# main.py

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.app.api.v1.enpoints import diagram, test
from fastapi.middleware.cors import CORSMiddleware

import os
import time
from threading import Thread

app = FastAPI(
    title="Cloud Architecture Diagram Generator",
    version="1.0.0",
)

origins = [
    "http://localhost:5173", 
    "https://production.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the 'code_exe' directory to serve static files
app.mount("/images", StaticFiles(directory="code_exe"), name="images")
app.mount("/updated_images", StaticFiles(directory="updated_code_files"), name="updated_images")

app.include_router(diagram.router, prefix="/api/v1/diagrams", tags=["Diagrams"])
app.include_router(test.router, prefix="/api/v1/test", tags=["Test"])

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Server is running smoothly."}

def cleanup_old_files(directory: str, max_age_seconds: int = 100):
    while True:
        now = time.time()
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            if os.path.isfile(file_path):
                file_age = now - os.path.getmtime(file_path)
                if file_age > max_age_seconds:
                    try:
                        os.remove(file_path)
                        print(f"Deleted old file: {file_path}")
                    except Exception as e:
                        print(f"Failed to delete {file_path}. Reason: {e}")
        time.sleep(15)  # Run cleanup every 60 seconds

def start_cleanup_threads():
    directories = ["code_exe", "updated_code_files"]
    for directory in directories:
        if os.path.exists(directory):
            thread = Thread(target=cleanup_old_files, args=(directory,))
            thread.daemon = True
            thread.start()

@app.on_event("startup")
def on_startup():
    start_cleanup_threads()