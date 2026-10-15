import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  Globe, 
  Sparkles, 
  ChevronRight, 
  Download, 
  Calculator,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BUSINESS_VALUE_METRICS } from '../../data/mockData';

export const BusinessValueRealization: React.FC = () => {
  const { showToast } = useApp();

  // Interactive ROI Calculator State for Executive Drilldown
  const [fleetSize, setFleetSize] = useState<number>(443620);
  const [avgSotaUpdatesPerYear, setAvgSotaUpdatesPerYear] = useState<number>(3.5);
  const [dealerCostPerVisit, setDealerCostPerVisit] = useState<number>(145);

  // Calculated Real-Time ROI
  const calculatedRecallSavings = ((fleetSize * avgSotaUpdatesPerYear * 0.32 * dealerCostPerVisit) / 1_000_000).toFixed(1);
  const calculatedEolSavings = ((fleetSize * (3.8 / 60) * 85) / 1_000_000).toFixed(1);
  const totalProjectedAnnualValue = (parseFloat(calculatedRecallSavings) + parseFloat(calculatedEolSavings) + 16.4).toFixed(1);

  const handleExportBrief = () => {
    showToast('Executive Value Report Generated', 'Exported Tata Move™ Value Realization Brief for JLR Leadership (PDF format ready).', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <span>TATA MOVE™ × JAGUAR LAND ROVER</span>
            <span>·</span>
            <span>MEASURABLE BUSINESS OUTCOMES</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <TrendingUp size={22} className="text-sky-400" />
            Business Benefits & Value Realization
          </h1>
          <p className="text-xs text-slate-300">
            Empirical financial returns, factory cycle-time compression, and warranty recall mitigation delivered by Move SIM
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportBrief}
            className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-[#1a3156] px-3.5 py-1.5 text-xs font-semibold text-sky-300 hover:bg-[#203c68] transition-all shadow-sm"
          >
            <Download size={14} /> Export Executive Brief
          </button>
        </div>
      </div>

      {/* Top 4 Value Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Realized Value</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">$42.8 Million</div>
          <p className="text-[11px] text-slate-300">+38.5% year-over-year value growth across JLR operations</p>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">SOTA Recall Mitigation</span>
            <ShieldCheck size={16} className="text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">$21.4 Million</div>
          <p className="text-[11px] text-slate-300">142,000 dealer physical service visits avoided via OTA updates</p>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Plant EOL Cycle Time</span>
            <Clock size={16} className="text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">-3.8 Minutes</div>
          <p className="text-[11px] text-slate-300">Zero-touch bootstrap eUICC provisioning at plant exit bays</p>
        </div>

        <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Roaming Cost Savings</span>
            <Globe size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">-31.2% Cost</div>
          <p className="text-[11px] text-slate-300">Dynamic multi-IMSI local switching vs static roaming tariffs</p>
        </div>
      </div>

      {/* Value Realization Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BUSINESS_VALUE_METRICS.map(bm => (
          <div
            key={bm.id}
            className="rounded-xl border border-[#224375] bg-[#1a3156] p-5 space-y-3 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-sky-500/20 border border-sky-500/40 px-2 py-0.5 text-[10px] font-mono text-sky-300 font-semibold">
                  {bm.category}
                </span>
                <span className="text-emerald-400 font-mono font-bold text-xs">
                  +{bm.growthPercent}% ROI
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2.5">{bm.metricTitle}</h3>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{bm.description}</p>
            </div>

            <div className="pt-3 border-t border-[#224375]/60 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded bg-[#152744] p-2.5 border border-[#224375]">
                <span className="text-[10px] text-slate-400 block font-sans">Delivered Outcome</span>
                <span className="text-sky-300 font-bold text-sm">{bm.realizedValue}</span>
              </div>
              <div className="rounded bg-[#152744] p-2.5 border border-[#224375]">
                <span className="text-[10px] text-slate-400 block font-sans">Net Cost Reduction</span>
                <span className="text-emerald-400 font-bold text-sm">{bm.savingsUSD}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Scaling Value & ROI Simulation Sandbox */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#224375]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Calculator size={14} className="text-sky-400" />
              Executive ROI Scaling Sandbox (Predictive Model)
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Simulate economic value delivered as JLR scales global connected fleet volume
            </p>
          </div>
          <span className="text-xs font-mono text-sky-300">
            Tata Move Economic Engine v3.4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Fleet Volume */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-200 font-medium">Global Connected Fleet Size:</span>
              <span className="font-mono font-bold text-sky-300">{fleetSize.toLocaleString()} vehicles</span>
            </div>
            <input
              type="range"
              min="200000"
              max="1000000"
              step="25000"
              value={fleetSize}
              onChange={(e) => setFleetSize(parseInt(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>200k</span>
              <span>Current (443k)</span>
              <span>1.0M</span>
            </div>
          </div>

          {/* Slider 2: SOTA Campaigns / Year */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-200 font-medium">Avg SOTA Campaigns / Year:</span>
              <span className="font-mono font-bold text-sky-300">{avgSotaUpdatesPerYear} campaigns</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={avgSotaUpdatesPerYear}
              onChange={(e) => setAvgSotaUpdatesPerYear(parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>1</span>
              <span>3.5 (Baseline)</span>
              <span>10</span>
            </div>
          </div>

          {/* Slider 3: Dealer Workshop Visit Cost */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-200 font-medium">Physical Dealer Visit Cost:</span>
              <span className="font-mono font-bold text-sky-300">${dealerCostPerVisit} USD</span>
            </div>
            <input
              type="range"
              min="80"
              max="300"
              step="5"
              value={dealerCostPerVisit}
              onChange={(e) => setDealerCostPerVisit(parseInt(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>$80</span>
              <span>$145 (Industry Avg)</span>
              <span>$300</span>
            </div>
          </div>
        </div>

        {/* Projected Calculated Outcome Banner */}
        <div className="rounded-xl border border-sky-500/30 bg-[#152744] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 font-mono">
              Projected Annualized Value at Simulated Parameters
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-0.5">
              ${totalProjectedAnnualValue} Million USD / Year
            </div>
            <p className="text-xs text-slate-200 mt-1">
              Includes ${calculatedRecallSavings}M in physical warranty avoidance and ${calculatedEolSavings}M in plant line cycle acceleration.
            </p>
          </div>

          <button
            onClick={() => {
              setFleetSize(443620);
              setAvgSotaUpdatesPerYear(3.5);
              setDealerCostPerVisit(145);
              showToast('Simulation Reset', 'Reset parameters to contractual baseline.', 'info');
            }}
            className="rounded-lg border border-[#224375] bg-[#1a3156] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-[#203c68] transition-colors"
          >
            Reset to Baseline
          </button>
        </div>
      </div>
    </div>
  );
};
