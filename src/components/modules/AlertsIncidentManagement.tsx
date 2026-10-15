import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Filter, 
  Search, 
  ArrowRight, 
  UserCheck, 
  Sparkles, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AlertSeverity } from '../../types';

export const AlertsIncidentManagement: React.FC = () => {
  const { incidents, acknowledgeIncident, resolveIncident, navigateToCockpit, showToast } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && inc.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return inc.title.toLowerCase().includes(q) || inc.id.toLowerCase().includes(q) || inc.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <span>INCIDENT COMMAND & CORRELATION ENGINE</span>
            
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <AlertTriangle size={22} className="text-amber-400" />
            Alerts & Incident Management Center
          </h1>
          
        </div>

        
      </div>

      
      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 shadow-lg flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="rounded-lg border border-[#224375] bg-[#152744] px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-sky-400"
            >
              <option value="all" className="bg-[#152744] text-white">All Severities</option>
              <option value="critical" className="bg-[#152744] text-white">Critical</option>
              <option value="high" className="bg-[#152744] text-white">High</option>
              <option value="medium" className="bg-[#152744] text-white">Medium</option>
              <option value="low" className="bg-[#152744] text-white">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-[#224375] bg-[#152744] px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-sky-400"
            >
              <option value="all" className="bg-[#152744] text-white">All Statuses</option>
              <option value="open" className="bg-[#152744] text-white">Open</option>
              <option value="investigating" className="bg-[#152744] text-white">Investigating</option>
              <option value="mitigated" className="bg-[#152744] text-white">Mitigated</option>
              <option value="resolved" className="bg-[#152744] text-white">Resolved</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-[#224375] bg-[#152744] py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-sans"
          />
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filteredIncidents.map(inc => (
          <div
            key={inc.id}
            className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 space-y-3.5 shadow-lg hover:border-sky-500/50 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#224375]/80">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-white">{inc.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                  inc.severity === 'critical' ? 'bg-red-950/80 text-red-300 border border-red-700/60' :
                  inc.severity === 'high' ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60' :
                  'bg-[#152744] text-slate-300 border border-[#224375]'
                }`}>
                  {inc.severity}
                </span>
                <span className="text-xs font-semibold text-slate-200">{inc.category}</span>
                {inc.correlationCluster && (
                  <span className="rounded bg-sky-950/80 text-sky-300 border border-sky-800/40 px-2 py-0.5 text-[10px] font-mono">
                    Cluster: {inc.correlationCluster}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">{inc.timestamp}</span>
                <span className={`font-semibold ${
                  inc.status === 'Resolved' ? 'text-emerald-400' :
                  inc.status === 'Investigating' ? 'text-sky-300' : 'text-amber-400'
                }`}>
                  {inc.status}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{inc.title}</h3>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{inc.description}</p>
            </div>

            {inc.rootCauseAnalysis && (
              <div className="rounded-lg bg-[#152744] p-3 text-xs border border-[#224375] space-y-1 font-mono">
                <span className="text-[10px] text-sky-400 font-bold uppercase block">Root Cause Analysis</span>
                <p className="text-slate-200 font-sans">{inc.rootCauseAnalysis}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#224375]/80 text-xs">
              <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
                <span>Assigned: <strong className="text-white">{inc.assignedTeam}</strong></span>
                <span>Affected Fleet: <strong className="text-sky-300">{inc.affectedVinCount} unit(s)</strong></span>
              </div>

              <div className="flex items-center gap-2">
                {inc.targetVin && (
                  <button
                    onClick={() => navigateToCockpit(inc.targetVin!)}
                    className="rounded bg-[#152744] hover:bg-[#203c68] border border-[#224375] px-3 py-1.5 text-xs text-slate-200 hover:text-white font-medium transition-colors"
                  >
                    Inspect VIN {inc.targetVin.slice(0, 10)}... →
                  </button>
                )}

                {inc.status === 'Open' && (
                  <button
                    onClick={() => acknowledgeIncident(inc.id)}
                    className="rounded bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}

                {inc.status === 'Investigating' && (
                  <button
                    onClick={() => resolveIncident(inc.id)}
                    className="rounded bg-sky-500 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-sky-400 transition-colors shadow-sm"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
