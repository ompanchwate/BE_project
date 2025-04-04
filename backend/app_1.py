from flask import Flask, request, jsonify, make_response
import cv2
import numpy as np
import mediapipe as mp
import os
import tensorflow as tf
import base64
from tensorflow.keras.models import load_model

app = Flask(__name__)

# MediaPipe setup
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils

# Initialize model and parameters
actions = np.array(['asthma', 'cold', 'dizziness', 'fever', 'sore_throat', 'vomiting'])
model = None
threshold = 0.5

# Load the model
def load_action_model():
    global model
    try:
        model = load_model('action.h5')
        print("Model loaded successfully")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

# MediaPipe helper functions
def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image.flags.writeable = False
    results = model.process(image)
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    return image, results

def draw_styled_landmarks(image, results):
    # Draw face landmarks
    mp_drawing.draw_landmarks(
        image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION,
        mp_drawing.DrawingSpec(color=(80, 110, 10), thickness=1, circle_radius=1),
        mp_drawing.DrawingSpec(color=(80, 256, 121), thickness=1, circle_radius=1)
    )
    
    # Draw pose landmarks
    mp_drawing.draw_landmarks(
        image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(80, 22, 10), thickness=2, circle_radius=4),
        mp_drawing.DrawingSpec(color=(80, 44, 121), thickness=2, circle_radius=2)
    )
    
    # Draw left hand landmarks
    mp_drawing.draw_landmarks(
        image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(121, 22, 76), thickness=2, circle_radius=4),
        mp_drawing.DrawingSpec(color=(121, 44, 250), thickness=2, circle_radius=2)
    )
    
    # Draw right hand landmarks
    mp_drawing.draw_landmarks(
        image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=4),
        mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
    )

def extract_keypoints(results):
    # Extract face landmarks
    face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]) if results.face_landmarks else np.zeros((468, 3))
    face = face.flatten() if isinstance(face, np.ndarray) else np.zeros(468*3)
    
    # Extract pose landmarks
    pose = np.array([[res.x, res.y, res.z] for res in results.pose_landmarks.landmark]) if results.pose_landmarks else np.zeros((33, 3))
    pose = pose.flatten() if isinstance(pose, np.ndarray) else np.zeros(33*3)
    
    # Extract left hand landmarks
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]) if results.left_hand_landmarks else np.zeros((21, 3))
    lh = lh.flatten() if isinstance(lh, np.ndarray) else np.zeros(21*3)
    
    # Extract right hand landmarks
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]) if results.right_hand_landmarks else np.zeros((21, 3))
    rh = rh.flatten() if isinstance(rh, np.ndarray) else np.zeros(21*3)
    
    return np.concatenate([face, pose, lh, rh])

# Handle OPTIONS requests
@app.route('/api/predict', methods=['OPTIONS'])
@app.route('/api/health', methods=['OPTIONS'])
@app.route('/api/start-stream', methods=['OPTIONS'])
@app.route('/api/actions', methods=['OPTIONS'])
def handle_options():
    print("hiii")
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    response = make_response(jsonify({"status": "healthy", "model_loaded": model is not None}))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# Prediction endpoint
@app.route('/api/predict', methods=['POST'])
def predict():
    if not model:
        response = make_response(jsonify({"error": "Model not loaded"}), 500)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    if 'video' not in request.files and 'frame' not in request.json:
        response = make_response(jsonify({"error": "No video file or frame data provided"}), 400)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    sequence = []
    predictions = []
    detected_action = None
    confidence = 0.0
    
    # Process video file
    if 'video' in request.files:
        video_file = request.files['video']
        video_path = os.path.join('temp', video_file.filename)
        os.makedirs('temp', exist_ok=True)
        video_file.save(video_path)
        
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        
        with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
            while cap.isOpened() and frame_count < 30:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Process the frame
                _, results = mediapipe_detection(frame, holistic)
                keypoints = extract_keypoints(results)
                sequence.append(keypoints)
                frame_count += 1
                
                # Skip frames if needed to get ~30 frames total
                if frame_count % max(1, int(cap.get(cv2.CAP_PROP_FRAME_COUNT) / 30)) != 0:
                    continue
            
            cap.release()
        
        # Clean up
        if os.path.exists(video_path):
            os.remove(video_path)
    
    # Process single frame (for real-time predictions)
    elif 'frame' in request.json:
        try:
            # Decode base64 image
            frame_data = request.json['frame'].split(',')[1] if ',' in request.json['frame'] else request.json['frame']
            frame_bytes = base64.b64decode(frame_data)
            np_arr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            # Get previous sequence data if available
            prev_sequence = request.json.get('prevSequence', [])
            if prev_sequence:
                sequence = prev_sequence
            
            with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
                _, results = mediapipe_detection(frame, holistic)
                keypoints = extract_keypoints(results)
                sequence.append(keypoints)
                
                # Keep only last 30 frames
                sequence = sequence[-30:]
        except Exception as e:
            response = make_response(jsonify({"error": f"Error processing frame: {str(e)}"}), 400)
            response.headers.add('Access-Control-Allow-Origin', '*') 
            return response
    
    # Make prediction if we have enough frames
    if len(sequence) == 30:
        res = model.predict(np.expand_dims(sequence, axis=0))[0]
        action_index = np.argmax(res)
        detected_action = actions[action_index]
        confidence = float(res[action_index])
        
        # Only return confident predictions
        if confidence < threshold:
            detected_action = None
    
    # Prepare response data
    response_data = {
        "sequence": sequence if len(sequence) < 30 else None,  # Don't send full sequence for bandwidth reasons
        "sequence_length": len(sequence),
        "action": detected_action,
        "confidence": confidence,
        "all_probabilities": {action: float(prob) for action, prob in zip(actions, res)} if 'res' in locals() else {}
    }
    
    # Create response with CORS headers
    response = make_response(jsonify(response_data))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/start-stream', methods=['POST'])
def start_stream():
    response = make_response(jsonify({"status": "stream_ready"}))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/actions', methods=['GET'])
def get_actions():
    response = make_response(jsonify({"actions": actions.tolist()}))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    load_action_model()
    print("Starting server with CORS support...")
    app.run(debug=True, host='0.0.0.0', port=5000)