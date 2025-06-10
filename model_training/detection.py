import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import os

model = load_model("Final_handSignModel.h5")
print("Model loaded successfully!")

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

cap = cv2.VideoCapture(0) 

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

def preprocess_frame(frame):
    '''Preprocess the frame for the MobileNetV2 model.
     Resize the frame to 240x240 (input size for the model) '''
    resized_frame = cv2.resize(frame, (240, 240))
    
    # Normalize pixel values to [0, 1]
    normalized_frame = resized_frame / 255.0
    
    # Expand dimensions to match the model's input shape (batch_size, height, width, channels)
    input_frame = np.expand_dims(normalized_frame, axis=0)
    
    return input_frame

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame.")
        break
    
    input_frame = preprocess_frame(frame)
    
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


cap.release()
cv2.destroyAllWindows()