interface RightPanelProps {
  stats: {
    rpm: number;
    gear: number;
    batteryVoltage: number;
    speed: number;
    engineTemp: number;
  };
  isLive: boolean;
}

interface FaultEntry {
  id: string;
  code: string;
  message: string;
  level: 'error' | 'warning';
  timestamp: string;
}

const MOCK_FAULTS: FaultEntry[] = [
  {
    id: 'e1',
    code: 'ERR-042',
    message: 'AFR-01 value out of bounds',
    level: 'warning',
    timestamp: '00:12:34',
  },
  {
    id: 'e2',
    code: 'ERR-091',
    message: 'BPT-02 signal noise high',
    level: 'error',
    timestamp: '00:11:09',
  },
  {
    id: 'e3',
    code: 'ERR-003',
    message: 'EGT-01 near threshold',
    level: 'warning',
    timestamp: '00:08:51',
  },
  {
    id: 'e4',
    code: 'SYS-001',
    message: 'USB intermittent conn.',
    level: 'error',
    timestamp: '00:02:17',
  },
];

export function RightPanel({ stats, isLive }: RightPanelProps) {
  const errorCount = MOCK_FAULTS.filter(f => f.level === 'error').length;
  const warnCount = MOCK_FAULTS.filter(f => f.level === 'warning').length;

  const statCells = [
    { label: 'RPM', value: Math.round(stats.rpm).toLocaleString(), sub: '' },
    { label: 'SPEED', value: Math.round(stats.speed).toString(), sub: 'km/h' },
    { label: 'GEAR', value: stats.gear.toString(), sub: '' },
    { label: 'BATT', value: stats.batteryVoltage.toFixed(1), sub: 'V' },
    { label: 'E.TEMP', value: Math.round(stats.engineTemp).toString(), sub: '°C' },
    {
      label: 'STATUS',
      value: isLive ? 'LIVE' : 'IDLE',
      sub: '',
      live: isLive,
    },
  ];

  return (
    <div
      className="w-[280px] bg-[#13161E] border-l border-[#1C2030] flex flex-col overflow-y-auto flex-shrink-0"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1C2030] flex-shrink-0">
        <div className="text-xs text-[#3A3F50] mt-0.5">BZR 4</div>
      </div>

      {/* Compact stats matrix */}
      <div className="p-3 flex-shrink-0">
        <div className="grid grid-cols-3 gap-1.5">
          {statCells.map((cell, idx) => (
            <div
              key={idx}
              className="bg-[#0D0F14] hover:bg-[#161922] transition-colors rounded p-2.5 flex flex-col items-center justify-center min-h-[60px]"
            >
              <span className="text-[9px] font-semibold tracking-widest text-[#3A3F50] mb-1">
                {cell.label}
              </span>
              <div className="flex items-baseline gap-0.5">
                <span
                  className="tabular-nums leading-none"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: cell.value.length > 4 ? '13px' : '18px',
                    color:
                      cell.live !== undefined
                        ? cell.live
                          ? '#FFFFFF'
                          : '#6B7A99'
                        : '#FFFFFF',
                  }}
                >
                  {cell.value}
                </span>
                {cell.sub && (
                  <span className="text-[9px] text-[#3A3F50]">{cell.sub}</span>
                )}
                {cell.live && (
                  <span className="relative flex h-1.5 w-1.5 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3B3B] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF3B3B]" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-[#1C2030]" />

      {/* Fault log */}
      <div className="p-3 flex-1">
        {/* Fault log header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-semibold tracking-widest text-[#6B7A99]">FAULT LOG</span>
          <div className="flex items-center gap-1 ml-auto">
            {errorCount > 0 && (
              <span className="text-[9px] bg-[#FF3B3B] text-white px-1.5 py-0.5 rounded-full font-semibold">
                {errorCount} ERR
              </span>
            )}
            {warnCount > 0 && (
              <span className="text-[9px] bg-[#FFB700] text-[#0D0F14] px-1.5 py-0.5 rounded-full font-semibold">
                {warnCount} WARN
              </span>
            )}
          </div>
        </div>

        {/* Fault entries */}
        <div className="space-y-1.5">
          {MOCK_FAULTS.map(fault => (
            <div
              key={fault.id}
              className="bg-[#0D0F14] hover:bg-[#161922] transition-colors rounded p-2.5 border-l-2"
              style={{
                borderLeftColor: fault.level === 'error' ? '#FF3B3B' : '#FFB700',
              }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className="text-xs font-semibold"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    color: fault.level === 'error' ? '#FF3B3B' : '#FFB700',
                  }}
                >
                  {fault.code}
                </span>
                <span
                  className="text-[9px] text-[#3A3F50]"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {fault.timestamp}
                </span>
              </div>
              <div className="text-xs text-[#6B7A99] leading-snug">{fault.message}</div>
            </div>
          ))}
        </div>

        {MOCK_FAULTS.length === 0 && (
          <div className="text-center py-6">
            <div className="text-[10px] text-[#3A3F50]">No faults detected</div>
          </div>
        )}
      </div>
    </div>
  );
}