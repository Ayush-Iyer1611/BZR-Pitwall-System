from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from loader import TelemetryLoader
from replay import ReplayEngine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

loader = TelemetryLoader()

df = loader.load_csv("sample.csv")

replay = ReplayEngine(df)

sensor_history = {}

VEHICLE_COLUMNS = {
    "time",
    "rpm",
    "gear",
    "batteryVoltage",
    "speed",
    "engineTemp",
}


def get_cluster(sensor_name):

    name = sensor_name.lower()

    dynamics = [
        "imu",
        "steer",
        "wheel",
        "yaw",
        "roll",
        "pitch",
        "suspension"
    ]

    powertrain = [
        "afr",
        "egt",
        "rpm",
        "motor",
        "torque",
        "throttle"
    ]

    electrical = [
        "battery",
        "voltage",
        "current",
        "imd",
        "bms",
        "cell"
    ]

    if any(x in name for x in dynamics):
        return "c1"

    if any(x in name for x in powertrain):
        return "c2"

    if any(x in name for x in electrical):
        return "c3"

    return "c1"


@app.post("/play")
def play():
    replay.play()
    return {"status": "playing"}


@app.post("/pause")
def pause():
    replay.pause()
    return {"status": "paused"}


@app.post("/reset")
def reset():
    replay.reset()
    return {"status": "reset"}

@app.get("/export")
def export():

    return {
        "rows": len(df),
        "columns": list(df.columns)
    }

@app.get("/telemetry")
def get_telemetry():

    window = replay.next_frame()

    latest = window.iloc[-1]

    sensors = []

    sensor_columns = [
        col
        for col in df.columns
        if col not in VEHICLE_COLUMNS
    ]

    for index, column in enumerate(sensor_columns):

        sensor_id = f"s{index + 1}"

        if sensor_id not in sensor_history:
            sensor_history[sensor_id] = []

        sensor_history[sensor_id].append(
            {
                "timestamp": float(latest["time"]),
                "value": float(latest[column]),
            }
        )

        sensor_history[sensor_id] = sensor_history[sensor_id][-200:]

        sensors.append(
            {
                "id": sensor_id,
                "name": column,
                "sensorId": column,
                "unit": "",
                "clusterId": get_cluster(column),
                "status": "active",
                "currentValue": float(latest[column]),
                "history": sensor_history[sensor_id],
            }
        )

    return {
        "vehicleStats": {
            "rpm": int(latest["rpm"]),
            "gear": int(latest["gear"]),
            "batteryVoltage": float(latest["batteryVoltage"]),
            "speed": float(latest["speed"]),
            "engineTemp": float(latest["engineTemp"]),
        },
        "sensors": sensors,
    }