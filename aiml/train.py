from fetch_data import get_sensor_data
from sklearn.ensemble import RandomForestRegressor
import joblib
import pandas as pd

# ------------------------------
# 1️⃣ Fetch data
# ------------------------------
df = get_sensor_data(limit=500)  # jitna data mile, utna
if df is None:
    print("Not enough data to train the model.")
    exit()

temps = df["temperature"].values
rpms  = df["rpm"].values
pwms  = df["pwm"].values

# ------------------------------
# 2️⃣ Prepare sliding window features
# ------------------------------
window = 5  # last 5 readings per sample
X, y = [], []

for i in range(len(temps) - window):
    features = []
    for j in range(window):
        features.extend([temps[i+j], rpms[i+j], pwms[i+j]])
    X.append(features)
    y.append(temps[i+window])

# ------------------------------
# 3️⃣ Train RandomForest model
# ------------------------------
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)
model.fit(X, y)

# ------------------------------
# 4️⃣ Save the trained model
# ------------------------------
joblib.dump(model, "model.pkl")
print(f"Model trained and saved! Total samples: {len(X)}")
