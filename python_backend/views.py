from django.shortcuts import render
from .ml_model import predict_news
try:
    from pymongo import MongoClient
except ImportError:
    MongoClient = None

def index(request):
    result = None
    user_input = ""
    
    if request.method == "POST":
        user_input = request.POST.get('news_text', '')
        if user_input:
            # Get prediction from our transformer model
            result = predict_news(user_input)
            
            # Save to MongoDB for logging (optional)
            if MongoClient:
                try:
                    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
                    db = client['fakenews_db']
                    db.news_logs.insert_one({
                        "text": user_input, 
                        "label": result['label'], 
                        "score": result['confidence']
                    })
                except Exception as e:
                    print(f"MongoDB Log Failed: {e}")

    return render(request, 'classifier/index.html', {
        'result': result, 
        'user_input': user_input
    })
