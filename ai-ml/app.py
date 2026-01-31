from flask import Flask, jsonify
from db import raw_collection
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import traceback

app = Flask(__name__)

# -------------------------------
# Health check
# -------------------------------
@app.route("/")
def health():
    return {
        "status": "OK",
        "message": "Accurate Aerothermal Fan ML API 🚀"
    }

# -------------------------------
# Prediction API
# -------------------------------
@app.route("/api/predict", methods=["GET"])
def predict_temperature():
    try:
        # 1️⃣ Fetch recent data
        cursor = raw_collection.find(
            {},
            {
                "_id": 0,
                "temperature": 1,
                "rpm": 1,
                "pwm": 1,
                "createdAt": 1
            }
        ).sort("createdAt", 1).limit(150)

        data = list(cursor)

        if len(data) < 40:
            return jsonify({
                "status": "INSUFFICIENT_DATA"
            })

        df = pd.DataFrame(data)

        # 2️⃣ Noise reduction (KEY for accuracy)
        df["temp_s"] = df["temperature"].rolling(3).mean()
        df["rpm_s"] = df["rpm"].rolling(3).mean()
        df["pwm_s"] = df["pwm"].rolling(3).mean()

        df["hour"] = pd.to_datetime(df["createdAt"]).dt.hour
        df = df.dropna()

        temps = df["temp_s"].values
        rpms = df["rpm_s"].values
        pwms = df["pwm_s"].values
        hours = df["hour"].values

        # 3️⃣ Sliding window features
        window = 5
        X, y = [], []

        for i in range(len(temps) - window):
            row = []
            for j in range(window):
                row.extend([
                    temps[i + j],
                    rpms[i + j],
                    pwms[i + j],
                    hours[i + j]
                ])
            X.append(row)
            y.append(temps[i + window])

        # 4️⃣ Train model (tuned)
        split = int(len(X) * 0.8)
        model = RandomForestRegressor(
            n_estimators=350,
            max_depth=14,
            min_samples_split=4,
            random_state=42
        )
        model.fit(X[:split], y[:split])

        # 5️⃣ Predict next temperature
        latest = []
        for i in range(window):
            latest.extend([
                temps[-window + i],
                rpms[-window + i],
                pwms[-window + i],
                hours[-window + i]
            ])

        predicted = model.predict([latest])[0]
        current = temps[-1]

        # 6️⃣ Stabilize output (industrial trick)
        predicted = (0.75 * predicted) + (0.25 * current)

        # 7️⃣ Future trend (next 5 steps)
        future = []
        t, r, p, h = list(temps), list(rpms), list(pwms), list(hours)

        for _ in range(5):
            f = []
            for i in range(window):
                f.extend([t[-window + i], r[-window + i], p[-window + i], h[-window + i]])
            pr = model.predict([f])[0]
            future.append(round(float(pr), 2))

            t.append(pr)
            r.append(r[-1])
            p.append(p[-1])
            h.append(h[-1])

        # 8️⃣ Trend logic
        trend = "STABLE"
        if future[-1] - current > 1.5:
            trend = "RISING"
        elif current - future[-1] > 1.5:
            trend = "FALLING"

        # 9️⃣ Control logic
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

        # 10️⃣ Sensor anomaly
        if abs(predicted - current) > 7:
            alert = "SENSOR_ANOMALY"
            buzzer = True

        # 11️⃣ History for dashboard
        history = df.tail(10)[
            ["temperature", "rpm", "pwm", "createdAt"]
        ].to_dict(orient="records")

        # 12️⃣ Final response
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
            "status": "ERROR",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)
