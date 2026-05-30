import pandas as pd

REQUIRED_COLUMNS = [
    "time",
    "rpm",
    "speed",
    "batteryVoltage",
    "engineTemp",
    "gear",
]


class TelemetryLoader:

    def __init__(self):
        self.df = None

    def load_csv(self, path):

        self.df = pd.read_csv(path)

        if "time" not in self.df.columns:
            self.df["time"] = self.df.index * 0.01

        missing = [
            col
            for col in REQUIRED_COLUMNS
            if col not in self.df.columns
        ]

        if missing:
            raise Exception(
                f"Missing required columns: {missing}"
            )

        return self.df