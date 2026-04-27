import os
from datetime import datetime
from pymongo import MongoClient

url = os.environ.get("MONGO_URL", "mongodb+srv://<user>:<password>@cluster0.io6uxbx.mongodb.net/?appName=Cluster0")

client = MongoClient(url)
db = client["fake_news_db"]
collection = db["news"]

try:
    data = {
        "title": "Fake news example",
        "content": "This is a rumor",
        "result": "Fake",
        "created_at": datetime.utcnow(),
    }
    collection.insert_one(data)
    print("Data inserted ✓")

    for doc in collection.find():
        print(doc)

    result = collection.find_one({"result": "Fake"})
    print("\nFirst Fake document:", result)

except Exception as e:
    print(f"❌ DB Error: {e}")
