import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Car, 
  Layers, 
  Cpu, 
  TrendingUp, 
  RotateCcw, 
  RotateCw, 
  MoreVertical, 
  ChevronDown,
  HardDrive,
  MessageSquare,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type UsageCategoryTab = 'data' | 'sms' | 'voice';

export interface TelematicsDeviceData {
  id: string;
  name: string;
  shortName: string;
  type: string;
  data: number;  // Single total GB
  sms: number;   // Single total K SMS
  voice: number; // Single total Hours
}

export interface TelematicsVehicleModel {
  name: string;
  shortName: string;
  make: 'Land Rover' | 'Jaguar';
  devices: TelematicsDeviceData[];
}

export const TELEMATICS_REGISTRY: TelematicsVehicleModel[] = [
  {
    name: 'Range Rover',
    shortName: 'Range Rover',
    make: 'Land Rover',
    devices: [
      {
        id: 'rr-tcu',
        name: 'Primary Powertrain & eCall TCU',
        shortName: 'Primary TCU',
        type: 'Primary TCU (5G SA)',
        data: 110,
        sms: 120,
        voice: 60
      },
      {
        id: 'rr-ihu',
        name: 'InControl & Pivi Pro Infotainment IHU',
        shortName: 'Pivi Pro IHU',
        type: 'Infotainment IHU (Pivi Pro)',
        data: 345,
        sms: 30,
        voice: 95
      },
      {
        id: 'rr-vcu',
        name: 'VCU & BMS High-Voltage Gateway',
        shortName: 'VCU & BMS',
        type: 'VCU & BMS Gateway',
        data: 60,
        sms: 90,
        voice: 8
      }
    ]
  },
  {
    name: 'Defender',
    shortName: 'Defender',
    make: 'Land Rover',
    devices: [
      {
        id: 'def-tcu',
        name: 'Tactical Dual-SIM Powertrain TCU',
        shortName: 'Dual-SIM TCU',
        type: 'Primary TCU (5G SA)',
        data: 100,
        sms: 105,
        voice: 60
      },
      {
        id: 'def-ihu',
        name: 'Pivi Pro Expedition Infotainment IHU',
        shortName: 'Expedition IHU',
        type: 'Infotainment IHU (Pivi Pro)',
        data: 220,
        sms: 20,
        voice: 65
      },
      {
        id: 'def-vcu',
        name: 'VCU Terrain Response & Diagnostics',
        shortName: 'Terrain VCU',
        type: 'VCU & BMS Gateway',
        data: 48,
        sms: 80,
        voice: 5
      },
      {
        id: 'def-sigfox',
        name: 'Sigfox LPWAN Asset & Stolen Vehicle Tracker',
        shortName: 'Sigfox Tracker',
        type: 'Sigfox LPWAN Tracker',
        data: 12,
        sms: 45,
        voice: 0
      }
    ]
  },
  {
    name: 'Velar',
    shortName: 'Velar',
    make: 'Land Rover',
    devices: [
      {
        id: 'vel-tcu',
        name: 'Range Rover Velar Connected TCU',
        shortName: 'Velar TCU',
        type: 'Primary TCU (5G SA)',
        data: 85,
        sms: 80,
        voice: 45
      },
      {
        id: 'vel-ihu',
        name: 'Pivi Pro Dual-Touchscreen Media IHU',
        shortName: 'Pivi Core IHU',
        type: 'Infotainment IHU (Pivi Pro)',
        data: 160,
        sms: 15,
        voice: 55
      },
      {
        id: 'vel-vcu',
        name: 'Hybrid & EV Energy Management VCU',
        shortName: 'EV VCU',
        type: 'VCU & BMS Gateway',
        data: 40,
        sms: 65,
        voice: 5
      }
    ]
  },
  {
    name: 'Discovery',
    shortName: 'Discovery',
    make: 'Land Rover',
    devices: [
      {
        id: 'dsc-tcu',
        name: 'Discovery Powertrain & Remote eCall TCU',
        shortName: 'Discovery TCU',
        type: 'Primary TCU (5G SA)',
        data: 120,
        sms: 130,
        voice: 70
      },
      {
        id: 'dsc-ihu',
        name: 'Rear Seat & Cabin Pivi Infotainment IHU',
        shortName: 'Media IHU',
        type: 'Infotainment IHU (Pivi Pro)',
        data: 380,
        sms: 25,
        voice: 110
      },
      {
        id: 'dsc-vcu',
        name: 'All-Terrain Control & Telematics Gateway',
        shortName: 'Gateway VCU',
        type: 'VCU & BMS Gateway',
        data: 55,
        sms: 95,
        voice: 8
      },
      {
        id: 'dsc-sigfox',
        name: 'Sub-GHz Backup Beacon & Tracker',
        shortName: 'Sigfox Tag',
        type: 'Sigfox LPWAN Tracker',
        data: 15,
        sms: 50,
        voice: 0
      }
    ]
  },
  {
    name: 'Jaguar F-PACE',
    shortName: 'F-PACE',
    make: 'Jaguar',
    devices: [
      {
        id: 'fpace-tcu',
        name: 'Jaguar High-Band Dynamic TCU',
        shortName: 'Jaguar TCU',
        type: 'Primary TCU (5G SA)',
        data: 90,
        sms: 95,
        voice: 55
      },
      {
        id: 'fpace-ihu',
        name: 'Jaguar Pivi Infotainment Core',
        shortName: 'Media IHU',
        type: 'Infotainment IHU (Pivi Pro)',
        data: 190,
        sms: 20,
        voice: 60
      },
      {
        id: 'fpace-vcu',
        name: 'Performance Dynamics & Emissions VCU',
        shortName: 'Dynamics VCU',
        type: 'VCU & BMS Gateway',
        data: 35,
        sms: 55,
        voice: 5
      }
    ]
  },
  {
    name: 'Jaguar I-PACE',
    shortName: 'I-PACE',
    make: 'Jaguar',
    devices: [
      {
        id: 'ipace-tcu',
        name: 'I-PACE EV Connected Telematics TCU',
        shortName: 'EV TCU',
        type: 'Primary TCU (5G SA)',
        data: 95,
        sms: 105,
        voice: 50
      },
      {
        id: 'ipace-ihu',
        name: 'InControl EV Cloud Infotainment IHU',
        shortName: 'EV IHU',
        type: 'Infotainment IHU (Pivi Pro)',
        data: 220,
        sms: 25,
        voice: 68
      },
      {
        id: 'ipace-vcu',
        name: 'High-Voltage Battery & Inverter BMS',
        shortName: 'Battery BMS',
        type: 'VCU & BMS Gateway',
        data: 85,
        sms: 105,
        voice: 8
      }
    ]
  },
  {
    name: 'Jaguar XF',
    shortName: 'Jaguar XF',
    make: 'Jaguar',
    devices: [
      {
        id: 'xf-tcu',
        name: 'Jaguar Executive Powertrain TCU',
        shortName: 'Executive TCU',
        type: 'Primary TCU (5G SA)',
        data: 80,
        sms: 85,
        voice: 45
      },
      {
        id: 'xf-ihu',
        name: 'Touch Pro Duo Executive Infotainment IHU',
        shortName: 'Touch Pro IHU',
        type: 'Infotainment IHU (Pivi Pro)',
        data: 150,
        sms: 18,
        voice: 55
      },
      {
        id: 'xf-vcu',
        name: 'Chassis & Powertrain Diagnostics VCU',
        shortName: 'Diagnostics VCU',
        type: 'VCU & BMS Gateway',
        data: 32,
        sms: 52,
        voice: 4
      }
    ]
  }
];

export const TAB_SPECS = {
  data: {
    key: 'data' as UsageCategoryTab,
    title: 'Data Usage',
    icon: HardDrive,
    unit: 'GB',
    color: '#2563eb',       // Single solid primary bar color: Data Blue
    colorLight: '#60a5fa',  // Top cap highlight
    glowColor: 'rgba(37, 99, 235, 0.18)',
    description: 'Total Cellular 5G/4G Broadband & Telematics Data Traffic',
    bandLabel: 'FAIR-USE TARGET THRESHOLD (250 - 500 GB)',
    bandMin: 250,
    bandMax: 500,
  },
  sms: {
    key: 'sms' as UsageCategoryTab,
    title: 'SMS Usage',
    icon: MessageSquare,
    unit: 'K SMS',
    color: '#9333ea',       // Single solid primary bar color: SMS Purple
    colorLight: '#c084fc',  // Top cap highlight
    glowColor: 'rgba(147, 51, 234, 0.18)',
    description: 'Total Binary OTA & Diagnostic SMS Message Traffic',
    bandLabel: 'CARRIER MONTHLY QUOTA THRESHOLD (150 - 300 K SMS)',
    bandMin: 150,
    bandMax: 300,
  },
  voice: {
    key: 'voice' as UsageCategoryTab,
    title: 'Voice Usage',
    icon: PhoneCall,
    unit: 'Hours',
    color: '#0d9488',       // Single solid primary bar color: Voice Teal
    colorLight: '#2dd4bf',  // Top cap highlight
    glowColor: 'rgba(13, 148, 136, 0.18)',
    description: 'Total Emergency eCall & Roadside VoLTE Voice Airtime',
    bandLabel: 'MONTHLY EMERGENCY VOICE BAND (40 - 100 Hours)',
    bandMin: 40,
    bandMax: 100,
  }
};

interface TelematicsUsageAnalyticsProps {
  countryName?: string;
}

export const TelematicsUsageAnalytics: React.FC<TelematicsUsageAnalyticsProps> = ({ countryName = 'Fleet' }) => {
  const { showToast } = useApp();

  // State: Active tab & Interdependent Filters
  const [activeUsageTab, setActiveUsageTab] = useState<UsageCategoryTab>('data');
  const [selectedMakeFilter, setSelectedMakeFilter] = useState<string>('All Makes');
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('All Models');
  const [selectedDeviceTypeFilter, setSelectedDeviceTypeFilter] = useState<string>('All Device Types');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<string>('Last 1 year');

  // Tooltip Popup state with bulletproof placement
  interface HoveredItemState {
    id: string;
    title: string;
    subtitle?: string;
    value: number;
    unit: string;
    color: string;
    placement: 'top' | 'right' | 'left';
    leftPct: number;
    topPct: number;
    arrowLeftPct?: number;
    arrowTopPct?: number;
    isPinned?: boolean;
  }

  const [hoveredItem, setHoveredItem] = useState<HoveredItemState | null>(null);

  // 1. Available Makes
  const availableMakes = useMemo(() => ['All Makes', 'Land Rover', 'Jaguar'], []);

  // 2. Available Models (Interdependently filtered by Make)
  const availableModels = useMemo(() => {
    if (selectedMakeFilter === 'All Makes') {
      return ['All Models', ...TELEMATICS_REGISTRY.map(m => m.name)];
    }
    return ['All Models', ...TELEMATICS_REGISTRY.filter(m => m.make === selectedMakeFilter).map(m => m.name)];
  }, [selectedMakeFilter]);

  // 3. Available Device Types (Interdependently filtered by Make & Model)
  const availableDeviceTypes = useMemo(() => {
    let scanList = TELEMATICS_REGISTRY;
    if (selectedMakeFilter !== 'All Makes') {
      scanList = scanList.filter(m => m.make === selectedMakeFilter);
    }
    if (selectedModelFilter !== 'All Models') {
      scanList = scanList.filter(m => m.name === selectedModelFilter);
    }
    const typesSet = new Set<string>();
    scanList.forEach(m => m.devices.forEach(d => typesSet.add(d.type)));
    return ['All Device Types', ...Array.from(typesSet)];
  }, [selectedMakeFilter, selectedModelFilter]);

  // Interdependent filter change handlers
  const handleMakeChange = (newMake: string) => {
    setSelectedMakeFilter(newMake);
    setHoveredItem(null);
    if (newMake !== 'All Makes') {
      const valid = TELEMATICS_REGISTRY.filter(m => m.make === newMake).map(m => m.name);
      if (selectedModelFilter !== 'All Models' && !valid.includes(selectedModelFilter)) {
        setSelectedModelFilter('All Models');
      }
    }
  };

  const handleModelChange = (newModel: string) => {
    setSelectedModelFilter(newModel);
    setHoveredItem(null);
    if (newModel !== 'All Models') {
      const matched = TELEMATICS_REGISTRY.find(m => m.name === newModel);
      if (matched && selectedMakeFilter !== 'All Makes' && matched.make !== selectedMakeFilter) {
        setSelectedMakeFilter(matched.make);
      }
      if (matched && selectedDeviceTypeFilter !== 'All Device Types') {
        const deviceTypes = matched.devices.map(d => d.type);
        if (!deviceTypes.includes(selectedDeviceTypeFilter)) {
          setSelectedDeviceTypeFilter('All Device Types');
        }
      }
    }
  };

  const handleDeviceTypeChange = (newDevType: string) => {
    setSelectedDeviceTypeFilter(newDevType);
    setHoveredItem(null);
  };

  const tabConfig = TAB_SPECS[activeUsageTab];

  // Compute dynamic chart bar data based on selected filters and active usage category
  interface ComputedBar {
    id: string;
    name: string;
    shortName: string;
    subtitle?: string;
    total: number;
  }

  const chartItems: ComputedBar[] = useMemo(() => {
    if (selectedModelFilter === 'All Models') {
      // Level 1: Bars are Models
      let modelsList = TELEMATICS_REGISTRY;
      if (selectedMakeFilter !== 'All Makes') {
        modelsList = modelsList.filter(m => m.make === selectedMakeFilter);
      }

      return modelsList.map(m => {
        let devList = m.devices;
        if (selectedDeviceTypeFilter !== 'All Device Types') {
          devList = devList.filter(d => d.type === selectedDeviceTypeFilter);
        }

        const total = devList.reduce((acc, d) => acc + (d[activeUsageTab] || 0), 0);

        return {
          id: `model-${m.name}`,
          name: m.name,
          shortName: m.shortName,
          subtitle: `${devList.length} device${devList.length === 1 ? '' : 's'}`,
          total
        };
      });
    } else {
      // Level 2: Specific Model is selected
      const targetModel = TELEMATICS_REGISTRY.find(m => m.name === selectedModelFilter) || TELEMATICS_REGISTRY[0];

      if (selectedDeviceTypeFilter === 'All Device Types') {
        // Bars are Devices of this Model
        return targetModel.devices.map(d => {
          return {
            id: `dev-${d.id}`,
            name: d.name,
            shortName: d.shortName,
            subtitle: d.type,
            total: d[activeUsageTab] || 0
          };
        });
      } else {
        // Level 3: Specific Model + Specific Device Type -> Show Operating Quarters
        const targetDev = targetModel.devices.find(d => d.type === selectedDeviceTypeFilter) || targetModel.devices[0];
        const val = targetDev[activeUsageTab] || 0;

        return [
          {
            id: 'q1',
            name: 'Q1 Baseline Telemetry',
            shortName: 'Q1 Baseline',
            subtitle: 'Winter Period',
            total: Math.round(val * 0.22)
          },
          {
            id: 'q2',
            name: 'Q2 Spring Diagnostics',
            shortName: 'Q2 Spring',
            subtitle: 'Active Fleet',
            total: Math.round(val * 0.26)
          },
          {
            id: 'q3',
            name: 'Q3 Summer Peak Traffic',
            shortName: 'Q3 Peak',
            subtitle: 'High Load',
            total: Math.round(val * 0.30)
          },
          {
            id: 'q4',
            name: 'Q4 Autumn Waves',
            shortName: 'Q4 Autumn',
            subtitle: 'Firmware Period',
            total: Math.round(val * 0.22)
          }
        ];
      }
    }
  }, [selectedMakeFilter, selectedModelFilter, selectedDeviceTypeFilter, activeUsageTab]);

  // Coordinate mapping with generous top headroom
  const rawMax = Math.max(...chartItems.map(it => it.total), tabConfig.bandMax * 1.15, 60);
  const maxScale = rawMax <= 150
    ? Math.ceil(rawMax / 25) * 25
    : rawMax <= 500
    ? Math.ceil(rawMax / 100) * 100
    : Math.ceil(rawMax / 250) * 250;

  const y0 = 330; // baseline
  const yTop = 70; // top gridline with 70px generous top headroom inside 400px viewBox
  const plotHeight = y0 - yTop; // 260px
  const pxPerUnit = plotHeight / maxScale;

  const itemWidth = chartItems.length <= 2 ? 110 : chartItems.length <= 4 ? 85 : 68;
  const xStart = 100;
  const xEnd = 910;
  const availableWidth = xEnd - xStart;
  const step = availableWidth / Math.max(1, chartItems.length);

  // Band coordinates
  const bandMin = Math.min(tabConfig.bandMin, maxScale * 0.4);
  const bandMax = Math.min(tabConfig.bandMax, maxScale * 0.85);
  const yBandTop = y0 - (bandMax * pxPerUnit);
  const yBandBottom = y0 - (bandMin * pxPerUnit);
  const bandHeight = Math.max(20, yBandBottom - yBandTop);

  // Bulletproof tooltip placement calculation that NEVER clips and NEVER covers the target bar
  const calculatePlacement = (xCenter: number, barTopY: number, barWidth: number) => {
    const cardW = 260; // Card width in SVG coordinate scale
    const cardH = 150; // Card height in SVG coordinate scale

    // Case 1: Lower/medium bar with enough headroom above it (barTopY >= 170)
    if (barTopY >= 170) {
      const cardX = Math.max(85, Math.min(670, xCenter - cardW / 2));
      const cardY = barTopY - cardH - 12; // 12px gap above the bar
      const arrowX = xCenter - cardX;
      const arrowLeftPct = Math.max(12, Math.min(88, (arrowX / cardW) * 100));

      return {
        placement: 'top' as const,
        leftPct: (cardX / 950) * 100,
        topPct: (cardY / 400) * 100,
        arrowLeftPct,
        arrowTopPct: undefined
      };
    } 
    // Case 2: Tall bar on left half of chart -> Place to the RIGHT of the bar
    else if (xCenter < 500) {
      const cardX = xCenter + barWidth / 2 + 14;
      const cardY = Math.max(20, Math.min(330 - cardH, barTopY));
      const arrowY = Math.max(20, Math.min(cardH - 20, (barTopY + 25) - cardY));
      const arrowTopPct = Math.max(15, Math.min(85, (arrowY / cardH) * 100));

      return {
        placement: 'right' as const,
        leftPct: (cardX / 950) * 100,
        topPct: (cardY / 400) * 100,
        arrowLeftPct: undefined,
        arrowTopPct
      };
    } 
    // Case 3: Tall bar on right half of chart -> Place to the LEFT of the bar
    else {
      const cardX = xCenter - barWidth / 2 - cardW - 14;
      const cardY = Math.max(20, Math.min(330 - cardH, barTopY));
      const arrowY = Math.max(20, Math.min(cardH - 20, (barTopY + 25) - cardY));
      const arrowTopPct = Math.max(15, Math.min(85, (arrowY / cardH) * 100));

      return {
        placement: 'left' as const,
        leftPct: (cardX / 950) * 100,
        topPct: (cardY / 400) * 100,
        arrowLeftPct: undefined,
        arrowTopPct
      };
    }
  };

  const timeframeLabel = analyticsTimeframe === 'Last 1 year' ? 'Jan 2024 – Dec 2024'
    : analyticsTimeframe === 'Last 6 months' ? 'Jul 2024 – Dec 2024'
    : analyticsTimeframe === 'Last 30 days' ? 'Nov 2024 – Dec 2024'
    : 'Q4 2024';

  const hasActiveFilters = selectedMakeFilter !== 'All Makes' || selectedModelFilter !== 'All Models' || selectedDeviceTypeFilter !== 'All Device Types';

  return (
    <div className="rounded-2xl border border-[#224375] bg-[#0c182a] p-5 shadow-xl space-y-4">
      {/* Header Bar matching font of Live Sample Connected Vehicles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#224375]/70 pb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <BarChart3 size={16} className="text-sky-400" />
            <span>Telematics Usage Analytics in {countryName}</span>
          </h3>
          <span 
            className="rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold border transition-colors"
            style={{ 
              backgroundColor: `${tabConfig.color}25`, 
              borderColor: `${tabConfig.colorLight}80`, 
              color: tabConfig.colorLight 
            }}
          >
            {tabConfig.title} ({tabConfig.unit})
          </span>
          {hasActiveFilters && (
            <span className="text-[10px] font-mono text-slate-300 bg-[#071322] border border-sky-500/30 px-2 py-0.5 rounded-md">
              {[selectedMakeFilter, selectedModelFilter, selectedDeviceTypeFilter].filter(f => !f.startsWith('All')).join(' • ')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => {
              setHoveredItem(null);
              showToast('Analytics Refreshed', `Refreshed ${tabConfig.title} metrics from core database.`, 'info');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#132742] transition-colors cursor-pointer"
            title="Refresh telematics data"
          >
            <RotateCw size={15} />
          </button>
          <button
            onClick={() => showToast('Analytics Options', `Viewing ${tabConfig.title} telematics aggregates across connected eSIM profiles.`, 'info')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#132742] transition-colors cursor-pointer"
            title="Options"
          >
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      {/* 3 Usage Category Tab Buttons: Data Usage, SMS Usage, Voice Usage */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['data', 'sms', 'voice'] as const).map((tabKey) => {
          const cfg = TAB_SPECS[tabKey];
          const Icon = cfg.icon;
          const isActive = activeUsageTab === tabKey;
          return (
            <button
              key={tabKey}
              onClick={() => {
                setActiveUsageTab(tabKey);
                setHoveredItem(null);
              }}
              style={isActive ? {
                backgroundColor: `${cfg.color}30`,
                borderColor: cfg.colorLight,
                color: '#ffffff'
              } : undefined}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                isActive
                  ? 'shadow-md ring-1 ring-sky-400/30'
                  : 'bg-[#071322] text-slate-400 hover:text-white border-[#224375] hover:bg-[#0e213b]'
              }`}
            >
              <Icon size={14} style={{ color: isActive ? cfg.colorLight : '#94a3b8' }} />
              <span>{cfg.title}</span>
              <span 
                className="text-[10px] px-1.5 py-0.2 rounded font-mono"
                style={{
                  backgroundColor: isActive ? `${cfg.colorLight}40` : '#1e293b',
                  color: isActive ? '#ffffff' : '#94a3b8'
                }}
              >
                {cfg.unit}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Interdependent Filters Row: Make, Model, Device Type & Timeframe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#071322] border border-[#224375] rounded-xl p-3 text-xs font-mono">
        {/* 1. Make Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Car size={12} className="text-sky-400" />
            <span>Make:</span>
          </label>
          <div className="relative">
            <select
              value={selectedMakeFilter}
              onChange={(e) => handleMakeChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[#224375] bg-[#0c182a] text-white px-2.5 py-1.5 pr-7 text-xs font-mono focus:border-sky-400 focus:outline-none cursor-pointer hover:border-sky-500/50 transition-colors"
            >
              {availableMakes.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 2. Model Filter (Interdependent on Make) */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Layers size={12} className="text-sky-400" />
            <span>Model:</span>
          </label>
          <div className="relative">
            <select
              value={selectedModelFilter}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[#224375] bg-[#0c182a] text-white px-2.5 py-1.5 pr-7 text-xs font-mono focus:border-sky-400 focus:outline-none cursor-pointer hover:border-sky-500/50 transition-colors"
            >
              {availableModels.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 3. Device Type Filter (Interdependent on Make & Model) */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Cpu size={12} className="text-sky-400" />
            <span>Device Type:</span>
          </label>
          <div className="relative">
            <select
              value={selectedDeviceTypeFilter}
              onChange={(e) => handleDeviceTypeChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[#224375] bg-[#0c182a] text-white px-2.5 py-1.5 pr-7 text-xs font-mono focus:border-sky-400 focus:outline-none cursor-pointer hover:border-sky-500/50 transition-colors"
            >
              {availableDeviceTypes.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 4. Timeframe & Quick Reset */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={12} className="text-sky-400" />
              <span>Timeframe:</span>
            </span>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSelectedMakeFilter('All Makes');
                  setSelectedModelFilter('All Models');
                  setSelectedDeviceTypeFilter('All Device Types');
                  setHoveredItem(null);
                  showToast('Filters Cleared', 'Reset to fleetwide overview.', 'info');
                }}
                className="text-sky-400 hover:text-white underline cursor-pointer text-[10px] flex items-center gap-0.5"
              >
                <RotateCcw size={10} />
                <span>Reset</span>
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={analyticsTimeframe}
              onChange={(e) => {
                setAnalyticsTimeframe(e.target.value);
                setHoveredItem(null);
              }}
              className="w-full appearance-none rounded-lg border border-[#224375] bg-[#0c182a] text-white px-2.5 py-1.5 pr-7 text-xs font-mono focus:border-sky-400 focus:outline-none cursor-pointer hover:border-sky-500/50 transition-colors"
            >
              <option value="Last 1 year">Last 1 year</option>
              <option value="Last 6 months">Last 6 months</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Current Quarter">Current Quarter</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Chart SVG Canvas Box with Tooltip Popup & Legend */}
      <div className="rounded-xl border border-[#1e3658] bg-[#071322] p-0 shadow-inner relative">
        <div className="relative w-full overflow-x-auto scrollbar-thin scrollbar-thumb-sky-500/20 py-0">
          <div className="relative min-w-[720px] h-[370px] sm:h-[400px]">
            <svg
              viewBox="0 0 950 400"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible font-mono select-none"
              onClick={() => setHoveredItem(null)}
            >
              {/* Dynamic Y-Axis Gridlines & Labels */}
              {[
                { label: `${maxScale} ${tabConfig.unit}`, val: maxScale, y: yTop },
                { label: `${Math.round(maxScale * 0.75)} ${tabConfig.unit}`, val: maxScale * 0.75, y: y0 - (maxScale * 0.75 * pxPerUnit) },
                { label: `${Math.round(maxScale * 0.5)} ${tabConfig.unit}`, val: maxScale * 0.5, y: y0 - (maxScale * 0.5 * pxPerUnit) },
                { label: `${Math.round(maxScale * 0.25)} ${tabConfig.unit}`, val: maxScale * 0.25, y: y0 - (maxScale * 0.25 * pxPerUnit) },
                { label: `0 ${tabConfig.unit}`, val: 0, y: y0 }
              ].map((tick) => (
                <g key={tick.label}>
                  <line
                    x1="85"
                    y1={tick.y}
                    x2="925"
                    y2={tick.y}
                    stroke="#162c4a"
                    strokeDasharray="2 3"
                    strokeWidth="1"
                  />
                  <text
                    x="75"
                    y={tick.y + 3.5}
                    fill="#768ba7"
                    textAnchor="end"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {tick.label}
                  </text>
                </g>
              ))}

              {/* Threshold Band */}
              <rect
                x="85"
                y={yBandTop}
                width="840"
                height={bandHeight}
                fill="rgba(14, 165, 233, 0.08)"
              />
              <line
                x1="85"
                y1={yBandTop}
                x2="925"
                y2={yBandTop}
                stroke="#0284c7"
                strokeDasharray="4 4"
                strokeWidth="1"
                strokeOpacity="0.8"
              />
              <line
                x1="85"
                y1={yBandBottom}
                x2="925"
                y2={yBandBottom}
                stroke="#0284c7"
                strokeDasharray="4 4"
                strokeWidth="1"
                strokeOpacity="0.8"
              />
              <text
                x="915"
                y={yBandTop + bandHeight / 2 + 3.5}
                fill="#0284c7"
                textAnchor="end"
                fontSize="10"
                fontWeight="bold"
                letterSpacing="1"
              >
                {tabConfig.bandLabel}
              </text>

              {/* Render Clean Single Solid Color Bars */}
              {chartItems.map((item, idx) => {
                const xCenter = xStart + (idx + 0.5) * step;
                const xLeft = xCenter - itemWidth / 2;

                const h = item.total * pxPerUnit;
                const y = y0 - h;
                const barTopY = y;

                const isHovered = hoveredItem?.id === item.id;

                const triggerHover = (pinned = false) => {
                  const placementData = calculatePlacement(xCenter, barTopY, itemWidth);
                  setHoveredItem({
                    id: item.id,
                    title: item.name,
                    subtitle: item.subtitle,
                    value: item.total,
                    unit: tabConfig.unit,
                    color: tabConfig.color,
                    placement: placementData.placement,
                    leftPct: placementData.leftPct,
                    topPct: placementData.topPct,
                    arrowLeftPct: placementData.arrowLeftPct,
                    arrowTopPct: placementData.arrowTopPct,
                    isPinned: pinned
                  });
                };

                return (
                  <g
                    key={item.id}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => triggerHover(false)}
                    onMouseLeave={() => {
                      setHoveredItem(prev => (prev?.isPinned ? prev : null));
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hoveredItem?.id === item.id && hoveredItem?.isPinned) {
                        setHoveredItem(null);
                      } else {
                        triggerHover(true);
                      }

                      // Dynamic drill-down click behavior
                      if (selectedModelFilter === 'All Models') {
                        handleModelChange(item.name);
                        showToast('Model Selected', `Drilled down to onboard devices for ${item.name}`, 'info');
                      } else if (selectedDeviceTypeFilter === 'All Device Types' && item.subtitle) {
                        handleDeviceTypeChange(item.subtitle);
                        showToast('Device Selected', `Inspecting ${item.name}`, 'info');
                      }
                    }}
                  >
                    {/* Hover Target Hitbox */}
                    <rect
                      x={xLeft - 14}
                      y={yTop}
                      width={itemWidth + 28}
                      height={plotHeight + 35}
                      fill="transparent"
                    />

                    {/* Active Hover Background Column */}
                    {isHovered && (
                      <rect
                        x={xLeft - 6}
                        y={Math.max(15, barTopY - 10)}
                        width={itemWidth + 12}
                        height={y0 - Math.max(15, barTopY - 10) + 4}
                        fill={tabConfig.glowColor}
                        rx={8}
                        ry={8}
                      />
                    )}

                    {/* Single Clean Solid Bar */}
                    <rect
                      x={xLeft}
                      y={y}
                      width={itemWidth}
                      height={Math.max(3, h)}
                      fill={tabConfig.color}
                      rx={6}
                      ry={6}
                      stroke={isHovered ? tabConfig.colorLight : 'none'}
                      strokeWidth={isHovered ? 2 : 0}
                      className="transition-all duration-200"
                    />

                    {/* Top Accent Cap */}
                    {h > 8 && (
                      <rect
                        x={xLeft}
                        y={y}
                        width={itemWidth}
                        height={Math.min(5, Math.max(2, h))}
                        fill={tabConfig.colorLight}
                        rx={6}
                        ry={6}
                        opacity={0.85}
                      />
                    )}

                    {/* Metric Value Label (Inside if tall, above if short) */}
                    {h >= 24 ? (
                      <text
                        x={xCenter}
                        y={y + 18}
                        fill="#ffffff"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {item.total}
                      </text>
                    ) : item.total > 0 ? (
                      <text
                        x={xCenter}
                        y={y - 6}
                        fill="#94a3b8"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {item.total}
                      </text>
                    ) : null}

                    {/* Category X-Axis Label */}
                    <text
                      x={xCenter}
                      y={y0 + 22}
                      fill="#f1f5f9"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {item.shortName || item.name}
                    </text>

                    {/* Optional Subtitle */}
                    {item.subtitle && (
                      <text
                        x={xCenter}
                        y={y0 + 36}
                        fill="#38bdf8"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="500"
                      >
                        {item.subtitle}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Interactive Smart Tooltip Popup matching the Reference Card Style */}
            {hoveredItem && (
              <div
                className={`absolute z-30 transition-all duration-150 animate-in fade-in zoom-in-95 ${
                  hoveredItem.isPinned ? 'pointer-events-auto' : 'pointer-events-none select-none'
                }`}
                style={{
                  left: `${hoveredItem.leftPct}%`,
                  top: `${hoveredItem.topPct}%`,
                  width: '260px'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full rounded-xl border border-[#1f3a60] bg-[#081426] p-3.5 shadow-2xl shadow-black/95 ring-1 ring-sky-500/30 text-slate-100 font-sans">
                  {/* Arrow for 'top' placement (bottom edge pointing down at bar) */}
                  {hoveredItem.placement === 'top' && hoveredItem.arrowLeftPct !== undefined && (
                    <div
                      className="absolute -bottom-1.5 w-3 h-3 bg-[#081426] border-b border-r border-[#1f3a60] rotate-45 pointer-events-none"
                      style={{
                        left: `${hoveredItem.arrowLeftPct}%`,
                        transform: 'translateX(-50%) rotate(45deg)'
                      }}
                    />
                  )}

                  {/* Arrow for 'right' placement (left edge pointing left at bar) */}
                  {hoveredItem.placement === 'right' && hoveredItem.arrowTopPct !== undefined && (
                    <div
                      className="absolute -left-1.5 w-3 h-3 bg-[#081426] border-b border-l border-[#1f3a60] rotate-45 pointer-events-none"
                      style={{
                        top: `${hoveredItem.arrowTopPct}%`,
                        transform: 'translateY(-50%) rotate(45deg)'
                      }}
                    />
                  )}

                  {/* Arrow for 'left' placement (right edge pointing right at bar) */}
                  {hoveredItem.placement === 'left' && hoveredItem.arrowTopPct !== undefined && (
                    <div
                      className="absolute -right-1.5 w-3 h-3 bg-[#081426] border-t border-r border-[#1f3a60] rotate-45 pointer-events-none"
                      style={{
                        top: `${hoveredItem.arrowTopPct}%`,
                        transform: 'translateY(-50%) rotate(45deg)'
                      }}
                    />
                  )}

                  {/* Top Header: Title & Timeframe */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="font-bold text-white text-sm tracking-tight block truncate">
                        {hoveredItem.title}
                      </span>
                      {hoveredItem.subtitle && (
                        <span className="text-[10px] text-sky-400 font-mono block">
                          {hoveredItem.subtitle}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">
                      {timeframeLabel}
                    </span>
                  </div>

                  {/* Thin Divider */}
                  <div className="my-2.5 border-b border-[#1b3459]" />

                  {/* Single Metric Category Row */}
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="h-3 w-3 rounded-xs shrink-0" 
                        style={{ backgroundColor: hoveredItem.color }} 
                      />
                      <span className="text-slate-200 font-medium text-xs">
                        {tabConfig.title}
                      </span>
                    </div>
                    <span className="font-bold text-white font-mono text-sm">
                      {hoveredItem.value} {hoveredItem.unit}
                    </span>
                  </div>

                  {/* Thin Divider */}
                  <div className="my-2 border-b border-[#1b3459]" />

                  {/* Total Row with Bright Cyan Highlight */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-bold text-white text-xs">Total</span>
                    <span className="font-bold text-[#00c0f3] text-sm font-mono">
                      {hoveredItem.value} {hoveredItem.unit}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Legend and Hints Bar */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 mt-1 border-t border-[#183155] text-xs font-mono">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-xs" style={{ backgroundColor: tabConfig.color }} />
              <span className="text-slate-200 font-semibold">{tabConfig.title} ({tabConfig.unit})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-0 border-b-2 border-dashed border-[#0284c7]" />
              <span className="text-sky-400 font-medium text-[11px]">{tabConfig.bandLabel}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            <span>Click any bar to drill down into devices • Single-color unified telemetry</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default TelematicsUsageAnalytics;
