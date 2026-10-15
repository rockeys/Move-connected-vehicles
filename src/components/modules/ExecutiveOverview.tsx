import React from 'react';
import { 
  Car, 
  Wifi, 
  Activity, 
  Layers, 
  HardDrive, 
  PhoneCall,
  MessageSquare,
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Factory, 
  Radio, 
  ChevronRight, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { SimCardIcon } from '../common/SimCardIcon';
import { useApp } from '../../context/AppContext';
import { GlobalVehicleMap } from '../common/GlobalVehicleMap';
import { DashboardTrendCharts } from './DashboardTrendCharts';
import { JLR_PLANTS, INCIDENT_ALERTS } from '../../data/mockData';

export const ExecutiveOverview: React.FC = () => {
  const { setActiveModule, filters, setFilter, resetFilters, selectedPlant, navigateToPlant, navigateToCockpit } = useApp();

  const isPlantFiltered = filters.plantId !== 'all' && selectedPlant !== null;

  // Plant-aware dynamic metric calculations
  const totalMfg = isPlantFiltered ? selectedPlant.totalProductionYTD : 458230;
  const totalConn = isPlantFiltered ? selectedPlant.connectedVehiclesYTD : 443620;
  const activeSims = isPlantFiltered ? Math.round(selectedPlant.connectedVehiclesYTD * 0.992) : 439810;
  const onlineVehicles = isPlantFiltered ? Math.round(selectedPlant.connectedVehiclesYTD * 0.932) : 412850;
  const plantRatio = isPlantFiltered ? selectedPlant.totalProductionYTD / 458230 : 1;

  const dataPb = isPlantFiltered ? (4.82 * plantRatio).toFixed(2) : '4.82';
  const voiceMins = isPlantFiltered ? (1.42 * plantRatio).toFixed(2) : '1.42';
  const smsCount = isPlantFiltered ? (18.6 * plantRatio).toFixed(1) : '18.6';
  const activeAlerts = isPlantFiltered ? selectedPlant.connectivityIncidentsYTD : 142;
  const healthScore = isPlantFiltered ? selectedPlant.readinessScore : 98.4;
  const plantAvail = isPlantFiltered ? (99.970 + (selectedPlant.provisioningSuccessRate - 99.7) * 0.04).toFixed(3) : '99.982';

  // Top-Level 12 KPI Cards Specification (Dynamically adapts to plant selection)
  const kpis = [
    {
      id: 'mfg',
      title: 'Total Vehicles Manufactured',
      value: totalMfg.toLocaleString(),
      change: isPlantFiltered ? `Plant YTD` : '+12.4%',
      isPositive: true,
      subtext: isPlantFiltered ? `YTD at ${selectedPlant.name}` : 'YTD across 6 global plants',
      icon: Factory,
      sparkline: [40, 52, 60, 68, 85, 94, 100],
      status: 'Optimal',
      targetModule: 'plant-intelligence' as const
    },
    {
      id: 'conn',
      title: 'Total Connected Vehicles',
      value: totalConn.toLocaleString(),
      change: isPlantFiltered ? `${((totalConn / totalMfg) * 100).toFixed(1)}%` : '+14.8%',
      isPositive: true,
      subtext: isPlantFiltered ? `${selectedPlant.shortName} connected ratio` : '96.8% global connected ratio',
      icon: Car,
      sparkline: [38, 48, 55, 64, 78, 89, 97],
      status: 'Optimal',
      targetModule: 'fleet-management' as const
    },
    {
      id: 'sims',
      title: 'Active Move SIMs',
      value: activeSims.toLocaleString(),
      change: isPlantFiltered ? `${selectedPlant.simActivationRate}%` : '+18.1%',
      isPositive: true,
      subtext: isPlantFiltered ? `${selectedPlant.shortName} eUICC profiles` : 'Tata eUICC global profiles',
      icon: SimCardIcon,
      sparkline: [35, 45, 58, 68, 82, 92, 98],
      status: 'Optimal',
      targetModule: 'sim-management' as const
    },
    {
      id: 'online',
      title: 'Vehicles Online',
      value: onlineVehicles.toLocaleString(),
      change: isPlantFiltered ? 'Live Active' : '+4.2%',
      isPositive: true,
      subtext: isPlantFiltered ? `Active sessions from ${selectedPlant.shortName}` : '93.1% concurrent session rate',
      icon: Wifi,
      sparkline: [78, 84, 82, 88, 90, 89, 93],
      status: 'Optimal',
      targetModule: 'fleet-management' as const
    },
    {
      id: 'avail',
      title: 'Connectivity Availability',
      value: `${plantAvail}%`,
      change: '+0.03%',
      isPositive: true,
      subtext: isPlantFiltered ? `${selectedPlant.shortName} SLA compliance` : 'Exceeding 99.95% JLR SLA',
      icon: ShieldCheck,
      sparkline: [99.7, 99.8, 99.85, 99.9, 99.95, 99.98, 99.98],
      status: 'Optimal',
      targetModule: 'network-operations' as const
    },
    {
      id: 'net_uptime',
      title: 'Network Uptime',
      value: '99.991%',
      change: '+0.01%',
      isPositive: true,
      subtext: isPlantFiltered ? selectedPlant.primaryOperator.split('/')[0] : 'Global telco carrier mesh',
      icon: Radio,
      sparkline: [99.9, 99.92, 99.94, 99.96, 99.98, 99.99, 99.99],
      status: 'Optimal',
      targetModule: 'network-operations' as const
    },
    {
      id: 'data',
      title: 'Total Data Consumption',
      value: `${dataPb} PB`,
      change: isPlantFiltered ? 'Telematics' : '+24.6%',
      isPositive: true,
      subtext: isPlantFiltered ? `Data throughput for ${selectedPlant.shortName}` : 'High-throughput telematics',
      icon: HardDrive,
      sparkline: [2.1, 2.5, 3.1, 3.8, 4.1, 4.5, 4.82],
      status: 'Optimal',
      targetModule: 'analytics-reports' as const
    },
    {
      id: 'voice',
      title: 'Total Voice Consumption',
      value: `${voiceMins}M Mins`,
      change: '+8.6%',
      isPositive: true,
      subtext: isPlantFiltered ? `eCall & concierge from ${selectedPlant.shortName}` : 'eCall, bCall & concierge VoIP',
      icon: PhoneCall,
      sparkline: [72, 78, 85, 91, 102, 118, 142],
      status: 'Optimal',
      targetModule: 'analytics-reports' as const
    },
    {
      id: 'sms',
      title: 'Total SMS Consumption',
      value: `${smsCount}M SMS`,
      change: '+14.2%',
      isPositive: true,
      subtext: isPlantFiltered ? `eUICC OTA triggers at plant` : 'eUICC OTA wake-up triggers',
      icon: MessageSquare,
      sparkline: [11.2, 12.5, 13.8, 15.2, 16.4, 17.5, 18.6],
      status: 'Optimal',
      targetModule: 'sim-management' as const
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      value: `${activeAlerts}`,
      change: isPlantFiltered ? `${selectedPlant.defectRatePpm} PPM` : '-18.5%',
      isPositive: isPlantFiltered ? selectedPlant.defectRatePpm < 30 : true,
      subtext: isPlantFiltered ? `Factory & EOL alerts (${selectedPlant.city})` : '0.03% of connected fleet',
      icon: AlertTriangle,
      sparkline: [195, 182, 170, 162, 154, 148, 142],
      status: activeAlerts > 15 ? 'Watch' : 'Optimal',
      targetModule: 'alerts-incidents' as const
    }
  ];

  // Model-wise connectivity breakdown (filters by plant if selected)
  const defaultModelAdoption = [
    { model: 'Range Rover', count: 112400, percent: 99.9, tech: '5G SA', color: 'bg-sky-400' },
    { model: 'Defender 110 & 90', count: 124800, percent: 99.8, tech: '5G NSA / SA', color: 'bg-emerald-400' },
    { model: 'Range Rover Sport', count: 74200, percent: 99.7, tech: '5G SA', color: 'bg-cyan-400' },
    { model: 'Range Rover Velar', count: 42100, percent: 99.6, tech: '5G NSA', color: 'bg-indigo-400' },
    { model: 'Discovery & Sport', count: 58900, percent: 99.5, tech: '4G LTE / 5G', color: 'bg-amber-400' },
    { model: 'Jaguar I-PACE & F-PACE', count: 31220, percent: 99.4, tech: '4G LTE / 5G', color: 'bg-purple-400' }
  ];

  const modelAdoption = isPlantFiltered 
    ? defaultModelAdoption.filter(m => 
        selectedPlant.modelsProduced.some(pm => 
          m.model.toLowerCase().includes(pm.toLowerCase()) || pm.toLowerCase().includes(m.model.toLowerCase())
        )
      ).map(m => ({
        ...m,
        count: Math.round(m.count * (selectedPlant.totalProductionYTD / 458230) * 2.4)
      }))
    : defaultModelAdoption;

  const displayModels = modelAdoption.length > 0 ? modelAdoption : defaultModelAdoption;

  return (
    <div className="space-y-6">
      {/* Plant Scope Active Banner (Shown when a plant filter is selected) */}
      {isPlantFiltered && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-500/50 bg-[#122b4d]/90 p-4 shadow-xl backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/40 shadow-inner">
              <Factory size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Plant Scope: {selectedPlant.name}
                </span>
                <span className="rounded bg-sky-400/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-sky-300 border border-sky-400/40">
                  {selectedPlant.country}
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-300 border border-emerald-400/40">
                  {selectedPlant.simActivationRate}% SIM Activation
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
               Below are scoped exclusively to {selectedPlant.name} ({selectedPlant.city}).
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilter('plantId', 'all')}
            className="rounded-lg border border-sky-400/40 bg-[#152744] hover:bg-[#1f375f] px-3 py-1.5 text-xs font-medium text-sky-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw size={13} />
            <span>Reset to Global Overview</span>
          </button>
        </div>
      )}

      {/* 12 Top-Level KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => setActiveModule(kpi.targetModule)}
              className="group cursor-pointer rounded-xl border border-[#224375] bg-[#1a3156] p-3.5 hover:border-sky-500/50 hover:bg-[#203c68] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-300 truncate pr-2">
                    {kpi.title}
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#152744] text-slate-300 group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors">
                    <Icon size={14} />
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-lg font-bold font-mono tracking-tight text-white">
                    {kpi.value}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {kpi.subtext}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#224375]/60">
                {/* Mini SVG Trend Chart */}
                <div className="h-6 w-full flex items-end gap-1">
                  {kpi.sparkline.map((val, idx) => {
                    const max = Math.max(...kpi.sparkline);
                    const min = Math.min(...kpi.sparkline);
                    const range = max - min || 1;
                    const heightPercent = Math.max(20, ((val - min) / range) * 100);
                    return (
                      <div
                        key={idx}
                        className="flex-1 rounded-xs bg-sky-400/40 group-hover:bg-sky-400 transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                    );
                  })}
                </div>

                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span className={`flex items-center font-mono font-semibold ${
                    kpi.isPositive ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {kpi.isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                    {kpi.change}
                  </span>
                  <ChevronRight size={11} className="text-slate-400 group-hover:text-sky-400 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise Telematics & Connectivity Trend Charts */}
      <DashboardTrendCharts />

      {/* Global Interactive Map Section */}
      <GlobalVehicleMap />

      

      {/* Critical Incidents Section in Executive View */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#224375]/80 mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Critical Fleet Incidents & Anomalies Requiring Executive Attention
            </h3>
          </div>
          <button
            onClick={() => setActiveModule('alerts-incidents')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
          >
            Manage Incidents <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {INCIDENT_ALERTS.slice(0, 3).map(inc => (
            <div
              key={inc.id}
              onClick={() => setActiveModule('alerts-incidents')}
              className="cursor-pointer rounded-lg border border-[#224375] bg-[#152744] p-3 hover:border-sky-500/50 hover:bg-[#203c68] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`font-semibold ${
                    inc.severity === 'critical' ? 'text-red-400' : inc.severity === 'high' ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    {inc.category}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{inc.timestamp}</span>
                </div>
                <h4 className="mt-1 text-xs font-semibold text-white line-clamp-2">
                  {inc.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                  {inc.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#224375]/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Affected: {inc.affectedVinCount}</span>
                <span className="text-sky-400 font-medium">{inc.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
