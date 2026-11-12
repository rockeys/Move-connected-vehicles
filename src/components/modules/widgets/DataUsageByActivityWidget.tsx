import React, { useState } from 'react';
import { 
  RotateCcw, 
  MoreVertical, 
  ChevronDown, 
  Download, 
  FileSpreadsheet, 
  Check 
} from 'lucide-react';

export interface ActivityUsage {
  id: string;
  name: string;
  dateRange: string;
  video: number; // in MB
  socialMedia: number; // in MB
  music: number; // in MB
  browsing: number; // in MB
}

export const DataUsageByActivityWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Country' | 'Make' | 'Model'>('Country');
  const [timePeriod, setTimePeriod] = useState<string>('Last 6 months');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Tooltip only visible on hover: initialized to null
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);

  const datasets: Record<string, ActivityUsage[]> = {
    Country: [
      {
        id: 'usa',
        name: 'USA',
        dateRange: 'Jan 2025 - June 2025',
        video: 820,
        socialMedia: 845,
        music: 790,
        browsing: 835
      },
      {
        id: 'UK',
        name: 'UK',
        dateRange: 'Jan 2025 - June 2025',
        video: 960,
        socialMedia: 980,
        music: 920,
        browsing: 990
      },
      {
        id: 'Italy',
        name: 'Italy',
        dateRange: 'Jan 2025 - June 2025',
        video: 353,
        socialMedia: 532,
        music: 150,
        browsing: 483
      },
      {
        id: 'France',
        name: 'France',
        dateRange: 'Jan 2025 - June 2025',
        video: 430,
        socialMedia: 510,
        music: 560,
        browsing: 490
      },
      {
        id: 'Germany',
        name: 'Germany',
        dateRange: 'Jan 2025 - June 2025',
        video: 610,
        socialMedia: 580,
        music: 490,
        browsing: 530
      }
    ],
    Make: [
      {
        id: 'rangerover',
        name: 'Range Rover',
        dateRange: 'Jan 2025 - June 2025',
        video: 790,
        socialMedia: 820,
        music: 740,
        browsing: 810
      },
      {
        id: 'defender',
        name: 'Defender',
        dateRange: 'Jan 2025 - June 2025',
        video: 480,
        socialMedia: 520,
        music: 390,
        browsing: 560
      },
      {
        id: 'velar',
        name: 'Velar',
        dateRange: 'Jan 2025 - June 2025',
        video: 640,
        socialMedia: 670,
        music: 590,
        browsing: 650
      },
      {
        id: 'discovery',
        name: 'Discovery',
        dateRange: 'Jan 2025 - June 2025',
        video: 510,
        socialMedia: 580,
        music: 460,
        browsing: 520
      },
      {
        id: 'jaguar',
        name: 'Jaguar',
        dateRange: 'Jan 2025 - June 2025',
        video: 710,
        socialMedia: 750,
        music: 680,
        browsing: 720
      }
    ],
    Model: [
      {
        id: 'autobiography',
        name: 'Autobiography',
        dateRange: 'Jan 2025 - June 2025',
        video: 890,
        socialMedia: 910,
        music: 840,
        browsing: 900
      },
      {
        id: 'dynamic_se',
        name: 'Dynamic SE',
        dateRange: 'Jan 2025 - June 2025',
        video: 650,
        socialMedia: 680,
        music: 540,
        browsing: 620
      },
      {
        id: 'sv_bespoke',
        name: 'SV Bespoke',
        dateRange: 'Jan 2025 - June 2025',
        video: 950,
        socialMedia: 970,
        music: 910,
        browsing: 960
      },
      {
        id: 'first_edition',
        name: 'First Edition',
        dateRange: 'Jan 2025 - June 2025',
        video: 720,
        socialMedia: 760,
        music: 640,
        browsing: 730
      },
      {
        id: 'standard',
        name: 'Standard',
        dateRange: 'Jan 2025 - June 2025',
        video: 420,
        socialMedia: 490,
        music: 380,
        browsing: 450
      }
    ]
  };

  const currentList = datasets[activeTab];
  const activeEntity = hoveredEntityId ? currentList.find(e => e.id === hoveredEntityId) : null;
  const activeIndex = hoveredEntityId ? currentList.findIndex(e => e.id === hoveredEntityId) : -1;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const activities = [
    { key: 'video', label: 'Video streaming', shortLabel: 'Video', color: '#2563eb' },
    { key: 'socialMedia', label: 'Social Media', shortLabel: 'Social Media', color: '#06b6d4' },
    { key: 'music', label: 'Music streaming', shortLabel: 'Music', color: '#8b5cf6' },
    { key: 'browsing', label: 'Web browsing', shortLabel: 'Browsing', color: '#db2777' }
  ] as const;

  const maxScaleMB = 1000;
  const xTicks = [0, 250, 500, 750, 1000];

  return (
    <div className="relative flex flex-col justify-between rounded-xl border border-[#224375] bg-[#1a3156] p-5 text-slate-200 shadow-lg backdrop-blur-md h-full">
      {/* Header bar */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold tracking-tight text-white flex items-center gap-2">
            Data usage by activity
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
                    setHoveredEntityId(null);
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
                {['Last 6 months', 'Last 1 year'].map((period) => (
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

      {/* Horizontal Grouped Bar Chart Area with Hover Tooltip */}
      <div 
        className="relative mt-3 flex-1"
        onMouseLeave={() => setHoveredEntityId(null)}
      >
        {/* Subtle Vertical Gridlines */}
        <div className="absolute inset-y-0 left-16 right-4 pointer-events-none flex justify-between">
          {xTicks.map((tick) => (
            <div key={tick} className="h-full border-r border-[#224375]/40 last:border-r-0" />
          ))}
        </div>

        {/* Entities and Bar Rows */}
        <div className="relative space-y-3.5 pr-4">
          {currentList.map((item) => {
            const isHovered = hoveredEntityId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredEntityId(item.id)}
                className={`group flex items-center gap-3 rounded-lg py-1 px-1 transition-all cursor-pointer ${
                  isHovered ? 'bg-[#152744]/90 ring-1 ring-sky-500/40' : 'hover:bg-[#152744]/40'
                }`}
              >
                {/* Y-axis Label */}
                <div className={`w-14 text-right text-xs font-medium truncate transition-colors ${
                  isHovered ? 'text-white font-bold' : 'text-slate-300'
                }`}>
                  {item.name}
                </div>

                {/* 4 Grouped Horizontal Bars */}
                <div className="flex-1 space-y-1">
                  {activities.map((act) => {
                    const val = item[act.key];
                    const widthPercent = (val / maxScaleMB) * 100;
                    return (
                      <div key={act.key} className="h-1.5 w-full bg-[#13233d] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.max(2, widthPercent))}%`,
                            backgroundColor: act.color,
                            opacity: isHovered ? 1 : 0.82
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Tooltip Card matching theme - VISIBLE ONLY ON HOVER */}
        {activeEntity && (
          <div 
            className="pointer-events-none absolute z-30 w-48 rounded-lg border border-[#2e5699] bg-[#0f1d33]/98 p-3 shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95"
            style={{
              top: `${Math.min(140, Math.max(10, activeIndex * 36))}px`,
              left: '52%',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="flex items-center justify-between border-b border-[#224375] pb-1.5 mb-2">
              <span className="text-xs font-bold text-white">{activeEntity.name}</span>
              <span className="text-[10px] font-medium text-slate-400">{activeEntity.dateRange}</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-xs bg-[#2563eb]" />
                  <span className="text-slate-300">Video</span>
                </div>
                <span className="font-bold text-white font-mono">{activeEntity.video} MB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-xs bg-[#06b6d4]" />
                  <span className="text-slate-300">Social Media</span>
                </div>
                <span className="font-bold text-white font-mono">{activeEntity.socialMedia} MB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-xs bg-[#8b5cf6]" />
                  <span className="text-slate-300">Music</span>
                </div>
                <span className="font-bold text-white font-mono">{activeEntity.music} MB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-xs bg-[#db2777]" />
                  <span className="text-slate-300">Browsing</span>
                </div>
                <span className="font-bold text-white font-mono">{activeEntity.browsing} MB</span>
              </div>
            </div>
          </div>
        )}

        {/* X-Axis Scale Labels */}
        <div className="mt-3 flex items-center justify-between pl-16 pr-4 pt-1.5 border-t border-[#224375]/60 text-[11px] text-slate-400 font-mono">
          {xTicks.map((tick) => (
            <span key={tick}>{tick} MB</span>
          ))}
        </div>
      </div>

      {/* Bottom Activities Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-[#224375]/60 text-xs">
        {activities.map((act) => (
          <div key={act.key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs" style={{ backgroundColor: act.color }} />
            <span className="text-slate-300 font-medium">{act.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
