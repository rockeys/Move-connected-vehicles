import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { COUNTRY_MARKERS, getCountryMetrics, CountryMarker } from '../../data/countryData';
import { 
  ArrowLeft, 
  Car, 
  Search, 
  Activity, 
  HardDrive, 
  Radio, 
  TrendingUp, 
  ChevronRight,
  Calendar,
  Globe,
  Signal,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const CountryVehicleDetails: React.FC = () => {
  const { 
    vehicles, 
    selectedCountryId, 
    setSelectedCountryId, 
    setActiveModule, 
    navigateToCockpit 
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>('Oct 2026');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [customMonthInput, setCustomMonthInput] = useState<string>('2026-10');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  const predefinedDates = ['Oct 2026', 'Sep 2026', 'Aug 2026', 'Jul 2026'];

  // Current selected country
  const currentCountry: CountryMarker = useMemo(() => {
    return COUNTRY_MARKERS.find(c => c.id === selectedCountryId) || COUNTRY_MARKERS[1] || COUNTRY_MARKERS[0];
  }, [selectedCountryId]);

  const currentMetrics = useMemo(() => {
    return getCountryMetrics(currentCountry, selectedDate);
  }, [currentCountry, selectedDate]);

  // Vehicles filtered specifically for this country
  const countryVehicles = useMemo(() => {
    const cId = currentCountry.id.toLowerCase();
    const cName = currentCountry.country.toLowerCase();
    const dName = currentCountry.displayName.toLowerCase();

    return vehicles.filter(v => {
      const vCountry = (v.country || '').toLowerCase();
      if (cId === 'uk' || cName.includes('kingdom') || dName === 'uk') {
        return vCountry.includes('kingdom') || vCountry.includes('uk') || vCountry.includes('britain');
      }
      if (cId === 'uae' || cName.includes('emirates') || dName === 'uae') {
        return vCountry.includes('emirates') || vCountry.includes('uae');
      }
      if (cId === 'saudi' || cName.includes('saudi') || dName.includes('saudi')) {
        return vCountry.includes('saudi');
      }
      if (cId === 'india' || cName.includes('india')) {
        return vCountry.includes('india');
      }
      if (cId === 'france' || cName.includes('france')) {
        return vCountry.includes('france');
      }
      return (
        vCountry.includes(cName) || 
        cName.includes(vCountry) ||
        vCountry.includes(dName) ||
        dName.includes(vCountry)
      );
    });
  }, [vehicles, currentCountry]);

  // Filtered vehicles within this country based on search & filter dropdowns
  const filteredVehicles = useMemo(() => {
    return countryVehicles.filter(v => {
      if (selectedStatusFilter !== 'all' && v.status !== selectedStatusFilter) return false;
      if (selectedModelFilter !== 'all' && v.model !== selectedModelFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesVin = v.vin.toLowerCase().includes(q);
        const matchesModel = v.model.toLowerCase().includes(q);
        const matchesVariant = v.variant.toLowerCase().includes(q);
        const matchesIccid = (v.simIccid || '').includes(q);
        const matchesCity = (v.city || '').toLowerCase().includes(q);
        if (!matchesVin && !matchesModel && !matchesVariant && !matchesIccid && !matchesCity) return false;
      }
      return true;
    });
  }, [countryVehicles, selectedStatusFilter, selectedModelFilter, searchQuery]);

  // Unique models in this country
  const availableModels = useMemo(() => {
    return Array.from(new Set(countryVehicles.map(v => v.model)));
  }, [countryVehicles]);

  // Custom month input handler
  const handleCustomMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomMonthInput(val);
    if (!val) return;
    const [year, month] = val.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      const formatted = `${monthNames[monthIndex]} ${year}`;
      setSelectedDate(formatted);
      setShowDatePicker(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModule('executive-overview')}
              className="text-xs font-semibold text-sky-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Geographical Map
            </button>
            <span className="text-[#3b5d8f]">/</span>
            <span className="text-xs text-slate-400 font-mono">Country Fleet Telematics</span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {currentCountry.displayName} – Move SIM Connected Vehicles
                </h1>
                <span className="rounded-md bg-sky-500/20 border border-sky-500/40 px-2 py-0.5 text-xs font-mono font-bold text-sky-300">
                  {selectedDate}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {currentCountry.name} · {currentCountry.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls: Country Switcher & Month Picker */}
        <div className="flex flex-wrap  justify-end gap-3">
          {/* Quick Country Switcher */}
          <div className="flex items-center gap-2 rounded-lg border border-[#224375] bg-[#152744] px-3 py-1.5 shadow-sm">
            <Globe size={14} className="text-sky-400" />
            <span className="text-xs text-slate-400 font-medium">Switch Country:</span>
            <select
              value={currentCountry.id}
              onChange={(e) => setSelectedCountryId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {COUNTRY_MARKERS.map(c => (
                <option key={c.id} value={c.id} className="bg-[#152744] text-white">
                  {c.flag} {c.displayName}
                </option>
              ))}
            </select>
          </div>

          

          {/* Custom Date Button */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-1.5 rounded-lg border border-[#224375] bg-[#152744] px-3 py-1.5 text-xs text-sky-300 hover:text-white hover:bg-[#1d3761] transition-all shadow-xs cursor-pointer"
              title="Choose custom month"
            >
              <Calendar size={13} className="text-sky-400" />
              <span>Choose Date</span>
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-10 z-[500] w-64 rounded-xl border border-sky-500/50 bg-[#0f1f38] p-3 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-[#224375] mb-2.5">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} className="text-sky-400" />
                    Select Period
                  </span>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-300 block">
                    Choose Month & Year:
                  </label>
                  <input
                    type="month"
                    value={customMonthInput}
                    onChange={handleCustomMonthChange}
                    className="w-full rounded border border-[#224375] bg-[#152744] px-2.5 py-1 text-xs text-white focus:border-sky-400 focus:outline-none"
                  />
                  <div className="text-[9px] text-slate-400 pt-1">
                    Telemetry recalculates for chosen period.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Executive Country KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Connected Fleet */}
        <div className="rounded-xl border border-[#224375] bg-[#12233f] p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Car size={14} className="text-sky-400" />
              Active Connected Fleet
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {currentMetrics.usage.activeConnectedVehicles.toLocaleString()} units
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>{currentMetrics.usage.connectivityRatio} Move SIM Activation Nominal</span>
            </div>
          </div>
        </div>

        {/* Monthly Data Traffic */}
        <div className="rounded-xl border border-[#224375] bg-[#12233f] p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <HardDrive size={14} className="text-sky-400" />
              Monthly Data Traffic
            </span>
            <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-sky-300 tracking-tight">
              {currentMetrics.usage.dataConsumption}
            </div>
            <div className="text-[11px] text-slate-300 font-mono mt-1">
              {currentMetrics.usage.sessions} Active Data Sessions
            </div>
          </div>
        </div>

        {/* Commercial Sales Volume */}
        <div className="rounded-xl border border-[#224375] bg-[#12233f] p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-400" />
              Commercial Sales Volume
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-emerald-300 tracking-tight">
              {currentMetrics.sale.unitsSold.toLocaleString()} units
            </div>
            <div className="text-[11px] text-slate-300 font-mono mt-1">
              {currentMetrics.sale.revenueUSD} · {currentMetrics.sale.yoyGrowth} YoY
            </div>
          </div>
        </div>

        {/* Primary Network Operator */}
        <div className="rounded-xl border border-[#224375] bg-[#12233f] p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Radio size={14} className="text-sky-400" />
              Primary Network Operator
            </span>
            <span className="h-2 w-2 rounded-full bg-sky-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-white truncate">
              {currentMetrics.usage.primaryCarriers[0] || 'Tata Move Global'}
            </div>
            <div className="text-[11px] text-sky-300 font-mono mt-1">
              {currentMetrics.usage.avgLatencyMs}ms Average Round-Trip Latency
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Country Vehicles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Car size={18} className="text-sky-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Move SIM Vehicles in {currentCountry.displayName}
          </h2>
         
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by VIN, model, city, ICCID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-[#224375] bg-[#152744] py-1.5 pl-8 pr-7 text-xs text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none w-60 font-sans shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Model Filter */}
          <select
            value={selectedModelFilter}
            onChange={(e) => setSelectedModelFilter(e.target.value)}
            className="rounded-lg border border-[#224375] bg-[#152744] px-3 py-1.5 text-xs text-slate-200 focus:border-sky-400 focus:outline-none cursor-pointer shadow-sm"
          >
            <option value="all">All Models</option>
            {availableModels.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="rounded-lg border border-[#224375] bg-[#152744] px-3 py-1.5 text-xs text-slate-200 focus:border-sky-400 focus:outline-none cursor-pointer shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="Online">Online</option>
            <option value="Degraded">Degraded</option>
            <option value="Roaming">Roaming</option>
            <option value="Offline">Offline</option>
            <option value="Critical">Critical</option>
            <option value="Suspended">Suspended</option>
          </select>

          {(searchQuery || selectedModelFilter !== 'all' || selectedStatusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedModelFilter('all');
                setSelectedStatusFilter('all');
              }}
              className="flex items-center gap-1 rounded-lg border border-[#224375] bg-[#152744] hover:bg-[#1d3761] px-2.5 py-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Vehicles Table matching Screenshot 2 */}
      {filteredVehicles.length === 0 ? (
        <div className="rounded-xl border border-[#224375] bg-[#11223c] p-12 text-center shadow-lg">
          <Car size={36} className="mx-auto text-slate-500 mb-3" />
          <h3 className="text-base font-semibold text-white">
            No vehicles found matching current filter in {currentCountry.displayName}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Try adjusting your search query, or reset the model and status filters to view all Move SIM telemetry in this country.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedModelFilter('all');
              setSelectedStatusFilter('all');
            }}
            className="mt-4 rounded-lg bg-sky-500/20 border border-sky-500/40 px-4 py-2 text-xs text-sky-300 hover:bg-sky-500/30 transition-colors font-semibold cursor-pointer shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#203a66] bg-[#0c1a2f] shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#11233e] text-[11px] font-bold font-mono tracking-wider uppercase text-slate-200 border-b border-[#203a66]">
              <tr>
                <th className="px-5 py-4">VIN</th>
                <th className="px-5 py-4">MODEL / VARIANT</th>
                <th className="px-5 py-4">PRODUCTION LINE</th>
                <th className="px-5 py-4">MOVE SIM ICCID</th>
                <th className="px-5 py-4">STATUS</th>
                <th className="px-5 py-4">SIGNAL</th>
                <th className="px-5 py-4">HEALTH</th>
                <th className="px-5 py-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182f54] text-slate-200">
              {filteredVehicles.map((veh) => {
                const isOnline = veh.status === 'Online';
                const isDegraded = veh.status === 'Degraded';
                const isCritical = veh.status === 'Critical';
                const isRoaming = veh.status === 'Roaming';

                // Move SIM ICCID format e.g. "8944502100 ... 9482"
                const formattedIccid = veh.simIccid && veh.simIccid.length >= 14
                  ? `${veh.simIccid.slice(0, 10)} ... ${veh.simIccid.slice(-4)}`
                  : veh.simIccid;

                return (
                  <tr 
                    key={veh.vin}
                    className="hover:bg-[#122544] transition-colors"
                  >
                    {/* VIN */}
                    <td className="px-5 py-4 font-mono font-bold text-white text-xs tracking-wider">
                      <button
                        onClick={() => navigateToCockpit(veh.vin)}
                        className="hover:text-sky-300 hover:underline cursor-pointer transition-colors text-left"
                        title="Open 360° Cockpit for this VIN"
                      >
                        {veh.vin}
                      </button>
                    </td>

                    {/* MODEL / VARIANT */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-xs">
                        {veh.model} ·
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {veh.variant}
                      </div>
                    </td>

                    {/* PRODUCTION LINE */}
                    <td className="px-5 py-4 text-xs text-slate-300">
                      {veh.productionLine || 'Line 1 – Range Rover Flagship'}
                    </td>

                    {/* MOVE SIM ICCID */}
                    <td className="px-5 py-4 font-mono text-xs text-slate-200">
                      {formattedIccid}
                    </td>

                    {/* STATUS: Pill matching Screenshot 2 */}
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-md px-3 py-1 text-xs font-semibold ${
                        isOnline 
                          ? 'border border-emerald-500/60 bg-emerald-950/50 text-emerald-400'
                          : isDegraded
                          ? 'border border-amber-500/60 bg-amber-950/50 text-amber-400'
                          : isCritical
                          ? 'border border-red-500/60 bg-red-950/50 text-red-400'
                          : isRoaming
                          ? 'border border-cyan-500/60 bg-cyan-950/50 text-cyan-400'
                          : 'border border-slate-500/60 bg-slate-900/50 text-slate-300'
                      }`}>
                        {veh.status}
                      </span>
                    </td>

                    {/* SIGNAL */}
                    <td className="px-5 py-4 font-mono">
                      <div className="font-bold text-white text-xs">
                        {veh.signalRssi} dBm
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        ({veh.networkTech})
                      </div>
                    </td>

                    {/* HEALTH */}
                    <td className="px-5 py-4 font-mono text-xs font-bold">
                      <span className={veh.healthScore >= 90 ? 'text-sky-400' : 'text-red-400'}>
                        {veh.healthScore}%
                      </span>
                    </td>

                    {/* ACTION: 360° Cockpit Button matching Screenshot 2 */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => navigateToCockpit(veh.vin)}
                        className="inline-flex flex-col items-center justify-center rounded-lg border border-[#2d528b] bg-[#142848] hover:bg-sky-500/20 hover:border-sky-400/60 px-3.5 py-1.5 text-xs font-semibold text-sky-400 hover:text-white transition-all cursor-pointer group shadow-sm"
                        title="Inspect Vehicle in 360° Cockpit"
                      >
                        <span className="leading-tight">360° Cockpit</span>
                        <span className="font-bold text-sky-300 group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
