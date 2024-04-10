from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the trained model
with open('NBClassifier.pkl', 'rb') as file:
    model = pickle.load(file)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = data['features']

    features = list(features.values())

    input_data = np.array([features], dtype=float)

    predicted_proba = model.predict_proba(input_data)

    class_labels = model.classes_

    predicted_class_index = np.argmax(predicted_proba)

    predicted_class = class_labels[predicted_class_index]
    predicted_probability = predicted_proba[0][predicted_class_index]

    # Prepare response
    response = {
        'predicted_class': predicted_class,
        'probability': float(predicted_probability),
        'other_classes': {}
    }

    # Add probabilities of other classes
        # Add probabilities of other classes
    for i, class_label in enumerate(class_labels):
        if i != predicted_class_index:
            response['other_classes'][class_label] = float(predicted_proba[0][i])

    return jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
