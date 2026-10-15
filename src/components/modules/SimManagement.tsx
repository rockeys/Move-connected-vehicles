import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Download, 
  Sliders, 
  Globe, 
  Cpu, 
  Database, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  HardDrive, 
  RefreshCw, 
  Search 
} from 'lucide-react';
import { SimCardIcon } from '../common/SimCardIcon';
import { useApp } from '../../context/AppContext';

export const SimManagement: React.FC = () => {
  const { vehicles, switchEsimProfile, showToast, navigateToCockpit } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<string>('all');

  const filteredSims = vehicles.filter(v => {
    if (filterState !== 'all' && !v.eUiccProfile.toLowerCase().includes(filterState.toLowerCase())) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return v.simIccid.includes(q) || v.vin.toLowerCase().includes(q) || v.model.toLowerCase().includes(q);
    }
    return true;
  });

  const handleTriggerBulkAudit = () => {
    showToast('GSMA RSP Audit Completed', 'Polled 439,810 active Tata Move eUICC endpoints. 100% cryptographic certificate compliance.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            
            <span>REMOTE SIM PROVISIONING</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <SimCardIcon size={22} className="text-sky-400" />
            SIM & Connectivity Lifecycle Management
          </h1>
          
        </div>

      </div>

      {/* Top 4 Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Active eUICC Pool</span>
            <SimCardIcon size={15} className="text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">439,810</div>
          {/* <p className="text-[11px] text-slate-300">Deployed across Range Rover, Defender & Jaguar platforms</p> */}
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Bootstrap State</span>
            <RotateCcw size={15} className="text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">3,810</div>
          {/* <p className="text-[11px] text-slate-300">At factory End-of-Line test bays & assembly staging</p> */}
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Regulatory Compliance</span>
            <Globe size={15} className="text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">100% Verified</div>
          {/* <p className="text-[11px] text-slate-300">China Cross-Border, Brazil Local, EU GDPR & India DoT</p> */}
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">SM-DP+ Throughput</span>
            <Cpu size={15} className="text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">1,420 RSP / min</div>
          {/* <p className="text-[11px] text-slate-300">Over-the-Air profile switches completed in &lt; 2.4s</p> */}
        </div>
      </div>

      

      {/* Interactive SIM Inventory Search & Table */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#224375]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Embedded Move SIM Telematics Inventory
            </h3>
            {/* <p className="text-[11px] text-slate-300 mt-0.5">
              Select any SIM to inspect RSP handshake certificates or execute live OTA profile reassignment
            </p> */}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by ICCID or VIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg border border-[#224375] bg-[#152744] py-1 pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[#224375] bg-[#152744] text-[10px] uppercase font-bold text-slate-300">
              <tr>
                <th className="py-2.5 px-3">SIM ICCID</th>
                <th className="py-2.5 px-3">Associated VIN</th>
                <th className="py-2.5 px-3 font-sans">Model</th>
                <th className="py-2.5 px-3">Profile State</th>
                <th className="py-2.5 px-3 font-sans">Primary Carrier</th>
                <th className="py-2.5 px-3">Consumption</th>
                <th className="py-2.5 px-3 text-right">RSP Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#224375]/60 text-[11px]">
              {filteredSims.map(v => (
                <tr key={v.simIccid} className="hover:bg-[#203c68]/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-sky-400">
                    {v.simIccid}
                  </td>
                  <td className="py-3 px-3 text-white hover:underline cursor-pointer" onClick={() => navigateToCockpit(v.vin)}>
                    {v.vin}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-200">
                    {v.model}
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                      v.eUiccProfile.includes('Operational') ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50' :
                      v.eUiccProfile.includes('Bootstrap') ? 'bg-sky-950/80 text-sky-300 border border-sky-600/50' :
                      'bg-purple-950/80 text-purple-300 border border-purple-600/50'
                    }`}>
                      {v.eUiccProfile}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-200">
                    {v.networkOperator}
                  </td>
                  <td className="py-3 px-3 text-slate-200">
                    {v.dataConsumptionMb} MB
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => switchEsimProfile(v.vin)}
                      className="rounded bg-sky-500/20 border border-sky-500/40 px-2.5 py-1 text-[10px] font-sans font-semibold text-sky-300 hover:bg-sky-500/30 transition-colors"
                    >
                      Swap Profile →
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
