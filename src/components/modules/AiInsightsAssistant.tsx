import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  Factory, 
  Car, 
  ArrowRight, 
  ExternalLink, 
  ChevronRight, 
  Zap 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    targetModule: any;
    plantId?: string;
  };
  metrics?: { label: string; value: string }[];
}

export const AiInsightsAssistant: React.FC = () => {
  const { 
    vehicles, 
    plants, 
    incidents, 
    setActiveModule, 
    setFilter, 
    navigateToCockpit, 
    navigateToPlant 
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello, I am the Tata Move™ Fleet Intelligence Agent. I continuously analyze real-time telematics, carrier latency, and plant assembly metrics across all 443,620 connected Jaguar Land Rover vehicles. How can I assist your operations today?",
      timestamp: 'Just now',
      metrics: [
        { label: 'Fleet SLA', value: '99.982%' },
        { label: 'Active Alerts', value: '5 Clusters' },
        { label: 'Realized Value', value: '$42.8M' }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Pre-configured executive prompt pills
  const samplePrompts = [
    "Show all offline vehicles across JLR plants.",
    "Which plant has the highest connectivity failure rate?",
    "Identify vehicle models experiencing network degradation.",
    "Show the top connectivity incidents this week.",
    "What is the current Move SIM availability?",
    "Which network operators are experiencing performance issues?",
    "Summarize the business impact of connectivity incidents."
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Context-grounded intelligent answer generation
    setTimeout(() => {
      let replyText = '';
      let suggestedAction: any = undefined;
      let metrics: { label: string; value: string }[] | undefined = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('offline')) {
        const offlineCount = vehicles.filter(v => v.status === 'Offline').length;
        replyText = `Across the global fleet, 18,420 vehicles (approx 4.1%) are currently offline. In our live active sample, ${offlineCount} unit(s) are registered as offline—notably Range Rover Evoque SALCA2V45RA991823 in Paris, France (parked in a multi-story subterranean garage). eCall safety circuit remains on standby.`;
        suggestedAction = { label: 'Filter Offline Vehicles in Fleet Grid', targetModule: 'fleet-management' };
        metrics = [{ label: 'Offline Total', value: '18,420' }, { label: 'Deep Sleep Ratio', value: '98.4%' }];
      } else if (lower.includes('plant') && (lower.includes('highest') || lower.includes('failure') || lower.includes('rate'))) {
        replyText = `Analyzing plant EOL provisioning telemetry: Changshu Plant (China) and Itatiaia (Brazil) have the highest defect/re-test rates at 32 PPM and 38 PPM respectively due to regional carrier registration latency. In contrast, Solihull Plant (UK) and Halewood (UK) lead globally with 99.85% and 99.87% first-pass SIM activation rates.`;
        suggestedAction = { label: 'Inspect Changshu Plant Telemetry', targetModule: 'plant-intelligence', plantId: 'changshu' };
        metrics = [{ label: 'Top Plant', value: 'Solihull (99.85%)' }, { label: 'Review Plant', value: 'Changshu (99.70%)' }];
      } else if (lower.includes('degradation') || lower.includes('models')) {
        replyText = `Currently, Range Rover Sport and Defender units roaming in Southern Germany / Upper Bavaria are experiencing localized latency degradation (averaging 142ms vs nominal 26ms) due to Deutsche Telekom cell tower backhaul maintenance along the A8 motorway corridor. Tata Move policy engine is executing dynamic failover to Telefónica Kite.`;
        suggestedAction = { label: 'Open Network Operations (NOC)', targetModule: 'network-operations' };
        metrics = [{ label: 'Impacted Models', value: 'Range Rover Sport' }, { label: 'Carrier Degraded', value: 'Deutsche Telekom' }];
      } else if (lower.includes('incident') || lower.includes('top')) {
        replyText = `There are currently 5 active correlated incidents. The top critical incident is INC-2026-8809: High-Voltage Battery Cell Imbalance (P0A80-00, delta > 45mV) on Jaguar I-PACE SADCK2A14LA389201 in New York, flagged for immediate dealer proactive service. The highest volume incident is INC-2026-8812 (A8 corridor cell congestion affecting 18 vehicles).`;
        suggestedAction = { label: 'View Incident Management', targetModule: 'alerts-incidents' };
        metrics = [{ label: 'Active Incidents', value: '5' }, { label: 'Critical Alarms', value: '1' }];
      } else if (lower.includes('availability') || lower.includes('move sim')) {
        replyText = `Current Tata Communications Move™ fleet connectivity availability is 99.982%, which outperforms the contractual 99.950% Tier-1 SLA. Active Move SIM count stands at 439,810 with 99.89% carrier handover success and 26.4ms average latency globally.`;
        suggestedAction = { label: 'View Executive Overview', targetModule: 'executive-overview' };
        metrics = [{ label: 'Move Availability', value: '99.982%' }, { label: 'Active SIMs', value: '439,810' }];
      } else if (lower.includes('operator') || lower.includes('performance') || lower.includes('network')) {
        replyText = `Of the 6 primary tier-1 network operators, Unicom IoT leads in uptime (99.99%) and latency (21ms). Vodafone IoT Global and AT&T Enterprise IoT are nominal with 99.98% and 99.94% availability. Deutsche Telekom IoT is currently flagged as 'Degraded' (48ms avg latency, 1.12% packet loss) on Central European roaming links.`;
        suggestedAction = { label: 'View Carrier Matrix in NOC', targetModule: 'network-operations' };
        metrics = [{ label: 'Top Operator', value: 'China Unicom (99.99%)' }, { label: 'Degraded', value: 'Deutsche Telekom' }];
      } else if (lower.includes('business') || lower.includes('value') || lower.includes('impact') || lower.includes('cost')) {
        replyText = `Tata Move SIM technology has generated $42.8M in cumulative economic value for JLR. This includes $21.4M saved through SOTA remote firmware recall avoidance (142,000 dealer visits eliminated), $8.45M in factory EOL cycle time reduction (-3.8 mins per car), and $11.6M through multi-IMSI local profile roaming cost reduction.`;
        suggestedAction = { label: 'Inspect Value Realization', targetModule: 'business-benefits' };
        metrics = [{ label: 'Total Value', value: '$42.8M' }, { label: 'SOTA Savings', value: '$21.4M' }];
      } else {
        replyText = `Based on the latest JLR telematics telemetry and Tata Move network registers: 443,620 connected vehicles are active across 6 assembly facilities. Global availability is 99.982%, active data consumption is 4.82 PB, and zero widespread plant line stoppages are present.`;
        suggestedAction = { label: 'Explore Fleet Cockpit', targetModule: 'fleet-management' };
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: 'Just now',
        suggestedAction,
        metrics
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <span>TATA MOVE™ PREDICTIVE & PRESCRIPTIVE COCKPIT</span>
            <span>·</span>
            <span>AGENTIC TELEMATICS</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <Sparkles size={22} className="text-sky-400" />
            AI Fleet Intelligence & Natural Language Assistant
          </h1>
          <p className="text-xs text-slate-300">
            Ask complex operational questions, explore predictive anomaly forecasts, and execute automated remediation
          </p>
        </div>
      </div>

      {/* Top 3 Predictive Anomaly Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-amber-500/40 bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-400 font-mono flex items-center gap-1.5">
              <AlertTriangle size={13} /> Predictive Roaming Congestion
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Confidence: 94%</span>
          </div>
          <h3 className="text-xs font-bold text-white">
            Impending 4G Handover Bottleneck on A8 Autobahn
          </h3>
          <p className="text-[11px] text-slate-300">
            Carrier maintenance window between 14:00–18:00 UTC will cause latency degradation for ~34 approaching Range Rovers.
          </p>
          <div className="pt-2 border-t border-[#224375]/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Prescription: Pre-emptive carrier profile swap</span>
            <button
              onClick={() => {
                setFilter('model', 'all');
                setActiveModule('network-operations');
              }}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5 transition-colors"
            >
              Action →
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-red-500/40 bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-red-400 font-mono flex items-center gap-1.5">
              <Zap size={13} /> Battery Thermal Deviation Forecast
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Confidence: 98%</span>
          </div>
          <h3 className="text-xs font-bold text-white">
            Cell Group 4 Divergence on Jaguar I-PACE (VIN: ...389201)
          </h3>
          <p className="text-[11px] text-slate-300">
            Telemetry pattern indicates 42mV voltage delta during DC fast charging. Thermal runaway prevention logic active.
          </p>
          <div className="pt-2 border-t border-[#224375]/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Prescription: Dispatch dealer remote triage</span>
            <button
              onClick={() => navigateToCockpit('SADCK2A14LA389201')}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5 transition-colors"
            >
              Inspect 360° →
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-sky-500/40 bg-[#1a3156] p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-sky-400 font-mono flex items-center gap-1.5">
              <Factory size={13} /> Plant SIM Provisioning Yield Alert
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Confidence: 91%</span>
          </div>
          <h3 className="text-xs font-bold text-white">
            Solihull Line 3 TCU Flashing Optimization Opportunity
          </h3>
          <p className="text-[11px] text-slate-300">
            Wi-Fi channel harmonization reduced timeout occurrences by 78%. Target cycle time achievable in upcoming shift.
          </p>
          <div className="pt-2 border-t border-[#224375]/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Prescription: Lock channel 44 on AP cluster</span>
            <button
              onClick={() => navigateToPlant('solihull')}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5 transition-colors"
            >
              Plant View →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Natural Language Chat Assistant */}
      <div className="rounded-xl border border-[#224375] bg-[#1a3156] shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-[#224375] px-5 py-3.5 bg-[#152744]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Tata Move™ Conversational Fleet Copilot
              </h3>
              <p className="text-[10px] text-slate-300">
                Connected to JLR Global Telematics Lake & GSMA RSP Orchestrator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-300">Live Agent Ready</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#12233e]">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-[#1f3b68] text-sky-300' 
                  : 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
              }`}>
                {msg.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
              </div>

              <div className={`rounded-xl p-3.5 space-y-2 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sky-600/30 text-sky-100 border border-sky-500/50'
                  : 'bg-[#1a3156] text-slate-200 border border-[#224375]'
              }`}>
                <p>{msg.text}</p>

                {msg.metrics && msg.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                    {msg.metrics.map(m => (
                      <span key={m.label} className="rounded bg-[#152744] px-2 py-0.5 border border-[#224375] text-slate-200">
                        {m.label}: <strong className="text-sky-400">{m.value}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {msg.suggestedAction && (
                  <div className="pt-2 border-t border-[#224375]/60">
                    <button
                      onClick={() => {
                        if (msg.suggestedAction?.plantId) {
                          navigateToPlant(msg.suggestedAction.plantId);
                        } else if (msg.suggestedAction?.targetModule) {
                          setActiveModule(msg.suggestedAction.targetModule);
                        }
                      }}
                      className="rounded bg-sky-500/20 border border-sky-500/40 px-3 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/30 transition-colors flex items-center gap-1.5"
                    >
                      {msg.suggestedAction.label} <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 text-xs text-sky-300 items-center font-mono">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                <Sparkles size={14} />
              </div>
              <span>Querying Move SIM telemetry engine...</span>
            </div>
          )}
        </div>

        {/* Sample Prompt Pills */}
        <div className="px-5 py-2 border-t border-[#224375] bg-[#152744] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-mono shrink-0">Ask:</span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="rounded-full bg-[#1a3156] hover:bg-[#203c68] text-slate-200 hover:text-white px-3 py-1 whitespace-nowrap transition-colors border border-[#224375]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#224375] bg-[#152744]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about JLR connected fleet, plant failure rates, Move SIM carriers, or SOTA..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 rounded-lg border border-[#224375] bg-[#1a3156] px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-sans"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-slate-900 font-bold hover:bg-sky-400 transition-colors disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
