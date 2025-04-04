from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load your trained model
model = load_model("Final_handSignModel.h5")
print("✅ Model loaded successfully!")

# Label map (update according to your model classes)
label_map = {
    0: "asthama",
    1: "cancer",
    2: "cold",
    3: "cough",
    4: "fever",
    5: "headache",
    6: "running nose",
    7: "sore throat"
}

# Image preprocessing function
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize((240, 240))  # Match your model's input size
    image_array = np.array(image) / 255.0  # Normalize
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    return image_array

# Prediction route
@app.route('/predict-frame', methods=['POST'])
def predict():
    if 'frame' not in request.files:
        return jsonify({'error': 'No frame uploaded'}), 400

    file = request.files['frame']
    image_bytes = file.read()

    try:
        processed_img = preprocess_image(image_bytes)
        predictions = model.predict(processed_img)
        predicted_class = int(np.argmax(predictions))
        confidence = float(np.max(predictions))
        label = label_map.get(predicted_class, "Unknown")
        print(label)

        return jsonify({
            'label': label,
            'confidence': confidence
        })
    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({'error': 'Prediction failed'}), 500

if __name__ == '__main__':
    app.run(debug=True)
