import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Signal, 
  Wifi, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Battery, 
  Zap, 
  Gauge, 
  Layers, 
  RefreshCw, 
  RotateCcw, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Radio, 
  Download, 
  Upload, 
  Clock, 
  MapPin, 
  ArrowLeft,
  ChevronRight,
  Terminal,
  Server
} from 'lucide-react';
import { SimCardIcon } from '../common/SimCardIcon';
import { useApp } from '../../context/AppContext';
import { DiagnosticCode, ConnectedAppHealth } from '../../types';

export const VehicleCockpit360: React.FC = () => {
  const { 
    selectedVehicle, 
    vehicles, 
    setSelectedVehicleVin, 
    pingVehicle, 
    switchEsimProfile,
    setActiveModule,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'cockpit' | 'telemetry' | 'apps' | 'dtc' | 'sim'>('cockpit');
  const [selectedSensorNode, setSelectedSensorNode] = useState<string>('tcu');
  const [simulatingCommand, setSimulatingCommand] = useState<boolean>(false);
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('all');

  const availableModels = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.model) set.add(v.model);
    });
    return Array.from(set);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    if (selectedModelFilter === 'all') return vehicles;
    return vehicles.filter(v => v.model === selectedModelFilter);
  }, [vehicles, selectedModelFilter]);

  const handleModelFilterChange = (model: string) => {
    setSelectedModelFilter(model);
    if (model !== 'all') {
      const matching = vehicles.filter(v => v.model === model);
      if (matching.length > 0 && selectedVehicle && selectedVehicle.model !== model) {
        setSelectedVehicleVin(matching[0].vin);
      }
    }
  };

  if (!selectedVehicle) {
    return (
      <div className="p-8 text-center text-slate-400">
        No vehicle selected. Please select a vehicle from Fleet Management.
      </div>
    );
  }

  const isDefender = selectedVehicle.model.toLowerCase().includes('defender');
  const heroImageSrc = isDefender
    ? '/src/assets/images/jlr_defender_telematics_1790688221801.jpg'
    : '/src/assets/images/jlr_range_rover_hero_1790688206035.jpg';

  const handleRemoteDiagnosticScan = () => {
    setSimulatingCommand(true);
    pingVehicle(selectedVehicle.vin);
    setTimeout(() => {
      setSimulatingCommand(false);
    }, 1500);
  };

  const handleTriggerSotaCheck = () => {
    showToast('SOTA Campaign Polled', `Queried JLR InControl Cloud OTA repository. 0 pending critical ECU campaigns for ${selectedVehicle.vin}.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Cockpit Header & Vehicle Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModule('country-details')}
              className="text-xs text-sky-400 hover:text-white flex items-center gap-1 transition-colors font-medium cursor-pointer"
            >
              <ArrowLeft size={13} /> Back to Country Fleet
            </button>
            <span className="text-[#3b5d8f]">/</span>
            <button
              onClick={() => setActiveModule('executive-overview')}
              className="text-xs text-slate-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Map
            </button>
            <span className="text-[#3b5d8f]">/</span>
            <span className="text-xs font-mono text-sky-400">VIN: {selectedVehicle.vin}</span>
          </div>

          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {selectedVehicle.model}
            </h1>
            <span className="rounded bg-[#1a3156] border border-[#224375] px-2.5 py-0.5 text-xs text-sky-200 font-medium">
              {selectedVehicle.variant}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
              selectedVehicle.status === 'Online' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50' :
              selectedVehicle.status === 'Roaming' ? 'bg-sky-950/80 text-sky-300 border border-sky-700/50' :
              selectedVehicle.status === 'Degraded' ? 'bg-amber-950/80 text-amber-300 border border-amber-700/50' :
              'bg-red-950/80 text-red-300 border border-red-700/50'
            }`}>
              {selectedVehicle.status}
            </span>
          </div>
        </div>

        {/* Car Model and ICCID Filter (Removed Diagnostic Ping and Switch eUICC Profile buttons) */}
        <div className="flex flex-wrap justify-end gap-2.5">
          {/* Car Model Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-[#224375] bg-[#152744] px-2.5 py-1.5">
            <Car size={13} className="text-sky-400" />
            <span className="text-[11px] font-medium text-slate-400">Model:</span>
            <select
              value={selectedModelFilter}
              onChange={(e) => handleModelFilterChange(e.target.value)}
              aria-label="Filter by Car Model"
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#152744] text-white">All Models</option>
              {availableModels.map(m => (
                <option key={m} value={m} className="bg-[#152744] text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* ICCID / Vehicle Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-[#224375] bg-[#152744] px-2.5 py-1.5">
            <span className="text-[11px] font-medium text-slate-400 font-mono">ICCID:</span>
            <select
              value={selectedVehicle.vin}
              onChange={(e) => setSelectedVehicleVin(e.target.value)}
              aria-label="Select vehicle by ICCID"
              className="bg-transparent text-xs font-mono text-slate-200 focus:outline-none cursor-pointer max-w-[280px]"
            >
              {filteredVehicles.map(v => (
                <option key={v.vin} value={v.vin} className="bg-[#152744] text-white">
                  {v.vin.slice(0, 10)}... · {v.model} ({v.simIccid})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cockpit Mode Tabs (PVM Tab removed) */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#224375]">
        {[
          { id: 'cockpit', label: '360° Digital Cockpit', icon: Gauge },
          { id: 'telemetry', label: 'Connectivity Telemetry', icon: Signal },
          { id: 'apps', label: `Connected Apps (${selectedVehicle.connectedApps.length})`, icon: Layers },
          // { id: 'dtc', label: `DTC Diagnostics (${selectedVehicle.dtcCodes.length})`, icon: Activity },
          { id: 'sim', label: 'Move SIM & RSP Profile', icon: SimCardIcon }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                isActive
                  ? 'border-sky-400 text-sky-300 font-semibold bg-[#1a3156]/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#152744]/40'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-sky-400' : 'text-slate-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Views */}
      {activeTab === 'cockpit' && (
        <div className="space-y-6">
          {/* Hero Digital Cockpit Visualizer & Hotspot HUD */}
          <div className="relative overflow-hidden rounded-2xl border border-[#224375] bg-[#1a3156] shadow-2xl">
            {/* Background vehicle photo */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#152744]">
              <img
                src={heroImageSrc}
                alt={`${selectedVehicle.model} Connected Vehicle Cockpit`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center opacity-85 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3156] via-[#1a3156]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a3156]/80 via-transparent to-[#1a3156]/80" />

              {/* Interactive Telemetry Sensor Hotspots overlaid on vehicle coordinates */}
              {/* Hotspot 1: TCU & Move SIM (Roof / Dorsal Shark-Fin Antenna) */}
              <button
                onClick={() => setSelectedSensorNode('tcu')}
                className={`absolute top-[26%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono font-bold transition-all shadow-xl backdrop-blur-md ${
                  selectedSensorNode === 'tcu'
                    ? 'bg-sky-400 text-slate-950 ring-4 ring-sky-400/40 scale-110'
                    : 'bg-[#152744]/90 text-sky-300 border border-sky-500/50 hover:bg-[#1a3156]'
                }`}
              >
                <Radio size={12} className="animate-pulse" />
                TCU & MOVE SIM
              </button>

              {/* Hotspot 3: Pivi Pro Head Unit & Infotainment */}
              <button
                onClick={() => setSelectedSensorNode('infotainment')}
                className={`absolute top-[42%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono font-bold transition-all shadow-xl backdrop-blur-md ${
                  selectedSensorNode === 'infotainment'
                    ? 'bg-sky-400 text-slate-950 ring-4 ring-sky-400/40 scale-110'
                    : 'bg-[#152744]/90 text-sky-300 border border-sky-500/50 hover:bg-[#1a3156]'
                }`}
              >
                <Cpu size={12} />
                PIVI PRO OS
              </button>

              {/* Hotspot 4: Powertrain & BMS Battery Management (Underfloor) */}
              <button
                onClick={() => setSelectedSensorNode('powertrain')}
                className={`absolute top-[68%] left-[54%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono font-bold transition-all shadow-xl backdrop-blur-md ${
                  selectedSensorNode === 'powertrain'
                    ? 'bg-sky-400 text-slate-950 ring-4 ring-sky-400/40 scale-110'
                    : 'bg-[#152744]/90 text-amber-300 border border-amber-500/50 hover:bg-[#1a3156]'
                }`}
              >
                <Zap size={12} />
                BMS & POWERTRAIN
              </button>

              {/* Hotspot 5: eCall Safety & InControl Gateway */}
              <button
                onClick={() => setSelectedSensorNode('safety')}
                className={`absolute top-[34%] left-[68%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono font-bold transition-all shadow-xl backdrop-blur-md ${
                  selectedSensorNode === 'safety'
                    ? 'bg-sky-400 text-slate-950 ring-4 ring-sky-400/40 scale-110'
                    : 'bg-[#152744]/90 text-purple-300 border border-purple-500/50 hover:bg-[#1a3156]'
                }`}
              >
                <ShieldCheck size={12} />
                eCALL 112 SOS
              </button>

              {/* Live telemetry floating HUD box */}
              <div className="absolute top-4 left-4 rounded-xl border border-[#224375] bg-[#152744]/95 p-3 backdrop-blur-md text-xs space-y-1 font-mono shadow-xl">
                <div className="flex items-center gap-2 text-sky-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                  REAL-TIME TELEMETRY HUD
                </div>
                <div className="text-slate-300">Carrier: {selectedVehicle.networkOperator}</div>
                <div className="text-slate-300">Latency: {selectedVehicle.latencyMs} ms · RSRP: {selectedVehicle.signalRsrp} dBm</div>
                <div className="text-slate-300">Location: {selectedVehicle.city}, {selectedVehicle.country}</div>
              </div>

              {/* Bottom Right Floating Gauges */}
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <div className="rounded-xl border border-[#224375] bg-[#152744]/95 p-3 backdrop-blur-md text-center shadow-lg">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Health Score</div>
                  <div className={`text-xl font-bold font-mono ${
                    selectedVehicle.healthScore >= 95 ? 'text-sky-400' : selectedVehicle.healthScore >= 80 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {selectedVehicle.healthScore}%
                  </div>
                </div>

                <div className="rounded-xl border border-[#224375] bg-[#152744]/95 p-3 backdrop-blur-md text-center shadow-lg">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Battery SoC</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {selectedVehicle.batterySocPercent}%
                  </div>
                </div>
              </div>
            </div>

            {/* Hotspot Detailed Context Drawer */}
            <div className="p-5 border-t border-[#224375] bg-[#12233f]">
              {selectedSensorNode === 'tcu' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio size={16} className="text-sky-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Telematics Control Unit (TCU) & Tata Move™ eUICC Subsystem
                      </h3>
                    </div>
                    <span className="rounded bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 text-[10px] font-mono text-sky-300">
                      RSP Handshake: Certified
                    </span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Dual embedded eSIM architecture powered by Tata Communications Move™. The primary eSIM provides high-bandwidth data channels for Pivi Pro cloud streaming, SOTA ECU flashing, and 360° PVM video telematics. The secondary fallback eUICC channel is reserved for ultra-low latency telematics and regulatory eCall emergency systems.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">ICCID</span>
                      <span className="text-white font-semibold truncate block">{selectedVehicle.simIccid}</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">IMSI</span>
                      <span className="text-white font-semibold">{selectedVehicle.simImsi}</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">eUICC Profile</span>
                      <span className="text-sky-400 font-semibold">{selectedVehicle.eUiccProfile}</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">Signal RSSI</span>
                      <span className="text-white font-semibold">{selectedVehicle.signalRssi} dBm ({selectedVehicle.signalQuality})</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedSensorNode === 'infotainment' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-sky-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Pivi Pro Head Unit & Infotainment Telemetry
                      </h3>
                    </div>
                    <span className="rounded bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 text-[10px] font-mono text-sky-400">
                      OS Version: 4.2.1-JLR
                    </span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Pivi Pro 13.1-inch curved glass infotainment system. Connects directly through Tata Move high-speed cellular routing to stream real-time 3D cloud navigation maps, over-the-air media updates, and predictive range optimization.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">Active Data Session</span>
                      <span className="text-white font-semibold">14h 22m continuous</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">Throughput (Dn / Up)</span>
                      <span className="text-white font-semibold">48.2 Mbps / 12.1 Mbps</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">Navigation Sync</span>
                      <span className="text-sky-400 font-semibold">Sub-30ms Traffic Stream</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">SOTA Readiness</span>
                      <span className="text-emerald-400 font-semibold">Campaign 68 ECUs Up-to-Date</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedSensorNode === 'powertrain' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-amber-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Battery Management System (BMS) & Powertrain Telemetry
                      </h3>
                    </div>
                    <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono text-amber-400">
                      Status: {selectedVehicle.powertrainStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200">
                    High-voltage pack telemetry streamed at 10Hz through the Tata Move low-latency telemetry gateway. Monitored for cell balance deviations, internal resistance thermals, and DC fast charge curve profiling.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">State of Health (SoH)</span>
                      <span className="text-white font-semibold">{selectedVehicle.batterySohPercent}% nominal</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">State of Charge (SoC)</span>
                      <span className="text-emerald-400 font-semibold">{selectedVehicle.batterySocPercent}%</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">Odometer</span>
                      <span className="text-white font-semibold">{selectedVehicle.odometerKm.toLocaleString()} km</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">Cabin Temperature</span>
                      <span className="text-white font-semibold">{selectedVehicle.temperatureCabinC}°C</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedSensorNode === 'safety' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-purple-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        eCall 112 / bCall Regulatory Safety Gateway
                      </h3>
                    </div>
                    <span className="rounded bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[10px] font-mono text-purple-400">
                      PSAP Handshake: Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Autonomous crash notification and emergency rescue bearer. Conforms to UN ECE R144 requirements, transmitting Minimum Set of Data (MSD) including GNSS location, crash severity vector, and occupant count in less than 2.8 seconds.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">Emergency Bearer</span>
                      <span className="text-white font-semibold">Priority 1 Dedicated Slice</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">Audio Handshake</span>
                      <span className="text-sky-400 font-semibold">VoLTE / 3G Circuit Fallback</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">Backup Battery</span>
                      <span className="text-emerald-400 font-semibold">100% (Independent Cell)</span>
                    </div>
                    <div className="rounded border border-[#224375] bg-[#152744] p-2">
                      <span className="text-[10px] text-slate-400 block">Last Audit</span>
                      <span className="text-slate-300 font-semibold">Automatic 30-day Pass</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#224375] bg-[#152744] p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Manufacturing Origin</span>
              <div className="text-sm font-bold text-white mt-1">{selectedVehicle.plantName}</div>
              <div className="text-[11px] text-slate-300 mt-0.5">{selectedVehicle.productionLine}</div>
            </div>

            <div className="rounded-xl border border-[#224375] bg-[#152744] p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Active Network Operator</span>
              <div className="text-sm font-bold text-white mt-1">{selectedVehicle.networkOperator}</div>
              <div className="text-[11px] text-sky-400 font-mono mt-0.5">{selectedVehicle.networkTech} · {selectedVehicle.latencyMs}ms</div>
            </div>

            <div className="rounded-xl border border-[#224375] bg-[#152744] p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Data Consumption YTD</span>
              <div className="text-sm font-bold text-white mt-1 font-mono">{selectedVehicle.dataConsumptionMb.toLocaleString()} MB</div>
              <div className="text-[11px] text-slate-300 font-mono mt-0.5">Up: {selectedVehicle.dataUploadMb}M · Dn: {selectedVehicle.dataDownloadMb}M</div>
            </div>

            <div className="rounded-xl border border-[#224375] bg-[#152744] p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Diagnostic State</span>
              <div className="text-sm font-bold text-white mt-1">
                {selectedVehicle.dtcCodes.length === 0 ? 'All Systems Clear' : `${selectedVehicle.dtcCodes.length} DTCs Flagged`}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Last ping: {selectedVehicle.lastConnected}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connectivity Telemetry Tab */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-[#224375] bg-[#152744] p-5 space-y-3 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Signal size={14} className="text-sky-400" />
                Radio Frequency & RF Channel
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">Signal Strength (RSSI):</span>
                  <span className="text-white font-bold">{selectedVehicle.signalRssi} dBm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">Reference Signal (RSRP):</span>
                  <span className="text-white font-bold">{selectedVehicle.signalRsrp} dBm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">Quality Assessment:</span>
                  <span className="text-sky-400 font-bold">{selectedVehicle.signalQuality}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">Cell Technology:</span>
                  <span className="text-white font-bold">{selectedVehicle.networkTech}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Roaming Status:</span>
                  <span className={selectedVehicle.isRoaming ? 'text-sky-300 font-bold' : 'text-slate-200 font-bold'}>
                    {selectedVehicle.isRoaming ? `Active Roaming (${selectedVehicle.roamingCountry})` : 'Home Network'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#224375] bg-[#152744] p-5 space-y-3 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Activity size={14} className="text-sky-400" />
                IP Performance & Quality of Service
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">Round-Trip Latency:</span>
                  <span className="text-sky-300 font-bold">{selectedVehicle.latencyMs} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">Packet Loss Rate:</span>
                  <span className="text-white font-bold">{selectedVehicle.packetLossPercent}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">MQTT Keepalive Handshake:</span>
                  <span className="text-emerald-400 font-bold">15 sec (Nominal)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">TLS Encryption:</span>
                  <span className="text-white font-bold">TLS 1.3 / ECC-384</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Session Uptime:</span>
                  <span className="text-white font-bold">99.98%</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#224375] bg-[#152744] p-5 space-y-3 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Download size={14} className="text-sky-400" />
                Data Utilization Breakdown
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">Pivi Pro Stream:</span>
                  <span className="text-white font-bold">2,410 MB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">SOTA Firmware Downloads:</span>
                  <span className="text-white font-bold">840 MB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">CAN / UDS Telematics:</span>
                  <span className="text-white font-bold">580 MB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">InControl Remote Events:</span>
                  <span className="text-white font-bold">380 MB</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Total Data Consumed:</span>
                  <span className="text-sky-400 font-bold">{selectedVehicle.dataConsumptionMb} MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connected Applications Tab */}
      {activeTab === 'apps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Connected Vehicle Applications Pipeline
            </h3>
            <button
              onClick={handleTriggerSotaCheck}
              className="rounded bg-sky-500/20 border border-sky-500/40 px-3 py-1 text-xs text-sky-300 hover:bg-sky-500/30 transition-colors font-medium"
            >
              Check SOTA Updates
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedVehicle.connectedApps.map(app => (
              <div
                key={app.id}
                className="rounded-xl border border-[#224375] bg-[#152744] p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{app.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{app.category} · v{app.version}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                    app.status === 'Operational' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' :
                    app.status === 'Degraded' ? 'bg-amber-950 text-amber-300 border border-amber-700/50' :
                    app.status === 'Updating' ? 'bg-sky-950 text-sky-300 border border-sky-700/50' :
                    'bg-[#1a3156] text-slate-400'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono border-t border-[#224375] pt-2 text-slate-300">
                  <span>Latency: <strong className="text-white">{app.latencyMs} ms</strong></span>
                  <span>Sync: <strong className="text-white">{app.lastSync}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DTC Diagnostics Tab */}
      {activeTab === 'dtc' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Diagnostic Trouble Codes (DTC) Telemetry
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Standard OBD-II & JLR Unified Diagnostic Services (UDS) active fault registers
              </p>
            </div>
            <button
              onClick={handleRemoteDiagnosticScan}
              className="rounded bg-sky-500/20 border border-sky-500/40 px-3 py-1 text-xs text-sky-300 hover:bg-sky-500/30 transition-colors font-medium"
            >
              Clear Stored DTCs / Re-scan
            </button>
          </div>

          {selectedVehicle.dtcCodes.length === 0 ? (
            <div className="rounded-xl border border-[#224375] bg-[#152744] p-8 text-center space-y-2">
              <CheckCircle2 size={32} className="mx-auto text-sky-400" />
              <div className="text-sm font-bold text-white">Zero Active Fault Codes</div>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                All 68 electronic control modules (Powertrain, Body, Chassis, Network, High-Voltage Battery) are operating within certified operational thresholds.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedVehicle.dtcCodes.map(dtc => (
                <div
                  key={dtc.code}
                  className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-red-400">{dtc.code}</span>
                      <span className="rounded bg-red-900/50 px-2 py-0.5 text-[10px] font-mono text-red-200 border border-red-700/50">
                        {dtc.subsystem}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-300">Observed {dtc.firstObserved}</span>
                  </div>
                  <p className="text-xs text-slate-200">{dtc.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Move SIM & RSP Profile Tab */}
      {activeTab === 'sim' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#224375] bg-[#152744] p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between pb-3 border-b border-[#224375]">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/tata_move_sim_iot_1790688234187.jpg"
                  alt="Tata Move SIM Microchip"
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-lg border border-sky-500/40 object-cover"
                />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Tata Communications MOVE™ eUICC Hardware Entity
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    GSMA SGP.02 / SGP.22 compliant automotive grade eSIM with dynamic multi-IMSI switching
                  </p>
                </div>
              </div>
              <button
                onClick={() => switchEsimProfile(selectedVehicle.vin)}
                className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-sky-400 transition-colors shadow-sm"
              >
                Toggle Profile State
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2 rounded-lg border border-[#224375] bg-[#12233f] p-3">
                <div className="text-[10px] text-sky-400 font-bold uppercase">Active eUICC State</div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">ICCID:</span>
                  <span className="text-sky-300 font-bold bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30">{selectedVehicle.simIccid}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">IMSI:</span>
                  <span className="text-white font-bold">{selectedVehicle.simImsi}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Current Profile:</span>
                  <span className="text-sky-300 font-bold">{selectedVehicle.eUiccProfile}</span>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-[#224375] bg-[#12233f] p-3">
                <div className="text-[10px] text-sky-400 font-bold uppercase">Move Server Endpoints</div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">SM-DP+ Address:</span>
                  <span className="text-slate-200">smdp.tatamove.jlr.com</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#224375]">
                  <span className="text-slate-400">SM-SR Entity:</span>
                  <span className="text-slate-200">smsr.global.tatacommunications.com</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">RSP Status:</span>
                  <span className="text-emerald-400 font-bold">Synchronized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

