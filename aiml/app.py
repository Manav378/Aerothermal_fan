from flask import Flask, jsonify
from aiml.db import raw_collection
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import traceback

app = Flask(__name__)

# -------------------------------------------------
# GLOBAL MODEL (train once)
# -------------------------------------------------
model = None
WINDOW = 5

# -------------------------------------------------
# Health check
# -------------------------------------------------
@app.route("/")
def health():
    return {
        "status": "OK",
        "message": "Accurate Aerothermal Fan ML API 🚀"
    }

# -------------------------------------------------
# Train model ONCE
# -------------------------------------------------
def train_model(df):
    temps = df["temp_s"].values
    rpms = df["rpm_s"].values
    pwms = df["pwm_s"].values
    hours = df["hour"].values

    X, y = [], []

    for i in range(len(temps) - WINDOW):
        row = []
        for j in range(WINDOW):
            row.extend([
                temps[i + j],
                rpms[i + j],
                pwms[i + j],
                hours[i + j]
            ])
        X.append(row)
        y.append(temps[i + WINDOW])

    model = RandomForestRegressor(
        n_estimators=120,      # 🔥 reduced for production
        max_depth=10,
        random_state=42
    )
    model.fit(X, y)
    return model

# -------------------------------------------------
# Prediction API
# -------------------------------------------------
@app.route("/api/predict", methods=["GET"])
def predict_temperature():
    global model
    try:
        # 1️⃣ Fast Mongo query
        cursor = raw_collection.find(
            {},
            {
                "_id": 0,
                "temperature": 1,
                "rpm": 1,
                "pwm": 1,
                "createdAt": 1
            }
        ).sort("createdAt", -1).limit(200)

        data = list(cursor)[::-1]

        if len(data) < 40:
            return jsonify({
                "status": "INSUFFICIENT_DATA",
                "history": [],
                "currentTemperature": 0,
                "predictedTemperature": 0,
                "futureTemperatures": [],
                "trend": "STABLE",
                "fanSpeed": 0,
                "buzzer": False,
                "alert": "WAITING_DATA"
            })

        df = pd.DataFrame(data)

        # 2️⃣ Noise smoothing
        df["temp_s"] = df["temperature"].rolling(3).mean()
        df["rpm_s"] = df["rpm"].rolling(3).mean()
        df["pwm_s"] = df["pwm"].rolling(3).mean()

        df["hour"] = pd.to_datetime(df["createdAt"]).dt.hour
        df = df.dropna()

        # 3️⃣ Train model once
        if model is None:
            model = train_model(df)

        temps = df["temp_s"].values
        rpms = df["rpm_s"].values
        pwms = df["pwm_s"].values
        hours = df["hour"].values

        # 4️⃣ Predict next value
        latest = []
        for i in range(WINDOW):
            latest.extend([
                temps[-WINDOW + i],
                rpms[-WINDOW + i],
                pwms[-WINDOW + i],
                hours[-WINDOW + i]
            ])

        predicted = model.predict([latest])[0]
        current = temps[-1]

        # 5️⃣ Stabilize output
        predicted = (0.75 * predicted) + (0.25 * current)

        # 6️⃣ Future prediction (5 steps)
        future = []
        t, r, p, h = list(temps), list(rpms), list(pwms), list(hours)

        for _ in range(5):
            f = []
            for i in range(WINDOW):
                f.extend([t[-WINDOW + i], r[-WINDOW + i], p[-WINDOW + i], h[-WINDOW + i]])
            pr = model.predict([f])[0]
            future.append(round(float(pr), 2))

            t.append(pr)
            r.append(r[-1])
            p.append(p[-1])
            h.append(h[-1])

        # 7️⃣ Trend logic
        trend = "STABLE"
        if future[-1] - current > 1.5:
            trend = "RISING"
        elif current - future[-1] > 1.5:
            trend = "FALLING"

        # 8️⃣ Control logic
        fan_speed = 30
        buzzer = False
        alert = "NORMAL"

        if predicted >= 45:
            fan_speed = 90
            buzzer = True
            alert = "OVERHEAT_SOON"
        elif predicted >= 40:
            fan_speed = 60
            alert = "RISING_TEMP"

        if abs(predicted - current) > 7:
            alert = "SENSOR_ANOMALY"
            buzzer = True

        # 9️⃣ History for dashboard
        history = df.tail(10)[
            ["temperature", "rpm", "pwm", "createdAt"]
        ].to_dict(orient="records")

        # 🔟 Final response
        return jsonify({
            "status": "OK",
            "history": history,
            "currentTemperature": round(float(current), 2),
            "predictedTemperature": round(float(predicted), 2),
            "futureTemperatures": future,
            "trend": trend,
            "fanSpeed": fan_speed,
            "buzzer": buzzer,
            "alert": alert
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({
            "status": "FAILED",
            "history": [],
            "currentTemperature": 0,
            "predictedTemperature": 0,
            "futureTemperatures": [],
            "trend": "STABLE",
            "fanSpeed": 0,
            "buzzer": False,
            "alert": "ERROR"
        })

# -------------------------------------------------
# Local run (Render ignores this)
# -------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
