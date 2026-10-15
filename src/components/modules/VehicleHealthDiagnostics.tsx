import React, { useState } from 'react';
import { 
  Activity, 
  Battery, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Gauge, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Car, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VehicleHealthDiagnostics: React.FC = () => {
  const { vehicles, navigateToCockpit, pingVehicle, showToast } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchDtc, setSearchDtc] = useState<string>('');

  const vehiclesWithDtc = vehicles.filter(v => v.dtcCodes.length > 0);

  const handleFleetDiagnosticsSweep = () => {
    showToast('Fleet UDS Scan Initiated', 'Sent remote diagnostic scan commands across 443,620 active Move SIM endpoints.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            
            <span>TELEMATICS DIAGNOSTIC SUITE</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <Activity size={22} className="text-sky-400" />
            Vehicle Health & Predictive Diagnostics
          </h1>
          
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleFleetDiagnosticsSweep}
            className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-[#1a3156] px-3.5 py-1.5 text-xs font-semibold text-sky-300 hover:bg-[#203c68] transition-all shadow-sm"
          >
            <RefreshCw size={14} /> Fleet Diagnostics Sweep
          </button>
        </div>
      </div>

      {/* Top 4 Health Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Fleet Health Index</span>
            <Activity size={16} className="text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">98.4 / 100</div>
          <p className="text-[11px] text-slate-300">99.2% of vehicles reporting zero critical powertrain faults</p>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Active DTC Faults</span>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">142 Active</div>
          <p className="text-[11px] text-slate-300">Powertrain (12), Network (84), Body (32), EV Battery (14)</p>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">EV Battery SoH Avg</span>
            <Battery size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">98.2%</div>
          <p className="text-[11px] text-slate-300">Measured across Range Rover PHEV & Jaguar I-PACE</p>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Preventive Work Orders</span>
            <ShieldCheck size={16} className="text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">28 Dispatched</div>
          <p className="text-[11px] text-slate-300">Dealer proactive scheduling before roadside breakdown</p>
        </div>
      </div>

      {/* Vehicles with Active Diagnostic Trouble Codes Table */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#224375]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400" />
              Vehicles Requiring Diagnostic Attention
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Live CAN bus diagnostic fault codes reported via Tata Move high-priority bearer
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search DTC code (e.g. P0A80)..."
                value={searchDtc}
                onChange={(e) => setSearchDtc(e.target.value)}
                className="rounded-lg border border-[#224375] bg-[#152744] py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {vehiclesWithDtc.map(veh => (
            <div
              key={veh.vin}
              className="rounded-lg border border-[#224375] bg-[#152744] p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white hover:text-sky-300 cursor-pointer transition-colors" onClick={() => navigateToCockpit(veh.vin)}>
                    {veh.vin}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">· {veh.model} ({veh.variant})</span>
                  <span className="rounded bg-[#1a3156] border border-[#224375] px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                    {veh.plantName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-300">Health: <strong className="text-amber-400">{veh.healthScore}%</strong></span>
                  <button
                    onClick={() => navigateToCockpit(veh.vin)}
                    className="rounded bg-sky-500/20 border border-sky-500/40 px-2.5 py-1 text-[10px] font-semibold text-sky-300 hover:bg-sky-500/30 transition-colors"
                  >
                    Launch 360° →
                  </button>
                </div>
              </div>

              {/* DTC list */}
              <div className="space-y-2 pt-1">
                {veh.dtcCodes.map(dtc => (
                  <div
                    key={dtc.code}
                    className="rounded border border-[#224375] bg-[#1a3156] p-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-red-400">{dtc.code}</span>
                      <span className="rounded bg-red-950/80 border border-red-700/60 px-1.5 py-0.5 text-[9px] font-mono text-red-300 uppercase">
                        {dtc.subsystem}
                      </span>
                      <span className="text-slate-200 text-[11px]">{dtc.description}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      Observed: {dtc.firstObserved}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
