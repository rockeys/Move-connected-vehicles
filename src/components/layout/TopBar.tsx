import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  RotateCcw, 
  Radio, 
  Filter, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  X,
  Check,
  Factory,
  PanelLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BUSINESS_UNITS = [
  'JLR EV Charger',
  'JLR EVA25 PP',
  'JLR EVA25 Prod',
  'JLR FOC Engg Support',
  'JLR Production',
  'JLR Production PSIMs',
  'JLR VDC Test Pre-Prod',
  'JLR VDC Test Staging'
] as const;

export const TopBar: React.FC = () => {
  const { 
    filters, 
    setFilter, 
    resetFilters, 
    incidents, 
    setActiveModule,
    navigateToCockpit,
    plants,
    selectedPlant,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [buDropdownOpen, setBuDropdownOpen] = useState(false);
  const [buSearch, setBuSearch] = useState('');
  const [tempSelectedBUs, setTempSelectedBUs] = useState<string[]>([]);
  const buDropdownRef = useRef<HTMLDivElement>(null);

  const [plantDropdownOpen, setPlantDropdownOpen] = useState(false);
  const [plantSearch, setPlantSearch] = useState('');
  const plantDropdownRef = useRef<HTMLDivElement>(null);

  const openIncidents = incidents.filter(i => i.status !== 'Resolved');

  // Sync tempSelectedBUs when dropdown opens
  const handleOpenBuDropdown = () => {
    if (!buDropdownOpen) {
      if (filters.businessUnits && filters.businessUnits.length > 0) {
        setTempSelectedBUs([...filters.businessUnits]);
      } else {
        // By default all are selected (Tout)
        setTempSelectedBUs([...BUSINESS_UNITS]);
      }
      setBuSearch('');
    }
    setBuDropdownOpen(!buDropdownOpen);
  };

  // Close BU dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buDropdownRef.current && !buDropdownRef.current.contains(event.target as Node)) {
        setBuDropdownOpen(false);
      }
    };
    if (buDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [buDropdownOpen]);

  // Close Plant dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (plantDropdownRef.current && !plantDropdownRef.current.contains(event.target as Node)) {
        setPlantDropdownOpen(false);
      }
    };
    if (plantDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [plantDropdownOpen]);

  // Handle (Tout) toggle
  const isAllSelected = tempSelectedBUs.length === BUSINESS_UNITS.length;
  const handleToggleAll = () => {
    if (isAllSelected) {
      setTempSelectedBUs([]);
    } else {
      setTempSelectedBUs([...BUSINESS_UNITS]);
    }
  };

  // Handle individual business unit toggle
  const handleToggleUnit = (unit: string) => {
    if (tempSelectedBUs.includes(unit)) {
      setTempSelectedBUs(tempSelectedBUs.filter(u => u !== unit));
    } else {
      setTempSelectedBUs([...tempSelectedBUs, unit]);
    }
  };

  // Apply button
  const handleApplyBuFilter = () => {
    if (tempSelectedBUs.length === BUSINESS_UNITS.length || tempSelectedBUs.length === 0) {
      setFilter('businessUnits', []); // empty array denotes all / tout
    } else {
      setFilter('businessUnits', tempSelectedBUs);
    }
    setBuDropdownOpen(false);
  };

  // Cancel / Annuler button
  const handleCancelBuFilter = () => {
    setBuDropdownOpen(false);
  };

  // Filtered business units based on search input
  const filteredBUs = BUSINESS_UNITS.filter(bu => 
    bu.toLowerCase().includes(buSearch.toLowerCase())
  );

  // Filtered plants based on search input
  const filteredPlants = plants.filter(p => 
    p.name.toLowerCase().includes(plantSearch.toLowerCase()) ||
    p.country.toLowerCase().includes(plantSearch.toLowerCase()) ||
    p.shortName.toLowerCase().includes(plantSearch.toLowerCase())
  );

  // Label display for the trigger button
  const getBuDisplayText = () => {
    if (!filters.businessUnits || filters.businessUnits.length === 0 || filters.businessUnits.length === BUSINESS_UNITS.length) {
      return '(Tout)';
    }
    if (filters.businessUnits.length === 1) {
      return filters.businessUnits[0];
    }
    return `${filters.businessUnits.length} sélectionnés`;
  };

  const getPlantDisplayText = () => {
    if (!filters.plantId || filters.plantId === 'all') {
      return '(All Plants)';
    }
    return selectedPlant?.shortName || selectedPlant?.name || filters.plantId;
  };

  return (
    <header className="relative z-20 flex h-16 w-full items-center justify-between border-b border-[#224375] bg-[#132542] px-6 backdrop-blur-md">
      {/* Sidebar Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          data-sidebar-toggle="true"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#224375] bg-[#152744] text-slate-300 hover:text-white hover:border-sky-500/50 hover:bg-[#1a3156] transition-colors cursor-pointer"
        >
          <PanelLeft size={16} className={!sidebarCollapsed ? 'text-sky-400' : 'text-slate-300'} />
        </button>
        

        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by VIN (e.g. SALWR2...), SIM ICCID, model, or city..."
            value={filters.searchQuery}
            onChange={(e) => setFilter('searchQuery', e.target.value)}
            className="w-full rounded-lg border border-[#224375] bg-[#152744] py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/40 transition-all font-sans"
          />
          {filters.searchQuery && (
            <button 
              onClick={() => setFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Global Context Controls */}
      <div className="flex items-center gap-3">
        {/* Business Unit Multi-Select Filter Dropdown */}
        <div className="relative" ref={buDropdownRef}>
          <button
            onClick={handleOpenBuDropdown}
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-[#224375] bg-[#152744] px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:border-sky-500/50 transition-all cursor-pointer"
            title="Filter by Business Unit"
          >
            <span className="text-[11px] font-medium text-slate-400">Business Unit:</span>
            <span className="font-semibold text-white max-w-[140px] truncate">
              {getBuDisplayText()}
            </span>
            <ChevronDown size={13} className={`text-slate-400 transition-transform ${buDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
          </button>

          {buDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[#224375] bg-[#12233f] p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#224375] mb-2.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Business Unit
                </span>
                <button
                  type="button"
                  onClick={handleCancelBuFilter}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Search within dropdown */}
              <div className="relative mb-2">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={buSearch}
                  onChange={(e) => setBuSearch(e.target.value)}
                  className="w-full rounded-md border border-[#224375] bg-[#152744] py-1 pl-7 pr-3 text-xs text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none"
                />
              </div>

              {/* Select all checkbox row */}
              <div 
                className="flex items-center justify-between py-1.5 px-2 hover:bg-[#1a3156] rounded cursor-pointer border-b border-[#224375]/60 mb-1" 
                onClick={handleToggleAll}
              >
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-200 select-none">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleAll}
                    className="rounded border-[#294c7a] bg-[#152744] text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>(Tout)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {tempSelectedBUs.length}/{BUSINESS_UNITS.length}
                </span>
              </div>

              {/* List of Business Units */}
              <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1 py-1">
                {filteredBUs.length === 0 ? (
                  <div className="text-[11px] text-slate-400 py-3 text-center">Aucun résultat</div>
                ) : (
                  filteredBUs.map(bu => {
                    const isChecked = tempSelectedBUs.includes(bu);
                    return (
                      <div
                        key={bu}
                        onClick={() => handleToggleUnit(bu)}
                        className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors cursor-pointer select-none ${
                          isChecked ? 'bg-sky-500/15 text-sky-200 font-medium' : 'text-slate-300 hover:bg-[#1a3156]'
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleUnit(bu)}
                            className="rounded border-[#294c7a] bg-[#152744] text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="truncate">{bu}</span>
                        </label>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Action buttons: Annuler & Appliquer */}
              <div className="flex items-center justify-end gap-2 pt-2.5 mt-2 border-t border-[#224375]">
                <button
                  type="button"
                  onClick={handleCancelBuFilter}
                  className="rounded-lg border border-[#224375] bg-[#152744] px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-[#1a3156] transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleApplyBuFilter}
                  className="rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-3 py-1 text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Check size={12} />
                  Appliquer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Plant Filter Dropdown (Replaces Model selection as requested) */}
        <div className="relative" ref={plantDropdownRef}>
          <button
            onClick={() => {
              setPlantDropdownOpen(!plantDropdownOpen);
              setPlantSearch('');
            }}
            type="button"
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              filters.plantId !== 'all'
                ? 'border-sky-500/70 bg-[#1a345c] text-white shadow-sm'
                : 'border-[#224375] bg-[#152744] text-slate-200 hover:text-white hover:border-sky-500/50'
            }`}
            title="Filter by Manufacturing Plant"
          >
            <Factory size={13} className="text-sky-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-400">Plant:</span>
            <span className="font-semibold text-white max-w-[150px] truncate">
              {getPlantDisplayText()}
            </span>
            <ChevronDown size={13} className={`text-slate-400 transition-transform ${plantDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
          </button>

          {plantDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#224375] bg-[#12233f] p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#224375] mb-2.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Factory size={13} className="text-sky-400" />
                  Manufacturing Plant
                </span>
                <button
                  type="button"
                  onClick={() => setPlantDropdownOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Search within Plant dropdown */}
              <div className="relative mb-2">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search plant or country (e.g. Solihull, Nitra)..."
                  value={plantSearch}
                  onChange={(e) => setPlantSearch(e.target.value)}
                  className="w-full rounded-md border border-[#224375] bg-[#152744] py-1 pl-7 pr-3 text-xs text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none"
                />
              </div>

              {/* All Plants Option */}
              <div 
                className={`flex items-center justify-between py-2 px-2.5 rounded cursor-pointer border-b border-[#224375]/60 mb-1 transition-colors ${
                  filters.plantId === 'all' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-200 hover:bg-[#1a3156]'
                }`}
                onClick={() => {
                  setFilter('plantId', 'all');
                  setPlantDropdownOpen(false);
                }}
              >
                <div>
                  <div className="text-xs font-medium">(All Manufacturing Plants)</div>
                  <div className="text-[10px] text-slate-400">Global fleet across 6 centres</div>
                </div>
                {filters.plantId === 'all' && <Check size={14} className="text-sky-400 shrink-0" />}
              </div>

              {/* List of Plants */}
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1 py-1">
                {filteredPlants.length === 0 ? (
                  <div className="text-[11px] text-slate-400 py-3 text-center">No manufacturing plants found</div>
                ) : (
                  filteredPlants.map(plant => {
                    const isSelected = filters.plantId === plant.id;
                    return (
                      <div
                        key={plant.id}
                        onClick={() => {
                          setFilter('plantId', plant.id);
                          setPlantDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer select-none ${
                          isSelected ? 'bg-sky-500/20 text-sky-200 font-semibold border border-sky-500/30' : 'text-slate-300 hover:bg-[#1a3156]'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate font-medium text-white">{plant.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                            <span>{plant.country}</span>
                            <span>·</span>
                            <span>{plant.totalProductionYTD.toLocaleString()} YTD</span>
                            <span>·</span>
                            <span className="text-sky-300">{plant.simActivationRate}% SIM</span>
                          </div>
                        </div>
                        {isSelected && <Check size={14} className="text-sky-400 shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>

              {filters.plantId !== 'all' && (
                <div className="pt-2 mt-2 border-t border-[#224375] flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setFilter('plantId', 'all');
                      setPlantDropdownOpen(false);
                    }}
                    className="text-[11px] text-slate-400 hover:text-sky-300 transition-colors"
                  >
                    Reset to All Plants
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reset Filter Button if active */}
        {(filters.plantId !== 'all' || filters.status !== 'all' || (filters.businessUnits && filters.businessUnits.length > 0) || filters.searchQuery) && (
          <button
            onClick={resetFilters}
            title="Reset global filters"
            className="flex items-center gap-1 rounded-lg border border-[#224375] bg-[#152744] px-2 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-[#1a3156] transition-colors"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Alerts and incidents feed"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#224375] bg-[#152744] text-slate-200 hover:bg-[#1a3156] hover:text-white transition-colors"
          >
            <Bell size={15} />
            {openIncidents.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-slate-950 font-mono">
                {openIncidents.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-96 rounded-xl border border-[#224375] bg-[#12233f] p-4 shadow-2xl backdrop-blur-xl z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#224375]">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Critical System Incidents
                  </span>
                </div>
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    setActiveModule('alerts-incidents');
                  }}
                  className="text-[11px] font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  View All <ExternalLink size={11} />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {openIncidents.map(inc => (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      if (inc.targetVin) {
                        navigateToCockpit(inc.targetVin);
                      } else {
                        setActiveModule('alerts-incidents');
                      }
                    }}
                    className="cursor-pointer rounded-lg border border-[#224375] bg-[#152744] p-2.5 hover:border-sky-500/50 hover:bg-[#1a3156] transition-all text-left"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-semibold ${
                        inc.severity === 'critical' ? 'text-red-400' : inc.severity === 'high' ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {inc.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{inc.timestamp}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-200 line-clamp-2">{inc.title}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Affected: {inc.affectedVinCount} vehicle(s)</span>
                      <span className="font-mono text-sky-400">{inc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#224375]">
          <img
            src="/src/assets/images/avatar_ops_director_1790688245417.jpg"
            alt="Director of Connected Car Operations"
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full border border-sky-400/50 object-cover"
          />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-white">RD</span>
            <span className="text-[10px] text-slate-300">VP Connected Car</span>
          </div>
        </div>
      </div>
    </header>
  );
};
