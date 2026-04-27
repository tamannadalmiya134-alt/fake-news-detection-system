import os
from datetime import datetime
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import numpy as np

# ✅ FIX 1 — Credentials via environment variable
url = os.environ.get("MONGO_URL", "mongodb+srv://<user>:<password>@cluster0.io6uxbx.mongodb.net/fake_news")

client = MongoClient(url)
db = client["fake_news"]
collection = db["news_db"]

# Seed training data
train_texts = [
    "Scientists discover cure for cancer after years of research",
    "Government releases annual budget report with new tax policies",
    "Local elections held successfully across the country",
    "Aliens have landed and the government is hiding it from us",
    "Drinking bleach cures all diseases, doctors are lying",
    "Celebrity secretly controls the world economy with 5G towers",
    "Viral video proves moon landing was faked in Hollywood",
    "You won't believe what this politician did, shocking truth revealed",
]
train_labels = [
    "Real News", "Real News", "Real News",
    "Fake News", "Fake News", "Fake News", "Fake News", "Fake News",
]

vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
X_train = vectorizer.fit_transform(train_texts)

model = LogisticRegression()
model.fit(X_train, train_labels)

def detect_fake_news(text):
    X = vectorizer.transform([text])
    label = model.predict(X)[0]
    confidence = round(float(np.max(model.predict_proba(X))) * 100, 2)
    return label, confidence

try:
    news = input("Enter news text: ").strip()
    if news:
        result, confidence = detect_fake_news(news)
        doc = {
            "text": news,
            "result": result,
            "confidence_percent": confidence,
            "created_at": datetime.utcnow(),
        }
        collection.insert_one(doc)
        print(f"\nResult: {result} ({confidence}%)")
except Exception as e:
    print(f"❌ Error: {e}")
