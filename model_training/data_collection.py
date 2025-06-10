import cv2
import mediapipe as mp
import json
import os

# Initialize Mediapipe
mp_hands = mp.solutions.hands
mp_face = mp.solutions.face_mesh
mp_draw = mp.solutions.drawing_utils

# Base dataset paths
DATASET_PATH = "dataset/raw_landmarks"
IMAGE_PATH = "dataset/images"
os.makedirs(DATASET_PATH, exist_ok=True)
os.makedirs(IMAGE_PATH, exist_ok=True)

# Get user input for sign label
sign_label = input("Enter the sign name (e.g., fever, cough): ").strip()
sign_image_dir = os.path.join(IMAGE_PATH, sign_label)
os.makedirs(sign_image_dir, exist_ok=True)  # Create folder for specific sign

frame_count = 0

# Important face points for reference
IMPORTANT_FACE_POINTS = [1, 4, 10, 152, 13, 14, 291, 61, 199]

# Start capturing video
cap = cv2.VideoCapture(0)

with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5) as hands, \
     mp_face.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)  # Flip for mirror effect
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process hands & face
        hand_results = hands.process(rgb_frame)
        face_results = face_mesh.process(rgb_frame)

        # Store landmarks
        landmarks_data = {"sign": sign_label, "frame": frame_count, "hands": [], "face": []}

        # Capture hand landmarks
        if hand_results.multi_hand_landmarks:
            for hand_landmarks in hand_results.multi_hand_landmarks:
                hand_points = [[lm.x, lm.y, lm.z] for lm in hand_landmarks.landmark]
                landmarks_data["hands"].append(hand_points)
                mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        # Capture face landmarks
        if face_results.multi_face_landmarks:
            for face_landmarks in face_results.multi_face_landmarks:
                h, w, _ = frame.shape
                face_points = [[face_landmarks.landmark[i].x, face_landmarks.landmark[i].y, face_landmarks.landmark[i].z] for i in IMPORTANT_FACE_POINTS]
                landmarks_data["face"] = face_points
                for i in IMPORTANT_FACE_POINTS:
                    x, y = int(face_landmarks.landmark[i].x * w), int(face_landmarks.landmark[i].y * h)
                    cv2.circle(frame, (x, y), 3, (0, 255, 0), -1)

        # Save frame & JSON data every 10 frames
        if frame_count % 10 == 0:
            img_path = os.path.join(sign_image_dir, f"{frame_count:04d}.jpg")
            json_path = os.path.join(DATASET_PATH, f"{sign_label}_{frame_count:04d}.json")

            cv2.imwrite(img_path, frame)  # Save image
            with open(json_path, "w") as f:
                json.dump(landmarks_data, f, indent=4)

            print(f"Saved: {json_path} + {img_path}")

        # Display the frame
        cv2.putText(frame, f"Sign: {sign_label}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
        cv2.putText(frame, "Press 'q' to stop", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        cv2.imshow("Data Collection", frame)

        frame_count += 1
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
