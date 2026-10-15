import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Vehicle, 
  Plant, 
  IncidentAlert, 
  NavigationModule, 
  GlobalFilterState, 
  VehicleStatus 
} from '../types';
import { 
  JLR_VEHICLES, 
  JLR_PLANTS, 
  INCIDENT_ALERTS 
} from '../data/mockData';

interface AppContextType {
  activeModule: NavigationModule;
  setActiveModule: (module: NavigationModule) => void;
  selectedVehicleVin: string;
  setSelectedVehicleVin: (vin: string) => void;
  selectedVehicle: Vehicle | null;
  filters: GlobalFilterState;
  setFilter: (key: keyof GlobalFilterState, value: any) => void;
  resetFilters: () => void;
  filteredVehicles: Vehicle[];
  plants: Plant[];
  vehicles: Vehicle[];
  incidents: IncidentAlert[];
  isLiveSimulation: boolean;
  setIsLiveSimulation: (active: boolean) => void;
  lastTelemetryTick: Date;
  selectedPlant: Plant | null;
  setSelectedPlantId: (plantId: string) => void;
  navigateToCockpit: (vin: string) => void;
  navigateToPlant: (plantId: string) => void;
  selectedCountryId: string;
  setSelectedCountryId: (countryId: string) => void;
  navigateToCountry: (countryId: string) => void;
  acknowledgeIncident: (id: string) => void;
  resolveIncident: (id: string) => void;
  pingVehicle: (vin: string) => void;
  switchEsimProfile: (vin: string) => void;
  activeToast: { title: string; message: string; type?: 'info' | 'success' | 'warning' } | null;
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_BUSINESS_UNITS = [
  'JLR EV Charger',
  'JLR EVA25 PP',
  'JLR EVA25 Prod',
  'JLR FOC Engg Support',
  'JLR Production',
  'JLR Production PSIMs',
  'JLR VDC Test Pre-Prod',
  'JLR VDC Test Staging'
];

const initialFilters: GlobalFilterState = {
  plantId: 'all',
  model: 'all',
  status: 'all',
  timeRange: '24h',
  searchQuery: '',
  networkOperator: 'all',
  businessUnits: []
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<NavigationModule>('executive-overview');
  const [selectedVehicleVin, setSelectedVehicleVin] = useState<string>('SALWR2V48PA198421');
  const [filters, setFilters] = useState<GlobalFilterState>(initialFilters);
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => 
    JLR_VEHICLES.map((v, i) => ({
      ...v,
      businessUnit: v.businessUnit || DEFAULT_BUSINESS_UNITS[i % DEFAULT_BUSINESS_UNITS.length]
    }))
  );
  const [plants] = useState<Plant[]>(JLR_PLANTS);
  const [incidents, setIncidents] = useState<IncidentAlert[]>(INCIDENT_ALERTS);
  const [isLiveSimulation, setIsLiveSimulation] = useState<boolean>(true);
  const [lastTelemetryTick, setLastTelemetryTick] = useState<Date>(new Date());
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type?: 'info' | 'success' | 'warning' } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const showToast = (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast((curr) => (curr?.title === title ? null : curr));
    }, 4000);
  };

  const setFilter = (key: keyof GlobalFilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const setSelectedPlantId = (plantId: string) => {
    setFilters(prev => ({ ...prev, plantId }));
  };

  const selectedVehicle = useMemo(() => {
    return vehicles.find(v => v.vin === selectedVehicleVin) || vehicles[0] || null;
  }, [vehicles, selectedVehicleVin]);

  const selectedPlant = useMemo(() => {
    if (filters.plantId === 'all') return null;
    return plants.find(p => p.id === filters.plantId) || null;
  }, [plants, filters.plantId]);

  const [selectedCountryId, setSelectedCountryId] = useState<string>('uk');

  const navigateToCockpit = (vin: string) => {
    setSelectedVehicleVin(vin);
    setActiveModule('vehicle-360');
  };

  const navigateToPlant = (plantId: string) => {
    setFilter('plantId', plantId);
    setActiveModule('plant-intelligence');
  };

  const navigateToCountry = (countryId: string) => {
    setSelectedCountryId(countryId);
    setActiveModule('country-details');
  };

  const acknowledgeIncident = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'Investigating' } : inc));
    showToast('Incident Acknowledged', `Incident ${id} updated to Investigating. NOC team notified.`, 'info');
  };

  const resolveIncident = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'Resolved' } : inc));
    showToast('Incident Resolved', `Incident ${id} marked as Resolved. SLA timer completed.`, 'success');
  };

  const pingVehicle = (vin: string) => {
    showToast('Diagnostics Handshake Sent', `Live UDS telemetry ping sent to VIN ${vin} via Move SIM gateway.`, 'info');
    setTimeout(() => {
      setVehicles(prev => prev.map(v => {
        if (v.vin === vin) {
          return {
            ...v,
            lastConnected: 'Just now',
            latencyMs: Math.max(18, Math.round(v.latencyMs * 0.9))
          };
        }
        return v;
      }));
      showToast('Telemetry Synchronized', `VIN ${vin} replied with status OK in 22ms.`, 'success');
    }, 1200);
  };

  const switchEsimProfile = (vin: string) => {
    showToast('GSMA RSP Switch Initiated', `Tata Move SM-DP+ server requested eUICC profile toggle for ${vin}.`, 'info');
    setTimeout(() => {
      setVehicles(prev => prev.map(v => {
        if (v.vin === vin) {
          const nextProfile = v.eUiccProfile.includes('Bootstrap') 
            ? 'Operational - Local Carrier' 
            : 'Bootstrap - Tata MOVE Global';
          return {
            ...v,
            eUiccProfile: nextProfile,
            status: 'Online',
            networkTech: '5G SA',
            lastConnected: 'Just now'
          };
        }
        return v;
      }));
      showToast('Profile Switched', `eUICC profile successfully updated. Local IP session established.`, 'success');
    }, 1800);
  };

  // Real-time telemetry simulation pulse
  useEffect(() => {
    if (!isLiveSimulation) return;
    const interval = setInterval(() => {
      setLastTelemetryTick(new Date());
      setVehicles(prev => {
        return prev.map(v => {
          if (v.status === 'Offline') return v;
          // small jitter in telemetry
          const latencyDelta = Math.floor(Math.random() * 5) - 2;
          const newLatency = Math.max(16, Math.min(180, v.latencyMs + latencyDelta));
          const rssiDelta = Math.floor(Math.random() * 3) - 1;
          const newRssi = Math.max(-125, Math.min(-65, v.signalRssi + rssiDelta));
          const dataDelta = Math.floor(Math.random() * 4) + 1;

          return {
            ...v,
            latencyMs: newLatency,
            signalRssi: newRssi,
            dataConsumptionMb: v.dataConsumptionMb + dataDelta,
            dataDownloadMb: v.dataDownloadMb + dataDelta
          };
        });
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isLiveSimulation]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (filters.plantId !== 'all' && v.plantId !== filters.plantId) return false;
      if (filters.model !== 'all' && v.model !== filters.model) return false;
      if (filters.status !== 'all' && v.status !== filters.status) return false;
      if (filters.networkOperator !== 'all' && !v.networkOperator.toLowerCase().includes(filters.networkOperator.toLowerCase())) return false;
      if (filters.businessUnits && filters.businessUnits.length > 0 && v.businessUnit) {
        if (!filters.businessUnits.includes(v.businessUnit)) return false;
      }
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesVin = v.vin.toLowerCase().includes(q);
        const matchesModel = v.model.toLowerCase().includes(q);
        const matchesIccid = v.simIccid.includes(q);
        const matchesCity = v.city.toLowerCase().includes(q);
        const matchesPlant = v.plantName.toLowerCase().includes(q);
        if (!matchesVin && !matchesModel && !matchesIccid && !matchesCity && !matchesPlant) return false;
      }
      return true;
    });
  }, [vehicles, filters]);

  return (
    <AppContext.Provider
      value={{
        activeModule,
        setActiveModule,
        selectedVehicleVin,
        setSelectedVehicleVin,
        selectedVehicle,
        filters,
        setFilter,
        resetFilters,
        filteredVehicles,
        plants,
        vehicles,
        incidents,
        isLiveSimulation,
        setIsLiveSimulation,
        lastTelemetryTick,
        selectedPlant,
        setSelectedPlantId,
        navigateToCockpit,
        navigateToPlant,
        selectedCountryId,
        setSelectedCountryId,
        navigateToCountry,
        acknowledgeIncident,
        resolveIncident,
        pingVehicle,
        switchEsimProfile,
        activeToast,
        showToast,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
