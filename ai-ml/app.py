# ai-ml/app.py
from flask import Flask, jsonify
from db import raw_collection
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

app = Flask(__name__)

@app.route("/predict", methods=["GET"])
def predict_temperature():
    try:
        cursor = raw_collection.find(
            {}, 
            {"_id": 0, "temperature": 1, "rpm": 1, "pwm": 1, "createdAt": 1}
        ).sort("createdAt", 1).limit(100)

        data = list(cursor)
        if len(data) < 20:
            return jsonify({"status": "INSUFFICIENT_DATA"})

        df = pd.DataFrame(data)
        temps = df["temperature"].values
        rpms = df["rpm"].values
        pwms = df["pwm"].values

        window = 5
        X, y = [], []
        for i in range(len(temps) - window):
            features = []
            for j in range(window):
                features.extend([temps[i + j], rpms[i + j], pwms[i + j]])
            X.append(features)
            y.append(temps[i + window])

        split = int(0.8 * len(X))
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]

        model = RandomForestRegressor(n_estimators=200, random_state=42)
        model.fit(X_train, y_train)

        latest_features = []
        for i in range(window):
            latest_features.extend([temps[-window + i], rpms[-window + i], pwms[-window + i]])

        future_temp = model.predict([latest_features])[0]
        current_temp = temps[-1]

        return jsonify({
            "status": "OK",
            "currentTemperature": float(current_temp),
            "predictedTemperature": round(float(future_temp), 2)
        })

    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
