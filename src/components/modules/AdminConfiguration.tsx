import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Users, 
  Cpu, 
  Database, 
  Server, 
  Key, 
  Globe, 
  CheckCircle2, 
  Sliders, 
  Save,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminConfiguration: React.FC = () => {
  const { showToast } = useApp();

  const [tcuTimeoutSeconds, setTcuTimeoutSeconds] = useState<number>(8.0);
  const [dataQuotaPerVehicleGb, setDataQuotaPerVehicleGb] = useState<number>(25);
  const [selectedRole, setSelectedRole] = useState<string>('Director');

  const handleSaveConfig = () => {
    showToast('Platform Configuration Saved', 'Synchronized updated Move SIM parameters with Tata Move Global Policy Orchestrator.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <span>TATA MOVE™ PLATFORM GOVERNANCE</span>
            <span>·</span>
            <span>SECURITY, POLICIES & ENTERPRISE INTEGRATIONS</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <Settings size={22} className="text-sky-400" />
            Administration & Global Configuration
          </h1>
          <p className="text-xs text-slate-300">
            Provisioning server endpoints, carrier priority policies, plant timeout limits, and RBAC security credentials
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSaveConfig}
            className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-1.5 text-xs font-bold text-slate-900 hover:bg-sky-400 transition-colors shadow-sm"
          >
            <Save size={14} /> Save Configuration
          </button>
        </div>
      </div>

      {/* Grid of Config Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1: Tata Move SM-DP+ & SM-SR GSMA Server Config */}
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#224375]">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                GSMA RSP Root Servers (SGP.02 / SGP.22)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 size={12} /> Live / Connected
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-[11px] text-slate-300 font-sans block mb-1">SM-DP+ Subscription Manager Data Preparation</label>
              <input
                type="text"
                readOnly
                value="smdp.tatamove.jlr.com:8443 (Cert: DigiCert GSMA Root)"
                className="w-full rounded border border-[#224375] bg-[#152744] px-3 py-1.5 text-slate-100"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-sans block mb-1">SM-SR Subscription Manager Secure Routing</label>
              <input
                type="text"
                readOnly
                value="smsr.global.tatacommunications.com:8443"
                className="w-full rounded border border-[#224375] bg-[#152744] px-3 py-1.5 text-slate-100"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-sans block mb-1">eUICC OEM Certificate Issuer ID</label>
              <input
                type="text"
                readOnly
                value="JLR-MOVE-EID-ROOT-2026-X509"
                className="w-full rounded border border-[#224375] bg-[#152744] px-3 py-1.5 text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Panel 2: Plant EOL Provisioning Timeouts */}
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#224375]">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Manufacturing Assembly Line Flashing Thresholds
              </h3>
            </div>
            <span className="text-[10px] font-mono text-sky-300">All 6 Plants</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-200 font-medium">TCU Flashing Max Timeout:</span>
                <span className="font-mono font-bold text-sky-300">{tcuTimeoutSeconds} seconds</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="15.0"
                step="0.5"
                value={tcuTimeoutSeconds}
                onChange={(e) => setTcuTimeoutSeconds(parseFloat(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                Alarms trigger if bootstrap handshake exceeds threshold during cycle time.
              </span>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-200 font-medium">Monthly Telematics High-Speed Quota:</span>
                <span className="font-mono font-bold text-sky-300">{dataQuotaPerVehicleGb} GB / month</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={dataQuotaPerVehicleGb}
                onChange={(e) => setDataQuotaPerVehicleGb(parseInt(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                High-priority SOTA and Pivi Pro traffic throttled after quota cap.
              </span>
            </div>
          </div>
        </div>

        {/* Panel 3: Enterprise Integrations Status */}
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#224375]">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Enterprise Back-Office Connectors
              </h3>
            </div>
            <span className="text-[10px] font-mono text-sky-300">4 / 4 Synced</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-[#224375]">
              <span className="font-medium text-slate-200">JLR SAP Manufacturing ERP:</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={12} /> Connected (22ms)
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#224375]">
              <span className="font-medium text-slate-200">AWS InControl Cloud Telemetry Lake:</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={12} /> Connected (14ms)
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#224375]">
              <span className="font-medium text-slate-200">Tata Communications Move Core Gateway:</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={12} /> Active (99.98%)
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="font-medium text-slate-200">European 112 PSAP Emergency Bearer:</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={12} /> Certified ECE R144
              </span>
            </div>
          </div>
        </div>

        {/* Panel 4: Role-Based Access Control (RBAC) */}
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#224375]">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Role-Based Access Control (RBAC)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-sky-300">Enterprise SSO Active</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Active Profile Role:</span>
              <span className="font-semibold text-white">VP Connected Car & Operations</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Security Clearance:</span>
              <span className="rounded bg-sky-500/20 border border-sky-500/40 px-2 py-0.5 text-[10px] font-mono text-sky-300">
                Level 4 – Global Administrator
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Audit Logging:</span>
              <span className="font-mono text-slate-200">SHA-256 Tamper-Proof Trail Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Multi-Factor Authentication:</span>
              <span className="font-mono text-emerald-400">FIDO2 / Hardware Security Key Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
