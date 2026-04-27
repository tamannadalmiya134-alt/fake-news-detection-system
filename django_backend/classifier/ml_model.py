from transformers import pipeline

# Model load (BERT Tiny - Fast and Accurate)
pipe = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-fake-news-detection")

def get_prediction(text):
    result = pipe(text)
    # result looks like: [{'label': 'LABEL_0', 'score': 0.98}]
    label = "FAKE" if result[0]['label'] == 'LABEL_0' else "REAL"
    return {'label': label, 'score': round(result[0]['score'] * 100, 2)}
