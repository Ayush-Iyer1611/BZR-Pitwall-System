import { useState, useEffect, useRef } from 'react';
import { Download, Maximize2, X, Plus, Check } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { Sensor } from '../App';

const TRACE_COLORS = ['#FFFFFF', '#909090', '#585858', '#383838'];

interface CenterPanelProps {
  sensors: Sensor[];
  pinnedSensors: string[];
  isLive: boolean;
  dataSource: 'usb' | 'sd';
  onDataSourceChange: (source: 'usb' | 'sd') => void;
  onToggleLive: () => void;
}

export function CenterPanel({
  sensors,
  pinnedSensors,
  isLive,
  dataSource,
  onDataSourceChange,
  onToggleLive,
}: CenterPanelProps) {
  const [maximizedSensorId, setMaximizedSensorId] = useState<string | null>(null);
  const [extraTraceIds, setExtraTraceIds] = useState<string[]>([]);
  const [showTraceSelector, setShowTraceSelector] = useState(false);
  const traceSelectorRef = useRef<HTMLDivElement>(null);

const pinnedSensorData = sensors.filter(s => pinnedSensors.includes(s.id)).slice(0, 4);
  const maximizedSensor = sensors.find(s => s.id === maximizedSensorId) ?? null;

  // Close trace selector on outside click
  useEffect(() => {
    if (!showTraceSelector) return;
    const handler = (e: MouseEvent) => {
      if (traceSelectorRef.current && !traceSelectorRef.current.contains(e.target as Node)) {
        setShowTraceSelector(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showTraceSelector]);

  const toggleTrace = (sensorId: string) => {
    setExtraTraceIds(prev =>
      prev.includes(sensorId)
        ? prev.filter(id => id !== sensorId)
        : [...prev, sensorId].slice(0, 3)
    );
  };

  const closeMaximized = () => {
    setMaximizedSensorId(null);
    setExtraTraceIds([]);
    setShowTraceSelector(false);
  };

  const buildMaximizedData = () => {
    if (!maximizedSensor) return [];
    const allTraceSensors = [
      maximizedSensor,
      ...sensors.filter(s => extraTraceIds.includes(s.id)),
    ];
    const len = Math.max(maximizedSensor.history.length, 30);
    return Array.from({ length: len }, (_, i) => {
      const point: Record<string, number> = { idx: i };
      allTraceSensors.forEach(s => {
        point[s.id] = s.history[i]?.value ?? s.currentValue + (Math.random() - 0.5) * 3;
      });
      return point;
    });
  };

  const extraTraceSensors = sensors.filter(s => extraTraceIds.includes(s.id));

  return (
    <div className="flex-1 bg-[#0D0F14] flex flex-col min-w-0">
      {/* Header */}
      <div className="bg-[#13161E] border-b border-[#1C2030] px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3B3B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3B3B]" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Source toggle */}
            <div className="flex bg-[#0D0F14] border border-[#1C2030] rounded p-0.5">
              {(['usb', 'sd'] as const).map(src => (
                <button
                  key={src}
                  onClick={() => onDataSourceChange(src)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    dataSource === src
                      ? 'bg-white text-[#0D0F14]'
                      : 'text-[#6B7A99] hover:text-[#F0F2F8]'
                  }`}
                >
                  {src === 'usb' ? 'USB' : 'SD Card'}
                </button>
              ))}
            </div>

            <button
              onClick={onToggleLive}
              className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                isLive
                  ? 'border-[#FF3B3B] text-[#FF3B3B] hover:bg-[#FF3B3B]/10'
                  : 'border-[#1C2030] text-[#6B7A99] hover:text-[#F0F2F8]'
              }`}
            >
              {isLive ? 'PAUSE' : 'RESUME'}
            </button>

            <button
              onClick={() => alert('Export all clusters to XLSX')}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#1C2030] hover:bg-[#252938] rounded text-xs font-medium transition-colors text-[#6B7A99] hover:text-[#F0F2F8]"
            >
              <Download className="w-3 h-3" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Graphs grid */}
      <div className="flex-1 overflow-auto p-5">
        {pinnedSensorData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-[#3A3F50] text-sm mb-1">No sensors active</div>
              <div className="text-[#3A3F50] text-xs">
  Waiting for telemetry from backend
</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {pinnedSensorData.map(sensor => (
              <SensorGraph
                key={sensor.id}
                sensor={sensor}
                onMaximize={() => {
                  setMaximizedSensorId(sensor.id);
                  setExtraTraceIds([]);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Fullscreen maximized graph ── */}
      {maximizedSensor && (
        <div className="fixed inset-0 z-50 bg-[#0D0F14] flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-[#1C2030] flex-shrink-0">
            <div className="flex items-center gap-5">
              <div>
                <div className="text-xs text-[#6B7A99] tracking-widest mb-0.5">{maximizedSensor.sensorId}</div>
                <div className="text-lg font-semibold">{maximizedSensor.name}</div>
              </div>
              <div
                className="text-3xl tabular-nums"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {maximizedSensor.currentValue.toFixed(1)}
                <span className="text-base text-[#6B7A99] ml-2">{maximizedSensor.unit}</span>
              </div>
              {/* Status */}
              <div className={`text-xs px-2 py-0.5 rounded-full border ${
                maximizedSensor.status === 'error'
                  ? 'border-[#FF3B3B] text-[#FF3B3B]'
                  : maximizedSensor.status === 'warning'
                  ? 'border-[#FFB700] text-[#FFB700]'
                  : 'border-[#2A2A2A] text-[#6B7A99]'
              }`}>
                {maximizedSensor.status.toUpperCase()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Add trace */}
              <div className="relative" ref={traceSelectorRef}>
                <button
                  onClick={() => setShowTraceSelector(v => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1C2030] hover:bg-[#252938] border border-[#252938] rounded text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Trace
                  {extraTraceIds.length > 0 && (
                    <span className="bg-white text-[#0D0F14] rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] font-bold">
                      {extraTraceIds.length}
                    </span>
                  )}
                </button>

                {showTraceSelector && (
                  <div className="absolute right-0 top-full mt-1.5 bg-[#13161E] border border-[#252938] rounded-lg overflow-hidden shadow-2xl z-10 min-w-[220px]">
                    <div className="px-3 py-2 border-b border-[#1C2030]">
                      <span className="text-xs text-[#6B7A99] tracking-wider">SELECT TRACES</span>
                    </div>
                    {sensors
                      .filter(s => s.id !== maximizedSensorId)
                      .map((s, idx) => (
                        <button
                          key={s.id}
                          onClick={() => toggleTrace(s.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#1C2030] transition-colors text-left"
                        >
                          <div
                            className="w-4 h-px flex-shrink-0"
                            style={{ backgroundColor: TRACE_COLORS[idx + 1] ?? '#444' }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm">{s.name}</div>
                            <div className="text-xs text-[#6B7A99]">
                              {s.currentValue.toFixed(1)} {s.unit}
                            </div>
                          </div>
                          {extraTraceIds.includes(s.id) && (
                            <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    {sensors.filter(s => s.id !== maximizedSensorId).length === 0 && (
                      <div className="px-3 py-4 text-xs text-[#6B7A99] text-center">
                        No other sensors available
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={closeMaximized}
                className="p-2 hover:bg-[#1C2030] rounded transition-colors text-[#6B7A99] hover:text-[#F0F2F8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active trace legend */}
          {extraTraceSensors.length > 0 && (
            <div className="flex items-center gap-5 px-8 py-2 bg-[#0D0F14] border-b border-[#1C2030] flex-shrink-0">
              {/* Primary */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-px bg-white" />
                <span className="text-xs text-[#F0F2F8]">
                  {maximizedSensor.name}
                </span>
              </div>
              {extraTraceSensors.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 group">
                  <div
                    className="w-6 h-px"
                    style={{ backgroundColor: TRACE_COLORS[i + 1] ?? '#444' }}
                  />
                  <span className="text-xs text-[#6B7A99]">{s.name}</span>
                  <button
                    onClick={() => toggleTrace(s.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#6B7A99] hover:text-[#FF3B3B]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          <div className="flex-1 p-8 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={buildMaximizedData()} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1D27" vertical={false} />
                <XAxis
                  dataKey="idx"
                  tick={false}
                  axisLine={{ stroke: '#1C2030' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B7A99', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                  axisLine={{ stroke: '#1C2030' }}
                  tickLine={false}
                  width={52}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#13161E',
                    border: '1px solid #252938',
                    borderRadius: '6px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                  }}
                  labelStyle={{ color: '#6B7A99' }}
                  itemStyle={{ color: '#F0F2F8' }}
                />
                <Line
                  type="monotone"
                  dataKey={maximizedSensor.id}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  name={maximizedSensor.name}
                />
                {extraTraceSensors.map((s, i) => (
                  <Line
                    key={s.id}
                    type="monotone"
                    dataKey={s.id}
                    stroke={TRACE_COLORS[i + 1] ?? '#555'}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                    name={s.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function SensorGraph({
  sensor,
  onMaximize,
}: {
  sensor: Sensor;
  onMaximize: () => void;
}) {
  const data =
    sensor.history.length > 0
      ? sensor.history.map((d, i) => ({ idx: i, value: d.value }))
      : Array.from({ length: 30 }, (_, i) => ({
          idx: i,
          value: sensor.currentValue + (Math.random() - 0.5) * 8,
        }));

  const statusColor =
    sensor.status === 'error'
      ? '#FF3B3B'
      : sensor.status === 'warning'
      ? '#FFB700'
      : '#3A3F50';

  return (
    <div className="bg-[#13161E] rounded-lg p-4 group hover:bg-[#161922] transition-colors">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2.5">
          <div
            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
            style={{ backgroundColor: statusColor }}
          />
          <div>
            <div className="text-sm font-medium leading-none mb-1">{sensor.name}</div>
            <div className="text-xs text-[#6B7A99]">{sensor.sensorId}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="text-right">
            <div
              className="text-2xl tabular-nums leading-none"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {sensor.currentValue.toFixed(1)}
            </div>
            <div className="text-xs text-[#6B7A99] mt-1">{sensor.unit}</div>
          </div>
          <button
            onClick={onMaximize}
            className="p-1.5 hover:bg-[#1C2030] rounded transition-colors opacity-0 group-hover:opacity-100 mt-0.5"
            title="Expand graph"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#6B7A99]" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A1D27" vertical={false} />
          <XAxis dataKey="idx" tick={false} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: '#3A3F50', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#13161E',
              border: '1px solid #1C2030',
              borderRadius: '4px',
              fontSize: 10,
              fontFamily: 'JetBrains Mono, monospace',
            }}
            labelStyle={{ color: '#6B7A99' }}
            itemStyle={{ color: '#F0F2F8' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FFFFFF"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}