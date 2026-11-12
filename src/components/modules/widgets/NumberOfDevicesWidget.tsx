import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  MoreVertical, 
  ChevronDown, 
  Download, 
  FileSpreadsheet, 
  Check,
  X,
  Search,
  Globe2,
  ArrowUpDown
} from 'lucide-react';

export interface DeviceSlice {
  id: string;
  label: string;
  percentage: number;
  count: number;
  color: string;
}

export interface DetailedOtherCountry {
  name: string;
  code: string;
  flag: string;
  deviceCount: number;
  percentageOfOthers?: number;
  onlineRate?: number;
  carrier: string;
  avgDataPerMonth: string;
  topModel?: string;
}

export const OTHERS_COUNTRIES_DETAIL: DetailedOtherCountry[] = [
  { name: 'Germany', code: 'DE', flag: '🇩🇪', deviceCount: 685420, carrier: 'Deutsche Telekom / Vodafone DE', avgDataPerMonth: '5.2 GB' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', deviceCount: 420150, carrier: 'Rogers / Bell Mobility', avgDataPerMonth: '4.9 GB' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', deviceCount: 345800, carrier: 'Telstra / Optus', avgDataPerMonth: '4.6 GB' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹', deviceCount: 312400, carrier: 'TIM / Vodafone IT', avgDataPerMonth: '4.1 GB' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸', deviceCount: 265900, carrier: 'Telefónica Movistar', avgDataPerMonth: '4.3 GB' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪', deviceCount: 198300, carrier: 'Telia Company', avgDataPerMonth: '5.4 GB' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷', deviceCount: 174200, carrier: 'Vivo (Telefônica Brasil)', avgDataPerMonth: '3.8 GB' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷', deviceCount: 142600, carrier: 'SK Telecom / KT', avgDataPerMonth: '6.1 GB' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', deviceCount: 118500, carrier: 'e& (Etisalat) / du', avgDataPerMonth: '5.7 GB' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', deviceCount: 94200, carrier: 'Vodacom / MTN', avgDataPerMonth: '3.6 GB' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭', deviceCount: 78400, carrier: 'Swisscom AG', avgDataPerMonth: '5.8 GB' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱', deviceCount: 61815, carrier: 'KPN / VodafoneZiggo', avgDataPerMonth: '5.0 GB' }
];

export const NumberOfDevicesWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Country' | 'Make' | 'Model'>('Country');
  const [timePeriod, setTimePeriod] = useState<string>('Last 1 year');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Tooltip only visible on hover: initialized to null
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Drilldown popup state for "Others"
  const [isOthersModalOpen, setIsOthersModalOpen] = useState(false);
  const [othersSearchQuery, setOthersSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'devices' | 'carrier' | 'name'>('devices');

  // Datasets tailored by tab with the exact figures from the mock
  const datasets: Record<string, { total: string; totalRaw: number; slices: DeviceSlice[] }> = {
    Country: {
      total: '15,250,893',
      totalRaw: 15250893,
      slices: [
        { id: 'usa', label: 'USA', percentage: 36, count: 5376287, color: '#2563eb' }, // Deep Blue matching mock
        { id: 'france', label: 'France', percentage: 21, count: 3202687, color: '#00a3bf' }, // Teal / Cyan
        { id: 'uk', label: 'UK', percentage: 8, count: 1220071, color: '#8b5cf6' }, // Violet
        { id: 'Italy', label: 'Italy', percentage: 16, count: 2440143, color: '#d946ef' }, // Magenta / Fuchsia
        { id: 'others', label: 'Others', percentage: 19, count: 2897685, color: '#84cc16' } // Chartreuse / Olive green
      ]
    },
    Make: {
      total: '15,250,893',
      totalRaw: 15250893,
      slices: [
        { id: 'rangerover', label: 'Range Rover', percentage: 38, count: 5795339, color: '#2563eb' },
        { id: 'defender', label: 'Defender', percentage: 26, count: 3965232, color: '#00a3bf' },
        { id: 'discovery', label: 'Discovery', percentage: 14, count: 2135125, color: '#8b5cf6' },
        { id: 'velar', label: 'Velar', percentage: 12, count: 1830107, color: '#d946ef' },
        { id: 'jaguar', label: 'Jaguar', percentage: 10, count: 1525090, color: '#84cc16' }
      ]
    },
    Model: {
      total: '15,250,893',
      totalRaw: 15250893,
      slices: [
        { id: 'autobiography', label: 'Autobiography', percentage: 32, count: 4880286, color: '#2563eb' },
        { id: 'dynamic_se', label: 'Dynamic SE', percentage: 24, count: 3660214, color: '#00a3bf' },
        { id: 'first_ed', label: 'First Edition', percentage: 15, count: 2287634, color: '#8b5cf6' },
        { id: 'sv_bespoke', label: 'SV Bespoke', percentage: 17, count: 2592652, color: '#d946ef' },
        { id: 'standard', label: 'Standard', percentage: 12, count: 1830107, color: '#84cc16' }
      ]
    }
  };

  const currentDataset = datasets[activeTab];
  const activeSlice = hoveredSlice ? currentDataset.slices.find(s => s.id === hoveredSlice) : null;

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOthersModalOpen) {
        setIsOthersModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOthersModalOpen]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleSliceClick = (sliceId: string) => {
    if (sliceId === 'others') {
      setIsOthersModalOpen(true);
    } else {
      setHoveredSlice(sliceId);
    }
  };

  // Geometry for SVG Donut slices
  const cx = 150;
  const cy = 130;
  const outerR = 92;
  const innerR = 64;

  // Calculate cumulative angles for donut paths
  let cumulativeAngle = -90; // Start at top
  const renderedSlices = currentDataset.slices.map((slice) => {
    const angle = (slice.percentage / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const midRad = ((startAngle + endAngle) / 2 * Math.PI) / 180;

    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);

    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = `
      M ${x1} ${y1}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;

    // Mid point for pointer line
    const labelLineStart = {
      x: cx + (outerR + 2) * Math.cos(midRad),
      y: cy + (outerR + 2) * Math.sin(midRad)
    };
    const labelLineMid = {
      x: cx + (outerR + 18) * Math.cos(midRad),
      y: cy + (outerR + 18) * Math.sin(midRad)
    };
    const isRightSide = labelLineMid.x >= cx;
    const labelLineEnd = {
      x: isRightSide ? labelLineMid.x + 22 : labelLineMid.x - 22,
      y: labelLineMid.y
    };

    return {
      ...slice,
      pathData,
      startAngle,
      endAngle,
      midRad,
      labelLineStart,
      labelLineMid,
      labelLineEnd,
      isRightSide
    };
  });

  // Filtered and sorted detailed country list for modal
  const filteredCountries = OTHERS_COUNTRIES_DETAIL
    .filter(c => 
      c.name.toLowerCase().includes(othersSearchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(othersSearchQuery.toLowerCase()) ||
      c.carrier.toLowerCase().includes(othersSearchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'devices') return b.deviceCount - a.deviceCount;
      if (sortBy === 'carrier') return a.carrier.localeCompare(b.carrier);
      return a.name.localeCompare(b.name);
    });

  return (
    <>
      <div className="relative flex flex-col justify-between rounded-xl border border-[#224375] bg-[#1a3156] p-5 text-slate-200 shadow-lg backdrop-blur-md h-full">
        {/* Header bar */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold tracking-tight text-white flex items-center gap-2">
              Number of devices
            </h3>
            <div className="flex items-center gap-1.5 text-slate-400">
              <button 
                type="button"
                onClick={handleRefresh}
                title="Refresh widget"
                className="p-1 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw size={15} className={isRefreshing ? 'animate-spin text-sky-400' : ''} />
              </button>
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  title="Options"
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                >
                  <MoreVertical size={15} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 top-7 z-30 w-44 rounded-lg border border-[#224375] bg-[#13233d] p-1.5 text-xs text-slate-200 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                    <button 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-[#1f3b66] hover:text-white transition-colors"
                    >
                      <Download size={13} className="text-slate-400" /> Export PNG
                    </button>
                    <button 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 hover:bg-[#1f3b66] hover:text-white transition-colors"
                    >
                      <FileSpreadsheet size={13} className="text-slate-400" /> Export CSV Data
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Navigation: Segmented Tabs & Time Filter */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#224375]/70 pb-3">
            <div className="flex items-center gap-1.5">
              {(['Country', 'Make', 'Model'] as const).map((tab) => {
                const isSelected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setHoveredSlice(null);
                    }}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border border-sky-400 bg-sky-500/20 text-sky-300 font-semibold shadow-xs'
                        : 'border border-[#224375] bg-[#152744] text-slate-300 hover:bg-[#203c68] hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Time Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                className="flex items-center gap-1.5 rounded-md border border-[#224375] bg-[#152744] px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-[#203c68] hover:text-white shadow-xs transition-all cursor-pointer"
              >
                <span>{timePeriod}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {isTimeDropdownOpen && (
                <div className="absolute right-0 top-8 z-30 w-36 rounded-lg border border-[#224375] bg-[#13233d] p-1 text-xs text-slate-200 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  {['Last 1 year', 'Last 6 months', 'Last 3 months', 'All time'].map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => {
                        setTimePeriod(period);
                        setIsTimeDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded px-2.5 py-1.5 hover:bg-[#1f3b66] hover:text-sky-300 transition-colors"
                    >
                      <span>{period}</span>
                      {timePeriod === period && <Check size={12} className="text-sky-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Donut Chart Canvas Area with Center Number & Hover-only Callout Tooltip */}
        <div 
          className="relative mt-2 flex flex-1 items-center justify-center"
          onMouseLeave={() => setHoveredSlice(null)}
        >
          {/* SVG Graphic */}
          <svg 
            viewBox="0 0 320 250" 
            className="w-full max-w-[340px] select-none overflow-visible"
          >
            {/* Slices */}
            <g>
              {renderedSlices.map((slice) => {
                const isHovered = hoveredSlice === slice.id;
                const isOthers = slice.id === 'others';
                return (
                  <path
                    key={slice.id}
                    d={slice.pathData}
                    fill={slice.color}
                    stroke="#1a3156"
                    strokeWidth={2.5}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      transformOrigin: `${cx}px ${cy}px`,
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      filter: isHovered ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.45))' : 'none',
                      opacity: hoveredSlice && !isHovered ? 0.75 : 1
                    }}
                    onMouseEnter={() => setHoveredSlice(slice.id)}
                    onClick={() => handleSliceClick(slice.id)}
                  >
                    {isOthers && <title>Click to drill down into country breakdown</title>}
                  </path>
                );
              })}
            </g>

            {/* Pointer Lines and Labels for each slice */}
            {renderedSlices.map((slice) => {
              const isHovered = hoveredSlice === slice.id;
              const textAnchor = slice.isRightSide ? 'start' : 'end';
              const labelX = slice.isRightSide ? slice.labelLineEnd.x + 4 : slice.labelLineEnd.x - 4;
              const labelY = slice.labelLineEnd.y + 3.5;
              const isOthers = slice.id === 'others';

              return (
                <g 
                  key={`label-${slice.id}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredSlice(slice.id)}
                  onClick={() => handleSliceClick(slice.id)}
                >
                  {/* Connecting subtle line */}
                  <polyline
                    points={`
                      ${slice.labelLineStart.x},${slice.labelLineStart.y} 
                      ${slice.labelLineMid.x},${slice.labelLineMid.y} 
                      ${slice.labelLineEnd.x},${slice.labelLineEnd.y}
                    `}
                    fill="none"
                    stroke="#3b679e"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />

                  {/* External percentage label */}
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={textAnchor}
                    className={`text-[10.5px] font-medium transition-colors ${
                      isHovered ? 'font-bold fill-white' : 'fill-slate-300'
                    }`}
                  >
                    {slice.label} <tspan className="font-semibold text-sky-400">{slice.percentage}%</tspan>
                    {isOthers && <tspan className="text-[9px] fill-lime-400 font-bold"> ↗</tspan>}
                  </text>
                </g>
              );
            })}

            {/* Center Donut Hole Text */}
            <g className="pointer-events-none">
              <text
                x={cx}
                y={cy - 2}
                textAnchor="middle"
                className="text-[17px] font-extrabold fill-white font-sans tracking-tight"
              >
                {currentDataset.total}
              </text>
              <text
                x={cx}
                y={cy + 15}
                textAnchor="middle"
                className="text-[11px] font-medium fill-slate-400"
              >
                devices
              </text>
            </g>
          </svg>

          {/* Highlighted Callout Tooltip Card matching theme - VISIBLE ONLY ON HOVER */}
          {activeSlice && (
            <div 
              className="pointer-events-none absolute right-2 top-2 z-20 flex flex-col gap-1 rounded-lg border border-[#2e5699] bg-[#0f1d33]/95 px-3 py-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="h-2.5 w-2.5 rounded-xs shrink-0" 
                  style={{ backgroundColor: activeSlice.color }} 
                />
                <span className="text-xs font-semibold text-slate-100">
                  {activeSlice.label}
                </span>
                <span className="text-xs font-bold text-sky-400 font-mono">
                  {activeSlice.percentage}%
                </span>
                <span className="text-[11px] text-slate-300 font-mono">
                  ({activeSlice.count.toLocaleString()} Devices)
                </span>
              </div>
              {activeSlice.id === 'others' && (
                <div className="text-[10px] text-lime-400 font-medium flex items-center gap-1 border-t border-[#224375]/80 pt-1 mt-0.5">
                  <span>⚡ Click to view detailed country breakdown</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Summary Slices Chips */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-[#224375]/60">
          {currentDataset.slices.map(s => {
            const isOthers = s.id === 'others';
            return (
              <button
                key={s.id}
                type="button"
                onMouseEnter={() => setHoveredSlice(s.id)}
                onClick={() => handleSliceClick(s.id)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] transition-all cursor-pointer ${
                  hoveredSlice === s.id 
                    ? 'bg-[#152744] text-white font-semibold ring-1 ring-sky-400/60' 
                    : isOthers 
                      ? 'text-lime-300 bg-lime-500/10 hover:bg-lime-500/20 ring-1 ring-lime-500/40' 
                      : 'text-slate-300 hover:text-white hover:bg-[#152744]/60'
                }`}
                title={isOthers ? 'Click to open country drilldown modal' : undefined}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span>{s.label}</span>
                <span className="text-slate-400 font-mono">({s.percentage}%)</span>
                {isOthers && (
                  <span className="text-[10px] font-bold text-lime-400 ml-0.5">↗</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drill-Down Popup Modal for "Others" Country Details */}
      {isOthersModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOthersModalOpen(false)}
        >
          <div 
            className="relative flex flex-col w-full max-w-4xl max-h-[85vh] rounded-2xl border border-[#2a4d80] bg-[#0f1d33] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#224375] px-6 py-4 bg-[#142642]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/20 text-lime-400 border border-lime-500/30">
                  <Globe2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      &quot;Others&quot; Devices — Country Details
                    </h3>
                    <span className="rounded-full bg-lime-500/20 px-2.5 py-0.5 text-[11px] font-bold text-lime-300 border border-lime-500/40">
                      19% of Global Fleet
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Connected devices, SIM network carrier, and average monthly telemetry across international markets.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOthersModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1a3156] hover:text-white transition-colors cursor-pointer"
                title="Close modal (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Controls: Search and Sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-[#224375]/60 bg-[#0d1a2e]">
              <div className="relative flex-1 min-w-[220px] max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by country or SIM network carrier..."
                  value={othersSearchQuery}
                  onChange={(e) => setOthersSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#224375] bg-[#152744] py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none"
                />
                {othersSearchQuery && (
                  <button
                    onClick={() => setOthersSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ArrowUpDown size={13} className="text-slate-400" />
                <span className="text-[11px] text-slate-400">Sort by:</span>
                <button
                  type="button"
                  onClick={() => setSortBy('devices')}
                  className={`rounded px-2.5 py-1 transition-all cursor-pointer ${
                    sortBy === 'devices' ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/50' : 'hover:bg-[#1a3156]'
                  }`}
                >
                  Device Count / %
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('carrier')}
                  className={`rounded px-2.5 py-1 transition-all cursor-pointer ${
                    sortBy === 'carrier' ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/50' : 'hover:bg-[#1a3156]'
                  }`}
                >
                  Network Carrier
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('name')}
                  className={`rounded px-2.5 py-1 transition-all cursor-pointer ${
                    sortBy === 'name' ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/50' : 'hover:bg-[#1a3156]'
                  }`}
                >
                  Country Name
                </button>
              </div>
            </div>

            {/* Scrollable Table Area */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#224375] text-[11px] font-semibold text-slate-400 uppercase tracking-wider sticky top-0 bg-[#0f1d33] z-10">
                    <th className="py-2.5 pl-3">Country</th>
                    <th className="py-2.5 px-3 text-right">Number of Devices</th>
                    <th className="py-2.5 px-3 text-right">% of Others (within 19%)</th>
                    <th className="py-2.5 pl-6 text-left">SIM Network Carrier</th>
                    <th className="py-2.5 pr-3 text-right">Avg Data/Month</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#224375]/40 text-slate-200">
                  {filteredCountries.map((country) => {
                    const totalOthersDevices = OTHERS_COUNTRIES_DETAIL.reduce((acc, c) => acc + c.deviceCount, 0);
                    const dividedPctOf19 = ((country.deviceCount / totalOthersDevices) * 19).toFixed(2);
                    const pctOfOthers = ((country.deviceCount / totalOthersDevices) * 100).toFixed(1);

                    return (
                      <tr 
                        key={country.code}
                        className="hover:bg-[#152a48]/70 transition-colors group"
                      >
                        <td className="py-3 pl-3 font-medium">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg leading-none">{country.flag}</span>
                            <div>
                              <span className="text-white font-semibold group-hover:text-sky-300 transition-colors">
                                {country.name}
                              </span>
                              <span className="ml-1.5 text-[10px] text-slate-400 font-mono">
                                ({country.code})
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-white text-[13px]">
                          {country.deviceCount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 font-mono text-xs font-bold text-lime-400">
                              <span>{dividedPctOf19}%</span>
                              <span className="text-[10px] font-normal text-slate-400">/ 19%</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {pctOfOthers}% of Others
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pl-6 text-slate-300">
                          <span className="font-mono text-xs text-sky-200">
                            {country.carrier}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-right font-mono text-slate-200 font-semibold">
                          {country.avgDataPerMonth}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCountries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No countries found matching &quot;{othersSearchQuery}&quot;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#224375] px-6 py-3 bg-[#142642] text-xs">
              <span className="text-slate-400">
                Showing {filteredCountries.length} of {OTHERS_COUNTRIES_DETAIL.length} countries • Total: 2,897,685 connected devices (19.00% of global fleet)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOthersModalOpen(false)}
                  className="rounded-lg border border-[#224375] bg-[#1a3156] px-4 py-1.5 font-medium text-slate-200 hover:bg-[#234375] hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

