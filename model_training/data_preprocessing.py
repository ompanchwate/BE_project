import os
import json
import pandas as pd

DATASET_PATH = "model_training\dataset\raw_landmarks"
OUTPUT_CSV = "model_training\processed_dataset.csv"
data = []

for file in os.listdir(DATASET_PATH):
    if file.endswith(".json"):
        json_path = os.path.join(DATASET_PATH, file)
        with open(json_path, "r") as f:
            landmarks = json.load(f)

        row = {"sign": landmarks["sign"]}

        # Flatten hand landmarks
        for hand_id, hand in enumerate(landmarks["hands"]):
            for i, point in enumerate(hand):
                row[f"hand_{hand_id}_x_{i}"] = point[0]
                row[f"hand_{hand_id}_y_{i}"] = point[1]
                row[f"hand_{hand_id}_z_{i}"] = point[2]

        # Flatten face landmarks
        for i, point in enumerate(landmarks["face"]):
            row[f"face_x_{i}"] = point[0]
            row[f"face_y_{i}"] = point[1]
            row[f"face_z_{i}"] = point[2]

        data.append(row)

# Convert to DataFrame and save
df = pd.DataFrame(data)
df.to_csv(OUTPUT_CSV, index=False)
print(f"Processed data saved to {OUTPUT_CSV}")
