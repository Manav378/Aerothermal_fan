from db import raw_collection
import pandas as pd

def get_sensor_data(limit=100):
    cursor = raw_collection.find(
        {},
        {"_id": 0, "temperature": 1, "rpm": 1, "pwm": 1, "timestamp": 1}
    ).sort("timestamp", 1).limit(limit)

    data = list(cursor)
    # print("Fetched rows:", len(data))  # debug

    if len(data) < 20:
        return None

    return pd.DataFrame(data)
