# Telemetry Format

## Current Format

Example:

time,imu_x,imu_y,afr,egt,rpm,speed,batteryVoltage,engineTemp,gear

0.00,72,68,13.2,760,6200,110,12.4,91,3

---

## Required Columns

Vehicle statistics:

- rpm
- speed
- batteryVoltage
- engineTemp
- gear

---

## Dynamic Sensor Columns

All additional columns become telemetry sensors.

Examples:

- imu_x
- imu_y
- afr
- egt
- bpt01
- bpt02
- imd_fault
- steering_angle

No backend changes are required when adding new sensor columns.
