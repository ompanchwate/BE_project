from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import io
from gtts import gTTS
import base64
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import jwt
from bson import ObjectId
import pytz
import datetime
import os
from dotenv import load_dotenv

load_dotenv()  # ✅ Load .env variables before using them

mongo_uri = os.getenv("MONGO_URI")
secret_key = os.getenv("SECRET_KEY")


app = Flask(__name__)
# CORS(app)
CORS(app,
     supports_credentials=True,
     origins=["https://handytalk.vercel.app"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])


bcrypt = Bcrypt(app)

# MongoDB Connection
client = MongoClient(mongo_uri)
db = client['sign_language_app']
users_collection = db['users']

# Load model
model = load_model("Final_handSignModel.h5")
print("✅ Model loaded successfully!")

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



def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize((240, 240))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

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

        # Convert label to speech
        tts = gTTS(text=label, lang='en')
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        audio_base64 = base64.b64encode(audio_buffer.read()).decode('utf-8')

        return jsonify({
            'label': label,
            'confidence': confidence,
            'audio': audio_base64
        })

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({'error': 'Prediction failed'}), 500


# -----------------------
# Authentication APIs
# -----------------------

def generate_jwt(email):
    payload = {
        'email': email
    }
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    gender = data.get('gender')
    qualification = data.get('qualification')
    password = data.get('password')

    # Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({'error': 'User already exists'}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Get current IST time
    ist_time = datetime.datetime.now(pytz.timezone('Asia/Kolkata'))

    # Insert new user with IST time
    result = users_collection.insert_one({
        'name': name,
        'email': email,
        'phone': phone,
        'gender': gender,
        'qualification': qualification,
        'password': hashed_password,
        'created_at': ist_time
    })

    # Fetch inserted user and exclude password
    user = users_collection.find_one({'_id': result.inserted_id}, {'password': 0})
    user['_id'] = str(user['_id'])
    user['created_at'] = user['created_at'].strftime('%Y-%m-%d %H:%M:%S %Z')

    # Generate JWT token
    token = jwt.encode({
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, secret_key, algorithm='HS256')

    return jsonify({'message': 'User created successfully', 'user': user, 'token': token}), 201


@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'error': 'Incorrect password'}), 401

    user = users_collection.find_one({'email': email}, {'password': 0})
    user['_id'] = str(user['_id'])

    # Generate JWT token
    token = jwt.encode({
    'email': email,
    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
}, secret_key, algorithm='HS256')

    return jsonify({'message': 'Login successful', 'user': user, 'token': token}), 200


@app.route('/authenticate', methods=['GET'])
def authenticate():
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return jsonify({'error': 'Authorization header missing'}), 401

    # Expect header format: "Bearer <token>"
    parts = auth_header.split()

    if len(parts) != 2 or parts[0].lower() != 'bearer':
        return jsonify({'error': 'Invalid authorization header'}), 401

    token = parts[1]

    try:
        decoded = jwt.decode(token, secret_key, algorithms=['HS256'])
        # If you want, you can fetch user info from DB using decoded info
        return jsonify({'message': 'Token is valid', 'user': decoded}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401


@app.route('/update-profile', methods=['PUT'])
def update_profile():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return jsonify({'error': 'Authorization header missing'}), 401

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        return jsonify({'error': 'Invalid authorization header'}), 401

    token = parts[1]

    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        email = payload['email']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

    data = request.get_json()
    update_fields = {}

    if 'name' in data:
        update_fields['name'] = data['name']
    if 'phone' in data:
        update_fields['phone'] = data['phone']
    if 'qualification' in data:
        update_fields['qualification'] = data['qualification']
    if 'gender' in data:
        update_fields['gender'] = data['gender']

    # Set updated time in IST

    result = users_collection.update_one({'email': email}, {'$set': update_fields})

    if result.matched_count == 0:
        return jsonify({'error': 'User not found'}), 404

    user = users_collection.find_one({'email': email}, {'password': 0})
    user['_id'] = str(user['_id'])

    return jsonify({'message': 'Profile updated successfully', 'user': user}), 200


# -----------------------


if __name__ == '__main__':
    app.run(debug=True)
