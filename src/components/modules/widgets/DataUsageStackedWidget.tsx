import React, { useState } from 'react';
import { 
  RotateCcw, 
  MoreVertical, 
  ChevronDown, 
  Download, 
  FileSpreadsheet, 
  Check,
  ArrowLeft,
  BarChart3
} from 'lucide-react';

export interface StackedUsageBar {
  id: string;
  name: string;
  dateRange: string;
  threeG: number; // in GB
  fourG: number;  // in GB
  fiveG: number;  // in GB
}

export interface MonthlyUsagePoint {
  id: string;
  monthShort: string;
  monthFull: string;
  threeG: number;
  fourG: number;
  fiveG: number;
}

export interface DrilldownTarget {
  id: string;
  name: string;
  type: 'Make' | 'Model' | 'Country';
  totalUsage: number;
}

export const DataUsageStackedWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Make' | 'Model' | 'Country'>('Make');
  const [timePeriod, setTimePeriod] = useState<'Last 6 months' | 'Last 1 year'>('Last 1 year');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Drilldown state: when user clicks any Make, Model, or Country bar
  const [selectedEntity, setSelectedEntity] = useState<DrilldownTarget | null>(null);

  // Tooltip only visible on hover: initialized to null
  const [hoveredBarId, setHoveredBarId] = useState<string | null>(null);

  // Aggregated annual overview datasets matching the mock
  const datasets: Record<string, StackedUsageBar[]> = {
    Make: [
      {
        id: 'rangerover',
        name: 'Range Rover',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 90,
        fourG: 180,
        fiveG: 310 // Total: 580 GB
      },
      {
        id: 'defender',
        name: 'Defender',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 60,
        fourG: 140,
        fiveG: 90 // Total: 290 GB
      },
      {
        id: 'velar',
        name: 'Velar',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 50,
        fourG: 120,
        fiveG: 70 // Total: 240 GB
      },
      {
        id: 'discovery',
        name: 'Discovery',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 160,
        fourG: 250,
        fiveG: 430 // Total: 840 GB (Matches exact tooltip in mock)
      },
      {
        id: 'jaguar',
        name: 'Jaguar',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 90,
        fourG: 250,
        fiveG: 430 // Total: 770 GB
      }
    ],
    Model: [
      {
        id: 'autobiography',
        name: 'Autobiography',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 80,
        fourG: 210,
        fiveG: 420 // 710 GB
      },
      {
        id: 'dynamic_se',
        name: 'Dynamic SE',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 70,
        fourG: 160,
        fiveG: 180 // 410 GB
      },
      {
        id: 'first_ed',
        name: 'First Edition',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 40,
        fourG: 130,
        fiveG: 110 // 280 GB
      },
      {
        id: 'sv_bespoke',
        name: 'SV Bespoke',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 160,
        fourG: 250,
        fiveG: 430 // 840 GB
      },
      {
        id: 'standard',
        name: 'Standard',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 90,
        fourG: 240,
        fiveG: 390 // 720 GB
      }
    ],
    Country: [
      {
        id: 'usa',
        name: 'USA',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 110,
        fourG: 260,
        fiveG: 480 // 850 GB
      },
      {
        id: 'germany',
        name: 'Germany',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 50,
        fourG: 150,
        fiveG: 120 // 320 GB
      },
      {
        id: 'uk',
        name: 'UK',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 45,
        fourG: 140,
        fiveG: 95 // 280 GB
      },
      {
        id: 'france',
        name: 'France',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 160,
        fourG: 250,
        fiveG: 430 // 840 GB
      },
      {
        id: 'japan',
        name: 'Japan',
        dateRange: 'Jan 2024 - Dec 2024',
        threeG: 90,
        fourG: 250,
        fiveG: 410 // 750 GB
      }
    ]
  };

  // Generate realistic monthly data for the selected entity (12 months of 2024)
  const getMonthlyDataForEntity = (entityId: string): MonthlyUsagePoint[] => {
    // 12 months array
    const months = [
      { short: 'Jan', full: 'January 2024', weight: 0.75 },
      { short: 'Feb', full: 'February 2024', weight: 0.78 },
      { short: 'Mar', full: 'March 2024', weight: 0.85 },
      { short: 'Apr', full: 'April 2024', weight: 0.88 },
      { short: 'May', full: 'May 2024', weight: 0.92 },
      { short: 'Jun', full: 'June 2024', weight: 0.98 },
      { short: 'Jul', full: 'July 2024', weight: 1.05 },
      { short: 'Aug', full: 'August 2024', weight: 1.12 },
      { short: 'Sep', full: 'September 2024', weight: 1.08 },
      { short: 'Oct', full: 'October 2024', weight: 1.16 },
      { short: 'Nov', full: 'November 2024', weight: 1.25 },
      { short: 'Dec', full: 'December 2024', weight: 1.35 }
    ];

    // Find baseline across all tabs or fallback to first make
    const allBars = [
      ...datasets.Make,
      ...datasets.Model,
      ...datasets.Country
    ];
    const overviewBar = allBars.find(b => b.id.toLowerCase() === entityId.toLowerCase()) || datasets.Make[0];
    const total3G = overviewBar.threeG || 110;
    const total4G = overviewBar.fourG || 220;
    const total5G = overviewBar.fiveG || 310;

    return months.map((m, idx) => {
      // 5G share grows over the course of the year, while 3G gradually tapers
      const progress = (idx + 1) / 12; // 0.08 to 1.0
      const threeGMult = (1.3 - progress * 0.6) * m.weight;
      const fourGMult = (1.0 + (Math.sin(idx * 0.7) * 0.12)) * m.weight;
      const fiveGMult = (0.7 + progress * 0.7) * m.weight;

      const threeG = Math.max(4, Math.round((total3G / 12) * threeGMult));
      const fourG = Math.max(10, Math.round((total4G / 12) * fourGMult));
      const fiveG = Math.max(16, Math.round((total5G / 12) * fiveGMult));

      return {
        id: `m-${idx}-${m.short.toLowerCase()}`,
        monthShort: m.short,
        monthFull: m.full,
        threeG,
        fourG,
        fiveG
      };
    });
  };

  const currentBars = datasets[activeTab];
  const activeBar = hoveredBarId ? currentBars.find(b => b.id === hoveredBarId) : null;

  // In drilldown mode, get monthly points based on timeframe (6 months or 12 months)
  const allMonthlyPoints = selectedEntity ? getMonthlyDataForEntity(selectedEntity.id) : [];
  const activeMonthlyPoints = timePeriod === 'Last 6 months' 
    ? allMonthlyPoints.slice(6) // Jul - Dec 2024
    : allMonthlyPoints; // Full Jan - Dec 2024

  const activeMonthlyHovered = hoveredBarId 
    ? activeMonthlyPoints.find(p => p.id === hoveredBarId) 
    : null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleBarClick = (bar: StackedUsageBar) => {
    setSelectedEntity({
      id: bar.id,
      name: bar.name,
      type: activeTab,
      totalUsage: bar.threeG + bar.fourG + bar.fiveG
    });
    setHoveredBarId(null);
  };

  const handleBackToOverview = () => {
    setSelectedEntity(null);
    setHoveredBarId(null);
  };

  const layers = [
    { key: 'threeG', label: 'Data', color: '#1e3a8a' },
    { key: 'fourG', label: 'Voice', color: '#0d9488' },
    { key: 'fiveG', label: 'SMS', color: '#8b5cf6' }
  ] as const;

  // Scales for Normal vs Monthly Drilldown
  const maxYOverview = 1000;
  const yTicksOverview = [1000, 750, 500, 250, 0];

  const maxYDrilldown = 100;
  const yTicksDrilldown = [100, 75, 50, 25, 0];

  return (
    <div className="relative hidden flex flex-col justify-between rounded-xl border border-[#224375] bg-[#1a3156] p-5 text-slate-200 shadow-lg backdrop-blur-md h-full">
      {/* Header bar */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {selectedEntity ? (
              <button
                type="button"
                onClick={handleBackToOverview}
                className="flex items-center gap-1.5 rounded-lg border border-sky-400/50 bg-sky-500/20 px-2.5 py-1 text-xs font-bold text-sky-300 hover:bg-sky-500/30 hover:text-white transition-all shadow-xs cursor-pointer"
                title="Return to overall view"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>
            ) : null}

            <div>
              <h3 className="text-[15px] font-bold tracking-tight text-white flex items-center gap-2">
                Usage Trends
                {selectedEntity && (
                  <>
                    <span className="text-slate-400 font-normal">/</span>
                    <span className="text-sky-400">{selectedEntity.name}</span>
                  </>
                )}
              </h3>
            </div>
          </div>

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
          {/* If drilled down, show breadcrumb & category label; else show tabs */}
          {selectedEntity ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Dimension:</span>
              <span className="rounded bg-[#152744] px-2 py-0.5 font-semibold text-slate-300 border border-[#224375]">
                {selectedEntity.type}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono text-[11px]">
                Monthly Trend
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {(['Country','Make', 'Model'] as const).map((tab) => {
                const isSelected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setHoveredBarId(null);
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
          )}

          {/* Time Filter Dropdown: STRICTLY ONLY "Last 6 months" and "Last 1 year" */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
              className="flex items-center gap-1.5 rounded-md border border-[#224375] bg-[#152744] px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-[#203c68] hover:text-white shadow-xs transition-all cursor-pointer"
            >
              <span>{timePeriod}</span>
              <ChevronDown size={13} className={`text-slate-400 transition-transform ${isTimeDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
            </button>
            {isTimeDropdownOpen && (
              <div className="absolute right-0 top-8 z-30 w-36 rounded-lg border border-[#224375] bg-[#13233d] p-1 text-xs text-slate-200 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                {(['Last 6 months', 'Last 1 year'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setTimePeriod(period);
                      setIsTimeDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded px-2.5 py-1.5 hover:bg-[#1f3b66] hover:text-sky-300 transition-colors cursor-pointer"
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

      {/* CHART AREA: Either Monthly Drill-Down OR Aggregated Overview */}
      {selectedEntity ? (
        /* ================= DRILL-DOWN MONTHLY VIEW ================= */
        <div 
          className="relative mt-4 flex-1 min-h-[260px]"
          onMouseLeave={() => setHoveredBarId(null)}
        >
          <div className="relative h-64 w-full flex">
            {/* Y-Axis scale on left for monthly view (0 - 100 GB) */}
            <div className="w-14 flex flex-col justify-between text-right pr-2.5 text-[10.5px] font-mono text-slate-400 pb-7 pt-1 select-none">
              {yTicksDrilldown.map((tick) => (
                <span key={tick}>{tick} GB</span>
              ))}
            </div>

            {/* Plot Area */}
            <div className="relative flex-1 h-full pb-7 pt-1">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 pb-7 pt-1 flex flex-col justify-between pointer-events-none">
                {yTicksDrilldown.map((tick) => (
                  <div key={tick} className="border-b border-[#224375]/40 w-full" />
                ))}
              </div>

              {/* Shaded Monthly Target Band (30 - 60 GB/month) */}
              <div 
                className="absolute left-0 right-0 pointer-events-none border-y border-dashed border-sky-400/40 bg-sky-500/10"
                style={{
                  top: '40%',
                  height: '30%'
                }}
              >
                <div className="absolute right-2 top-0.5 text-[9px] font-mono font-medium text-sky-400 uppercase tracking-wider">
                  Target Band (30 - 60 GB/mo)
                </div>
              </div>

              {/* Monthly Bars Container */}
              <div className="relative h-full w-full flex items-end justify-between px-2">
                {activeMonthlyPoints.map((point, index) => {
                  const total = point.threeG + point.fourG + point.fiveG;
                  const totalHeightPercent = (total / maxYDrilldown) * 100;
                  const isHovered = hoveredBarId === point.id;

                  const threeGHeightPercent = (point.threeG / total) * 100;
                  const fourGHeightPercent = (point.fourG / total) * 100;
                  const fiveGHeightPercent = (point.fiveG / total) * 100;

                  return (
                    <div
                      key={point.id}
                      onMouseEnter={() => setHoveredBarId(point.id)}
                      className="relative h-full flex flex-col justify-end items-center cursor-pointer group"
                      style={{ 
                        width: timePeriod === 'Last 6 months' ? '14%' : '7.2%' 
                      }}
                    >
                      {/* The Stacked Bar Column */}
                      <div
                        className={`relative w-full ${timePeriod === 'Last 6 months' ? 'max-w-[42px]' : 'max-w-[28px]'} rounded-t-sm overflow-hidden flex flex-col-reverse shadow-md transition-all duration-200 ${
                          isHovered ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#1a3156] brightness-110' : 'opacity-95 hover:opacity-100'
                        }`}
                        style={{ height: `${Math.min(96, Math.max(12, totalHeightPercent))}%` }}
                      >
                        {/* Layer 1: 3G (Bottom) */}
                        <div
                          className="w-full bg-[#1e40af] flex items-center justify-center transition-all"
                          style={{ height: `${threeGHeightPercent}%`, minHeight: '4px' }}
                        >
                          {timePeriod === 'Last 6 months' && point.threeG >= 8 && (
                            <span className="text-[9px] font-bold text-white/90 font-mono select-none">
                              {point.threeG}
                            </span>
                          )}
                        </div>

                        {/* Layer 2: 4G/LTE (Middle) */}
                        <div
                          className="w-full bg-[#0d9488] flex items-center justify-center transition-all border-t border-teal-300/20"
                          style={{ height: `${fourGHeightPercent}%`, minHeight: '6px' }}
                        >
                          {timePeriod === 'Last 6 months' && point.fourG >= 14 && (
                            <span className="text-[9px] font-bold text-white/95 font-mono select-none">
                              {point.fourG}
                            </span>
                          )}
                        </div>

                        {/* Layer 3: 5G (Top) */}
                        <div
                          className="w-full bg-[#8b5cf6] flex items-center justify-center transition-all border-t border-purple-300/20"
                          style={{ height: `${fiveGHeightPercent}%`, minHeight: '8px' }}
                        >
                          {timePeriod === 'Last 6 months' && point.fiveG >= 16 && (
                            <span className="text-[9px] font-bold text-white font-mono select-none">
                              {point.fiveG}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* X-axis Month Label below bar */}
                      <div className={`absolute -bottom-6 text-center text-[10.5px] truncate w-14 transition-colors font-mono select-none ${
                        isHovered ? 'font-bold text-sky-300' : 'font-medium text-slate-300'
                      }`}>
                        {point.monthShort}
                      </div>

                      {/* Tooltip Card floating above active monthly bar - VISIBLE ONLY ON HOVER */}
                      {isHovered && activeMonthlyHovered && (
                        <div 
                          className="pointer-events-none absolute z-30 w-48 rounded-lg border border-[#2e5699] bg-[#0f1d33]/98 p-3 shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95"
                          style={{
                            left: index <= (timePeriod === 'Last 6 months' ? 0 : 1) ? '-6px' : index >= (activeMonthlyPoints.length - (timePeriod === 'Last 6 months' ? 1 : 2)) ? 'auto' : '50%',
                            right: index >= (activeMonthlyPoints.length - (timePeriod === 'Last 6 months' ? 1 : 2)) ? '-6px' : 'auto',
                            transform: (index <= (timePeriod === 'Last 6 months' ? 0 : 1) || index >= (activeMonthlyPoints.length - (timePeriod === 'Last 6 months' ? 1 : 2))) ? 'none' : 'translateX(-50%)',
                            ...(totalHeightPercent < 42
                              ? { bottom: `calc(${Math.min(96, Math.max(12, totalHeightPercent))}% + 8px)` }
                              : { top: '8px' })
                          }}
                        >
                          <div className="text-[11px] font-semibold text-slate-300 border-b border-[#224375] pb-1.5 mb-2 flex items-center justify-between">
                            <span className="text-white font-bold">{selectedEntity.name}</span>
                            <span className="text-[10px] text-sky-400 font-mono">{activeMonthlyHovered.monthFull}</span>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-xs bg-[#1e40af]" />
                                <span className="text-slate-300">Data</span>
                              </div>
                              <span className="font-bold text-white font-mono">{activeMonthlyHovered.threeG} GB</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-xs bg-[#0d9488]" />
                                <span className="text-slate-300">Voice</span>
                              </div>
                              <span className="font-bold text-white font-mono">{activeMonthlyHovered.fourG} GB</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-xs bg-[#8b5cf6]" />
                                <span className="text-slate-300">SMS</span>
                              </div>
                              <span className="font-bold text-white font-mono">{activeMonthlyHovered.fiveG} GB</span>
                            </div>
                            <div className="mt-1 pt-1.5 border-t border-[#224375] flex items-center justify-between font-semibold text-slate-200">
                              <span>Month Total</span>
                              <span className="font-mono text-sky-400 font-bold">{total} GB</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= OVERVIEW VIEW (NORMAL STATE) ================= */
        <div 
          className="relative mt-4 flex-1 min-h-[260px]"
          onMouseLeave={() => setHoveredBarId(null)}
        >
          <div className="relative h-64 w-full flex">
            {/* Y-Axis scale on left */}
            <div className="w-16 flex flex-col justify-between text-right pr-3 text-[11px] font-mono text-slate-400 pb-7 pt-1 select-none">
              {yTicksOverview.map((tick) => (
                <span key={tick}>{tick} GB</span>
              ))}
            </div>

            {/* Chart Plot Area */}
            <div className="relative flex-1 h-full pb-7 pt-1">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 pb-7 pt-1 flex flex-col justify-between pointer-events-none">
                {yTicksOverview.map((tick) => (
                  <div key={tick} className="border-b border-[#224375]/40 w-full" />
                ))}
              </div>

              {/* Shaded Fair-Use Target Band between 250 GB and 500 GB styled for theme */}
              <div 
                className="absolute left-0 right-0 pointer-events-none border-y border-dashed border-sky-400/40 bg-sky-500/10"
                style={{
                  top: '50%',
                  height: '25%'
                }}
              >
                {/* <div className="absolute right-2 top-0.5 text-[9px] font-mono font-medium text-sky-400 uppercase tracking-wider">
                  Fair-Use Target Threshold (250 - 500 GB)
                </div> */}
              </div>

              {/* Bars Container */}
              <div className="relative h-full w-full flex items-end justify-around px-4">
                {currentBars.map((bar, index) => {
                  const total = bar.threeG + bar.fourG + bar.fiveG;
                  const totalHeightPercent = (total / maxYOverview) * 100;
                  const isHovered = hoveredBarId === bar.id;

                  const threeGHeightPercent = (bar.threeG / total) * 100;
                  const fourGHeightPercent = (bar.fourG / total) * 100;
                  const fiveGHeightPercent = (bar.fiveG / total) * 100;

                  return (
                    <div
                      key={bar.id}
                      onMouseEnter={() => setHoveredBarId(bar.id)}
                      onClick={() => handleBarClick(bar)}
                      className="relative h-full flex flex-col justify-end items-center cursor-pointer group"
                      style={{ width: '15%' }}
                    >
                      {/* The Stacked Bar Column */}
                      <div
                        className={`relative w-full max-w-[56px] rounded-t-sm overflow-hidden flex flex-col-reverse shadow-md transition-all duration-200 ${
                          isHovered ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#1a3156] scale-y-[1.01]' : 'opacity-90 hover:opacity-100'
                        }`}
                        style={{ height: `${totalHeightPercent}%` }}
                      >
                        {/* Layer 1: 3G (Bottom) */}
                        <div
                          className="w-full bg-[#1e40af] flex items-center justify-center transition-all"
                          style={{ height: `${threeGHeightPercent}%`, minHeight: '6px' }}
                        >
                          {bar.threeG >= 60 && (
                            <span className="text-[10px] font-bold text-white/90 font-mono select-none">
                              {bar.threeG}
                            </span>
                          )}
                        </div>

                        {/* Layer 2: 4G/LTE (Middle) */}
                        <div
                          className="w-full bg-[#0d9488] flex items-center justify-center transition-all border-t border-teal-300/20"
                          style={{ height: `${fourGHeightPercent}%`, minHeight: '8px' }}
                        >
                          {bar.fourG >= 100 && (
                            <span className="text-[10px] font-bold text-white/95 font-mono select-none">
                              {bar.fourG}
                            </span>
                          )}
                        </div>

                        {/* Layer 3: 5G (Top) */}
                        <div
                          className="w-full bg-[#8b5cf6] flex items-center justify-center transition-all border-t border-purple-300/20"
                          style={{ height: `${fiveGHeightPercent}%`, minHeight: '10px' }}
                        >
                          {bar.fiveG >= 100 && (
                            <span className="text-[10px] font-bold text-white font-mono select-none">
                              {bar.fiveG}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* X-axis Label below bar */}
                      <div className={`absolute -bottom-6 text-center text-[11px] truncate w-20 transition-colors select-none ${
                        isHovered ? 'font-bold text-sky-300' : 'font-medium text-slate-300'
                      }`}>
                        {bar.name}
                      </div>

                      {/* Tooltip Card floating above active bar - VISIBLE ONLY ON HOVER */}
                      {isHovered && activeBar && (
                        <div 
                          className="pointer-events-none absolute z-30 w-48 rounded-lg border border-[#2e5699] bg-[#0f1d33]/98 p-3 shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95"
                          style={{
                            left: index === 0 ? '-6px' : index === (currentBars.length - 1) ? 'auto' : '50%',
                            right: index === (currentBars.length - 1) ? '-6px' : 'auto',
                            transform: (index === 0 || index === (currentBars.length - 1)) ? 'none' : 'translateX(-50%)',
                            ...(totalHeightPercent < 42
                              ? { bottom: `calc(${totalHeightPercent}% + 8px)` }
                              : { top: '8px' })
                          }}
                        >
                          <div className="text-[11px] font-semibold text-slate-300 border-b border-[#224375] pb-1.5 mb-2 flex items-center justify-between">
                            <span className="text-white font-bold">{activeBar.name}</span>
                            <span className="text-[10px] text-slate-400">{activeBar.dateRange}</span>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-xs bg-[#1e40af]" />
                                <span className="text-slate-300">Data</span>
                              </div>
                              <span className="font-bold text-white font-mono">{activeBar.threeG} GB</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-xs bg-[#0d9488]" />
                                <span className="text-slate-300">Voice</span>
                              </div>
                              <span className="font-bold text-white font-mono">{activeBar.fourG} GB</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-xs bg-[#8b5cf6]" />
                                <span className="text-slate-300">SMS</span>
                              </div>
                              <span className="font-bold text-white font-mono">{activeBar.fiveG} GB</span>
                            </div>
                            <div className="mt-1 pt-1.5 border-t border-[#224375] flex items-center justify-between font-semibold text-slate-200">
                              <span>Total</span>
                              <span className="font-mono text-sky-400 font-bold">{activeBar.threeG + activeBar.fourG + activeBar.fiveG} GB</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-1 border-t border-[#224375]/80 text-[10px] text-sky-300 flex items-center gap-1 font-medium">
                            <BarChart3 size={11} />
                            <span>Click bar to drill down monthly</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Network Generations Legend + Summary */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#224375]/60 text-xs">
        <div className="flex items-center gap-6">
          {layers.map((layer) => (
            <div key={layer.key} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs" style={{ backgroundColor: layer.color }} />
              <span className="text-slate-300 font-medium">{layer.label}</span>
            </div>
          ))}
        </div>

        {selectedEntity ? (
          <div className="text-[11px] text-slate-400">
            Showing monthly breakdown for <span className="text-white font-semibold">{selectedEntity.name}</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Click any bar to drill down into monthly data
          </div>
        )}
      </div>
    </div>
  );
};

