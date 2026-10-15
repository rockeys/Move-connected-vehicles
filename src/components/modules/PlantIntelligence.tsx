import React, { useState } from 'react';
import { 
  Factory, 
  Car, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Clock, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  ChevronRight, 
  Filter, 
  Users, 
  Settings, 
  Cpu 
} from 'lucide-react';
import { SimCardIcon } from '../common/SimCardIcon';
import { useApp } from '../../context/AppContext';
import { Plant, ProductionLine } from '../../types';

export const PlantIntelligence: React.FC = () => {
  const { 
    plants, 
    filters, 
    setFilter, 
    vehicles, 
    navigateToCockpit, 
    incidents,
    setActiveModule
  } = useApp();

  const [activePlantId, setActivePlantId] = useState<string>(
    filters.plantId !== 'all' ? filters.plantId : plants[0].id
  );

  const selectedPlant = plants.find(p => p.id === activePlantId) || plants[0];

  const plantVehicles = vehicles.filter(v => v.plantId === selectedPlant.id);
  const plantIncidents = incidents.filter(i => i.plantId === selectedPlant.id);

  // Line status calculation
  const totalHourlyOutput = selectedPlant.activeLines.reduce((acc, l) => acc + l.currentOutputPerHour, 0);
  const targetHourlyOutput = selectedPlant.activeLines.reduce((acc, l) => acc + l.targetOutputPerHour, 0);
  const avgSimSuccess = (
    selectedPlant.activeLines.reduce((acc, l) => acc + l.simProvisionSuccessRate, 0) / 
    (selectedPlant.activeLines.length || 1)
  ).toFixed(2);

  return (
    <div className="space-y-3">
      {/* Module Header & Hierarchy Navigator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Plant & Manufacturing Intelligence
          </h1>
          {/* <p className="text-xs text-slate-300">
            End-to-End assembly line telemetry, TCU harness integration, and Tata Move eUICC provisioning audits
          </p> */}
        </div>

        
      </div>
      {/* Plant Selector Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg border border-[#224375] bg-[#152744]">
          {plants.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setActivePlantId(p.id);
                setFilter('plantId', p.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activePlantId === p.id
                  ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#1a3156]'
              }`}
            >
              {p.shortName}
            </button>
          ))}
        </div>

      {/* Selected Plant Overview Card & Key KPIs */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#224375]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400">
              <Factory size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{selectedPlant.name}</h2>
                <span className="rounded bg-[#152744] px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-[#224375]">
                  {selectedPlant.country}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Facility Lead: <strong className="text-white">{selectedPlant.managerName}</strong> · Primary Telco: <strong className="text-sky-300">{selectedPlant.primaryOperator}</strong>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400">Models Assembled:</span>
                {selectedPlant.modelsProduced.map(m => (
                  <span key={m} className="rounded bg-[#152744] border border-[#224375] px-2 py-0.5 text-[11px] font-medium text-slate-200">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-[#224375] bg-[#152744] px-4 py-2.5 text-center">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Readiness Score</div>
              <div className="text-xl font-bold font-mono text-sky-400">{selectedPlant.readinessScore}%</div>
            </div>
            <div className="rounded-lg border border-[#224375] bg-[#152744] px-4 py-2.5 text-center">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">SIM Activation</div>
              <div className="text-xl font-bold font-mono text-white">{selectedPlant.simActivationRate}%</div>
            </div>
          </div>
        </div>

        {/* 6 Plant Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
          <div className="rounded-lg border border-[#224375] bg-[#152744] p-3">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Production</div>
            <div className="text-base font-bold font-mono text-white mt-1">{selectedPlant.totalProductionYTD.toLocaleString()}</div>
            <div className="text-[10px] text-slate-300 mt-1 font-mono">+12.4% YTD</div>
          </div>
          <div className="rounded-lg border border-[#224375] bg-[#152744] p-3">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Connected Units</div>
            <div className="text-base font-bold font-mono text-sky-300 mt-1">{selectedPlant.connectedVehiclesYTD.toLocaleString()}</div>
            <div className="text-[10px] text-slate-300 mt-1 font-mono">99.8% Factory Rate</div>
          </div>
          <div className="rounded-lg border border-[#224375] bg-[#152744] p-3">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Provisioning SLA</div>
            <div className="text-base font-bold font-mono text-white mt-1">{selectedPlant.provisioningSuccessRate}%</div>
            <div className="text-[10px] text-sky-400 mt-1 font-mono">Target: 99.80%</div>
          </div>
          <div className="rounded-lg border border-[#224375] bg-[#152744] p-3">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Line Throughput</div>
            <div className="text-base font-bold font-mono text-white mt-1">{totalHourlyOutput} / {targetHourlyOutput} uph</div>
            <div className="text-[10px] text-slate-300 mt-1 font-mono">Units Per Hour</div>
          </div>
          <div className="rounded-lg border border-[#224375] bg-[#152744] p-3">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Defect Rate (PPM)</div>
            <div className="text-base font-bold font-mono text-white mt-1">{selectedPlant.defectRatePpm} PPM</div>
            <div className="text-[10px] text-emerald-400 mt-1 font-mono font-semibold">Industry Low</div>
          </div>
          <div className="rounded-lg border border-[#224375] bg-[#152744] p-3">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">TCU Incidents</div>
            <div className="text-base font-bold font-mono text-amber-400 mt-1">{selectedPlant.connectivityIncidentsYTD}</div>
            <div className="text-[10px] text-slate-300 mt-1 font-mono">Under Investigation</div>
          </div>
        </div>
      </div>

      {/* Production Lines Breakdown for Selected Plant */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Layers size={16} className="text-sky-400" />
            Active Production Lines ({selectedPlant.activeLines.length})
          </h3>
          <span className="text-xs font-mono text-sky-400">
            Avg SIM Provisioning Yield: {avgSimSuccess}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedPlant.activeLines.map(line => (
            <div 
              key={line.id} 
              className="rounded-xl border border-[#224375] bg-[#1a3156] p-4.5 space-y-3 shadow-md hover:border-sky-500/50 transition-all"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#224375]/80">
                <span className="font-bold text-white">{line.name}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                  line.status === 'Optimal' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50' :
                  line.status === 'Degraded' ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50' :
                  'bg-red-950/80 text-red-300 border border-red-600/50'
                }`}>
                  {line.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Line Stage</span>
                <p className="text-xs font-semibold text-white">{line.stage}</p>
              </div>

              <div className="space-y-1.5 text-xs pt-1 border-t border-[#224375]/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Output Velocity:</span>
                  <span className="font-mono font-bold text-white">
                    {line.currentOutputPerHour} / {line.targetOutputPerHour} uph
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">SIM Provision Success:</span>
                  <span className="font-mono font-bold text-sky-400">
                    {line.simProvisionSuccessRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Cycle Time:</span>
                  <span className="font-mono text-slate-200">
                    {line.activeCycleTimeMinutes} mins
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Station Engineers:</span>
                  <span className="font-mono text-slate-200">
                    {line.technicianCount} staff
                  </span>
                </div>
              </div>

              {/* Step indicator */}
              <div className="text-[10px] text-slate-300 flex items-center justify-between">
                <span>Tata Move Bootstrap Test:</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={12} /> Certified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicles Manufactured at this Plant */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#224375]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Car size={14} className="text-sky-400" />
              Connected Vehicles Originating From {selectedPlant.shortName}
            </h3>
            
          </div>
          <button
            onClick={() => setActiveModule('fleet-management')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
          >
            All Fleet Records <ChevronRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#224375] bg-[#152744] text-[10px] uppercase font-bold text-slate-300">
              <tr>
                <th className="py-2.5 px-3">VIN</th>
                <th className="py-2.5 px-3">Model / Variant</th>
                <th className="py-2.5 px-3">Production Line</th>
                <th className="py-2.5 px-3">Move SIM ICCID</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Signal</th>
                <th className="py-2.5 px-3">Health</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#224375]/60 font-mono text-[11px]">
              {plantVehicles.map(veh => (
                <tr 
                  key={veh.vin} 
                  className="hover:bg-[#203c68]/60 transition-colors group cursor-pointer"
                  onClick={() => navigateToCockpit(veh.vin)}
                >
                  <td className="py-2.5 px-3 font-bold text-white group-hover:text-sky-300">
                    {veh.vin}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-100">
                    {veh.model} · <span className="text-slate-300 text-[10px]">{veh.variant}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">
                    {veh.productionLine}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {veh.simIccid.slice(0, 10)}...{veh.simIccid.slice(-4)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                      veh.status === 'Online' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50' :
                      veh.status === 'Roaming' ? 'bg-sky-950/80 text-sky-300 border border-sky-600/50' :
                      veh.status === 'Degraded' ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50' :
                      veh.status === 'Critical' ? 'bg-red-950/80 text-red-300 border border-red-600/50' :
                      'bg-[#152744] text-slate-300 border border-[#224375]'
                    }`}>
                      {veh.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">
                    {veh.signalRssi} dBm <span className="text-slate-400 font-sans">({veh.networkTech})</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`font-bold ${
                      veh.healthScore >= 95 ? 'text-sky-400' : veh.healthScore >= 80 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {veh.healthScore}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToCockpit(veh.vin);
                      }}
                      className="rounded bg-[#152744] hover:bg-sky-500 hover:text-slate-950 border border-[#224375] px-2.5 py-1 text-[10px] font-sans font-semibold text-sky-300 transition-colors"
                    >
                      360° Cockpit →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
