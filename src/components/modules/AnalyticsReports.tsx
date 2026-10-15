import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter, 
  FileText, 
  Share2, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Car, 
  Factory, 
  Radio, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsReports: React.FC = () => {
  const { showToast, plants } = useApp();
  const [selectedReportType, setSelectedReportType] = useState<string>('fleet_sla');
  const [reportRange, setReportRange] = useState<string>('quarter');

  const scheduledReports = [
    { id: 'rep-1', title: 'Monthly JLR Executive Connectivity SLA Report', cadence: 'Monthly on 1st', recipients: 'Executive Board, VP Telematics', format: 'PDF', status: 'Active' },
    { id: 'rep-2', title: 'Plant EOL SIM Provisioning Audit & Yield', cadence: 'Weekly on Mondays', recipients: 'Plant Managers (Mumbai, Pune, Delhi)', format: 'Excel (XLSX)', status: 'Active' },
    { id: 'rep-3', title: 'Global Telco Roaming & Bandwidth Billing Ledger', cadence: 'Monthly on 15th', recipients: 'Procurement, NOC Operations', format: 'CSV', status: 'Active' },
    { id: 'rep-4', title: 'High-Voltage Battery BMS Anomaly Telemetry Digest', cadence: 'Daily at 06:00 UTC', recipients: 'Powertrain Engineering Team', format: 'JSON / PDF', status: 'Active' }
  ];

  const handleExport = (format: string) => {
    showToast(`Report Downloaded (${format})`, `Generated custom analytics report for ${reportRange.toUpperCase()} time range.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            
            <span>ENTERPRISE REPORTING ENGINE</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <BarChart3 size={22} className="text-sky-400" />
            Analytics & Executive Reporting
          </h1>
          
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-[#1a3156] px-3.5 py-1.5 text-xs font-semibold text-sky-300 hover:bg-[#203c68] transition-all shadow-sm"
          >
            <Download size={14} /> Export PDF Brief
          </button>
          <button
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 rounded-lg border border-[#224375] bg-[#152744] px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#1a3156] transition-all"
          >
            <Download size={14} /> Raw CSV
          </button>
        </div>
      </div>

      {/* Report Configuration Bar */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">Dataset:</span>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="rounded-lg border border-[#224375] bg-[#152744] px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-sky-400"
            >
              <option value="fleet_sla" className="bg-[#152744] text-white">Fleet Connectivity SLA & Availability</option>
              <option value="plant_eol" className="bg-[#152744] text-white">Plant EOL SIM Provisioning Yields</option>
              <option value="mno_roam" className="bg-[#152744] text-white">Global Telco Roaming & Bandwidth Costs</option>
              <option value="bms_dtc" className="bg-[#152744] text-white">Powertrain & Battery Health Telemetry</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">Window:</span>
            <select
              value={reportRange}
              onChange={(e) => setReportRange(e.target.value)}
              className="rounded-lg border border-[#224375] bg-[#152744] px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-sky-400"
            >
              <option value="7d" className="bg-[#152744] text-white">Last 7 Days</option>
              <option value="30d" className="bg-[#152744] text-white">Last 30 Days</option>
              <option value="quarter" className="bg-[#152744] text-white">Current Quarter (Q3 2026)</option>
              <option value="ytd" className="bg-[#152744] text-white">Year to Date (YTD)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span>Records Indexed: <strong className="text-sky-300">443,620</strong></span>
        </div>
      </div>

      {/* Scheduled Executive Reports Table */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#224375]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar size={14} className="text-sky-400" />
              Automated Scheduled Executive Reports
            </h3>
            
          </div>
          {/* <button
            onClick={() => showToast('Report Scheduler', 'Configured new automated report recipient pipeline.', 'info')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
          >
            + New Schedule
          </button> */}
        </div>

        <div className="space-y-3">
          {scheduledReports.map(rep => (
            <div
              key={rep.id}
              className="rounded-lg border border-[#224375] bg-[#152744] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{rep.title}</span>
                  <span className="rounded bg-[#1a3156] border border-[#224375] px-2 py-0.5 text-[10px] font-mono text-sky-300">
                    {rep.format}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Cadence: <span className="text-white font-medium">{rep.cadence}</span> · Recipients: <span className="text-slate-300">{rep.recipients}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={12} /> {rep.status}
                </span>
                <button
                  onClick={() => handleExport(rep.format)}
                  className="rounded bg-[#1a3156] hover:bg-[#203c68] border border-[#224375] px-3 py-1 text-[11px] font-medium text-slate-200 hover:text-white transition-colors"
                >
                  Download Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
