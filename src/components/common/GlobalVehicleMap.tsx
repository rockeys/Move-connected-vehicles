import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Factory, 
  AlertTriangle, 
  Activity, 
  ChevronRight, 
  HardDrive, 
  MessageSquare, 
  PhoneCall, 
  Compass, 
  Car,
  Wifi,
  Calendar,
  ChevronDown,
  ChevronLeft,
  Globe,
  Signal,
  ExternalLink,
  ShieldCheck,
  Layers,
  MapPin,
  X,
  CheckCircle2
} from 'lucide-react';

export interface RegionalMetrics {
  sessions: string;
  data: string;
  sms: string;
  voice: string;
}

export interface MapMarker {
  id: string;
  name: string;
  label: string;
  type: 'plant' | 'roaming' | 'market';
  lat: number;
  lng: number;
  count: number;
  status: 'optimal' | 'warning';
  details: string;
  country: string;
  activationRate?: number;
  models?: string[];
  metricsByDate?: Record<string, RegionalMetrics>;
  totalSalesVehicles?: number;
}

// Fixed 21° Bird's Eye Pitch
const FIXED_PITCH = 21;

// Month list for Month-only picker
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// World geographical boundaries: ensures map on drag cannot go outside the end of the world map
const WORLD_BOUNDS = L.latLngBounds(
  L.latLng(-80.0, -180.0),
  L.latLng(84.0, 180.0)
);

export interface HoveredFacilityInfo {
  marker: MapMarker;
  metrics: RegionalMetrics;
  x: number;
  y: number;
}

export const GlobalVehicleMap: React.FC<{ onSelectPlant?: (plantId: string) => void }> = ({ onSelectPlant }) => {
  const { setFilter, setActiveModule, vehicles, navigateToCockpit, navigateToCountry } = useApp();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const monthPickerRef = useRef<HTMLDivElement | null>(null);

  // Month-only Date Selection State (Strictly month level, no day picking)
  const [selectedMonth, setSelectedMonth] = useState<string>('Oct 2026');
  const [pickerYear, setPickerYear] = useState<number>(2026);
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);

  // Hover panel state (strictly flat 2D and accurately positioned at pointer)
  const [hoveredFacility, setHoveredFacility] = useState<HoveredFacilityInfo | null>(null);

  // Selected country marker for Country Usage drilldown
  const [selectedPoint, setSelectedPoint] = useState<MapMarker | null>(null);

  // Base geographical dataset: strictly and ONLY the 6 specified countries
  const baseMarkers: MapMarker[] = useMemo(() => [
    {
      id: 'us',
      name: 'United States Strategic Market Hub',
      label: 'US',
      type: 'market',
      lat: 39.8283,
      lng: -98.5795,
      count: 138600,
      status: 'optimal',
      details: 'North American connected vehicle fleet, AT&T and T-Mobile nationwide 5G cellular infrastructure.',
      country: 'US',
      activationRate: 99.91,
      models: ['Range Rover', 'Defender 110', 'Range Rover Sport', 'Defender 130'],
      totalSalesVehicles: 138600,
      metricsByDate: {
        'Oct 2026': { sessions: '42.8 M', data: '18450.20 GB', sms: '380.50 K', voice: '42h 15m 10s' }
      }
    },
    {
      id: 'uk',
      name: 'United Kingdom Operations & Fleet',
      label: 'UK',
      type: 'plant',
      lat: 53.4808,
      lng: -2.2426,
      count: 164280,
      status: 'optimal',
      details: 'Home market production and connected telemetry, Vodafone and EE primary cellular network.',
      country: 'UK',
      activationRate: 99.88,
      models: ['Range Rover', 'Range Rover Sport', 'Defender 110', 'Discovery Sport', 'Range Rover Velar'],
      totalSalesVehicles: 164280,
      metricsByDate: {
        'Oct 2026': { sessions: '54.2 M', data: '19840.60 GB', sms: '445.80 K', voice: '52h 30m 15s' }
      }
    },
    {
      id: 'italy',
      name: 'Italy Southern Europe Market',
      label: 'Italy',
      type: 'market',
      lat: 42.5042,
      lng: 12.5736,
      count: 48920,
      status: 'optimal',
      details: 'Southern European connected fleet corridor, TIM and Vodafone Italia 5G Standalone network.',
      country: 'Italy',
      activationRate: 99.85,
      models: ['Range Rover Velar', 'Defender 90', 'Range Rover Evoque'],
      totalSalesVehicles: 48920,
      metricsByDate: {
        'Oct 2026': { sessions: '14.6 M', data: '5240.80 GB', sms: '128.40 K', voice: '14h 22m 40s' }
      }
    },
    {
      id: 'france',
      name: 'France Strategic Market Hub',
      label: 'France',
      type: 'market',
      lat: 46.6034,
      lng: 1.8883,
      count: 64800,
      status: 'optimal',
      details: 'Western European flagship sales & distribution hub. Orange and SFR 5G SA enterprise telematics link.',
      country: 'France',
      activationRate: 99.86,
      models: ['Range Rover Evoque', 'Range Rover Velar', 'Defender 90', 'Range Rover Sport'],
      totalSalesVehicles: 64800,
      metricsByDate: {
        'Oct 2026': { sessions: '18.2 M', data: '6920.40 GB', sms: '168.30 K', voice: '18h 40m 15s' }
      }
    },
    {
      id: 'germany',
      name: 'Germany Central European Corridor',
      label: 'Germany',
      type: 'market',
      lat: 51.1657,
      lng: 10.4515,
      count: 65770,
      status: 'optimal',
      details: 'High-speed autobahn telematics corridor and primary DACH regional destination market.',
      country: 'Germany',
      activationRate: 99.89,
      models: ['Range Rover Sport', 'Defender 110', 'Discovery 5'],
      totalSalesVehicles: 65770,
      metricsByDate: {
        'Oct 2026': { sessions: '19.8 M', data: '7450.60 GB', sms: '182.40 K', voice: '20h 15m 30s' }
      }
    },
    {
      id: 'india',
      name: 'India Move™ Telematics & Manufacturing Hub',
      label: 'India',
      type: 'plant',
      lat: 21.7679,
      lng: 78.8718,
      count: 112540,
      status: 'optimal',
      details: 'Tata Communications global Move™ NOC, Pune assembly, Jio 5G SA and Airtel IoT nationwide core.',
      country: 'India',
      activationRate: 99.92,
      models: ['Range Rover Velar CKD', 'Defender 110', 'Range Rover Evoque', 'Jaguar F-PACE'],
      totalSalesVehicles: 112540,
      metricsByDate: {
        'Oct 2026': { sessions: '38.4 M', data: '14280.50 GB', sms: '348.90 K', voice: '36h 45m 10s' }
      }
    }
  ], []);

  // Helper for native input type="month" (format: YYYY-MM)
  const getYearMonthInput = (monthStr: string): string => {
    const parts = monthStr.split(' ');
    const mIndex = MONTH_NAMES.indexOf(parts[0]);
    const y = parts[1] || '2026';
    const monthNum = mIndex !== -1 ? String(mIndex + 1).padStart(2, '0') : '10';
    return `${y}-${monthNum}`;
  };

  const parseYearMonthInput = (val: string): string => {
    const [y, m] = val.split('-');
    const monthIndex = parseInt(m, 10) - 1;
    const monthName = MONTH_NAMES[monthIndex] || 'Oct';
    return `${monthName} ${y}`;
  };

  const handleSelectMonth = (monthStr: string) => {
    setSelectedMonth(monthStr);
    const parts = monthStr.split(' ');
    if (parts[1]) {
      const yr = parseInt(parts[1], 10);
      if (!isNaN(yr)) setPickerYear(yr);
    }
    setShowMonthPicker(false);
  };

  const handleNativeMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const parsed = parseYearMonthInput(e.target.value);
      handleSelectMonth(parsed);
    }
  };

  // Close month picker dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (monthPickerRef.current && !monthPickerRef.current.contains(e.target as Node)) {
        setShowMonthPicker(false);
      }
    };
    if (showMonthPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMonthPicker]);

  const getMetricsForMarker = (marker: MapMarker, month: string = selectedMonth): RegionalMetrics => {
    if (marker.metricsByDate && marker.metricsByDate[month]) {
      return marker.metricsByDate[month];
    }

    // Procedurally calculate realistic telemetry metrics for any month & year selected
    const baseCount = marker.count || 25000;
    const parts = month.split(' ');
    const monthName = parts[0];
    const yearVal = parseInt(parts[1], 10) || 2026;
    const monthIndex = MONTH_NAMES.indexOf(monthName) !== -1 ? MONTH_NAMES.indexOf(monthName) : 9;

    // Realistic monthly seasonal variance multiplier
    const factor = 0.88 + ((monthIndex * 7 + (yearVal % 10) * 11) % 25) / 100;

    const sessionsM = ((baseCount * 0.00038) * factor).toFixed(1);
    const totalGB = ((baseCount * 0.14) * factor).toFixed(2);
    const smsK = ((baseCount * 0.0034) * factor).toFixed(2);
    const voiceHours = Math.floor(4 + (monthIndex % 5));
    const voiceMins = Math.floor(10 + ((baseCount + monthIndex * 9) % 48));
    const voiceSecs = Math.floor((monthIndex * 17) % 60);

    return {
      sessions: `${sessionsM} M`,
      data: `${totalGB} GB`,
      sms: `${smsK} K`,
      voice: `${voiceHours}h ${voiceMins}m ${voiceSecs}s`
    };
  };

  const displayedMarkers = useMemo(() => baseMarkers, [baseMarkers]);

  const currentSelectedPoint = useMemo(() => {
    if (!selectedPoint) return null;
    return baseMarkers.find(m => m.id === selectedPoint.id) || selectedPoint;
  }, [selectedPoint, baseMarkers]);

  // Initialize Leaflet Map with fixed Satellite Basemap and Strict World Bounds
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCenter: L.LatLngExpression = [24.0, 15.0];
    const defaultZoom = 2;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      minZoom: 2,
      maxZoom: 13,
      zoomControl: false,
      attributionControl: true,
      maxBounds: WORLD_BOUNDS,
      maxBoundsViscosity: 1.0, // Strict lock: user cannot drag outside the world map
      worldCopyJump: false
    });

    mapInstanceRef.current = map;
    map.setMaxBounds(WORLD_BOUNDS);

    // Prevent map dragging outside world bounds
    map.on('drag', () => {
      map.panInsideBounds(WORLD_BOUNDS, { animate: false });
    });

    map.on('movestart zoomstart', () => {
      setHoveredFacility(null);
    });

    // Fixed High-Resolution Satellite Basemap (Esri World Imagery)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        minZoom: 2,
        attribution: 'Tiles &copy; Esri &mdash; Satellite Earth Observation',
        className: 'tactical-terrain-layer',
        bounds: WORLD_BOUNDS,
        noWrap: false
      }
    ).addTo(map);

    // Fixed Boundaries & Places Overlay
    L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        minZoom: 2,
        opacity: 0.85,
        bounds: WORLD_BOUNDS
      }
    ).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render 3D Holographic Marker Beacons (standing upright at fixed 21° pitch)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    displayedMarkers.forEach((marker) => {
      const isSelected = selectedPoint?.id === marker.id;
      const isWarning = marker.status === 'warning';
      const metrics = getMetricsForMarker(marker, selectedMonth);

      const countFormatted = marker.count >= 1000 
        ? `${(marker.count / 1000).toFixed(0)}k` 
        : marker.count.toString();

      const pulseColor = isWarning ? '#fbbf24' : '#38bdf8';
      const themeColor = isWarning ? 'amber' : 'sky';

      const locationTitle = marker.label
        ? marker.country && !marker.label.includes(marker.country)
          ? `${marker.label}, ${marker.country}`
          : marker.label
        : marker.country || marker.name;

      // In fixed 21° bird's-eye view, the billboard counter-rotates by -21° so it stands upright facing the viewer
      const counterRotation = -FIXED_PITCH;

      const customIcon = L.divIcon({
        className: 'custom-terrain-beacon-wrapper',
        iconSize: [120, 100],
        iconAnchor: [60, 90], // Base of vertical pillar on the terrain surface
        html: `
          <div class="relative w-[120px] h-[100px] flex flex-col items-center justify-end pointer-events-auto cursor-pointer group">
            
            <!-- Upright Holographic 3D Billboard HUD (Stands upright facing camera at 21° pitch) -->
            <div 
              class="beacon-billboard mb-1 rounded-md px-2 py-1 shadow-2xl backdrop-blur-md border flex items-center gap-1.5 transition-all duration-300 ${
                isSelected
                  ? 'bg-[#0f2442]/95 border-white text-white ring-2 ring-sky-400 scale-110 -translate-y-1'
                  : isWarning
                    ? 'bg-[#1e1a0d]/90 border-amber-400/80 text-amber-200 group-hover:scale-105 group-hover:border-amber-300'
                    : 'bg-[#0b172a]/90 border-sky-400/70 text-sky-200 group-hover:scale-105 group-hover:border-sky-300'
              }"
              style="transform: rotateX(${counterRotation}deg); transform-origin: bottom center;"
              title="${locationTitle}"
            >
              <!-- Glowing Marker Core Blip -->
              <span class="relative flex h-2.5 w-2.5 shrink-0">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isWarning ? 'bg-amber-400' : 'bg-sky-400'}"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 ${isWarning ? 'bg-amber-400' : 'bg-sky-400'} shadow-md"></span>
              </span>

              <!-- City Label & Vehicle Count -->
              <div class="flex items-center gap-1 font-mono text-[10px] whitespace-nowrap">
                <span class="font-bold text-white tracking-wide">${marker.label}</span>
                <span class="text-[9px] px-1 py-0.2 rounded font-semibold ${
                  isWarning 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                }">
                  ${countFormatted}
                </span>
              </div>
            </div>

            <!-- Vertical 3D Holographic Light Stalk (Rises 36px from terrain into sky) -->
            <div class="relative w-1 h-9 flex flex-col items-center">
              <div 
                class="w-[2px] h-full ${
                  isWarning 
                    ? 'bg-gradient-to-t from-transparent via-amber-400/60 to-amber-300' 
                    : 'bg-gradient-to-t from-transparent via-sky-400/60 to-sky-300'
                } animate-beacon-beam"
              ></div>
              <span class="absolute top-0 w-2 h-2 rounded-full ${isWarning ? 'bg-amber-300 shadow-[0_0_8px_#f59e0b]' : 'bg-sky-300 shadow-[0_0_8px_#38bdf8]'} -translate-y-1/2"></span>
            </div>

            <!-- Terrain Surface Ground Pad -->
            <div class="relative w-8 h-4 flex items-center justify-center -mt-1">
              <span 
                class="absolute w-8 h-4 rounded-full border border-${themeColor}-400/70 animate-radar-wave opacity-50"
                style="border-color: ${pulseColor};"
              ></span>
              <span 
                class="absolute w-5 h-2.5 rounded-full border border-${themeColor}-400 animate-ping opacity-75"
                style="border-color: ${pulseColor};"
              ></span>
              <span 
                class="w-2 h-1 rounded-full ${isWarning ? 'bg-amber-400' : 'bg-sky-400'} shadow-lg"
              ></span>
            </div>

          </div>
        `
      });

      const leafletMarker = L.marker([marker.lat, marker.lng], { 
        icon: customIcon,
        title: locationTitle 
      });

      // Accurate hover tracking in 2D viewport coordinates directly over the marker
      leafletMarker.on('mouseover', (e: L.LeafletMouseEvent) => {
        const viewport = viewportRef.current?.getBoundingClientRect();
        if (viewport) {
          const currentMetrics = getMetricsForMarker(marker, selectedMonth);
          setHoveredFacility({
            marker,
            metrics: currentMetrics,
            x: e.originalEvent.clientX - viewport.left,
            y: e.originalEvent.clientY - viewport.top
          });
        }
      });

      leafletMarker.on('mousemove', (e: L.LeafletMouseEvent) => {
        const viewport = viewportRef.current?.getBoundingClientRect();
        if (viewport) {
          const currentMetrics = getMetricsForMarker(marker, selectedMonth);
          setHoveredFacility({
            marker,
            metrics: currentMetrics,
            x: e.originalEvent.clientX - viewport.left,
            y: e.originalEvent.clientY - viewport.top
          });
        }
      });

      leafletMarker.on('mouseout', () => {
        setHoveredFacility(null);
      });

      leafletMarker.on('click', () => {
        setSelectedPoint(marker);
        map.flyTo([marker.lat, marker.lng], Math.max(map.getZoom(), 5), {
          duration: 1.4,
          easeLinearity: 0.25
        });
      });

      layer.addLayer(leafletMarker);
    });
  }, [displayedMarkers, selectedPoint, selectedMonth]);

  // Camera Navigation Actions
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    setSelectedPoint(null);
    mapInstanceRef.current?.flyTo([24.0, 15.0], 2, {
      duration: 1.2
    });
  };

  const handleFocusIndia = () => {
    mapInstanceRef.current?.flyTo([21.5, 78.5], 5, {
      duration: 1.4,
      easeLinearity: 0.25
    });
  };



  const selectedMetrics = currentSelectedPoint 
    ? getMetricsForMarker(currentSelectedPoint, selectedMonth)
    : null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#224375] bg-[#0c182a] p-4 shadow-2xl">
      {/* Geographical Split Section Header with Dedicated Date Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#224375]">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <Radio size={16} className="text-sky-400 animate-pulse" />
              <span>Geographical Split</span>
            </h3>
            {/* <span className="rounded bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 text-[10px] font-mono text-sky-300">
              Satellite Terrain (21° Bird's Eye)
            </span> */}
          </div>
          {/* <p className="text-[11px] text-slate-300 mt-0.5">
            Real-time telemetry and regional cellular data consumption breakdown across manufacturing hubs and roaming corridors.
          </p> */}
        </div>

        {/* Date Section (Month-only selection) & Telematics Mode Chip */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Single Date Field Selection with Year-wise Month Picker */}
          <div className="relative flex items-center" ref={monthPickerRef}>
            <button
              onClick={() => setShowMonthPicker((prev) => !prev)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-mono transition-all cursor-pointer shadow-sm group ${
                showMonthPicker
                  ? 'border-sky-400 bg-[#0f2442] text-white ring-2 ring-sky-500/30'
                  : 'border-[#224375] bg-[#091526] hover:bg-[#11233e] hover:border-sky-500/60 text-slate-200'
              }`}
              title="Click to select month year-wise"
            >
              <Calendar size={13} className="text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-normal">Date:</span>
                <span className="font-bold text-sky-300">{selectedMonth}</span>
              </div>
              <ChevronDown
                size={12}
                className={`text-slate-400 group-hover:text-sky-300 transition-transform duration-200 ${
                  showMonthPicker ? 'rotate-180 text-sky-400' : ''
                }`}
              />
            </button>

            {/* Year-wise Month Selection Popover */}
            {showMonthPicker && (
              <div className="absolute right-0 top-full mt-2 z-[600] w-72 rounded-xl border border-sky-500/50 bg-[#071322]/98 p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-100 ring-1 ring-sky-500/30">
                {/* Year Header with Steppers */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#224375]">
                  <span className="text-[11px] font-mono font-bold text-sky-300 flex items-center gap-1.5">
                    <Calendar size={12} className="text-sky-400" />
                    <span>Select Month Year-wise</span>
                  </span>

                  {/* Year Stepper */}
                  <div className="flex items-center gap-1 bg-[#0c1c33] border border-[#224375] rounded-lg px-1.5 py-0.5">
                    <button
                      onClick={() => setPickerYear((y) => y - 1)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-sky-500/20 transition-colors cursor-pointer"
                      title="Previous Year"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <span className="text-xs font-mono font-bold text-white px-2">
                      {pickerYear}
                    </span>
                    <button
                      onClick={() => setPickerYear((y) => y + 1)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-sky-500/20 transition-colors cursor-pointer"
                      title="Next Year"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Quick Year Selector Chips */}
                <div className="flex items-center justify-between gap-1 mb-2.5 px-0.5">
                  {[2024, 2025, 2026, 2027].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setPickerYear(yr)}
                      className={`flex-1 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                        pickerYear === yr
                          ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/50'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#11233e]'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>

                {/* 12 Months Grid for Selected Year */}
                <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                  {MONTH_NAMES.map((m) => {
                    const formatted = `${m} ${pickerYear}`;
                    const isSelected = selectedMonth === formatted;
                    return (
                      <button
                        key={m}
                        onClick={() => handleSelectMonth(formatted)}
                        className={`rounded-lg py-2 px-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 font-bold text-white shadow-md shadow-sky-600/30 ring-1 ring-sky-300/40'
                            : 'bg-[#0c1c33] border border-[#224375]/50 text-slate-200 hover:bg-sky-500/20 hover:text-white hover:border-sky-400/50'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>

                {/* Native Month Input fallback */}
                <div className="mt-3 pt-2.5 border-t border-[#224375]/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Custom month:</span>
                  <input
                    type="month"
                    value={getYearMonthInput(selectedMonth)}
                    onChange={handleNativeMonthChange}
                    className="bg-[#0b172a] border border-[#224375] text-sky-300 rounded px-1.5 py-0.5 text-[10px] cursor-pointer hover:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Telematics Status Chip */}
          <div className="flex items-center gap-1.5 rounded-lg border border-[#224375] bg-[#11233e] px-3 py-1.5 text-xs text-sky-300 font-mono shadow-xs">
            <Wifi size={13} className="text-emerald-400" />
            <span>Home Country Telematics</span>
          </div>
        </div>
      </div>

      {/* 3D Viewport Stage: Fixed 21° Bird's Eye Pitch */}
      <div 
        ref={viewportRef}
        className="birds-eye-viewport relative w-full aspect-[2.15/1] min-h-[440px] max-h-[560px] rounded-xl border border-[#224375] overflow-hidden bg-[#071322] shadow-[inset_0_4px_24px_rgba(0,0,0,0.85)]"
      >
        {/* Subtle Atmospheric Horizon for 21° Bird's Eye */}
        <div className="horizon-atmosphere-overlay" style={{ height: '44px', opacity: 0.7 }} />
        <div className="horizon-line" />

        {/* 3D Surface Container: Fixed 21° Oblique Tilt with zero corner gaps */}
        <div 
          className="birds-eye-surface absolute"
          style={{
            transform: `rotateX(${FIXED_PITCH}deg) scale(1.15)`,
            transformOrigin: '50% 65%',
            width: '136%',
            height: '132%',
            left: '-18%',
            top: '-16%'
          }}
        >
          {/* Leaflet Map DOM Node */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>

        {/* Live Cockpit Overlay Telemetry Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 rounded-lg bg-[#071322]/90 border border-sky-500/40 px-3 py-1.5 text-[11px] font-mono text-slate-300 backdrop-blur-md shadow-xl pointer-events-none">
          <span className="h-2.5 w-2.5 rounded-full animate-pulse bg-sky-400" />
          <span className="font-bold text-white">Home Country Telematics</span>
          <span className="text-slate-600">|</span>
          <span className="text-sky-300 font-bold">{selectedMonth}</span>
          {/* <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Hover/Click facility marker for consumption telemetry</span> */}
        </div>

        {/* Interactive Camera Control Cluster (Top Right) */}
        <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0e1d35]/90 border border-[#224375] text-sky-300 hover:bg-sky-600 hover:text-white transition-all shadow-lg backdrop-blur-xs"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0e1d35]/90 border border-[#224375] text-sky-300 hover:bg-sky-600 hover:text-white transition-all shadow-lg backdrop-blur-xs"
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={handleFocusIndia}
            title="Focus India (Mumbai, Delhi, Kolkata, Pune)"
            className="flex h-8 px-2 items-center justify-center gap-1 rounded-lg bg-[#0e1d35]/90 border border-sky-500/40 text-sky-300 hover:bg-sky-600 hover:text-white transition-all shadow-lg backdrop-blur-xs text-[10px] font-mono font-bold"
          >
            <Compass size={13} className="text-sky-400" />
            <span>India</span>
          </button>
          <button
            onClick={handleResetView}
            title="Reset Global View"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0e1d35]/90 border border-[#224375] text-sky-300 hover:bg-sky-600 hover:text-white transition-all shadow-lg backdrop-blur-xs"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Floating Telemetry Hover Panel (Strictly 2D Flat, Perfectly Aligned directly over the hovered marker) */}
        {hoveredFacility && (
          <div 
            className="absolute z-[550] pointer-events-none transition-transform duration-75 ease-out animate-in fade-in-50 zoom-in-95 duration-100"
            style={{
              left: `${Math.max(115, Math.min(hoveredFacility.x, (viewportRef.current?.clientWidth || 800) - 115))}px`,
              top: `${Math.max(105, hoveredFacility.y - 14)}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="rounded-xl border border-sky-400/80 bg-[#071322]/95 p-3 shadow-2xl backdrop-blur-xl min-w-[210px] text-xs font-mono text-white ring-1 ring-sky-500/40">
              <div className="font-bold text-white text-sm mb-1.5 pb-1.5 border-b border-sky-500/30 flex items-center justify-between gap-3">
                <span>{hoveredFacility.marker.label}, {hoveredFacility.marker.country}</span>
                <span className="text-[9px] font-bold text-sky-300 font-mono bg-sky-500/20 px-1.5 py-0.5 rounded border border-sky-500/40">
                  Usage • {selectedMonth}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Activity size={10} className="text-sky-400" /> Sessions:
                  </span>
                  <span className="font-bold text-white">{hoveredFacility.metrics.sessions}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-slate-400 flex items-center gap-1">
                    <HardDrive size={10} className="text-sky-400" /> Data:
                  </span>
                  <span className="font-bold text-sky-300">{hoveredFacility.metrics.data}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MessageSquare size={10} className="text-amber-400" /> SMS:
                  </span>
                  <span className="font-bold text-amber-300">{hoveredFacility.metrics.sms}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-slate-400 flex items-center gap-1">
                    <PhoneCall size={10} className="text-emerald-400" /> Voice:
                  </span>
                  <span className="font-bold text-emerald-300">{hoveredFacility.metrics.voice}</span>
                </div>
              </div>
            </div>
            {/* Downward pointing arrow */}
            <div className="flex justify-center -mt-[1px]">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-sky-400/80" />
            </div>
          </div>
        )}

        {/* Country Usage Interactive Panel (Bottom Left): ONLY Country Usage shows */}
        {currentSelectedPoint && selectedMetrics && (
          <div className="absolute bottom-4 left-4 z-[400] w-84 sm:w-96 rounded-xl border border-sky-500/50 bg-[#071322]/95 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  currentSelectedPoint.status === 'warning'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                }`}>
                  {currentSelectedPoint.type === 'plant' ? <Factory size={16} /> : <AlertTriangle size={16} />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-white text-sm leading-tight">
                      {currentSelectedPoint.label
                        ? currentSelectedPoint.country && !currentSelectedPoint.label.includes(currentSelectedPoint.country)
                          ? `${currentSelectedPoint.label}, ${currentSelectedPoint.country}`
                          : currentSelectedPoint.label
                        : currentSelectedPoint.country}
                    </h4>
                    <span className="rounded bg-sky-500/20 border border-sky-500/40 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-sky-300">
                      Home Country • {selectedMonth}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {currentSelectedPoint.name}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-white text-xs p-1 rounded hover:bg-[#1a3156] transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Geographical Split 4 Metrics Grid */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded-lg bg-[#040b15] border border-[#224375] p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Activity size={10} className="text-sky-400" /> Sessions
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    {selectedMetrics.sessions}
                  </span>
                </div>
                <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              </div>

              <div className="rounded-lg bg-[#040b15] border border-[#224375] p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <HardDrive size={10} className="text-sky-400" /> Data
                  </span>
                  <span className="text-sm font-bold text-sky-300 mt-0.5 block">
                    {selectedMetrics.data}
                  </span>
                </div>
                <div className="h-2 w-2 rounded-full bg-sky-400" />
              </div>

              <div className="rounded-lg bg-[#040b15] border border-[#224375] p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <MessageSquare size={10} className="text-amber-400" /> SMS
                  </span>
                  <span className="text-sm font-bold text-amber-300 mt-0.5 block">
                    {selectedMetrics.sms}
                  </span>
                </div>
                <div className="h-2 w-2 rounded-full bg-amber-400" />
              </div>

              <div className="rounded-lg bg-[#040b15] border border-[#224375] p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <PhoneCall size={10} className="text-emerald-400" /> Voice
                  </span>
                  <span className="text-sm font-bold text-emerald-300 mt-0.5 block">
                    {selectedMetrics.voice}
                  </span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
            </div>

            {/* Additional Facility Context */}
            <div className="mt-2.5 rounded-lg bg-[#040b15]/70 border border-[#224375]/70 p-2 text-[10px] font-mono flex items-center justify-between text-slate-300">
              <span>Connected Vehicles: <strong className="text-white">{currentSelectedPoint.count.toLocaleString()}</strong></span>
              {/* <span>SIM Activation: <strong className="text-sky-300">{currentSelectedPoint.activationRate || 99.8}%</strong></span> 
              <span className={`font-semibold ${currentSelectedPoint.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentSelectedPoint.status.toUpperCase()}
              </span>*/}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#224375] pt-2 text-[10px]">
              {/* <span className="text-slate-400 font-mono">
                {currentSelectedPoint.type === 'plant' ? 'Manufacturing / Operational Hub' : 'Roaming Corridor'}
              </span> */}
              <button
                onClick={() => navigateToCountry(currentSelectedPoint.country)}
                className="flex items-center gap-1.5 rounded-lg bg-sky-500/20 border border-sky-500/40 px-3 py-1.5 text-sky-300 hover:bg-sky-500/30 hover:border-sky-400 transition-all font-semibold cursor-pointer shadow-xs"
                title="Investigate Country Level Telematics"
              >
                <span>Investigate Country</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
