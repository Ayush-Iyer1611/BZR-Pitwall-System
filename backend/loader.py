import pandas as pd

class TelemetryLoader:

    def __init__(self):
        self.df = None

    def load_csv(self, path):

        self.df = pd.read_csv(path)

        # Create time column if missing
        if "time" not in self.df.columns:
            self.df["time"] = self.df.index * 0.01

        return self.df