import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Download, Trash2, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Cluster, Sensor } from '../App';

type Tab = 'clusters' | 'sensors';

interface LeftPanelProps {
  clusters: Cluster[];
  sensors: Sensor[];
  onToggleCluster: (id: string) => void;
  onAddCluster: (name: string) => void;
  onAddSensor: (name: string, sensorId: string, unit: string, clusterId: string) => void;
  onRemoveSensor: (id: string) => void;
}

export function LeftPanel({
  clusters,
  sensors,
  onToggleCluster,
  onAddCluster,
  onAddSensor,
  onRemoveSensor,
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('clusters');
  const [showAddCluster, setShowAddCluster] = useState(false);
  const [showAddSensor, setShowAddSensor] = useState(false);
  const [appendToClusterId, setAppendToClusterId] = useState<string | null>(null);

  const appendTargetCluster = clusters.find(c => c.id === appendToClusterId) ?? null;

  return (
    <div
      className="w-[240px] bg-[#13161E] border-r border-[#1C2030] flex flex-col flex-shrink-0"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Tab switcher */}
      <div className="flex border-b border-[#1C2030] flex-shrink-0">
        {(['clusters', 'sensors'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold tracking-widest uppercase transition-colors ${
              activeTab === tab
                ? 'text-[#F0F2F8] border-b-2 border-white -mb-px'
                : 'text-[#3A3F50] hover:text-[#6B7A99]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── CLUSTERS TAB ── */}
      {activeTab === 'clusters' && (
        <>
          {/* Add cluster button */}
          <div className="p-3 border-b border-[#1C2030] flex-shrink-0">
            <button
              onClick={() => setShowAddCluster(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#0D0F14] hover:bg-[#161922] border border-[#1C2030] hover:border-[#252938] rounded text-xs font-medium text-[#6B7A99] hover:text-[#F0F2F8] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Cluster
            </button>
          </div>

          {/* Cluster list */}
          <div className="flex-1 overflow-y-auto">
            {clusters.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#3A3F50]">
                No clusters yet
              </div>
            ) : (
              clusters.map(cluster => {
                const clusterSensors = sensors.filter(s => s.clusterId === cluster.id);
                return (
                  <div key={cluster.id} className="border-b border-[#1C2030]">
                    {/* Cluster row */}
                    <div
                      className="flex items-center gap-2 px-3 py-2.5 hover:bg-[#0D0F14] cursor-pointer transition-colors group"
                      onClick={() => onToggleCluster(cluster.id)}
                    >
                      {cluster.expanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-[#3A3F50] flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-[#3A3F50] flex-shrink-0" />
                      )}
                      <span className="flex-1 text-sm min-w-0 truncate">{cluster.name}</span>
                      <span className="text-[10px] text-[#3A3F50] mr-1">
                        {clusterSensors.length}
                      </span>
                      {/* Append sensor to cluster */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setAppendToClusterId(cluster.id);
                        }}
                        className="p-1 hover:bg-[#1C2030] rounded transition-colors opacity-0 group-hover:opacity-100 text-[#6B7A99] hover:text-[#F0F2F8]"
                        title="Add sensor to cluster"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      {/* Download */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          alert(`Export ${cluster.name} data to XLSX`);
                        }}
                        className="p-1 hover:bg-[#1C2030] rounded transition-colors opacity-0 group-hover:opacity-100 text-[#6B7A99] hover:text-[#F0F2F8]"
                        title="Export cluster"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Sensors in cluster */}
                    {cluster.expanded && (
                      <div className="bg-[#0D0F14]">
                        {clusterSensors.length === 0 ? (
                          <div className="px-4 py-4 text-center">
                            <div className="text-[10px] text-[#3A3F50] mb-2">
                              No sensors assigned
                            </div>
                          </div>
                        ) : (
                          clusterSensors.map(sensor => (
                            <ClusterSensorRow
                              key={sensor.id}
                              sensor={sensor}
                              onRemove={() => onRemoveSensor(sensor.id)}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ── SENSORS TAB ── */}
      {activeTab === 'sensors' && (
        <>
          {/* Add sensor button */}
          <div className="p-3 border-b border-[#1C2030] flex-shrink-0">
            <button
              onClick={() => setShowAddSensor(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#0D0F14] hover:bg-[#161922] border border-[#1C2030] hover:border-[#252938] rounded text-xs font-medium text-[#6B7A99] hover:text-[#F0F2F8] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Sensor
            </button>
          </div>

          {/* Sensors list */}
          <div className="flex-1 overflow-y-auto">
            {sensors.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#3A3F50]">
                No sensors yet
              </div>
            ) : (
              sensors.map(sensor => {
                const cluster = clusters.find(c => c.id === sensor.clusterId);
                return (
                  <SensorListRow
                    key={sensor.id}
                    sensor={sensor}
                    clusterName={cluster?.name}
                    onRemove={() => onRemoveSensor(sensor.id)}
                  />
                );
              })
            )}
          </div>
        </>
      )}

      {/* ── Modals ── */}

      {/* Add Cluster Modal */}
      <AddClusterModal
        open={showAddCluster}
        onClose={() => setShowAddCluster(false)}
        onAddCluster={name => {
          onAddCluster(name);
          setShowAddCluster(false);
        }}
      />

      {/* Add Sensor Modal (from Sensors tab) */}
      <AddSensorModal
        open={showAddSensor}
        onClose={() => setShowAddSensor(false)}
        clusters={clusters}
        onAddSensor={(name, sensorId, unit, clusterId) => {
          onAddSensor(name, sensorId, unit, clusterId);
          setShowAddSensor(false);
        }}
      />

      {/* Append Sensor Modal (from cluster + button) */}
      {appendTargetCluster && (
        <AppendSensorModal
          open={appendToClusterId !== null}
          onClose={() => setAppendToClusterId(null)}
          cluster={appendTargetCluster}
          onAddSensor={(name, sensorId, unit) => {
            onAddSensor(name, sensorId, unit, appendTargetCluster.id);
            setAppendToClusterId(null);
          }}
        />
      )}
    </div>
  );
}

/* ─── Sensor row in cluster expand ─── */
function ClusterSensorRow({
  sensor,
  onRemove,
}: {
  sensor: Sensor;
  onRemove: () => void;
}) {
  const statusColor =
    sensor.status === 'error'
      ? '#FF3B3B'
      : sensor.status === 'warning'
      ? '#FFB700'
      : '#3A3F50';

  return (
    <div className="flex items-center gap-2 px-4 py-2 hover:bg-[#13161E] transition-colors group cursor-default">
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: statusColor }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate">{sensor.name}</div>
        <div
          className="text-[10px] text-[#3A3F50] tabular-nums"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {sensor.currentValue.toFixed(1)} {sensor.unit}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded hover:bg-[#FF3B3B]/20 hover:text-[#FF3B3B] text-[#3A3F50] opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ─── Sensor row in sensors tab ─── */
function SensorListRow({
  sensor,
  clusterName,
  onRemove,
}: {
  sensor: Sensor;
  clusterName?: string;
  onRemove: () => void;
}) {
  const statusColor =
    sensor.status === 'error'
      ? '#FF3B3B'
      : sensor.status === 'warning'
      ? '#FFB700'
      : '#3A3F50';

  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#1C2030] hover:bg-[#0D0F14] transition-colors group cursor-default">
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5"
        style={{ backgroundColor: statusColor }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs font-medium truncate">{sensor.name}</span>
          <span
            className="text-[9px] text-[#3A3F50] font-mono flex-shrink-0"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {sensor.sensorId}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] text-[#6B7A99] tabular-nums"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {sensor.currentValue.toFixed(1)} {sensor.unit}
          </span>
          {clusterName && (
            <span className="text-[9px] text-[#3A3F50] bg-[#1C2030] px-1.5 py-0.5 rounded truncate max-w-[70px]">
              {clusterName}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded hover:bg-[#FF3B3B]/20 hover:text-[#FF3B3B] text-[#3A3F50] opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ─── Modal base styles ─── */
const inputCls =
  'w-full bg-[#0D0F14] border border-[#1C2030] focus:border-[#3A3F50] focus:outline-none rounded px-3 py-2 text-sm text-[#F0F2F8] placeholder-[#3A3F50] transition-colors';
const labelCls = 'block text-xs text-[#6B7A99] mb-1.5 tracking-wide';
const cancelCls =
  'flex-1 bg-[#0D0F14] hover:bg-[#161922] border border-[#1C2030] text-[#6B7A99] hover:text-[#F0F2F8] py-2 px-4 rounded text-sm transition-colors';
const confirmCls =
  'flex-1 bg-white hover:bg-[#E0E0E0] text-[#0D0F14] font-semibold py-2 px-4 rounded text-sm transition-colors';

/* ─── Add Cluster Modal ─── */
function AddClusterModal({
  open,
  onClose,
  onAddCluster,
}: {
  open: boolean;
  onClose: () => void;
  onAddCluster: (name: string) => void;
}) {
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    onAddCluster(name.trim());
    setName('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#13161E] border border-[#1C2030] rounded-lg p-6 w-[380px] shadow-2xl z-50"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-sm font-semibold tracking-wide">
              CREATE CLUSTER
            </Dialog.Title>
            <button onClick={onClose} className="text-[#3A3F50] hover:text-[#F0F2F8] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelCls}>Cluster Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Braking System"
                className={inputCls}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>

            <div className="bg-[#0D0F14] border border-[#1C2030] rounded p-3">
              <div className="text-xs text-[#3A3F50] mb-1">Preview</div>
              <div className="text-sm text-[#6B7A99]">
                {name || <span className="italic text-[#3A3F50]">Unnamed Cluster</span>}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button onClick={onClose} className={cancelCls}>Cancel</button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className={`${confirmCls} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Create Cluster
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ─── Add Sensor Modal (from Sensors tab) ─── */
function AddSensorModal({
  open,
  onClose,
  clusters,
  onAddSensor,
}: {
  open: boolean;
  onClose: () => void;
  clusters: Cluster[];
  onAddSensor: (name: string, sensorId: string, unit: string, clusterId: string) => void;
}) {
  const [name, setName] = useState('');
  const [sensorId, setSensorId] = useState(
    `SN-${Math.floor(Math.random() * 9000 + 1000)}`
  );
  const [unit, setUnit] = useState('');
  const [clusterId, setClusterId] = useState(clusters[0]?.id ?? '');

  const handleSave = () => {
    if (!name.trim() || !sensorId.trim() || !unit.trim() || !clusterId) return;
    onAddSensor(name.trim(), sensorId.trim(), unit.trim(), clusterId);
    setName('');
    setSensorId(`SN-${Math.floor(Math.random() * 9000 + 1000)}`);
    setUnit('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#13161E] border border-[#1C2030] rounded-lg p-6 w-[400px] shadow-2xl z-50"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-sm font-semibold tracking-wide">
              ADD SENSOR
            </Dialog.Title>
            <button onClick={onClose} className="text-[#3A3F50] hover:text-[#F0F2F8] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelCls}>Sensor Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. BPT-01"
                className={inputCls}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Sensor ID</label>
                <input
                  type="text"
                  value={sensorId}
                  onChange={e => setSensorId(e.target.value)}
                  className={`${inputCls}`}
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                />
              </div>
              <div>
                <label className={labelCls}>Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  placeholder="e.g. bar, °C, rpm"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Assign to Cluster</label>
              {clusters.length === 0 ? (
                <div className="text-xs text-[#FFB700] bg-[#FFB700]/10 border border-[#FFB700]/20 rounded px-3 py-2">
                  No clusters available — create a cluster first
                </div>
              ) : (
                <select
                  value={clusterId}
                  onChange={e => setClusterId(e.target.value)}
                  className={`${inputCls} cursor-pointer`}
                >
                  {clusters.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#13161E' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button onClick={onClose} className={cancelCls}>Cancel</button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !sensorId.trim() || !unit.trim() || !clusterId}
              className={`${confirmCls} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Add Sensor
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ─── Append Sensor Modal (from cluster + button) ─── */
function AppendSensorModal({
  open,
  onClose,
  cluster,
  onAddSensor,
}: {
  open: boolean;
  onClose: () => void;
  cluster: Cluster;
  onAddSensor: (name: string, sensorId: string, unit: string) => void;
}) {
  const [name, setName] = useState('');
  const [sensorId, setSensorId] = useState(
    `SN-${Math.floor(Math.random() * 9000 + 1000)}`
  );
  const [unit, setUnit] = useState('');

  const handleSave = () => {
    if (!name.trim() || !sensorId.trim() || !unit.trim()) return;
    onAddSensor(name.trim(), sensorId.trim(), unit.trim());
    setName('');
    setSensorId(`SN-${Math.floor(Math.random() * 9000 + 1000)}`);
    setUnit('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#13161E] border border-[#1C2030] rounded-lg p-6 w-[400px] shadow-2xl z-50"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <div className="flex items-center justify-between mb-1">
            <Dialog.Title className="text-sm font-semibold tracking-wide">
              APPEND SENSOR
            </Dialog.Title>
            <button onClick={onClose} className="text-[#3A3F50] hover:text-[#F0F2F8] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Target cluster badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs text-[#3A3F50]">→</span>
            <span className="text-xs bg-[#1C2030] text-[#6B7A99] px-2 py-1 rounded">
              {cluster.name}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelCls}>Sensor Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. BPT-03"
                className={inputCls}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Sensor ID</label>
                <input
                  type="text"
                  value={sensorId}
                  onChange={e => setSensorId(e.target.value)}
                  className={inputCls}
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                />
              </div>
              <div>
                <label className={labelCls}>Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  placeholder="e.g. bar, °C, rpm"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Cluster locked indicator */}
            <div>
              <label className={labelCls}>Cluster</label>
              <div className="flex items-center gap-2 bg-[#0D0F14] border border-[#1C2030] rounded px-3 py-2">
                <span className="text-sm text-[#6B7A99] flex-1">{cluster.name}</span>
                <span className="text-[10px] text-[#3A3F50] bg-[#1C2030] px-1.5 py-0.5 rounded">locked</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button onClick={onClose} className={cancelCls}>Cancel</button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !sensorId.trim() || !unit.trim()}
              className={`${confirmCls} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Add to Cluster
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
