# main.py

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.app.api.v1.enpoints import diagram, test
from fastapi.middleware.cors import CORSMiddleware

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