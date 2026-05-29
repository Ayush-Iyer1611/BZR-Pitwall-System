# Backend Documentation

## Technology

- Python
- FastAPI
- Pandas

---

## Core Components

### app.py

Main API server.

Responsibilities:

- Load telemetry data
- Expose REST endpoints
- Manage replay state
- Serve telemetry frames

---

### replay.py

Replay engine.

Responsibilities:

- Play
- Pause
- Reset
- Window management

---

### loader.py

CSV loader.

Responsibilities:

- Read telemetry files
- Convert CSV into DataFrame

---

## API Endpoints

### GET /telemetry

Returns:

- Vehicle statistics
- Sensor values
- Historical telemetry

---

### POST /play

Starts replay.

---

### POST /pause

Pauses replay.

---

### POST /reset

Resets replay to start.
