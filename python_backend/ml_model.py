from transformers import pipeline

# Load pre-trained fake news detection pipeline
# Model: "mrm8488/bert-tiny-finetuned-fake-news-detection"
# This is a highly efficient BERT model fine-tuned specifically for Fake News detection.
pipe = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-fake-news-detection")

def predict_news(text):
    """
    Takes news text and returns classification label and confidence score.
    LABEL_0 -> FAKE
    LABEL_1 -> REAL
    """
    result = pipe(text)
    # Result format: [{'label': 'LABEL_0', 'score': 0.98}]
    
    prediction = result[0]
    label = "FAKE" if prediction['label'] == 'LABEL_0' else "REAL"
    score = round(prediction['score'] * 100, 2)
    
    return {
        'label': label,
        'confidence': score,
        'original_label': prediction['label']
    }
