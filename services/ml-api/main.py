# services/ml-api/main.py
from fastapi import FastAPI, UploadFile, File
from pymilvus import connections, Collection
import torch
# from transformers import AutoModelForImageClassification 

app = FastAPI(title="Para-Master ML API")

# Connect to Milvus on Startup
@app.on_event("startup")
def connect_db():
    connections.connect("default", host="localhost", port="19533")
    print("Connected to Milvus")

@app.post("/identify/image")
async def identify_parasite(file: UploadFile = File(...)):
    # 1. Load fine-tuned Swin Transformer
    # 2. Process image
    # 3. Return classification and confidence
    return {"species": "Plasmodium falciparum", "confidence": 0.98}

@app.post("/identify/genomic")
async def search_genomic(sequence: str):
    # 1. Convert sequence to vector embedding
    # 2. Query Milvus collection
    # 3. Return top matches
    return {"matches": ["Strain_A", "Strain_B"]}