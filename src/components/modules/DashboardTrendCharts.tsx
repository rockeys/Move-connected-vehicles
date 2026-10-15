import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Car, 
  ChevronRight, 
  BarChart2,
  Calendar,
  CheckCircle2,
  Factory
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  TimeRange, 
  getSimTrendData, 
  getVehicleTrendData 
} from '../../data/trendData';

export const DashboardTrendCharts: React.FC = () => {
  const { setActiveModule, filters, selectedPlant } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('12m');

  const plantId = filters.plantId;
  const isPlantFiltered = plantId && plantId !== 'all';

  // Independent hover states for each widget to allow individual exploration
  const [hoverSimIdx, setHoverSimIdx] = useState<number | null>(null);
  const [hoverVehIdx, setHoverVehIdx] = useState<number | null>(null);

  // Retrieve datasets filtered by plant if selected
  const simData = useMemo(() => getSimTrendData(timeRange, plantId), [timeRange, plantId]);
  const vehicleData = useMemo(() => getVehicleTrendData(timeRange, plantId), [timeRange, plantId]);

  // Overall summary metrics for top headers (steady authoritative figures)
  const latestSim = simData[simData.length - 1];
  const latestVeh = vehicleData[vehicleData.length - 1];

  // High-legibility 2-column SVG geometry (580 x 220 viewBox) with generous padding for text
  const svgW = 580;
  const svgH = 220;
  const pad = { top: 28, right: 32, bottom: 44, left: 58 };
  const innerW = svgW - pad.left - pad.right;
  const innerH = svgH - pad.top - pad.bottom;

  // Format X-axis labels to ensure high legibility and avoid horizontal crowding
  const formatAxisLabel = (label: string, range: TimeRange) => {
    if (range === '12m') {
      return label.split(' ')[0];
    }
    return label;
  };

  // Helper: smooth SVG path for line
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  /* -------------------------------------------------------------------------- */
  /* WIDGET 1: BAR CHART (Move SIM In-Plant Provisioning & Monthly Velocity)     */
  /* -------------------------------------------------------------------------- */
  const maxSimVal = Math.max(...simData.map(d => d.provisionedInPeriod)) * 1.2;
  const simSlotW = innerW / simData.length;
  const simBarWidth = Math.max(14, Math.min(30, simSlotW * 0.58));

  // Compute tooltip coordinates for hovered bar
  const simTooltipPosition = useMemo(() => {
    if (hoverSimIdx === null) return null;
    const d = simData[hoverSimIdx];
    const xCenter = pad.left + (hoverSimIdx + 0.5) * simSlotW;
    const barH = (d.provisionedInPeriod / maxSimVal) * innerH;
    const barY = pad.top + innerH - barH;
    const xPercent = (xCenter / svgW) * 100;
    const yPercent = (barY / svgH) * 100;

    return {
      xPercent,
      yPercent,
      point: d
    };
  }, [hoverSimIdx, simData, simSlotW, maxSimVal, innerH, pad.left, pad.top, svgW, svgH]);

  const renderBarChart = () => {
    return (
      <svg 
        viewBox={`0 0 ${svgW} ${svgH}`} 
        className="w-full h-auto select-none block"
        onMouseLeave={() => setHoverSimIdx(null)}
      >
        <defs>
          <linearGradient id="barGradDefault" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="1" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines with high-contrast text */}
        {[0, 0.33, 0.66, 1].map((pct, idx) => {
          const y = pad.top + innerH * (1 - pct);
          const val = Math.round(maxSimVal * pct);
          return (
            <g key={idx}>
              <line 
                x1={pad.left} 
                y1={y} 
                x2={svgW - pad.right} 
                y2={y} 
                stroke="#294d80" 
                strokeDasharray="3 3" 
                strokeOpacity="0.7" 
              />
              <text 
                x={pad.left - 10} 
                y={y + 4} 
                textAnchor="end" 
                fill="#cbd5e1" 
                fontSize="11" 
                fontWeight="500"
                fontFamily="monospace"
              >
                {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
              </text>
            </g>
          );
        })}

        {/* Baseline X-axis line */}
        <line 
          x1={pad.left} 
          y1={pad.top + innerH} 
          x2={svgW - pad.right} 
          y2={pad.top + innerH} 
          stroke="#3b629b" 
          strokeWidth="1.5" 
        />

        {/* Small text to represent plant data in the chart */}
        <text 
          x={svgW - pad.right} 
          y={pad.top - 10} 
          textAnchor="end" 
          fill={isPlantFiltered ? "#38bdf8" : "#94a3b8"} 
          fontSize="10" 
          fontWeight="600" 
          fontFamily="monospace"
        >
          {isPlantFiltered ? `[Plant: ${selectedPlant?.shortName || plantId}]` : '[Scope: Global Fleet]'}
        </text>

        {/* Bars */}
        {simData.map((d, i) => {
          const xCenter = pad.left + (i + 0.5) * simSlotW;
          const barH = (d.provisionedInPeriod / maxSimVal) * innerH;
          const barY = pad.top + innerH - barH;
          const isHovered = hoverSimIdx === i;
          const labelText = formatAxisLabel(d.label, timeRange);

          return (
            <g 
              key={i} 
              className="cursor-pointer"
              onMouseEnter={() => setHoverSimIdx(i)}
            >
              {/* Invisible wider hit target for smooth hover */}
              <rect
                x={xCenter - simSlotW / 2}
                y={pad.top}
                width={simSlotW}
                height={innerH + pad.bottom}
                fill="transparent"
              />

              {/* Bar Rect with rounded top */}
              <rect
                x={xCenter - simBarWidth / 2}
                y={barY}
                width={simBarWidth}
                height={Math.max(4, barH)}
                rx="4"
                ry="4"
                fill={isHovered ? "url(#barGradHover)" : "url(#barGradDefault)"}
                className="transition-all duration-150"
                filter={isHovered ? "drop-shadow(0 0 10px rgba(56, 189, 248, 0.75))" : undefined}
              />

              {/* Bar Value text above bar */}
              <text
                x={xCenter}
                y={barY - 6}
                textAnchor="middle"
                fill={isHovered ? "#38bdf8" : "#f8fafc"}
                fontSize="10"
                fontFamily="monospace"
                fontWeight={isHovered ? "700" : "600"}
              >
                {d.provisionedInPeriod >= 1000 ? `${(d.provisionedInPeriod / 1000).toFixed(1)}k` : d.provisionedInPeriod}
              </text>

              {/* High-contrast X-axis Label */}
              <text
                x={xCenter}
                y={pad.top + innerH + 20}
                textAnchor="middle"
                fill={isHovered ? "#38bdf8" : "#e2e8f0"}
                fontSize="11"
                fontWeight={isHovered ? "700" : "600"}
                fontFamily="inherit"
              >
                {labelText}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  /* -------------------------------------------------------------------------- */
  /* WIDGET 2: LINE CHART (Vehicles with Move SIM vs Total Manufactured)        */
  /* -------------------------------------------------------------------------- */
  const minVehVal = Math.min(...vehicleData.map(d => d.connectedWithSim)) * 0.94;
  const maxVehVal = Math.max(...vehicleData.map(d => d.manufactured)) * 1.02;
  const vehRange = maxVehVal - minVehVal || 1;

  const mfgPoints = vehicleData.map((d, i) => ({
    x: pad.left + (i * innerW) / (vehicleData.length - 1),
    y: pad.top + innerH - ((d.manufactured - minVehVal) / vehRange) * innerH,
    data: d
  }));

  const connPoints = vehicleData.map((d, i) => ({
    x: pad.left + (i * innerW) / (vehicleData.length - 1),
    y: pad.top + innerH - ((d.connectedWithSim - minVehVal) / vehRange) * innerH,
    data: d
  }));

  const mfgPath = createSmoothPath(mfgPoints);
  const connPath = createSmoothPath(connPoints);

  // Compute tooltip coordinates for hovered line point
  const vehTooltipPosition = useMemo(() => {
    if (hoverVehIdx === null) return null;
    const pt = connPoints[hoverVehIdx];
    const xPercent = (pt.x / svgW) * 100;
    const yPercent = (pt.y / svgH) * 100;
    return {
      xPercent,
      yPercent,
      point: vehicleData[hoverVehIdx]
    };
  }, [hoverVehIdx, connPoints, vehicleData, svgW, svgH]);

  const handleLineMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width) * svgW;
    if (normX < pad.left || normX > svgW - pad.right) {
      setHoverVehIdx(null);
      return;
    }
    const step = innerW / (vehicleData.length - 1);
    const closest = Math.round((normX - pad.left) / step);
    const clamped = Math.max(0, Math.min(vehicleData.length - 1, closest));
    setHoverVehIdx(clamped);
  };

  const renderLineChart = () => {
    const activePoint = hoverVehIdx !== null ? connPoints[hoverVehIdx] : null;

    return (
      <svg 
        viewBox={`0 0 ${svgW} ${svgH}`} 
        className="w-full h-auto select-none block cursor-crosshair"
        onMouseMove={handleLineMouseMove}
        onMouseLeave={() => setHoverVehIdx(null)}
      >
        {/* Horizontal grid lines with clear legible text */}
        {[0, 0.33, 0.66, 1].map((pct, idx) => {
          const y = pad.top + innerH * (1 - pct);
          const val = Math.round(minVehVal + vehRange * pct);
          return (
            <g key={idx}>
              <line 
                x1={pad.left} 
                y1={y} 
                x2={svgW - pad.right} 
                y2={y} 
                stroke="#294d80" 
                strokeDasharray="3 3" 
                strokeOpacity="0.7" 
              />
              <text 
                x={pad.left - 10} 
                y={y + 4} 
                textAnchor="end" 
                fill="#cbd5e1" 
                fontSize="11" 
                fontWeight="500"
                fontFamily="monospace"
              >
                {(val / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* Baseline X-axis line */}
        <line 
          x1={pad.left} 
          y1={pad.top + innerH} 
          x2={svgW - pad.right} 
          y2={pad.top + innerH} 
          stroke="#3b629b" 
          strokeWidth="1.5" 
        />

        {/* Small text to represent plant data in the chart */}
        <text 
          x={svgW - pad.right} 
          y={pad.top - 10} 
          textAnchor="end" 
          fill={isPlantFiltered ? "#38bdf8" : "#94a3b8"} 
          fontSize="10" 
          fontWeight="600" 
          fontFamily="monospace"
        >
          {isPlantFiltered ? `[Plant: ${selectedPlant?.shortName || plantId}]` : '[Scope: Global Fleet]'}
        </text>

        {/* Manufactured line (Dashed gray) */}
        <path 
          d={mfgPath} 
          fill="none" 
          stroke="#94a3b8" 
          strokeWidth="2.2" 
          strokeDasharray="4 3" 
        />

        {/* Connected with Move SIM Line (Bright Sky Blue) */}
        <path 
          d={connPath} 
          fill="none" 
          stroke="#38bdf8" 
          strokeWidth="3" 
        />

        {/* Data point dots */}
        {connPoints.map((pt, i) => {
          const isHovered = hoverVehIdx === i;
          return (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={isHovered ? 6 : 3.5}
              fill="#0b172a"
              stroke="#38bdf8"
              strokeWidth={isHovered ? 2.5 : 2}
              className="transition-all"
            />
          );
        })}

        {/* Crosshair on hover */}
        {activePoint && (
          <g>
            <line 
              x1={activePoint.x} 
              y1={pad.top} 
              x2={activePoint.x} 
              y2={pad.top + innerH} 
              stroke="#38bdf8" 
              strokeWidth="1.5" 
              strokeDasharray="2 2"
            />
            <circle 
              cx={mfgPoints[hoverVehIdx!].x} 
              cy={mfgPoints[hoverVehIdx!].y} 
              r="4.5" 
              fill="#0b172a" 
              stroke="#cbd5e1" 
              strokeWidth="2" 
            />
            <circle 
              cx={activePoint.x} 
              cy={activePoint.y} 
              r="6.5" 
              fill="#38bdf8" 
              stroke="#ffffff" 
              strokeWidth="2" 
            />
          </g>
        )}

        {/* High-contrast X Axis Labels */}
        {vehicleData.map((d, i) => {
          const x = pad.left + (i * innerW) / (vehicleData.length - 1);
          const isHovered = hoverVehIdx === i;
          const labelText = formatAxisLabel(d.label, timeRange);
          return (
            <text 
              key={i} 
              x={x} 
              y={pad.top + innerH + 20} 
              textAnchor="middle" 
              fill={isHovered ? "#38bdf8" : "#e2e8f0"} 
              fontSize="11" 
              fontWeight={isHovered ? "700" : "600"}
              fontFamily="inherit"
            >
              {labelText}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Global Section Header & Shared Horizon Time Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          
          <div className="flex flex-wrap items-center gap-2.5 mt-0.5">
            <h2 className="text-base font-bold text-white">
              Fleet Telematics & Connectivity Trend Intelligence
            </h2>
            {/* {isPlantFiltered ? (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400/40 bg-cyan-950/70 px-2 py-0.5 text-[10.5px] font-mono text-cyan-300 font-semibold shadow-xs">
                <Factory size={11} className="text-cyan-400" />
                Plant Scope: {selectedPlant?.name} ({selectedPlant?.country})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10.5px] font-mono text-slate-400">
                Global Production Data
              </span>
            )} */}
          </div>
        </div>

        {/* Global Horizon Filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-[#224375] bg-[#12233e] p-1 self-start sm:self-auto">
          {(['24h', '7d', '30d', '12m'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                setHoverSimIdx(null);
                setHoverVehIdx(null);
              }}
              className={`rounded-md px-3 py-1 text-xs font-mono font-bold transition-all ${
                timeRange === range
                  ? 'bg-sky-500/30 text-sky-200 border border-sky-400 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#1a3156]'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Two Trend Graph Widgets in the Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* ========================================================================= */}
        {/* WIDGET 1: BAR CHART – Move SIM Lifecycle & Provisioning Velocity          */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 shadow-lg flex flex-col justify-between hover:border-sky-500/50 transition-colors">
          <div>
            {/* Widget Top Title */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#224375]/80">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300">
                  <BarChart2 size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">
                    Move SIM Provisioning Velocity
                  </h3>
                  <div className="text-[11px] text-slate-300 font-mono">
                    {isPlantFiltered 
                      ? `Plant · ${selectedPlant?.shortName} EOL Yield` 
                      : 'In-Plant Factory EOL Volume'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModule('sim-management')}
                className="text-slate-300 hover:text-sky-300 transition-colors p-1"
                title="Open SIM Management"
              >
                <ChevronRight size={15} />
              </button>
            </div>

            
            {/* Vector Bar Chart Canvas with Relative Interactive Tooltip Container */}
            <div className="relative rounded-lg border border-[#224375] bg-[#0c182a] p-2.5">
              {renderBarChart()}

              {/* Point-in-time Tooltip Structure anchored to Hovered Bar (Transparent Blur) */}
              {simTooltipPosition && (
                <div 
                  className="pointer-events-none absolute z-30 min-w-[240px] rounded-xl border border-sky-400/40 bg-[#091b33]/70 p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-100 ease-out"
                  style={{
                    left: `${simTooltipPosition.xPercent}%`,
                    top: `${Math.max(12, Math.min(60, simTooltipPosition.yPercent))}%`,
                    transform: simTooltipPosition.xPercent > 60 
                      ? 'translate(-104%, -40%)' 
                      : simTooltipPosition.xPercent < 40 
                        ? 'translate(6%, -40%)' 
                        : 'translate(-50%, -106%)'
                  }}
                >
                  {/* Tooltip Header with Time and Plant Scope Tag */}
                  <div className="flex items-center justify-between pb-2 border-b border-sky-500/25 text-xs font-semibold text-sky-200">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-sky-400" />
                      <span>{simTooltipPosition.point.timeDisplay}</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-sky-950/80 px-1.5 py-0.5 rounded border border-cyan-400/30 flex items-center gap-1">
                      <Factory size={9} />
                      <span>{isPlantFiltered ? `(${selectedPlant?.shortName})` : 'Global Fleet'}</span>
                    </span>
                  </div>

                  {/* Top-of-Widget Data displayed directly in Tooltip Structure */}
                  <div className="mt-2.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-sky-400"></span>
                        <span>{isPlantFiltered ? `Active eUICC (${selectedPlant?.shortName}):` : 'Active eUICC Fleet:'}</span>
                      </span>
                      <strong className="font-mono text-white tabular-nums">
                        {simTooltipPosition.point.activeSims.toLocaleString()} SIMs
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                        <span>{isPlantFiltered ? 'Plant Provisioned:' : 'Factory Provisioned:'}</span>
                      </span>
                      <strong className="font-mono text-cyan-300 tabular-nums">
                        +{simTooltipPosition.point.provisionedInPeriod.toLocaleString()} units
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                        <span>EOL Activation Yield:</span>
                      </span>
                      <strong className="font-mono text-emerald-400 tabular-nums">
                        {simTooltipPosition.point.activationRate}%
                      </strong>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-[#1e3a63]/80 text-[11px]">
                      <span className="text-slate-400">OTA Profile Swaps:</span>
                      <strong className="font-mono text-purple-300 tabular-nums">
                        {simTooltipPosition.point.profileSwaps.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          
        </div>

        {/* ========================================================================= */}
        {/* WIDGET 2: LINE CHART – Vehicles with Move SIM vs Production               */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 shadow-lg flex flex-col justify-between hover:border-sky-500/50 transition-colors">
          <div>
            {/* Widget Top Title */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#224375]/80">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300">
                  <Car size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">
                    Vehicles with Move SIM
                  </h3>
                  <div className="text-[11px] text-slate-300 font-mono">
                    {isPlantFiltered 
                      ? `Plant · ${selectedPlant?.shortName} Fleet Penetration` 
                      : 'Connected vs Manufactured'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModule('fleet-management')}
                className="text-slate-300 hover:text-sky-300 transition-colors p-1"
                title="Open Fleet Management"
              >
                <ChevronRight size={15} />
              </button>
            </div>

            

            {/* Vector Line Chart Canvas with Relative Interactive Tooltip Container */}
            <div className="relative rounded-lg border border-[#224375] bg-[#0c182a] p-2.5">
              {renderLineChart()}

              {/* Point-in-time Tooltip Structure anchored to Hovered Line Node (Transparent Blur) */}
              {vehTooltipPosition && (
                <div 
                  className="pointer-events-none absolute z-30 min-w-[245px] rounded-xl border border-sky-400/40 bg-[#091b33]/70 p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-100 ease-out"
                  style={{
                    left: `${vehTooltipPosition.xPercent}%`,
                    top: `${Math.max(12, Math.min(60, vehTooltipPosition.yPercent))}%`,
                    transform: vehTooltipPosition.xPercent > 60 
                      ? 'translate(-104%, -40%)' 
                      : vehTooltipPosition.xPercent < 40 
                        ? 'translate(6%, -40%)' 
                        : 'translate(-50%, -106%)'
                  }}
                >
                  {/* Tooltip Header with Time and Plant Scope Tag */}
                  <div className="flex items-center justify-between pb-2 border-b border-sky-500/25 text-xs font-semibold text-sky-200">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-sky-400" />
                      <span>{vehTooltipPosition.point.timeDisplay}</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-sky-950/80 px-1.5 py-0.5 rounded border border-cyan-400/30 flex items-center gap-1">
                      <Factory size={9} />
                      <span>{isPlantFiltered ? `(${selectedPlant?.shortName})` : 'Global Fleet'}</span>
                    </span>
                  </div>

                  {/* Top-of-Widget Data displayed directly in Tooltip Structure */}
                  <div className="mt-2.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-sky-400"></span>
                        <span>Connected with Move SIM:</span>
                      </span>
                      <strong className="font-mono text-white tabular-nums">
                        {vehTooltipPosition.point.connectedWithSim.toLocaleString()} Units
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                        <span>Total Manufactured:</span>
                      </span>
                      <strong className="font-mono text-slate-300 tabular-nums">
                        {vehTooltipPosition.point.manufactured.toLocaleString()} Units
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-400" />
                        <span>Fleet Penetration:</span>
                      </span>
                      <strong className="font-mono text-emerald-400 tabular-nums">
                        {vehTooltipPosition.point.penetrationRate}%
                      </strong>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-[#1e3a63]/80 text-[11px]">
                      <span className="text-slate-400">Roaming Fleet:</span>
                      <strong className="font-mono text-amber-300 tabular-nums">
                        {vehTooltipPosition.point.roamingVehicles.toLocaleString()} units
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          
        </div>

      </div>
    </div>
  );
};
