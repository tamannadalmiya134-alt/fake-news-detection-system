import os
from datetime import datetime
from pymongo import MongoClient

url = os.environ.get("MONGO_URL", "mongodb+srv://<user>:<password>@cluster0.io6uxbx.mongodb.net/?appName=Cluster0")

client = MongoClient(url)
db = client["ratio"]
collection = db["result"]

try:
    collection.insert_many([
        {"name": "Anvesha", "created_at": datetime.utcnow()},
        {"id": "1",         "created_at": datetime.utcnow()},
        {"language": "python", "created_at": datetime.utcnow()},
    ])
    print("Data inserted ✓")

    result = collection.find_one({"name": "Anvesha"})
    print("Found:", result)

except Exception as e:
    print(f"❌ DB Error: {e}")
