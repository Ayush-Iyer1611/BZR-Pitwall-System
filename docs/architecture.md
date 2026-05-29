# System Architecture

## Overview

BZR Pitwall System is a telemetry replay and visualization platform designed for Formula Student applications.

The system currently operates in SD-card replay mode.

Telemetry data is loaded from CSV files and replayed through a FastAPI backend.

The React frontend consumes telemetry data and displays:

- Sensor graphs
- Vehicle statistics
- Historical telemetry
- Sensor clusters

---

## Architecture Diagram

STM32 Sensors
↓
Data Acquisition
↓
CSV Logger
↓
SD Card
↓
CSV File
↓
FastAPI Backend
↓
Replay Engine
↓
REST API
↓
React Frontend
↓
Telemetry Dashboard

---

## Data Flow

1. Sensors generate data.
2. Data is logged to SD card.
3. CSV file is loaded into backend.
4. Replay engine steps through telemetry.
5. Frontend polls backend.
6. Dashboard updates graphs and statistics.

---

## Current Mode

SD Card Replay Only

Live telemetry is planned for future development.
