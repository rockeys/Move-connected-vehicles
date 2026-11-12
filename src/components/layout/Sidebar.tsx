import React from 'react';
import { 
  LayoutDashboard, 
  Factory, 
  Car, 
  Gauge, 
  Radio, 
  Activity, 
  Layers, 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  AlertTriangle, 
  Settings, 
  ShieldCheck,
  Cpu,
  Globe
} from 'lucide-react';
import { SimCardIcon } from '../common/SimCardIcon';
import { NavigationModule } from '../../types';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed?: (c: boolean) => void;
}

interface NavItem {
  id: NavigationModule;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activeModule, setActiveModule, incidents } = useApp();

  const openIncidentsCount = incidents.filter(i => i.status !== 'Resolved').length;

  const sections: NavSection[] = [
    {
      title: 'COMMAND',
      items: [
        { id: 'executive-overview', label: 'Executive Overview', icon: LayoutDashboard },
        { id: 'country-details', label: 'Country Telematics', icon: Globe, badge: '6 Markets' }
      ]
    },
    {
      title: 'MANUFACTURING & FLEET',
      items: [
        { id: 'plant-intelligence', label: 'Plant & Manufacturing', icon: Factory, badge: '6 Plants' },
        // { id: 'fleet-management', label: 'Fleet Management', icon: Car },
        // { id: 'vehicle-360', label: 'Vehicle 360° Cockpit', icon: Gauge, badge: 'Live' }
      ]
    },
    // {
    //   title: 'CONNECTIVITY INFRASTRUCTURE',
    //   items: [
    //     { id: 'sim-management', label: 'SIM & Connectivity', icon: SimCardIcon },
    //     { id: 'network-operations', label: 'Network Operations (NOC)', icon: Radio }
    //   ]
    // },
    {
      title: 'VEHICLE INTELLIGENCE',
      items: [
        // { id: 'vehicle-health', label: 'Health & Diagnostics', icon: Activity },
        { id: 'connected-apps', label: 'Connected Applications', icon: Layers }
      ]
    },
    {
      title: 'Alerts',
      items: [
        // { id: 'business-benefits', label: 'Value Realization', icon: TrendingUp, badge: '$42.8M' },
        // { id: 'analytics-reports', label: 'Analytics & Reports', icon: BarChart3 },
        // { id: 'ai-insights', label: 'AI Insights & Assistant', icon: Sparkles, badge: 'Agent' },
        { id: 'alerts-incidents', label: 'Alerts & Incidents', icon: AlertTriangle, badge: openIncidentsCount > 0 ? `${openIncidentsCount}` : undefined, badgeColor: 'text-amber-400 bg-amber-950/80 border border-amber-800/50' }
      ]
    }
  ];

  return (
    <aside 
      className={`relative z-30 flex flex-col border-r border-[#224375] bg-[#10203a] backdrop-blur-md transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className={`flex h-18 items-center border-b border-[#224375] px-4 bg-[#132542] ${collapsed ? 'justify-center' : 'justify-start'}`}>
        {!collapsed ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider text-white">
                MOVE™
              </span>
              <span className="text-xs font-semibold text-sky-400/80">×</span>
              <span className="text-xs font-bold tracking-widest text-slate-100">
                Automotive
              </span>
            </div>
            <div className="text-[11px] font-medium tracking-tight text-sky-300/70">
              Connected Vehicle Intelligence
            </div>
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a3156] border border-[#224375] text-sky-400 font-bold text-xs shadow-inner" title="TATA MOVE™ × JLR">
            Move
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map(section => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1a3156] text-sky-300 font-semibold shadow-inner border border-sky-500/30'
                      : 'text-slate-300 hover:bg-[#152744] hover:text-white border border-transparent'
                  } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-md bg-sky-400" />
                  )}
                  <Icon 
                    size={17} 
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} 
                  />
                  {!collapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span 
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        item.badgeColor || 'bg-[#152744] text-sky-300 border border-[#224375]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Telemetry Gateway Status */}
      <div className="border-t border-[#224375] p-3 bg-[#132542]">
        {!collapsed ? (
          <div className="rounded-lg border border-[#224375] bg-[#12233f] p-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <ShieldCheck size={13} className="text-sky-400" />
                Move™ RSP Cloud
              </span>
              <span className="font-mono text-[10px] text-sky-400 font-semibold">99.98%</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span>GSMA eUICC Root CA</span>
              <span className="text-slate-200 font-mono">Compliant</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1" title="Tata Move™ RSP Cloud: 99.98% OK">
            <Cpu size={16} className="text-sky-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
