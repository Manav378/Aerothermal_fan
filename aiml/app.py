from flask import Flask, jsonify
from aiml.db import raw_collection
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import traceback

app = Flask(__name__)

model = None
last_train_size = 0
WINDOW = 5

# -------------------------------
# Health
# -------------------------------
@app.route("/")
def health():
    return {
        "status": "OK",
        "message": "Accurate Aerothermal Fan ML API 🚀"
    }

# -------------------------------
# Train model
# -------------------------------
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

    m = RandomForestRegressor(
        n_estimators=120,
        max_depth=10,
        random_state=42
    )
    m.fit(X, y)
    return m

# -------------------------------
# Prediction API
# -------------------------------
@app.route("/api/predict", methods=["GET"])
def predict_temperature():
    global model, last_train_size
    try:
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
                "alert": "WAITING_DATA"
            })

        df = pd.DataFrame(data)

        # smoothing
        df["temp_s"] = df["temperature"].rolling(3).mean()
        df["rpm_s"] = df["rpm"].rolling(3).mean()
        df["pwm_s"] = df["pwm"].rolling(3).mean()

        df["hour"] = pd.to_datetime(df["createdAt"]).dt.hour
        df = df.dropna()

        # retrain if new data
        if model is None or len(df) != last_train_size:
            model = train_model(df)
            last_train_size = len(df)

        temps = df["temp_s"].values
        rpms = df["rpm_s"].values
        pwms = df["pwm_s"].values
        hours = df["hour"].values

        raw_temps = df["temperature"].values
        current = raw_temps[-1]   # 🔥 real sensor temp

        # predict next
        latest = []
        for i in range(WINDOW):
            latest.extend([
                temps[-WINDOW + i],
                rpms[-WINDOW + i],
                pwms[-WINDOW + i],
                hours[-WINDOW + i]
            ])

        predicted = model.predict([latest])[0]

        # stabilize
        predicted = (0.75 * predicted) + (0.25 * current)

        # future
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

        # trend
        trend = "STABLE"
        if future[-1] - current > 1.5:
            trend = "RISING"
        elif current - future[-1] > 1.5:
            trend = "FALLING"

        alert = "NORMAL"

        if predicted >= 45:
            alert = "OVERHEAT_SOON"
        elif predicted >= 40:
    
            alert = "RISING_TEMP"

        if abs(predicted - current) > 7:
            alert = "SENSOR_ANOMALY"
           

        history = df.tail(10)[
            ["temperature", "rpm", "pwm", "createdAt"]
        ].to_dict(orient="records")

        return jsonify({
            "status": "OK",
            "history": history,
            "currentTemperature": round(float(current), 2),
            "predictedTemperature": round(float(predicted), 2),
            "futureTemperatures": future,
            "trend": trend,
            "alert": alert
        })

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "status": "FAILED",
            "history": [],
            "currentTemperature": 0,
            "predictedTemperature": 0,
            "futureTemperatures": [],
            "trend": "STABLE",
            "alert": "ERROR"
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
