import pandas as pd
import numpy as np

rows = 5000

df = pd.DataFrame({
    "time": np.arange(rows) * 0.01,
    "imu_x": 72 + np.sin(np.arange(rows)/20)*10,
    "imu_y": 68 + np.cos(np.arange(rows)/25)*10,
    "afr": 13 + np.sin(np.arange(rows)/30)*0.5,
    "egt": 760 + np.sin(np.arange(rows)/40)*50,
    "rpm": 6000 + np.sin(np.arange(rows)/10)*1000,
    "speed": 100 + np.sin(np.arange(rows)/15)*40,
    "batteryVoltage": 12.5 + np.sin(np.arange(rows)/100)*0.3,
    "engineTemp": 90 + np.sin(np.arange(rows)/50)*10,
    "gear": np.random.randint(3, 6, rows)
})

df.to_csv("sample.csv", index=False)

print("Generated", rows, "rows")