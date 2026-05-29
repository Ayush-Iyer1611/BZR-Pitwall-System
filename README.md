# BZR Pitwall System

## Overview

BZR Pitwall System is a Formula Student telemetry replay and analysis platform developed for BZR Racing.

The platform enables engineers to:

* Replay telemetry sessions from SD card logs
* Visualize sensor data in real time
* Monitor vehicle statistics
* Analyze historical sensor trends
* Automatically detect and display telemetry channels from CSV files

The current implementation uses a 5000-point mock telemetry dataset for development and testing.

---

# Features

## Telemetry Replay

* Play telemetry recordings
* Pause telemetry playback
* Reset telemetry sessions
* Historical graph visualization
* Dynamic replay engine

## Dynamic Sensor Discovery

Sensors are automatically discovered from CSV columns.

Example:

```csv
time,imu_x,imu_y,afr,egt,rpm,speed,batteryVoltage,engineTemp,gear
```

The dashboard automatically creates telemetry channels for:

* imu_x
* imu_y
* afr
* egt

No frontend modifications are required when new sensors are added.

---

## Vehicle Statistics

The right panel displays:

* RPM
* Speed
* Gear
* Battery Voltage
* Engine Temperature

These values are extracted directly from the telemetry file.

---

## Automatic Sensor Clustering

Sensors are grouped automatically into:

### Vehicle Dynamics

Examples:

* IMU
* Steering
* Suspension
* Wheel Speed

### Powertrain

Examples:

* AFR
* EGT
* RPM
* Throttle

### Electrical

Examples:

* Battery Voltage
* Current
* IMD
* BMS

---

# System Architecture

STM32 Sensors
↓
Data Acquisition
↓
CSV Logger
↓
SD Card
↓
FastAPI Backend
↓
Replay Engine
↓
Dynamic Sensor Discovery
↓
React Dashboard
↓
Graphs / Vehicle Stats / Analysis

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Recharts

## Backend

* FastAPI
* Pandas

---

# Project Structure

```text
backend/
├── app.py
├── replay.py
├── loader.py
├── generate_dataset.py
├── sample.csv

src/
├── App.tsx
├── components/

package.json
README.md
```

---

# Mock Dataset

The current development build uses a generated telemetry dataset containing:

* 5000 telemetry samples
* IMU-X
* IMU-Y
* AFR
* EGT
* RPM
* Speed
* Battery Voltage
* Engine Temperature
* Gear Position

This dataset is used for frontend and backend validation before integration with actual vehicle telemetry.

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Ayush-Iyer1611/BZR-Pitwall-System.git

cd BZR-Pitwall-System
```

---

# Frontend Setup

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Backend Setup

Create virtual environment:

```bash
python3 -m venv .venv
```

Activate:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install fastapi uvicorn pandas
```

Navigate to backend:

```bash
cd backend
```

Run backend:

```bash
uvicorn app:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API Docs:

```text
http://127.0.0.1:8000/docs
```

---

# API Endpoints

## Get Telemetry

```http
GET /telemetry
```

Returns:

```json
{
  "vehicleStats": {},
  "sensors": []
}
```

---

## Replay Controls

```http
POST /play
POST /pause
POST /reset
```

---

# Future Roadmap

## Fault Detection Engine

Examples:

* High EGT
* Lean AFR
* Low Battery Voltage
* Sensor Failure Detection

## Telemetry Analytics

* Min / Max Values
* Sensor Gradients
* Trend Analysis
* Session Statistics

## Replay Enhancements

* Variable Replay Speed
* Timeline Navigation
* Session Export

## Vehicle Integration

* CAN Bus Integration
* Live Telemetry
* Multi-Session Storage

---

# Authors

Ayush Iyer

BZR Racing

Formula Student Telemetry & Data Systems
