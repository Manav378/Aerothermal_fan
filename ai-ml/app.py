from flask import Flask, jsonify
from db import raw_collection
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import traceback

app = Flask(__name__)

# -------------------------------
# Health check (Render / uptime)
# -------------------------------
@app.route("/")
def health():
    return {
        "status": "OK",
        "message": "Aerothermal Fan ML API running 🚀"
    }

# -------------------------------
# Temperature Prediction API (Environment Temp)
# -------------------------------
@app.route("/api/predict", methods=["GET"])
def predict_temperature():
    try:
        # 1️⃣ Fetch last 100 environment readings from MongoDB
        cursor = raw_collection.find(
            {},
            {
                "_id": 0,
                "temperature": 1,  # environment temp
                "rpm": 1,
                "pwm": 1,
                "createdAt": 1
            }
        ).sort("createdAt", 1).limit(100)

        data = list(cursor)

        # 2️⃣ Check if enough data
        if len(data) < 20:
            return jsonify({
                "status": "INSUFFICIENT_DATA",
                "message": "Not enough environment data to predict"
            })

        # 3️⃣ Create DataFrame
        df = pd.DataFrame(data)
        if not {"temperature", "rpm", "pwm"}.issubset(df.columns):
            return jsonify({
                "status": "ERROR",
                "message": "Missing required fields in DB"
            })

        temps = df["temperature"].values
        rpms = df["rpm"].values
        pwms = df["pwm"].values

        # 4️⃣ Feature engineering (sliding window)
        window = 5
        X, y = [], []
        for i in range(len(temps) - window):
            features = []
            for j in range(window):
                features.extend([temps[i + j], rpms[i + j], pwms[i + j]])
            X.append(features)
            y.append(temps[i + window])

        if len(X) == 0:
            return jsonify({
                "status": "ERROR",
                "message": "Feature generation failed"
            })

        # 5️⃣ Train model (RandomForest)
        split = int(0.8 * len(X))
        X_train = X[:split]
        y_train = y[:split]

        model = RandomForestRegressor(n_estimators=200, random_state=42)
        model.fit(X_train, y_train)

        # 6️⃣ Predict next environment temperature
        latest_features = []
        for i in range(window):
            latest_features.extend([temps[-window + i], rpms[-window + i], pwms[-window + i]])

        predicted_temp = model.predict([latest_features])[0]
        current_temp = temps[-1]

        # 7️⃣ Decide fan speed & buzzer based on environment temp
        # Thresholds for environment temperature
        SAFE_ENV_TEMP = 35  # safe room temp (Celsius)
        WARNING_TEMP = 40   # rising temp
        CRITICAL_TEMP = 45  # too hot

        fan_speed = 30  # default low
        buzzer = False
        alert = "NORMAL"

        if predicted_temp >= CRITICAL_TEMP:
            fan_speed = 90
            buzzer = True
            alert = "OVERHEAT_SOON"
        elif predicted_temp >= WARNING_TEMP:
            fan_speed = 60
            alert = "RISING_TEMP"

        # 8️⃣ Response JSON
        return jsonify({
            "status": "OK",
            "currentTemperature": round(float(current_temp), 2),
            "predictedTemperature": round(float(predicted_temp), 2),
            "fanSpeed": fan_speed,
            "buzzer": buzzer,
            "alert": alert
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({
            "status": "ERROR",
            "message": str(e)
        }), 500

# -------------------------------
# Run locally only
# -------------------------------
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=False
    )
