class ReplayEngine:

    def __init__(self, dataframe):

        self.df = dataframe

        self.current_index = 0

        self.window_size = 60

        self.is_playing = False

    def play(self):

        self.is_playing = True

    def pause(self):

        self.is_playing = False

    def reset(self):

        self.current_index = 0

    def next_frame(self):

        # STOP ADVANCING IF PAUSED
        if not self.is_playing:

            start = max(0, self.current_index - self.window_size)

            return self.df.iloc[start:self.current_index + 1]

        # STOP AT END
        if self.current_index >= len(self.df) - 1:

            self.is_playing = False

            start = max(0, self.current_index - self.window_size)

            return self.df.iloc[start:self.current_index + 1]

        # ADVANCE
        self.current_index += 1

        start = max(0, self.current_index - self.window_size)

        return self.df.iloc[start:self.current_index + 1]