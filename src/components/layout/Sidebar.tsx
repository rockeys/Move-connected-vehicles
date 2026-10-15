import React, { useRef, useEffect } from 'react';
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
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Cpu,
  Globe
} from 'lucide-react';
import { SimCardIcon } from '../common/SimCardIcon';
import { NavigationModule } from '../../types';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (c: boolean) => void;
}

interface NavItem {
  id: NavigationModule;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  disabled?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed: propCollapsed, 
  setCollapsed: propSetCollapsed 
}) => {
  const { activeModule, setActiveModule, incidents, sidebarCollapsed, setSidebarCollapsed } = useApp();

  const collapsed = propCollapsed !== undefined ? propCollapsed : sidebarCollapsed;
  const setCollapsed = propSetCollapsed || setSidebarCollapsed;

  const sidebarRef = useRef<HTMLElement>(null);

  // Close sidebar when clicking anywhere outside of it
  useEffect(() => {
    if (collapsed) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      // If clicked inside the sidebar element, don't close
      if (sidebarRef.current && sidebarRef.current.contains(target)) {
        return;
      }

      // If clicked on an element designated as a sidebar toggle, ignore
      if ((event.target as HTMLElement)?.closest?.('[data-sidebar-toggle]')) {
        return;
      }

      setCollapsed(true);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCollapsed(true);
      }
    };

    // Listen on document for clicks outside (both mouse and touch for mobile/tablets)
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [collapsed, setCollapsed]);

  const openIncidentsCount = incidents.filter(i => i.status !== 'Resolved').length;

  const sections: NavSection[] = [
    {
      title: 'COMMAND',
      items: [
        { id: 'executive-overview', label: 'Executive Overview', icon: LayoutDashboard },
        { id: 'country-details', label: 'Country Telematics', icon: Globe, badge: '5 Global' }
      ]
    },
    {
      title: 'MANUFACTURING & FLEET',
      items: [
        { id: 'plant-intelligence', label: 'Plant & Manufacturing', icon: Factory, badge: '6 Plants' },
        { id: 'fleet-management', label: 'Fleet Management', icon: Car },
        { id: 'vehicle-360', label: 'Vehicle 360° Cockpit', icon: Gauge, badge: 'Live' }
      ]
    },
    {
      title: 'CONNECTIVITY INFRASTRUCTURE',
      items: [
        { id: 'sim-management', label: 'SIM & Connectivity', icon: SimCardIcon },
        { id: 'network-operations', label: 'Network Operations (NOC)', icon: Radio, disabled: true }
      ]
    },
    {
      title: 'VEHICLE INTELLIGENCE',
      items: [
        // { id: 'vehicle-health', label: 'Health & Diagnostics', icon: Activity },
        { id: 'connected-apps', label: 'Connected Applications', icon: Layers }
      ]
    },
    {
      title: 'STRATEGY & AI',
      items: [
        // { id: 'business-benefits', label: 'Value Realization', icon: TrendingUp, badge: '$42.8M' },
        { id: 'analytics-reports', label: 'Analytics & Reports', icon: BarChart3, disabled: true },
        // { id: 'ai-insights', label: 'AI Insights & Assistant', icon: Sparkles, badge: 'Agent' },
        { id: 'alerts-incidents', label: 'Alerts & Incidents', icon: AlertTriangle, badge: openIncidentsCount > 0 ? `${openIncidentsCount}` : undefined, badgeColor: 'text-amber-400 bg-amber-950/80 border border-amber-800/50' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'administration', label: 'Administration & Config', icon: Settings, disabled: true }
      ]
    }
  ];

  return (
    <aside 
      ref={sidebarRef}
      className={`relative z-30 flex flex-col border-r border-[#224375] bg-[#10203a] backdrop-blur-md transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72 shadow-2xl'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#224375] px-4 bg-[#132542]">
        {!collapsed ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              
              <span className="text-sm font-bold tracking-wider text-white">
                MOVE™
              </span>
              <span className="text-xs font-semibold text-sky-400/80">×</span>
              <span className="text-xs font-bold tracking-widest text-slate-100">
                JLR
              </span>
            </div>
            <div className="text-[11px] font-medium tracking-tight text-sky-300/70">
              Connected Vehicle Intelligence
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Click to expand sidebar"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a3156] border border-[#224375] hover:border-sky-400 hover:bg-sky-500/20 text-sky-400 font-bold text-xs transition-colors cursor-pointer"
          >
            Move
          </button>
        )}

        {/* <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#224375] text-slate-300 hover:border-sky-500/50 hover:bg-[#1a3156] hover:text-white transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button> */}
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
const isDisabled = item.disabled;
              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && setActiveModule(item.id)}
                  disabled={isDisabled}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1a3156] text-sky-300 font-semibold shadow-inner border border-sky-500/30'
                      : 'text-slate-300 hover:bg-[#152744] hover:text-white border border-transparent'
                  } ${
    isDisabled
      ? 'cursor-not-allowed opacity-50 text-slate-500'
      : isActive
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

     
    </aside>
  );
};
