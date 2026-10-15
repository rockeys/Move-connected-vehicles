import React, { useState } from 'react';
import { 
  Radio, 
  Activity, 
  Globe, 
  AlertTriangle, 
  CheckCircle2, 
  Signal, 
  Zap, 
  Clock, 
  Server, 
  HardDrive, 
  ShieldCheck, 
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NETWORK_OPERATOR_METRICS, INCIDENT_ALERTS } from '../../data/mockData';

export const NetworkOperationsCenter: React.FC = () => {
  const { incidents, acknowledgeIncident, resolveIncident, showToast, setActiveModule } = useApp();
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');

  const handleTestBackbone = () => {
    showToast('Tata Move Global Backbone Tested', 'Subsea fiber circuits, SM-DP+ endpoints, and tier-1 roaming gateways verified. Avg ping: 18ms.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* NOC Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            
            <span>24/7 CELLULAR MESH MONITORING</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <Radio size={22} className="text-sky-400" />
            Connectivity Infrastructure & Carrier Matrix
          </h1>
          {/* <p className="text-xs text-slate-300">
            Real-time telemetry across 600+ partner telco carriers, subsea backhaul links, and edge cell tower performance
          </p> */}
        </div>

        
      </div>

      {/* 6 Top Network KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-3.5 space-y-1 shadow-md">
          <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Network Availability</div>
          <div className="text-lg font-bold font-mono text-sky-400">99.984%</div>
          <div className="text-[10px] text-slate-300 font-mono">SLA: 99.95%</div>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-3.5 space-y-1 shadow-md">
          <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Avg Roundtrip Latency</div>
          <div className="text-lg font-bold font-mono text-white">26.4 ms</div>
          <div className="text-[10px] text-sky-400 font-mono">-3.2ms vs benchmark</div>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-3.5 space-y-1 shadow-md">
          <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Packet Loss Rate</div>
          <div className="text-lg font-bold font-mono text-emerald-400">0.024%</div>
          <div className="text-[10px] text-slate-300 font-mono">Ultra-low packet drop</div>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-3.5 space-y-1 shadow-md">
          <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Session Handover Success</div>
          <div className="text-lg font-bold font-mono text-white">99.91%</div>
          <div className="text-[10px] text-slate-300 font-mono">Seamless cell roaming</div>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-3.5 space-y-1 shadow-md">
          <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Mean Time to Detect (MTTD)</div>
          <div className="text-lg font-bold font-mono text-white">1.8 Mins</div>
          <div className="text-[10px] text-sky-400 font-mono">Autonomous AI alarm</div>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-3.5 space-y-1 shadow-md">
          <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Mean Time to Resolve (MTTR)</div>
          <div className="text-lg font-bold font-mono text-white">14.2 Mins</div>
          <div className="text-[10px] text-emerald-400 font-mono">Dynamic carrier failover</div>
        </div>
      </div>

      {/* Global Telco Operator Performance Matrix */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#224375]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Globe size={14} className="text-sky-400" />
              Global Tier-1 Mobile Network Operator (MNO) Performance
            </h3>
            {/* <p className="text-[11px] text-slate-300 mt-0.5">
              Live latency, active SIM populations, and SLA fulfillment across regional partner carriers
            </p> */}
          </div>
          {/* <span className="text-xs font-mono text-slate-300">
            6 Core MNO Backbones Active
          </span> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[#224375] text-[10px] uppercase font-bold text-slate-300 bg-[#152744]">
              <tr>
                <th className="py-2.5 px-3 font-sans">Operator</th>
                <th className="py-2.5 px-3 font-sans">Coverage Region</th>
                <th className="py-2.5 px-3">Active SIMs</th>
                <th className="py-2.5 px-3">Technology</th>
                <th className="py-2.5 px-3">Avg Latency</th>
                <th className="py-2.5 px-3">Packet Loss</th>
                <th className="py-2.5 px-3">Uptime SLA</th>
                <th className="py-2.5 px-3 font-sans">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#224375]/60 text-[11px]">
              {NETWORK_OPERATOR_METRICS.map(mno => (
                <tr key={mno.operator} className="hover:bg-[#203c68]/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-white font-sans">
                    {mno.operator}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-200">
                    {mno.country}
                  </td>
                  <td className="py-3 px-3 text-slate-100">
                    {mno.activeSims.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-sky-400 font-sans font-semibold">
                    {mno.networkTech}
                  </td>
                  <td className="py-3 px-3 text-white">
                    {mno.avgLatencyMs} ms
                  </td>
                  <td className="py-3 px-3 text-slate-200">
                    {mno.packetLossPercent}%
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">
                    {mno.uptimePercent}%
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                      mno.status === 'Optimal' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50' :
                      'bg-amber-950/80 text-amber-300 border border-amber-600/50'
                    }`}>
                      {mno.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active NOC Incident Stream */}
      {/* <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#224375]">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              NOC Active Connectivity Anomalies & Remediation Feed
            </h3>
          </div>
          <button
            onClick={() => setActiveModule('alerts-incidents')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
          >
            Incident Command →
          </button>
        </div>

        <div className="space-y-3">
          {activeIncidents.map(inc => (
            <div
              key={inc.id}
              className="rounded-lg border border-[#224375] bg-[#152744] p-4 space-y-2 hover:border-sky-500/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">{inc.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    inc.severity === 'critical' ? 'bg-red-950/80 text-red-300 border border-red-700/60' :
                    inc.severity === 'high' ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60' :
                    'bg-[#12233e] text-slate-300 border border-[#224375]'
                  }`}>
                    {inc.severity}
                  </span>
                  <span className="text-xs text-slate-300">· {inc.category}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{inc.timestamp}</span>
              </div>

              <h4 className="text-xs font-bold text-white">{inc.title}</h4>
              <p className="text-[11px] text-slate-200 leading-relaxed">{inc.description}</p>

              {inc.rootCauseAnalysis && (
                <div className="rounded bg-[#12233e] p-2.5 text-[11px] text-sky-300 font-mono border border-[#224375]">
                  Root Cause: {inc.rootCauseAnalysis}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#224375]/60 text-xs">
                <span className="font-mono text-slate-300">
                  Impact: <strong className="text-white">{inc.affectedVinCount} vehicles</strong>
                </span>

                <div className="flex items-center gap-2">
                  {inc.status === 'Open' && (
                    <button
                      onClick={() => acknowledgeIncident(inc.id)}
                      className="rounded bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  {inc.status === 'Investigating' && (
                    <button
                      onClick={() => resolveIncident(inc.id)}
                      className="rounded bg-sky-500/20 border border-sky-500/40 px-2.5 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/30 transition-colors"
                    >
                      Resolve Incident
                    </button>
                  )}
                  <span className="text-slate-400 text-[11px] font-mono">Assigned: {inc.assignedTeam}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};
