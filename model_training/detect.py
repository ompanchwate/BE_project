import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model


# Load the trained model
import os

model = load_model("Final_handSignModel.h5")
print("Model loaded successfully!")

# Example label mapping (replace with your actual class names)
label_map = {
    0: "asthama",
    1: "cancer",
    2: "cold",
    3: "cough",
    4: "fever",
    5: "headache",
    6: "running nose",
    7: "sore throat"
    # Add more classes as needed
}

# Initialize webcam
cap = cv2.VideoCapture(0)  # 0 for default webcam

# Check if the webcam is opened correctly
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

def preprocess_frame(frame):
    """
    Preprocess the frame for the MobileNetV2 model.
    """
    # Resize the frame to 240x240 (input size for the model)
    resized_frame = cv2.resize(frame, (240, 240))
    
    # Normalize pixel values to [0, 1]
    normalized_frame = resized_frame / 255.0
    
    # Expand dimensions to match the model's input shape (batch_size, height, width, channels)
    input_frame = np.expand_dims(normalized_frame, axis=0)
    
    return input_frame

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame.")
        break
    
    # Preprocess the frame
    input_frame = preprocess_frame(frame)
    
    # Make a prediction using the model
    predictions = model.predict(input_frame)
    predicted_class = np.argmax(predictions)  # Get the class with the highest probability
    confidence = np.max(predictions)  # Get the confidence score
    
    # Get the predicted label
    predicted_label = label_map.get(predicted_class, "Unknown")
    
    # Display the predicted label and confidence on the frame
    text = f"Sign: {predicted_label} ({confidence:.2f})"
    cv2.putText(frame, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    # Display the frame
    cv2.imshow("Sign Language Tracking", frame)
    
    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()









# import cv2
# import mediapipe as mp
# import numpy as np
# import tensorflow as tf  # Load model correctly for Keras
# import pickle

# # Load the model correctly as a Scikit-Learn model
# with open("sign_model.pkl", "rb") as file:
#     model = pickle.load(file)

# # # Load trained model (Keras/TensorFlow)
# # model = tf.keras.models.load_model("sign_model.pkl")  # Use .h5 if available

# # Initialize Mediapipe
# mp_hands = mp.solutions.hands
# mp_face = mp.solutions.face_mesh
# mp_draw = mp.solutions.drawing_utils

# cap = cv2.VideoCapture(0)

# with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5) as hands, \
#      mp_face.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:

#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break

#         frame = cv2.flip(frame, 1)
#         rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#         # Process hands & face
#         hand_results = hands.process(rgb_frame)
#         face_results = face_mesh.process(rgb_frame)

#         feature_vector = []

#         # Capture hand landmarks
#         if hand_results.multi_hand_landmarks:
#             for hand_landmarks in hand_results.multi_hand_landmarks:
#                 for lm in hand_landmarks.landmark:
#                     feature_vector.extend([lm.x, lm.y, lm.z])

#         # Capture face landmarks
#         if face_results.multi_face_landmarks:
#             for face_landmarks in face_results.multi_face_landmarks:
#                 for i in [1, 4, 10, 152, 13, 14, 291, 61, 199]:  # Select key points
#                     lm = face_landmarks.landmark[i]
#                     feature_vector.extend([lm.x, lm.y, lm.z])

#         # Convert to NumPy array & reshape for model input
#         feature_vector = np.array(feature_vector).reshape(1, -1)

#         # ✅ Use model.input_shape[1] instead of model.n_features_in_
#         if feature_vector.shape[1] == model.input_shape[1]:
#             prediction = model.predict(feature_vector)
#             predicted_label = np.argmax(prediction)  # Convert probabilities to class label

#             # Display prediction
#             cv2.putText(frame, f"Predicted Sign: {predicted_label}", (50, 50),
#                         cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

#         # Show frame
#         cv2.imshow("Sign Detection", frame)
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

# cap.release()
# cv2.destroyAllWindows()
