from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import joblib
from flask_cors import CORS

# Load the trained model and scaler
model = tf.keras.models.load_model("seizure_detection_model.h5")
scaler = joblib.load("scaler.pkl")

app = Flask(__name__)

CORS(app)

# Global variable to store current prediction result
current_prediction = None

@app.route('/')
def home():
    return "Seizure Detection API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    global current_prediction
    try:
        # Receive sensor data from Raspberry Pi
        data = request.get_json()
        input_data = np.array(data['features']).reshape(1, -1)

        # Scale input data
        input_scaled = scaler.transform(input_data)

        # Make prediction
        prediction = model.predict(input_scaled)
        result = int(prediction[0][0] > 0.5)  # Binary classification (0 = No Seizure, 1 = Seizure)
        
        # Update global prediction result
        current_prediction = result
        
        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/get_predict', methods=['GET'])
def get_predict():
    try:
        if current_prediction is not None:
            return jsonify({"prediction": current_prediction})
        else:
            return jsonify({"error": "No prediction available yet."})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)  # Make server accessible over local network
