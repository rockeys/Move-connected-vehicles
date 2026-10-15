import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Download, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  Radio,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConnectedApplications: React.FC = () => {
  const { showToast } = useApp();
  const [selectedApp, setSelectedApp] = useState<string>('pivi');

  const apps = [
    {
      id: 'pivi',
      name: 'Pivi Pro Head Unit & Infotainment',
      category: 'Cockpit & Media',
      status: 'Operational',
      availability: 99.98,
      dailyApiVolume: '14.2M Calls',
      avgLatencyMs: 24,
      errorRate: '0.008%',
      activeCampaign: 'Pivi Pro OS 4.2.1 Global Wave (380k units updated)',
      description: 'Primary customer digital touchpoint. Streams cloud navigation, Spotify, Apple CarPlay over Tata Move high-speed cellular pipe.'
    },
    {
      id: 'incontrol',
      name: 'InControl Remote Services',
      category: 'Telematics & Remote Key',
      status: 'Operational',
      availability: 99.96,
      dailyApiVolume: '8.4M Calls',
      avgLatencyMs: 31,
      errorRate: '0.012%',
      activeCampaign: 'Instant Climate Pre-Conditioning Fast-Wake Optimization',
      description: 'Smartphone app connectivity for remote lock/unlock, battery charge scheduling, and cabin climatization.'
    },
    {
      id: 'sota',
      name: 'SOTA Software Over The Air Engine',
      category: 'ECU Firmware Pipeline',
      status: 'Operational',
      availability: 99.99,
      dailyApiVolume: '2.1M Calls',
      avgLatencyMs: 38,
      errorRate: '0.002%',
      activeCampaign: 'Campaign JLR-68ECU-2026: Powertrain calibration package',
      description: 'End-to-end cryptographic delta patching of 68 onboard electronic modules, avoiding dealership physical service recalls.'
    },
    {
      id: 'ecall',
      name: 'eCall 112 / bCall Regulatory Safety',
      category: 'Emergency SOS',
      status: 'Operational',
      availability: 99.999,
      dailyApiVolume: '420k Handshakes',
      avgLatencyMs: 16,
      errorRate: '0.0001%',
      activeCampaign: 'Continuous Autonomous Bearer Health Verification',
      description: 'Life-critical emergency telemetry transmitting Minimum Set of Data (MSD) to emergency PSAP services upon collision detection.'
    },
    {
      id: 'telematics',
      name: 'Telematics Gateway Unit (TGU)',
      category: 'CAN / UDS Cloud Streaming',
      status: 'Operational',
      availability: 99.98,
      dailyApiVolume: '28.9M Packets',
      avgLatencyMs: 21,
      errorRate: '0.004%',
      activeCampaign: 'Edge Predictive Maintenance Telemetry Compression',
      description: 'Ingests high-rate vehicle diagnostic data and streams to JLR engineering analytics lake over Tata Move secure APN.'
    },
    {
      id: 'nav',
      name: 'Cloud Navigation & Live Traffic',
      category: 'Spatial Intelligence',
      status: 'Operational',
      availability: 99.95,
      dailyApiVolume: '18.6M Points',
      avgLatencyMs: 28,
      errorRate: '0.014%',
      activeCampaign: 'Dynamic Range Estimator & EV Fast Charger Real-Time Availability',
      description: 'Real-time hazard warnings, speed camera alerts, and EV route planner with live charging stall occupancy.'
    }
  ];

  const handleTriggerSotaRollout = (appName: string) => {
    showToast('Application Audit Triggered', `Polled distributed cloud cluster for ${appName}. All regional microservices healthy.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <span>JLR CONNECTED VEHICLE SUITE</span>
           
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <Layers size={22} className="text-sky-400" />
            Connected Applications & SOTA Pipelines
          </h1>
          
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleTriggerSotaRollout('Connected Applications')}
            className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-[#1a3156] px-3.5 py-1.5 text-xs font-semibold text-sky-300 hover:bg-[#203c68] transition-all shadow-sm"
          >
            <Activity size={14} /> Health Check All Services
          </button>
        </div>
      </div>

      {/* Grid of 6 Connected Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map(app => (
          <div
            key={app.id}
            className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 space-y-3.5 shadow-lg flex flex-col justify-between hover:border-sky-500/50 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{app.name}</h3>
                  <span className="text-[10px] font-mono text-slate-300">{app.category}</span>
                </div>
                <span className="rounded bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 px-2 py-0.5 text-[10px] font-mono font-semibold">
                  {app.status}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {app.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#224375]/60 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#224375]">
                <span className="text-slate-300">Availability SLA:</span>
                <span className="text-sky-400 font-bold">{app.availability}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#224375]">
                <span className="text-slate-300">Daily API Calls:</span>
                <span className="text-white font-bold">{app.dailyApiVolume}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#224375]">
                <span className="text-slate-300">Round-Trip Latency:</span>
                <span className="text-sky-300 font-bold">{app.avgLatencyMs} ms</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-300">Error Rate:</span>
                <span className="text-emerald-400 font-bold">{app.errorRate}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#224375]/60">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Active Campaign</span>
              <div className="text-[11px] text-sky-300 font-medium truncate">
                {app.activeCampaign}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
