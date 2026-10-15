export type VehicleStatus = 'Online' | 'Offline' | 'Degraded' | 'Roaming' | 'Provisioning' | 'Suspended' | 'Critical';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface DiagnosticCode {
  code: string;
  description: string;
  subsystem: 'Powertrain' | 'Chassis' | 'Body' | 'Network' | 'Battery/EV';
  severity: AlertSeverity;
  status: 'Active' | 'Pending' | 'Stored';
  firstObserved: string;
}

export interface ConnectedAppHealth {
  id: string;
  name: string;
  category: 'Infotainment' | 'Telematics' | 'Safety' | 'OTA' | 'Remote' | 'Navigation';
  status: 'Operational' | 'Degraded' | 'Offline' | 'Updating';
  latencyMs: number;
  version: string;
  lastSync: string;
}

export interface Vehicle {
  vin: string;
  model: string;
  variant: string;
  businessUnit?: string;
  year: number;
  plantId: string;
  plantName: string;
  productionLine: string;
  mfgDate: string;
  simIccid: string;
  simImsi: string;
  status: VehicleStatus;
  networkOperator: string;
  signalRssi: number; // dBm e.g. -74
  signalRsrp: number; // dBm e.g. -88
  signalQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  networkTech: '5G SA' | '5G NSA' | '4G LTE' | '3G Fallback';
  isRoaming: boolean;
  roamingCountry?: string;
  latencyMs: number;
  packetLossPercent: number;
  dataConsumptionMb: number;
  dataUploadMb: number;
  dataDownloadMb: number;
  healthScore: number; // 0-100
  batterySocPercent: number;
  batterySohPercent: number;
  powertrainStatus: 'Nominal' | 'Warning' | 'Maintenance Required' | 'All Systems Normal';
  odometerKm: number;
  fuelOrEvLevelPercent: number;
  temperatureCabinC: number;
  dtcCodes: DiagnosticCode[];
  connectedApps: ConnectedAppHealth[];
  lastConnected: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  eUiccProfile: 'Operational - Local Carrier' | 'Bootstrap - Tata MOVE Global' | 'Secondary Roaming';
  activeAlertsCount: number;
}

export interface ProductionLine {
  id: string;
  name: string;
  stage: 'Stamping & Body' | 'Powertrain & Chassis' | 'TCU & Move SIM Integration' | 'End of Line (EOL) Telematics Audit';
  status: 'Optimal' | 'Degraded' | 'Halted';
  currentOutputPerHour: number;
  targetOutputPerHour: number;
  simProvisionSuccessRate: number; // e.g. 99.8%
  activeCycleTimeMinutes: number;
  technicianCount: number;
}

export interface Plant {
  id: string;
  name: string;
  shortName: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  totalProductionYTD: number;
  connectedVehiclesYTD: number;
  simActivationRate: number; // percentage
  provisioningSuccessRate: number; // percentage
  readinessScore: number; // 0-100
  defectRatePpm: number; // parts per million
  connectivityIncidentsYTD: number;
  activeLines: ProductionLine[];
  modelsProduced: string[];
  primaryOperator: string;
  managerName: string;
}

export interface SIMLifecycleRecord {
  iccid: string;
  imsi: string;
  msisdn: string;
  vin: string;
  model: string;
  profileState: 'Bootstrap' | 'Operational' | 'Testing' | 'Suspended' | 'Decommissioned';
  currentCarrier: string;
  homeCountry: string;
  currentCountry: string;
  dataUsedThisBillingCycleMb: number;
  quotaMb: number;
  bootstrapProvider: string;
  lastRspTransaction: string;
  activationDate: string;
  eSimEid: string;
  firmwareVersion: string;
}

export interface NetworkOperatorMetric {
  operator: string;
  country: string;
  region: 'EMEA' | 'Americas' | 'APAC' | 'UK & Ireland';
  activeSims: number;
  networkTech: string;
  avgLatencyMs: number;
  packetLossPercent: number;
  availabilitySla: number;
  uptimePercent: number;
  incidentCount: number;
  status: 'Optimal' | 'Degraded' | 'Critical';
}

export interface IncidentAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: 'Critical Connectivity Failure' | 'SIM Activation Failure' | 'Network Degradation' | 'Vehicle Offline' | 'Abnormal Data Consumption' | 'Application Failure' | 'Vehicle Health Warning' | 'Plant-Level Connectivity Issue';
  plantId?: string;
  plantName?: string;
  affectedVinCount: number;
  targetVin?: string;
  status: 'Open' | 'Investigating' | 'Mitigated' | 'Resolved';
  timestamp: string;
  correlationCluster?: string;
  assignedTeam: 'Move NOC Ops' | 'Plant Manufacturing IT' | 'Telematics Engineering' | 'JLR Field Service';
  rootCauseAnalysis?: string;
  slaBreachMinutes?: number;
}

export interface BusinessValueMetric {
  id: string;
  category: 'Warranty & SOTA' | 'Plant Efficiency' | 'Roaming Optimization' | 'SLA & Availability' | 'Customer Experience';
  metricTitle: string;
  realizedValue: string;
  baselineComparison: string;
  savingsUSD: string;
  growthPercent: number;
  description: string;
}

export interface GlobalFilterState {
  plantId: string; // 'all' or plantId
  model: string; // 'all' or model name
  status: string; // 'all' or VehicleStatus
  timeRange: '24h' | '7d' | '30d' | 'quarter' | 'ytd';
  searchQuery: string;
  networkOperator: string;
  businessUnits: string[];
}

export type NavigationModule = 
  | 'executive-overview'
  | 'country-details'
  | 'plant-intelligence'
  | 'fleet-management'
  | 'vehicle-360'
  | 'sim-management'
  | 'network-operations'
  | 'vehicle-health'
  | 'connected-apps'
  | 'business-benefits'
  | 'analytics-reports'
  | 'ai-insights'
  | 'alerts-incidents'
  | 'administration';
