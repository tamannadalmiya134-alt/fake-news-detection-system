from django.shortcuts import render
from pymongo import MongoClient
from transformers import pipeline

# AI Model Load (Pehli baar download hone mein waqt lagega)
classifier = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-fake-news-detection")

def predict_news(request):
    result = None
    news_text = ""
    if request.method == "POST":
        news_text = request.POST.get("news_text")
        if news_text:
            # Model prediction
            prediction = classifier(news_text)[0]
            
            # Label fixing (LABEL_0 -> FAKE, LABEL_1 -> REAL)
            label = "FAKE" if prediction['label'] == 'LABEL_0' else "REAL"
            score = round(prediction['score'] * 100, 2)
            
            result = {'label': label, 'score': score}

            # Optional: MongoDB Logic
            try:
                client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
                db = client['fakenews_db']
                db.news_logs.insert_one({"text": news_text, "label": label, "score": score})
            except Exception as e:
                print(f"MongoDB connection skipped: {e}")

    return render(request, "classifier/index.html", {"result": result, "news_text": news_text})
