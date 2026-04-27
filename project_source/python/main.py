import os
from datetime import datetime
from pymongo import MongoClient

# ✅ FIX 1 — Credentials via environment variable
url = os.environ.get("MONGO_URL", "mongodb+srv://<user>:<password>@cluster0.io6uxbx.mongodb.net/?appName=Cluster0")

try:
    client = MongoClient(url)
    db = client["mydb"]
    print("Connected successfully ✓")

    collection = db["test"]

    # ✅ FIX 5 — Added timestamp so documents are traceable
    collection.insert_one({
        "name": "Anvesha",
        "created_at": datetime.utcnow(),
    })
    print("Data inserted ✓")

except Exception as e:
    print(f"❌ DB Error: {e}")
