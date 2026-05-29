import { useState, useEffect } from 'react';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';

export interface Sensor {
  id: string;
  name: string;
  sensorId: string;
  unit: string;
  clusterId: string;
  status: 'active' | 'warning' | 'error';
  currentValue: number;
  minValue: number;
  maxValue: number;
  history: Array<{ timestamp: number; value: number }>;
}

export interface Cluster {
  id: string;
  name: string;
  expanded: boolean;
}

export default function App() {

  const [clusters, setClusters] = useState<Cluster[]>([
    { id: 'c1', name: 'Vehicle Dynamics', expanded: true },
    { id: 'c2', name: 'Powertrain', expanded: true },
    { id: 'c3', name: 'Electrical', expanded: true },
  ]);

  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [pinnedSensors, setPinnedSensors] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(false);

  const [vehicleStats, setVehicleStats] = useState({
    rpm: 0,
    gear: 0,
    batteryVoltage: 0,
    speed: 0,
    engineTemp: 0,
  });

  const [dataSource, setDataSource] =
    useState<'usb' | 'sd'>('sd');

  useEffect(() => {

    if (!isLive) return;

    const interval = setInterval(async () => {

      try {

        const response = await fetch(
          'http://127.0.0.1:8000/telemetry'
        );

        const data = await response.json();

        console.log(data);

        const backendSensors = data.sensors || [];

        const mapped = backendSensors.map((sensor: any) => ({

          id: sensor.id,

          name: sensor.name,

          sensorId: sensor.sensorId || sensor.id,

          unit: sensor.unit,

          clusterId: sensor.clusterId,

          status: sensor.status || 'active',

          currentValue: Number(sensor.currentValue),

          minValue: 0,

          maxValue: 1000,

          history:
            sensor.history?.map((h: any) => ({
              timestamp: Number(h.timestamp),
              value: Number(h.value),
            })) || [],

        }));

        setSensors(mapped);

        setPinnedSensors(
          mapped.map((s: Sensor) => s.id)
        );

        setVehicleStats({

          rpm: Number(data.vehicleStats?.rpm || 0),

          gear: Number(data.vehicleStats?.gear || 0),

          batteryVoltage: Number(
            data.vehicleStats?.batteryVoltage || 0
          ),

          speed: Number(
            data.vehicleStats?.speed || 0
          ),

          engineTemp: Number(
            data.vehicleStats?.engineTemp || 0
          ),

        });

      } catch (err) {

        console.error(err);

      }

    }, 100);

    return () => clearInterval(interval);

  }, [isLive]);

  const addCluster = (name: string) => {

    setClusters(prev => [
      ...prev,
      {
        id: `c${Date.now()}`,
        name,
        expanded: true,
      },
    ]);

  };

  const toggleCluster = (id: string) => {

    setClusters(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, expanded: !c.expanded }
          : c
      )
    );

  };

 const addSensor = () => {
  console.log('Sensors come from CSV');
};

const removeSensor = () => {
  console.log('Sensors come from CSV');
};

  return (
    <div
      className="size-full bg-[#0D0F14] text-[#F0F2F8] flex overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >

      <LeftPanel
        clusters={clusters}
        sensors={sensors}
        onToggleCluster={toggleCluster}
        onAddCluster={addCluster}
        onAddSensor={addSensor}
        onRemoveSensor={removeSensor}
      />

      <CenterPanel
        sensors={sensors}
        pinnedSensors={pinnedSensors}
        isLive={isLive}
        dataSource={dataSource}
        onDataSourceChange={setDataSource}
        onToggleLive={async () => {

  const nextState = !isLive;

  setIsLive(nextState);

  if (nextState) {

    await fetch(
      'http://127.0.0.1:8000/play',
      { method: 'POST' }
    );

  } else {

    await fetch(
      'http://127.0.0.1:8000/pause',
      { method: 'POST' }
    );

  }

}}
      />

      <RightPanel
        stats={vehicleStats}
        isLive={isLive}
      />

    </div>
  );
}