from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import joblib

# Load the trained model and scaler
model = tf.keras.models.load_model(r"E:\Codes\Projects\Health_Hackathon\server\seizure_detection_model.h5")
scaler = joblib.load(r"E:\Codes\Projects\Health_Hackathon\server\scaler.pkl")

app = Flask(__name__)

@app.route('/')
def home():
    return "Seizure Detection API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Receive sensor data 
        data = request.get_json()
        input_data = np.array(data['features']).reshape(1, -1)

        # Scale input data
        input_scaled = scaler.transform(input_data)

        # Make prediction
        prediction = model.predict(input_scaled)
        result = int(prediction[0][0] > 0.5)  # Binary classification

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)
