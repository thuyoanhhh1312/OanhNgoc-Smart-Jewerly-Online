from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, RobertaForSequenceClassification
import torch

# Khởi tạo FastAPI app
app = FastAPI()

# Load PhoBERT Sentiment model
tokenizer = AutoTokenizer.from_pretrained("./phobert-base-vi-sentiment-analysis", use_fast=False)
model = RobertaForSequenceClassification.from_pretrained("./phobert-base-vi-sentiment-analysis")

label_map = {0: "Tiêu cực",  1: "Tích cực", 2: "Trung tính"}

class SentimentRequest(BaseModel):
    text: str

@app.post("/sentiment")
def analyze_sentiment(req: SentimentRequest):
    inputs = tokenizer(req.text, return_tensors="pt", truncation=True, padding=True, max_length=256)
    with torch.no_grad():
        logits = model(**inputs).logits
        pred = torch.argmax(logits, dim=1).item()
        label = label_map[pred]
    return {"label": label}