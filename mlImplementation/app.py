from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import logging

app = Flask(__name__)
CORS(app)

model = None

def load_model(model_path):
    global model
    try:
        with open(model_path, 'rb') as file:
            model = pickle.load(file)
    except Exception as e:
        logging.error(f"Error loading model: {e}")

load_model('NBClassifier.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    global model
    if model is None:
        return jsonify({'error': 'Model not loaded'})

    try:
        data = request.get_json()
        features = data.get('features')

        if not features:
            return jsonify({'error': 'No features provided'})

        K = features.get('K')
        N = features.get('N')
        P = features.get('P')
        humidity = features.get('humidity')
        pH = features.get('pH')
        rainfall = features.get('rainfall')
        temperature = features.get('temperature')

        prediction = model.predict([[N, P, K, temperature, humidity, pH, rainfall]])

        probabilities = model.predict_proba([[N, P, K, temperature, humidity, pH, rainfall]])

        response = {
            'predicted_class': prediction[0],
            'probability': float(np.max(probabilities)),
            'other_classes': {}
        }

        class_labels = model.classes_
        for i, class_label in enumerate(class_labels):
            response['other_classes'][class_label] = float(probabilities[0][i])

        return jsonify(response)
    except Exception as e:
        logging.error(f"Prediction error: {e}")
        return jsonify({'error': 'Prediction failed'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
