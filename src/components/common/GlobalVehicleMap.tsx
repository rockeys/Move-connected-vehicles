import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Activity, 
  ChevronRight, 
  Calendar, 
  HardDrive, 
  MessageSquare, 
  PhoneCall, 
  TrendingUp, 
  Car
} from 'lucide-react';
import { COUNTRY_MARKERS, CountryMarker, getCountryMetrics } from '../../data/countryData';

export const GlobalVehicleMap: React.FC = () => {
  const { navigateToCountry } = useApp();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Date selection state (Defaults to 'Oct 2026')
  const [selectedDate, setSelectedDate] = useState<string>('Oct 2026');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [customMonthInput, setCustomMonthInput] = useState<string>('2026-10');

  // Filter mode: All Countries | Country Sale | Country Usage
  const [activeFilter, setActiveFilter] = useState<'all' | 'sale' | 'usage'>('all');

  // Selected Country for floating panel on map
  const [selectedCountry, setSelectedCountry] = useState<CountryMarker | null>(null);

  const predefinedDates = ['Oct 2026', 'Sep 2026', 'Aug 2026', 'Jul 2026'];

  // Filter markers based on active tab: All | Country Sale | Country Usage
  const displayedMarkers = useMemo(() => {
    if (activeFilter === 'all') return COUNTRY_MARKERS;
    if (activeFilter === 'sale') {
      return COUNTRY_MARKERS.filter(m => m.category === 'sale' || m.category === 'both');
    }
    return COUNTRY_MARKERS.filter(m => m.category === 'usage' || m.category === 'both');
  }, [activeFilter]);

  const totalCount = COUNTRY_MARKERS.length;
  const saleCount = COUNTRY_MARKERS.filter(m => m.category === 'sale' || m.category === 'both').length;
  const usageCount = COUNTRY_MARKERS.filter(m => m.category === 'usage' || m.category === 'both').length;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCenter: L.LatLngExpression = [30.0, 40.0];
    const defaultZoom = 3;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: true
    });

    mapInstanceRef.current = map;

    // OpenStreetMap Dark Mode Basemap (CartoDB Dark Matter powered by OSM data)
     L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution:
      '&copy; OpenStreetMap contributors'
  }
).addTo(map);


    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Country Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    displayedMarkers.forEach((marker) => {
      const isSelected = selectedCountry?.id === marker.id;
      const metrics = getCountryMetrics(marker, selectedDate);
      const isWarning = marker.status === 'warning';

      let pulseColorClass = isWarning ? 'bg-amber-400' : 'bg-sky-400';
      let coreColorClass = isWarning ? 'bg-amber-400' : 'bg-sky-400';
      let textColorClass = isWarning ? 'text-amber-300' : 'text-sky-300';
      let borderColorClass = isWarning ? 'border-amber-400/60' : 'border-sky-400/60';
      let glowFilter = isWarning 
        ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.9))' 
        : 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.9))';

      if (activeFilter === 'sale') {
        pulseColorClass = 'bg-emerald-400';
        coreColorClass = 'bg-emerald-400';
        textColorClass = 'text-emerald-300';
        borderColorClass = 'border-emerald-400/60';
        glowFilter = 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.9))';
      }

      let countFormatted = '';
      if (activeFilter === 'sale') {
        countFormatted = `${(metrics.sale.unitsSold / 1000).toFixed(0)}k sold`;
      } else if (activeFilter === 'usage') {
        countFormatted = `${(metrics.usage.activeConnectedVehicles / 1000).toFixed(0)}k active`;
      } else {
        countFormatted = `${(metrics.usage.activeConnectedVehicles / 1000).toFixed(0)}k conn`;
      }

      const customIcon = L.divIcon({
        className: 'custom-blinking-marker-wrapper',
        iconSize: [52, 52],
        iconAnchor: [26, 26],
        html: `
          <div class="relative w-13 h-13 flex items-center justify-center cursor-pointer group" style="filter: ${glowFilter};" title="${marker.displayName}">
            <!-- Pulsing Wave -->
            <span class="absolute inline-flex h-11 w-11 rounded-full ${pulseColorClass} opacity-75 animate-ping"></span>
            
            <!-- Secondary Ripple Ring -->
            <span class="absolute inline-flex h-9 w-9 rounded-full ${pulseColorClass} opacity-35 animate-marker-ripple"></span>
            
            <!-- Glowing Core -->
            <span class="relative inline-flex items-center justify-center rounded-full h-5 w-5 border-2 border-[#0b172a] ${coreColorClass} shadow-lg animate-marker-blink ${isSelected ? 'scale-125 ring-2 ring-white' : ''}">
              <span class="text-[9px] font-bold text-slate-950 font-mono">${marker.flag}</span>
            </span>
            
            <!-- HUD Label -->
            <div class="absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0b172a]/95 border ${borderColorClass} px-2 py-0.5 text-[9px] font-mono font-medium ${textColorClass} shadow-xl backdrop-blur-sm pointer-events-none flex items-center gap-1 transition-all group-hover:scale-105">
              <span>${marker.displayName}</span>
              <span class="text-slate-400 font-normal">(${countFormatted})</span>
            </div>
          </div>
        `
      });

      const leafletMarker = L.marker([marker.lat, marker.lng], { 
        icon: customIcon,
        title: marker.displayName 
      });

      // Hover Tooltip: Consistent telematics preview across Country Sale & Usage
      const tooltipContent = `
        <div style="min-width: 185px; padding: 2px;">
          <div style="font-weight: 700; color: #ffffff; font-size: 13px; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 1px solid rgba(56, 189, 248, 0.3); display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span>${marker.flag} ${marker.displayName}</span>
            <span style="font-size: 9px; font-weight: 600; color: #38bdf8; font-family: monospace; background: rgba(56, 189, 248, 0.15); padding: 1px 5px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.3);">${selectedDate}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; font-family: monospace; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px;">
              <span style="color: #94a3b8;">Sessions:</span>
              <span style="font-weight: 700; color: #ffffff;">${metrics.usage.sessions}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px;">
              <span style="color: #94a3b8;">Data:</span>
              <span style="font-weight: 700; color: #38bdf8;">${metrics.usage.dataConsumption}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px;">
              <span style="color: #94a3b8;">SMS:</span>
              <span style="font-weight: 700; color: #fbbf24;">${metrics.usage.sms}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px;">
              <span style="color: #94a3b8;">Voice:</span>
              <span style="font-weight: 700; color: #34d399;">${metrics.usage.voice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px; margin-top: 2px; padding-top: 3px; border-top: 1px dashed rgba(255, 255, 255, 0.1);">
              <span style="color: #94a3b8;">Connected:</span>
              <span style="font-weight: 700; color: #ffffff;">${metrics.usage.activeConnectedVehicles.toLocaleString()}</span>
            </div>
          </div>
          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 9px; color: #94a3b8; font-family: monospace;">
            Click marker to open country panel →
          </div>
        </div>
      `;

      leafletMarker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -22],
        className: 'custom-geo-tooltip',
        opacity: 1
      });

      // On Click: Opens floating panel on map as requested
      leafletMarker.on('click', () => {
        setSelectedCountry(marker);
        map.flyTo([marker.lat, marker.lng], Math.max(map.getZoom(), 4.5), {
          duration: 1.2,
          easeLinearity: 0.25
        });
      });

      layer.addLayer(leafletMarker);
    });
  }, [displayedMarkers, selectedCountry, selectedDate, activeFilter]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    setSelectedCountry(null);
    mapInstanceRef.current?.flyTo([30.0, 40.0], 3, {
      duration: 1.2
    });
  };

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

  const selectedMetrics = selectedCountry ? getCountryMetrics(selectedCountry, selectedDate) : null;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-[#224375] bg-[#12233f] p-4 shadow-xl">
      {/* Header Bar: Geographical Split on left, Date & Category Filter on right */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#224375]">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <Radio size={16} className="text-sky-400 animate-pulse" />
              Vehicles Connected Globally
            </h3>
            <span className="rounded bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 text-[10px] font-mono text-sky-300">
              {activeFilter === 'sale' ? 'Country Sale View' : activeFilter === 'usage' ? 'Country Usage View' : 'Global Fleet View'}
            </span>
          </div>
          
        </div>

        {/* Date Filter & Category Pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          

          {/* Date Picker Button */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-1.5 rounded-lg border border-[#224375] bg-[#152744] px-2.5 py-1 text-xs text-sky-300 hover:text-white hover:bg-[#1d3761] transition-all shadow-xs cursor-pointer"
              title="Choose custom month"
            >
              <Calendar size={13} className="text-sky-400" />
              <span>Choose Date</span>
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-9 z-[500] w-64 rounded-xl border border-sky-500/50 bg-[#0f1f38] p-3 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95">
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

          {/* Category Pills: All | Country Sale | Country Usage */}
          <div className="flex items-center rounded-lg bg-[#0e1e36] p-0.5 border border-[#224375]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setActiveFilter('sale')}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                activeFilter === 'sale'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp size={11} className={activeFilter === 'sale' ? 'text-emerald-400' : 'text-slate-400'} />
              <span>Country Sale ({saleCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter('usage')}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                activeFilter === 'usage'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity size={11} className={activeFilter === 'usage' ? 'text-sky-400' : 'text-slate-400'} />
              <span>Country Usage ({usageCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Viewport Area */}
      <div className="relative w-full aspect-[2.1/1] min-h-[420px] max-h-[540px] rounded-lg border border-[#224375] overflow-hidden bg-[#0b172a] shadow-inner">
        {/* Leaflet Mount Target */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Live Cockpit Status Overlay (Top Left) */}
        <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 rounded-md bg-[#0e1e36]/90 border border-sky-500/30 px-2.5 py-1.5 text-[11px] font-mono text-slate-300 backdrop-blur-md shadow-lg pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          
          <span className="rounded bg-sky-500/20 px-1.5 py-0.2 text-[10px] text-sky-200 border border-sky-500/30 font-bold">
            {selectedDate}
          </span>
        </div>

        {/* Interactive Zoom & Reset Controls (Top Right) */}
        <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="flex h-7 w-7 items-center justify-center rounded-md bg-[#152744]/90 border border-[#224375] text-sky-300 hover:bg-[#203c68] hover:text-white transition-all shadow-md backdrop-blur-xs cursor-pointer"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="flex h-7 w-7 items-center justify-center rounded-md bg-[#152744]/90 border border-[#224375] text-sky-300 hover:bg-[#203c68] hover:text-white transition-all shadow-md backdrop-blur-xs cursor-pointer"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={handleResetView}
            title="Reset Corridor View"
            className="flex h-7 w-7 items-center justify-center rounded-md bg-[#152744]/90 border border-[#224375] text-sky-300 hover:bg-[#203c68] hover:text-white transition-all shadow-md backdrop-blur-xs cursor-pointer"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Floating Panel on Click: Opens over the map with Investigate Country button */}
        {selectedCountry && selectedMetrics && (
          <div className="absolute top-14 left-3 z-[400] w-[390px] rounded-2xl border border-[#203a66] bg-[#0c182a]/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/40 bg-sky-500/15 text-sky-400">
                  <Radio size={20} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white tracking-wide">
                      {selectedCountry.displayName}
                    </h4>
                    <span className="rounded bg-sky-500/20 border border-sky-400/40 px-2 py-0.5 text-[10px] font-mono font-bold text-sky-300">
                      {selectedDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 leading-snug">
                    {selectedCountry.name} · {selectedCountry.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCountry(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#162a4a] transition-colors cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* 4 Telemetry Boxes (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2.5 mt-1 font-mono">
              {/* Sessions Card */}
              <div className="rounded-xl border border-[#1b3459] bg-[#0f213b] p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-300 font-sans">
                    <Activity size={12} className="text-sky-400" />
                    Sessions
                  </span>
                  <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                </div>
                <div className="text-lg font-bold text-white mt-2">
                  {selectedMetrics.usage.sessions}
                </div>
              </div>

              {/* Data Card */}
              <div className="rounded-xl border border-[#1b3459] bg-[#0f213b] p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-300 font-sans">
                    <HardDrive size={12} className="text-sky-400" />
                    Data
                  </span>
                  <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                </div>
                <div className="text-md font-bold text-sky-300 mt-2">
                  {selectedMetrics.usage.dataConsumption}
                </div>
              </div>

              {/* SMS Card */}
              <div className="rounded-xl border border-[#1b3459] bg-[#0f213b] p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-300 font-sans">
                    <MessageSquare size={12} className="text-amber-400" />
                    SMS
                  </span>
                  <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                </div>
                <div className="text-lg font-bold text-amber-400 mt-2">
                  {selectedMetrics.usage.sms}
                </div>
              </div>

              {/* Voice Card */}
              <div className="rounded-xl border border-[#1b3459] bg-[#0f213b] p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-300 font-sans">
                    <PhoneCall size={12} className="text-emerald-400" />
                    Voice
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-2">
                  {selectedMetrics.usage.voice}
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-3 rounded-lg bg-[#0f213b]/70 border border-[#1b3459] px-3 py-2 text-xs font-mono flex items-center justify-between text-slate-300">
              <span>Connected: <strong className="text-white">{selectedMetrics.usage.activeConnectedVehicles.toLocaleString()}</strong></span>
              <span>SIM Activation: <strong className="text-sky-300">{selectedMetrics.usage.connectivityRatio}</strong></span>
              <span className="font-bold text-emerald-400 uppercase tracking-wide">OPTIMAL</span>
            </div>

            {/* Footer with "Investigate Country >" button opening the new page */}
            <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#1b3459]">
              <span className="text-xs text-slate-400 font-sans">
                Country Telematics Corridor
              </span>
              <button
                onClick={() => {
                  navigateToCountry(selectedCountry.id);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-sky-500/50 bg-sky-500/20 hover:bg-sky-500/35 px-4 py-2 text-xs font-semibold text-sky-300 hover:text-white transition-all cursor-pointer shadow-md"
              >
                <span>Investigate Country</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
