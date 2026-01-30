# app.py
from db import raw_collection
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import json
import sys

try:
    # ------------------------------
    # 1️⃣ Fetch last 100 records for training (ascending order)
    # ------------------------------
    cursor = raw_collection.find(
        {}, 
        {"_id": 0, "temperature": 1, "rpm": 1, "pwm": 1, "createdAt": 1}
    ).sort("createdAt", 1).limit(100)  # ascending for training

    data = list(cursor)

    if len(data) < 20:
        print(json.dumps({"status": "INSUFFICIENT_DATA"}))
        sys.exit()

    df = pd.DataFrame(data)

    temps = df["temperature"].values
    rpms = df["rpm"].values
    pwms = df["pwm"].values

    # ------------------------------
    # 2️⃣ Sliding window features for training
    # ------------------------------
    window = 5
    X, y = [], []
    for i in range(len(temps) - window):
        features = []
        for j in range(window):
            features.extend([temps[i + j], rpms[i + j], pwms[i + j]])
        X.append(features)
        y.append(temps[i + window])

    # ------------------------------
    # 3️⃣ Train/Test split
    # ------------------------------
    split = int(0.8 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    # ------------------------------
    # 4️⃣ Train RandomForest model
    # ------------------------------
    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    # ------------------------------
    # 5️⃣ Model accuracy (MAE)
    # ------------------------------
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)

    # ------------------------------
    # 6️⃣ Predict next temperature
    # ------------------------------
    latest_features = []
    for i in range(window):
        latest_features.extend([temps[-window + i], rpms[-window + i], pwms[-window + i]])

    future_temp = model.predict([latest_features])[0]

    # ------------------------------
    # 7️⃣ Fetch latest actual temperature from DB using correct field 'createdAt'
    # ------------------------------
    latest_temp_doc = raw_collection.find(
        {}, 
        {"_id": 0, "temperature": 1}
    ).sort("createdAt", -1).limit(1)  # descending → latest first

    latest_temp_list = list(latest_temp_doc)
    if latest_temp_list:
        current_temp = latest_temp_list[0]["temperature"]
    else:
        current_temp = temps[-1]  # fallback if something went wrong

    # ------------------------------
    # 8️⃣ Output JSON
    # ------------------------------
    print(json.dumps({
        "status": "OK",
        "currentTemperature": float(current_temp),          # latest DB value
        "predictedTemperature": round(float(future_temp), 2),
        "avgError": round(float(mae), 3)
    }))

except Exception as e:
    print(json.dumps({
        "status": "ERROR",
        "message": str(e)
    }))
