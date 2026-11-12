import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Globe, 
  HardDrive, 
  MessageSquare, 
  PhoneCall, 
  Wifi, 
  CheckCircle2, 
  AlertTriangle, 
  Car, 
  ExternalLink, 
  Cpu, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  X,
  Search,
  BarChart3,
  ListFilter,
  Server,
  Layers,
  ShieldCheck,
  Copy,
  Check,
  Radio,
  Antenna,
  Zap,
  Activity,
  RotateCw,
  RotateCcw,
  MoreVertical
} from 'lucide-react';
import { Vehicle } from '../../types';
import { TelematicsUsageAnalytics } from './TelematicsUsageAnalytics';

// The 6 allowed countries strictly matching user specification
export const ALLOWED_COUNTRIES = ['US', 'UK', 'Italy', 'France', 'Germany', 'India'] as const;
export type AllowedCountry = typeof ALLOWED_COUNTRIES[number];

export interface OperatorTrafficStat {
  operator: string;
  dataTB: number;
  voiceHours: number;
  smsK: number;
  color: string;
}

// Device Hierarchy interfaces per user specifications:
// VIN -> Make & Model -> Attached Devices -> EID -> Profile -> Multiple ICCIDs (Status: Active | Fallback)
export interface DeviceIccid {
  iccid: string;
  imsi: string;
  status: 'Active' | 'Fallback';
  operator: string;
  networkTech: string;
  signalQuality: string;
  role: string;
  ipAddress: string;
  apn: string;
}

export interface DeviceProfile {
  id: string;
  name: string;
  type: 'Operational' | 'Bootstrap' | 'Emergency';
  gsmaSpec: string;
  state: 'Enabled' | 'Standby';
  iccids: DeviceIccid[];
}

export interface AttachedDevice {
  deviceId: string;
  deviceName: string;
  subsystem: string;
  hardwareModel: string;
  firmwareVersion: string;
  eid: string;
  connectionStatus: 'Online' | 'Standby';
  profiles: DeviceProfile[];
}

// Deterministic generator of attached devices, EIDs, Profiles, and ICCIDs for any vehicle VIN
export function getVehicleAttachedDevices(vehicle: Vehicle): AttachedDevice[] {
  const cleanVin = vehicle.vin.replace(/[^A-Za-z0-9]/g, '');
  const hashNum = cleanVin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Format 32-digit GSMA eUICC EID
  const makeEid = (prefix: number) => {
    const raw = `890490320050${prefix}${hashNum.toString().padStart(4, '0')}000001294820194`.slice(0, 32);
    return raw.match(/.{1,4}/g)?.join(' ') || raw;
  };

  const primaryOperator = vehicle.networkOperator || 'Jio 5G Standalone';
  const fallbackOperator = primaryOperator.includes('Jio') 
    ? 'Bharti Airtel IoT Backup' 
    : primaryOperator.includes('AT&T') 
    ? 'T-Mobile US Ultra Capacity Fallback' 
    : primaryOperator.includes('Vodafone') 
    ? 'EE / BT Group Secondary' 
    : primaryOperator.includes('Orange')
    ? 'SFR Automotive Failover'
    : primaryOperator.includes('Deutsche')
    ? 'Telefónica O2 Germany Fallback'
    : 'Tata Communications Move™ Roaming Mesh';

  // Device 1: Primary TCU
  const tcuDevice: AttachedDevice = {
    deviceId: 'DEV-TCU-01',
    deviceName: 'Primary Telematics Control Unit (TCU)',
    subsystem: 'Powertrain, eCall & Safety Telematics',
    hardwareModel: 'Qualcomm Snapdragon Auto 5G SA (TCU Gen 4)',
    firmwareVersion: 'JLR-TCU-v4.8.2-PROD',
    eid: makeEid(11),
    connectionStatus: 'Online',
    profiles: [
      {
        id: 'PROF-OP-01',
        name: 'JLR Tier-1 Operational Carrier Profile (Local Core)',
        type: 'Operational',
        gsmaSpec: 'GSMA SGP.02 eUICC v3.1',
        state: 'Enabled',
        iccids: [
          {
            iccid: vehicle.simIccid || `89911002348910294${hashNum % 1000}F`,
            imsi: vehicle.simImsi || '310410892019201',
            status: 'Active',
            operator: primaryOperator,
            networkTech: vehicle.networkTech || '5G SA',
            signalQuality: `${vehicle.signalQuality || 'Excellent'} (${vehicle.signalRssi || -74} dBm)`,
            role: 'Primary High-Speed Cellular Bearer',
            ipAddress: '10.244.18.92',
            apn: 'jlr.move.telematics.5g'
          },
          {
            iccid: `${(vehicle.simIccid || '8991100234891029481F').slice(0, 16)}${((hashNum + 77) % 900 + 100)}F`,
            imsi: '310410892019299',
            status: 'Fallback',
            operator: fallbackOperator,
            networkTech: '4G LTE-A / 5G NSA',
            signalQuality: 'Good (-84 dBm)',
            role: 'Carrier Failover Standby Bearer',
            ipAddress: '10.244.19.104',
            apn: 'jlr.move.backup.telematics'
          }
        ]
      },
      {
        id: 'PROF-BOOT-02',
        name: 'Tata MOVE™ Global Bootstrap & Emergency Recovery',
        type: 'Bootstrap',
        gsmaSpec: 'GSMA SGP.02 v4.2',
        state: 'Standby',
        iccids: [
          {
            iccid: `899100010992834${(hashNum % 90000 + 10000)}F`,
            imsi: '204040001928341',
            status: 'Fallback',
            operator: 'Tata Communications Move™ Global Core',
            networkTech: 'Multi-IMSI Bootstrap Mesh',
            signalQuality: 'Standby (-79 dBm)',
            role: 'Emergency eCall & Factory Bootstrap Fallback',
            ipAddress: '10.128.4.15',
            apn: 'tata.move.bootstrap.iot'
          }
        ]
      }
    ]
  };

  // Device 2: InControl & Pivi Pro IHU
  const infotainmentDevice: AttachedDevice = {
    deviceId: 'DEV-IHU-02',
    deviceName: 'Infotainment',
    subsystem: 'Cabin Media, Cloud Navigation & SOTA Wi-Fi Hotspot',
    hardwareModel: 'Harman Becker Pivi Pro EVA2.5 Dual-eSIM Unit',
    firmwareVersion: 'OS-PIVI-2026.4.1',
    eid: makeEid(22),
    connectionStatus: 'Online',
    profiles: [
      {
        id: 'PROF-PIVI-01',
        name: 'Consumer In-Cabin Connected Services Profile',
        type: 'Operational',
        gsmaSpec: 'GSMA SGP.02 eUICC v3.1',
        state: 'Enabled',
        iccids: [
          {
            iccid: `89912003482910${(hashNum % 90000 + 10000)}F`,
            imsi: '310260482910283',
            status: 'Active',
            operator: primaryOperator,
            networkTech: '5G SA High-Band',
            signalQuality: 'Excellent (-71 dBm)',
            role: 'Pivi Pro Cloud Media & Hotspot Traffic',
            ipAddress: '10.245.88.14',
            apn: 'jlr.pivi.incontrol.hotspot'
          },
          {
            iccid: `89912003482999${(hashNum % 90000 + 10000)}F`,
            imsi: '310260482910299',
            status: 'Fallback',
            operator: 'Global Roaming Data Hub',
            networkTech: '4G LTE-M / Roaming',
            signalQuality: 'Good (-86 dBm)',
            role: 'Cross-Border Streaming Standby',
            ipAddress: '10.245.89.02',
            apn: 'jlr.pivi.roam.backup'
          }
        ]
      }
    ]
  };

  // Device 3: VCU & BMS Gateway
  const vcuDevice: AttachedDevice = {
    deviceId: 'DEV-BMS-03',
    deviceName: 'VCU & BMS Telemetry Gateway (Battery Management)',
    subsystem: 'Battery Management, Thermal Monitoring & Drive Diagnostics',
    hardwareModel: 'Bosch Automotive VCU-Gen5 IoT Gateway',
    firmwareVersion: 'BMS-DIAG-v6.1',
    eid: makeEid(33),
    connectionStatus: 'Online',
    profiles: [
      {
        id: 'PROF-BMS-01',
        name: 'Ultra-Low-Power Powertrain Telemetry Profile',
        type: 'Operational',
        gsmaSpec: 'GSMA RSP M2M Spec',
        state: 'Enabled',
        iccids: [
          {
            iccid: `89913008920194${(hashNum % 90000 + 10000)}F`,
            imsi: '310410772910284',
            status: 'Active',
            operator: primaryOperator,
            networkTech: '5G RedCap / LTE-M',
            signalQuality: 'Excellent (-76 dBm)',
            role: 'Real-Time High-Frequency Battery Telemetry',
            ipAddress: '10.246.12.51',
            apn: 'jlr.bms.battery.uds'
          },
          {
            iccid: `89913008920199${(hashNum % 90000 + 10000)}F`,
            imsi: '310410772910299',
            status: 'Fallback',
            operator: 'Low-Latency Narrowband Failover',
            networkTech: 'NB-IoT / LTE-M',
            signalQuality: 'Good (-89 dBm)',
            role: 'Deep-Sleep Wakeup & Security Fallback',
            ipAddress: '10.246.12.99',
            apn: 'jlr.bms.fallback.iot'
          }
        ]
      }
    ]
  };

  return [tcuDevice, infotainmentDevice];
}

// Model & Device Architecture interfaces for Make/Model filter and 4-channel telemetry usage pattern
export interface DeviceDailyPoint {
  day: string;
  dataMB: number;
  voiceMins: number;
  smsCount: number;
  sigfoxFrames: number;
}

export interface ModelConnectedDevice {
  deviceId: string;
  name: string;
  shortName: string;
  subsystem: string;
  hardwareModel: string;
  role: string;
  category: 'tcu' | 'ihu' | 'vcu' | 'sigfox';
  // Single SIM per device specifications
  simIccid: string;
  simImsi: string;
  carrier: string;
  networkBearer: string;
  apn: string;
  ipAddress: string;
  simStatus: 'Active' | 'Online' | 'Standby';
  // Aggregate Usage Pattern
  usage: {
    dataDisplay: string;
    dataTotalMB: number;
    voiceDisplay: string;
    voiceTotalMins: number;
    smsDisplay: string;
    smsTotalCount: number;
    sigfoxDisplay: string;
    sigfoxTotalFrames: number;
    frequency: string;
    payloadNotes: string;
  };
  dailyHistory: DeviceDailyPoint[];
}

export interface VehicleModelTelemetrySpec {
  modelName: string;
  make: string;
  category: string;
  variant: string;
  devices: ModelConnectedDevice[];
}

// Generate rich, deterministic model telemetry specs and attached devices for any country and models
export function generateModelTelemetrySpecs(countryCode: AllowedCountry, models: string[]): VehicleModelTelemetrySpec[] {
  const primaryCarrier = countryCode === 'India' 
    ? 'Jio 5G Standalone' 
    : countryCode === 'US' 
    ? 'AT&T Enterprise IoT' 
    : countryCode === 'UK' 
    ? 'Vodafone UK Core' 
    : countryCode === 'France' 
    ? 'Orange France IoT' 
    : countryCode === 'Germany' 
    ? 'Deutsche Telekom 5G' 
    : 'TIM Enterprise Italy';

  const secondaryCarrier = countryCode === 'India' 
    ? 'Bharti Airtel IoT' 
    : countryCode === 'US' 
    ? 'T-Mobile Ultra Capacity' 
    : countryCode === 'UK' 
    ? 'EE / BT Group' 
    : countryCode === 'France' 
    ? 'SFR Automotive' 
    : countryCode === 'Germany' 
    ? 'Telefónica O2 Germany' 
    : 'Vodafone Omnitel Italia';

  return models.map((modelName, mIdx) => {
    const seed = (mIdx + 1) * 37;
    const isOffroadOrExpedition = modelName.includes('Defender') || modelName.includes('Sport');
    const isElectric = modelName.includes('I-PACE') || modelName.includes('Velar');

    const devices: ModelConnectedDevice[] = [];

    // Device 1: Primary TCU (All models)
    devices.push({
      deviceId: `DEV-TCU-${mIdx + 1}`,
      name: 'Primary Powertrain & eCall Telematics (TCU Gen 4)',
      shortName: 'Primary TCU 5G',
      subsystem: 'Powertrain, Active Safety & eCall Emergency',
      hardwareModel: 'Qualcomm Snapdragon Auto 5G SA (TCU-PRO)',
      role: 'Mission-Critical CAN Telemetry & High-Band Cellular',
      category: 'tcu',
      simIccid: `8991 1002 9182 3491 ${(seed * 11) % 9000 + 1000}F`,
      simImsi: `31041089201920${mIdx + 1}`,
      carrier: primaryCarrier,
      networkBearer: '5G SA (Band n78 / n28)',
      apn: 'jlr.move.tcu.primary',
      ipAddress: `10.244.18.${70 + mIdx}`,
      simStatus: 'Active',
      usage: {
        dataDisplay: `${(16.4 + (seed % 5)).toFixed(1)} GB`,
        dataTotalMB: Math.round((16.4 + (seed % 5)) * 1024),
        voiceDisplay: `${38 + (seed % 20)} mins (14 eCall / bCall sessions)`,
        voiceTotalMins: 38 + (seed % 20),
        smsDisplay: `${165 + (seed % 40)} SMS triggers`,
        smsTotalCount: 165 + (seed % 40),
        sigfoxDisplay: '18 frames (Sleep heartbeat)',
        sigfoxTotalFrames: 18,
        frequency: 'Continuous 100Hz Real-Time',
        payloadNotes: 'High-frequency CAN bus telemetry, diagnostic DTC polling & SOTA firmware patches'
      },
      dailyHistory: [
        { day: 'Mon', dataMB: 2450, voiceMins: 6, smsCount: 28, sigfoxFrames: 3 },
        { day: 'Tue', dataMB: 2890, voiceMins: 8, smsCount: 32, sigfoxFrames: 2 },
        { day: 'Wed', dataMB: 3120, voiceMins: 5, smsCount: 26, sigfoxFrames: 3 },
        { day: 'Thu', dataMB: 2780, voiceMins: 9, smsCount: 34, sigfoxFrames: 2 },
        { day: 'Fri', dataMB: 3450, voiceMins: 11, smsCount: 38, sigfoxFrames: 4 },
        { day: 'Sat', dataMB: 1980, voiceMins: 4, smsCount: 16, sigfoxFrames: 2 },
        { day: 'Sun', dataMB: 1820, voiceMins: 3, smsCount: 14, sigfoxFrames: 2 }
      ]
    });

    // Device 2: Pivi Pro IHU (All models)
    devices.push({
      deviceId: `DEV-IHU-${mIdx + 1}`,
      name: 'InControl & Pivi Pro Infotainment Gateway (IHU)',
      shortName: 'Pivi Pro IHU',
      subsystem: 'Cabin Media, Cloud Navigation & Wi-Fi Hotspot',
      hardwareModel: 'Harman Becker Pivi Pro EVA2.5 Dual-eSIM Unit',
      role: 'Cabin Entertainment & Connected Cloud Services',
      category: 'ihu',
      simIccid: `8991 2003 4829 1042 ${(seed * 13) % 9000 + 1000}F`,
      simImsi: `31026048291028${mIdx + 1}`,
      carrier: primaryCarrier,
      networkBearer: '5G SA High-Band / 4G LTE-A Hotspot',
      apn: 'jlr.pivi.incontrol.hotspot',
      ipAddress: `10.245.88.${30 + mIdx}`,
      simStatus: 'Active',
      usage: {
        dataDisplay: `${(38.2 + (seed % 12)).toFixed(1)} GB`,
        dataTotalMB: Math.round((38.2 + (seed % 12)) * 1024),
        voiceDisplay: '0 min (Dedicated Data Bearer)',
        voiceTotalMins: 0,
        smsDisplay: `${12 + (seed % 10)} SMS (OTA activation)`,
        smsTotalCount: 12 + (seed % 10),
        sigfoxDisplay: '0 frames (Non-LPWAN)',
        sigfoxTotalFrames: 0,
        frequency: 'On-Demand & In-Cabin Streaming',
        payloadNotes: 'HD Cloud Navigation, Spotify lossless, 4K map layers & Passenger Wi-Fi clients'
      },
      dailyHistory: [
        { day: 'Mon', dataMB: 5120, voiceMins: 0, smsCount: 2, sigfoxFrames: 0 },
        { day: 'Tue', dataMB: 5840, voiceMins: 0, smsCount: 3, sigfoxFrames: 0 },
        { day: 'Wed', dataMB: 6210, voiceMins: 0, smsCount: 1, sigfoxFrames: 0 },
        { day: 'Thu', dataMB: 5490, voiceMins: 0, smsCount: 2, sigfoxFrames: 0 },
        { day: 'Fri', dataMB: 7120, voiceMins: 0, smsCount: 4, sigfoxFrames: 0 },
        { day: 'Sat', dataMB: 4890, voiceMins: 0, smsCount: 1, sigfoxFrames: 0 },
        { day: 'Sun', dataMB: 4280, voiceMins: 0, smsCount: 1, sigfoxFrames: 0 }
      ]
    });

    // Device 3: VCU & BMS Telemetry Gateway
    devices.push({
      deviceId: `DEV-VCU-${mIdx + 1}`,
      name: isElectric 
        ? 'High-Voltage BMS & Thermal Telemetry Unit' 
        : 'VCU & Powertrain Diagnostics Gateway',
      shortName: isElectric ? 'HV Battery BMS' : 'VCU Gateway',
      subsystem: isElectric ? 'High-Voltage Battery, Inverter & Thermal Core' : 'Chassis Dynamics & Emissions Telemetry',
      hardwareModel: 'Bosch Automotive VCU-Gen5 IoT Gateway',
      role: 'Low-Latency Battery Diagnostic & Cell Health Telemetry',
      category: 'vcu',
      simIccid: `8991 3008 9201 9450 ${(seed * 17) % 9000 + 1000}F`,
      simImsi: `31041077291028${mIdx + 1}`,
      carrier: secondaryCarrier,
      networkBearer: '5G RedCap / LTE-M IoT',
      apn: 'jlr.bms.battery.uds',
      ipAddress: `10.246.12.${50 + mIdx}`,
      simStatus: 'Active',
      usage: {
        dataDisplay: `${(2.8 + (seed % 3)).toFixed(1)} GB`,
        dataTotalMB: Math.round((2.8 + (seed % 3)) * 1024),
        voiceDisplay: '0 min (Data-Only Gateway)',
        voiceTotalMins: 0,
        smsDisplay: `${74 + (seed % 25)} SMS alerts`,
        smsTotalCount: 74 + (seed % 25),
        sigfoxDisplay: '42 frames (Sleep sync)',
        sigfoxTotalFrames: 42,
        frequency: 'Periodic 10Hz Battery Diagnostic Pulses',
        payloadNotes: 'Cell temperature, pack impedance, State of Charge (SoC), State of Health (SoH) diagnostics'
      },
      dailyHistory: [
        { day: 'Mon', dataMB: 410, voiceMins: 0, smsCount: 11, sigfoxFrames: 6 },
        { day: 'Tue', dataMB: 450, voiceMins: 0, smsCount: 14, sigfoxFrames: 7 },
        { day: 'Wed', dataMB: 390, voiceMins: 0, smsCount: 9, sigfoxFrames: 5 },
        { day: 'Thu', dataMB: 480, voiceMins: 0, smsCount: 12, sigfoxFrames: 6 },
        { day: 'Fri', dataMB: 520, voiceMins: 0, smsCount: 16, sigfoxFrames: 8 },
        { day: 'Sat', dataMB: 360, voiceMins: 0, smsCount: 7, sigfoxFrames: 5 },
        { day: 'Sun', dataMB: 340, voiceMins: 0, smsCount: 5, sigfoxFrames: 5 }
      ]
    });

    // Device 4: Dedicated Sigfox LPWAN Anti-Theft & Stolen Vehicle Tracker (for Expedition, Off-Road, Flagship & Electric models)
    if (isOffroadOrExpedition || isElectric || mIdx % 2 === 0) {
      devices.push({
        deviceId: `DEV-SIG-${mIdx + 1}`,
        name: 'Autonomous Sigfox LPWAN Anti-Theft & Fleet Tracker',
        shortName: 'Sigfox LPWAN Tracker',
        subsystem: 'Autonomous Asset Tracking & Stolen Vehicle Recovery',
        hardwareModel: 'Tata MOVE™ Sigfox RC1/RC4 Ultra-Low-Power Transceiver',
        role: 'Autonomous Jamming-Resistant Anti-Theft Heartbeat Beacon',
        category: 'sigfox',
        simIccid: `8991 4005 8192 0014 ${(seed * 19) % 9000 + 1000}F`,
        simImsi: `31099000192834${mIdx + 1}`,
        carrier: 'Tata Communications Move™ Sigfox Global Network',
        networkBearer: 'Sigfox UNB 868 MHz (RC1) / 902 MHz (RC4)',
        apn: 'tata.move.sigfox.lpwan',
        ipAddress: `10.128.9.${10 + mIdx}`,
        simStatus: 'Active',
        usage: {
          dataDisplay: '0.12 MB (Ultra-Narrowband)',
          dataTotalMB: 0.12,
          voiceDisplay: '0 min (Sub-GHz Radio Only)',
          voiceTotalMins: 0,
          smsDisplay: '0 SMS (Cellular-Independent)',
          smsTotalCount: 0,
          sigfoxDisplay: `${580 + (seed % 120)} frames (12-byte uplink)`,
          sigfoxTotalFrames: 580 + (seed % 120),
          frequency: '15-Minute Uplink Heartbeat (Deep-Sleep Capable)',
          payloadNotes: 'Anti-theft GPS coordinate beacons, tamper trip sensors, motion alerts on 868MHz UNB radio'
        },
        dailyHistory: [
          { day: 'Mon', dataMB: 0.02, voiceMins: 0, smsCount: 0, sigfoxFrames: 88 },
          { day: 'Tue', dataMB: 0.02, voiceMins: 0, smsCount: 0, sigfoxFrames: 92 },
          { day: 'Wed', dataMB: 0.02, voiceMins: 0, smsCount: 0, sigfoxFrames: 84 },
          { day: 'Thu', dataMB: 0.02, voiceMins: 0, smsCount: 0, sigfoxFrames: 96 },
          { day: 'Fri', dataMB: 0.02, voiceMins: 0, smsCount: 0, sigfoxFrames: 104 },
          { day: 'Sat', dataMB: 0.01, voiceMins: 0, smsCount: 0, sigfoxFrames: 68 },
          { day: 'Sun', dataMB: 0.01, voiceMins: 0, smsCount: 0, sigfoxFrames: 64 }
        ]
      });
    }

    return {
      modelName,
      make: 'Jaguar Land Rover (JLR)',
      category: isOffroadOrExpedition ? 'All-Terrain Expedition 4x4' : isElectric ? 'All-Electric / Plug-in Hybrid' : 'Luxury Performance Flagship',
      variant: isElectric ? 'EV 400PS HSE AWD' : isOffroadOrExpedition ? 'D300 Dynamic SE 4WD' : 'P530 V8 Autobiography',
      devices
    };
  });
}

interface CountryMeta {
  code: AllowedCountry;
  name: string;
  flag: string;
  region: string;
  totalVehicles: number;
  activationRate: number;
  dataMonthly: string;
  dataTB: string;
  sessionsMonthly: string;
  smsMonthly: string;
  voiceMonthly: string;
  avgLatency: string;
  packetLoss: string;
  primaryOperators: {
    name: string;
    role: string;
    tech: string;
    latency: string;
    sla: string;
    status: 'Optimal' | 'Warning';
  }[];
  modelsRunning: string[];
}

const COUNTRY_METADATA: Record<AllowedCountry, CountryMeta> = {
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    region: 'North America',
    totalVehicles: 138600,
    activationRate: 99.91,
    dataMonthly: '18,450.20 GB',
    dataTB: '18.45',
    sessionsMonthly: '42.8 M',
    smsMonthly: '380.50 K',
    voiceMonthly: '42h 15m 10s',
    avgLatency: '24ms',
    packetLoss: '0.02%',
    primaryOperators: [
      { name: 'AT&T Enterprise IoT', role: 'Primary 5G Carrier Hub', tech: '5G SA / FirstNet Band 14', latency: '22ms', sla: '99.99%', status: 'Optimal' },
      { name: 'T-Mobile US Ultra Capacity', role: 'High-Band 5G Roaming', tech: '5G SA / Ultra Wideband', latency: '26ms', sla: '99.95%', status: 'Optimal' },
      { name: 'Verizon Wireless IoT', role: 'Secondary Fallback Core', tech: '4G LTE-M / 5G NSA', latency: '28ms', sla: '99.92%', status: 'Optimal' }
    ],
    modelsRunning: ['Range Rover', 'Defender 110', 'Range Rover Sport', 'Defender 130', 'Range Rover SV']
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Western Europe & Home Market',
    totalVehicles: 164280,
    activationRate: 99.88,
    dataMonthly: '19,840.60 GB',
    dataTB: '19.84',
    sessionsMonthly: '54.2 M',
    smsMonthly: '445.80 K',
    voiceMonthly: '52h 30m 15s',
    avgLatency: '18ms',
    packetLoss: '0.01%',
    primaryOperators: [
      { name: 'Vodafone IoT Global', role: 'Primary European MVNO Backbone', tech: '5G SA / 4G LTE-M', latency: '16ms', sla: '99.99%', status: 'Optimal' },
      { name: 'EE / BT Group', role: 'High-Density Terrestrial 5G', tech: '5G NSA / Band n78', latency: '21ms', sla: '99.96%', status: 'Optimal' },
      { name: 'Virgin Media O2', role: 'Secondary Carrier Roaming', tech: '4G LTE Cat-M1', latency: '24ms', sla: '99.93%', status: 'Optimal' }
    ],
    modelsRunning: ['Range Rover', 'Range Rover Sport', 'Defender 110', 'Discovery Sport', 'Range Rover Velar', 'Jaguar I-PACE']
  },
  Italy: {
    code: 'Italy',
    name: 'Italy',
    flag: '🇮🇹',
    region: 'Southern Europe',
    totalVehicles: 48920,
    activationRate: 99.85,
    dataMonthly: '5,240.80 GB',
    dataTB: '5.24',
    sessionsMonthly: '14.6 M',
    smsMonthly: '128.40 K',
    voiceMonthly: '14h 22m 40s',
    avgLatency: '23ms',
    packetLoss: '0.03%',
    primaryOperators: [
      { name: 'TIM (Telecom Italia)', role: 'National 5G Standalone Core', tech: '5G SA / 3.7 GHz', latency: '20ms', sla: '99.95%', status: 'Optimal' },
      { name: 'Vodafone Italia IoT', role: 'Automotive Enterprise APN', tech: '5G NSA / 4G LTE', latency: '24ms', sla: '99.94%', status: 'Optimal' },
      { name: 'WindTre Business', role: 'Failover Cellular APN', tech: '4G LTE-A', latency: '29ms', sla: '99.90%', status: 'Optimal' }
    ],
    modelsRunning: ['Range Rover Velar', 'Defender 90', 'Range Rover Evoque', 'Discovery Sport']
  },
  France: {
    code: 'France',
    name: 'France',
    flag: '🇫🇷',
    region: 'Western Europe',
    totalVehicles: 64800,
    activationRate: 99.86,
    dataMonthly: '6,920.40 GB',
    dataTB: '6.92',
    sessionsMonthly: '18.2 M',
    smsMonthly: '168.30 K',
    voiceMonthly: '18h 40m 15s',
    avgLatency: '20ms',
    packetLoss: '0.02%',
    primaryOperators: [
      { name: 'Orange Business IoT', role: 'National 5G SA Enterprise Core', tech: '5G SA / Band n78', latency: '19ms', sla: '99.98%', status: 'Optimal' },
      { name: 'SFR Automotive Cellular', role: 'Cross-Border Highway Corridor', tech: '5G NSA / 4G LTE', latency: '23ms', sla: '99.93%', status: 'Optimal' },
      { name: 'Bouygues Telecom', role: 'High-Density Metro Roaming', tech: '4G LTE-M', latency: '27ms', sla: '99.91%', status: 'Optimal' }
    ],
    modelsRunning: ['Range Rover Evoque', 'Range Rover Velar', 'Defender 90', 'Range Rover Sport']
  },
  Germany: {
    code: 'Germany',
    name: 'Germany',
    flag: '🇩🇪',
    region: 'Central Europe (DACH)',
    totalVehicles: 65770,
    activationRate: 99.89,
    dataMonthly: '7,450.60 GB',
    dataTB: '7.45',
    sessionsMonthly: '19.8 M',
    smsMonthly: '182.40 K',
    voiceMonthly: '20h 15m 30s',
    avgLatency: '17ms',
    packetLoss: '0.01%',
    primaryOperators: [
      { name: 'Deutsche Telekom IoT', role: 'Primary Autobahn High-Speed Core', tech: '5G SA / 3.6 GHz', latency: '15ms', sla: '99.99%', status: 'Optimal' },
      { name: 'Telefónica O2 Germany', role: 'Secondary Dedicated Telematics APN', tech: '5G NSA / 4G LTE', latency: '22ms', sla: '99.94%', status: 'Optimal' },
      { name: 'Vodafone Deutschland', role: 'Enterprise Fleet Roaming', tech: '5G SA / LTE-M', latency: '19ms', sla: '99.95%', status: 'Optimal' }
    ],
    modelsRunning: ['Range Rover Sport', 'Defender 110', 'Discovery 5', 'Range Rover SV', 'Jaguar F-PACE']
  },
  India: {
    code: 'India',
    name: 'India',
    flag: '🇮🇳',
    region: 'South Asia & Global Move™ NOC',
    totalVehicles: 112540,
    activationRate: 99.92,
    dataMonthly: '14,280.50 GB',
    dataTB: '14.28',
    sessionsMonthly: '38.4 M',
    smsMonthly: '348.90 K',
    voiceMonthly: '36h 45m 10s',
    avgLatency: '16ms',
    packetLoss: '0.01%',
    primaryOperators: [
      { name: 'Jio 5G Standalone (Primary)', role: 'Nationwide True 5G SA Core', tech: '5G SA / Band n78 (3500MHz)', latency: '14ms', sla: '99.99%', status: 'Optimal' },
      { name: 'Bharti Airtel IoT Business', role: 'Enterprise Cellular & Roaming', tech: '5G NSA / 4G LTE', latency: '19ms', sla: '99.96%', status: 'Optimal' },
      { name: 'Tata Communications Move™ Hub', role: 'Global Subsea Gateway & NOC Node', tech: 'Multi-IMSI Local eUICC Core', latency: '12ms', sla: '100.0%', status: 'Optimal' }
    ],
    modelsRunning: ['Range Rover Velar CKD', 'Defender 110', 'Range Rover Evoque', 'Jaguar F-PACE', 'Range Rover Sport']
  }
};

// Operator traffic distribution matching the exact chart structure in the user's attachment
const COUNTRY_OPERATOR_DISTRIBUTION: Record<AllowedCountry, OperatorTrafficStat[]> = {
  US: [
    { operator: 'AT&T ENTERPRISE IOT', dataTB: 10.45, voiceHours: 23.80, smsK: 212.50, color: '#d32f2f' },
    { operator: 'T-MOBILE US ULTRA CAPACITY', dataTB: 6.82, voiceHours: 15.20, smsK: 142.10, color: '#8e63bb' },
    { operator: 'VERIZON WIRELESS IOT', dataTB: 1.18, voiceHours: 3.15, smsK: 25.90, color: '#c4b5fd' },
    { operator: 'US CELLULAR', dataTB: 0, voiceHours: 0, smsK: 0, color: '#94a3b8' }
  ],
  UK: [
    { operator: 'VODAFONE IOT GLOBAL', dataTB: 11.20, voiceHours: 29.50, smsK: 252.40, color: '#d32f2f' },
    { operator: 'EE / BT GROUP', dataTB: 7.15, voiceHours: 17.80, smsK: 158.60, color: '#8e63bb' },
    { operator: 'VIRGIN MEDIA O2', dataTB: 1.49, voiceHours: 5.00, smsK: 34.80, color: '#c4b5fd' },
    { operator: 'THREE UK', dataTB: 0, voiceHours: 0, smsK: 0, color: '#94a3b8' }
  ],
  Italy: [
    { operator: 'TIM (TELECOM ITALIA)', dataTB: 2.95, voiceHours: 8.10, smsK: 73.20, color: '#d32f2f' },
    { operator: 'VODAFONE ITALIA IOT', dataTB: 1.85, voiceHours: 5.00, smsK: 44.70, color: '#8e63bb' },
    { operator: 'WINDTRE BUSINESS', dataTB: 0.44, voiceHours: 1.12, smsK: 10.50, color: '#c4b5fd' },
    { operator: 'ILIAD ITALIA', dataTB: 0, voiceHours: 0, smsK: 0, color: '#94a3b8' }
  ],
  France: [
    { operator: 'ORANGE BUSINESS IOT', dataTB: 3.92, voiceHours: 10.40, smsK: 95.80, color: '#d32f2f' },
    { operator: 'SFR AUTOMOTIVE', dataTB: 2.34, voiceHours: 6.50, smsK: 57.40, color: '#8e63bb' },
    { operator: 'BOUYGUES TELECOM', dataTB: 0.66, voiceHours: 1.50, smsK: 15.10, color: '#c4b5fd' },
    { operator: 'FREE MOBILE', dataTB: 0, voiceHours: 0, smsK: 0, color: '#94a3b8' }
  ],
  Germany: [
    { operator: 'DEUTSCHE TELEKOM IOT', dataTB: 4.25, voiceHours: 11.50, smsK: 104.20, color: '#d32f2f' },
    { operator: 'TELEFÓNICA O2 GERMANY', dataTB: 2.45, voiceHours: 6.80, smsK: 61.50, color: '#8e63bb' },
    { operator: 'VODAFONE DEUTSCHLAND', dataTB: 0.75, voiceHours: 1.85, smsK: 16.70, color: '#c4b5fd' },
    { operator: '1&1 DRILLISCH', dataTB: 0, voiceHours: 0, smsK: 0, color: '#94a3b8' }
  ],
  India: [
    { operator: 'JIO 5G STANDALONE', dataTB: 8.15, voiceHours: 20.80, smsK: 198.60, color: '#d32f2f' },
    { operator: 'BHARTI AIRTEL IOT', dataTB: 4.95, voiceHours: 12.60, smsK: 121.40, color: '#8e63bb' },
    { operator: 'TATA COMMUNICATIONS MOVE™', dataTB: 1.18, voiceHours: 3.05, smsK: 28.90, color: '#c4b5fd' },
    { operator: 'VODAFONE IDEA (VI)', dataTB: 0, voiceHours: 0, smsK: 0, color: '#94a3b8' }
  ]
};

export const CountryLevelDetails: React.FC = () => {
  const { 
    selectedCountry, 
    setSelectedCountry, 
    setActiveModule, 
    vehicles, 
    navigateToCockpit, 
    setFilter, 
    showToast 
  } = useApp();

  // Traffic popup modal state ('data' | 'voice' | 'sms' | null)
  const [activeTrafficModal, setActiveTrafficModal] = useState<'data' | 'voice' | 'sms' | null>(null);

  // Selected vehicle for Attached Devices Hierarchy modal
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<Vehicle | null>(null);
  // VIN search input state
  const [vinSearchQuery, setVinSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modal Accordion State (Toggled off by default)
  const [expandedModalDevices, setExpandedModalDevices] = useState<Record<string, boolean>>({});

  const handleOpenVehicleDetails = (v: Vehicle) => {
    setExpandedModalDevices({});
    setSelectedVehicleForDetails(v);
  };

  // Dynamic Telematics Analytics State (Interdependent Make/Model/Device Type filters + Data/SMS/Voice tabs)
  type UsageCategoryTab = 'data' | 'sms' | 'voice';
  const [activeUsageTab, setActiveUsageTab] = useState<UsageCategoryTab>('data');
  const [selectedMakeFilter, setSelectedMakeFilter] = useState<string>('All Makes');
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('All Models');
  const [selectedDeviceTypeFilter, setSelectedDeviceTypeFilter] = useState<string>('All Device Types');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<string>('Last 1 year');
  const [hoveredAnalyticsItem, setHoveredAnalyticsItem] = useState<{
    id: string;
    title: string;
    subtitle?: string;
    c1Label: string;
    c1Val: number;
    c1Color: string;
    c2Label: string;
    c2Val: number;
    c2Color: string;
    c3Label: string;
    c3Val: number;
    c3Color: string;
    c4Label: string;
    c4Val: number;
    c4Color: string;
    unit: string;
    total: number;
    xPct: number;
    topY: number;
    isPinned?: boolean;
  } | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to Clipboard', `${label}: ${text}`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Normalize selected country to one of the 6 allowed
  const currentCode: AllowedCountry = useMemo(() => {
    const raw = (selectedCountry || '').toLowerCase();
    if (raw.includes('us') || raw.includes('united states') || raw.includes('america')) return 'US';
    if (raw.includes('uk') || raw.includes('united kingdom') || raw.includes('britain') || raw.includes('england')) return 'UK';
    if (raw.includes('italy') || raw.includes('italia')) return 'Italy';
    if (raw.includes('france')) return 'France';
    if (raw.includes('germany') || raw.includes('deutschland')) return 'Germany';
    if (raw.includes('india') || raw.includes('bharat')) return 'India';
    return 'India';
  }, [selectedCountry]);

  const meta = COUNTRY_METADATA[currentCode];

  // Vehicles matching this country
  const matchingVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const vc = (v.country || '').toLowerCase();
      if (currentCode === 'US' && (vc.includes('usa') || vc.includes('united states') || vc.includes('us'))) return true;
      if (currentCode === 'UK' && (vc.includes('uk') || vc.includes('united kingdom') || ['solihull', 'halewood', 'castle-bromwich', 'wolverhampton'].includes(v.plantId))) return true;
      if (currentCode === 'Italy' && vc.includes('italy')) return true;
      if (currentCode === 'France' && vc.includes('france')) return true;
      if (currentCode === 'Germany' && vc.includes('germany')) return true;
      if (currentCode === 'India' && (vc.includes('india') || v.plantId === 'pune')) return true;
      return false;
    });
  }, [vehicles, currentCode]);

  // Sample inventory vehicles for this country
  const countryVehicles: Vehicle[] = useMemo(() => {
    if (matchingVehicles.length >= 4) return matchingVehicles.slice(0, 10);
    return vehicles.slice(0, 8).map((v, i) => ({
      ...v,
      country: meta.name,
      networkOperator: meta.primaryOperators[i % meta.primaryOperators.length].name
    }));
  }, [matchingVehicles, vehicles, meta]);

  // Display vehicles filtered by VIN search field
  const displayVehicles: Vehicle[] = useMemo(() => {
    const q = vinSearchQuery.trim().toLowerCase();
    if (!q) return countryVehicles;
    return countryVehicles.filter(v => v.vin.toLowerCase().includes(q));
  }, [countryVehicles, vinSearchQuery]);

  // Attached devices for the selected vehicle modal
  const selectedVehicleDevices = useMemo(() => {
    if (!selectedVehicleForDetails) return [];
    return getVehicleAttachedDevices(selectedVehicleForDetails);
  }, [selectedVehicleForDetails]);
  const handleCountrySwitch = (country: AllowedCountry) => {
    setSelectedCountry(country);
    setVinSearchQuery('');
    setSelectedMakeFilter('All Makes');
    setSelectedModelFilter('All Models');
    setSelectedDeviceTypeFilter('All Device Types');
    setHoveredAnalyticsItem(null);
    showToast('Country Switched', `Loaded country telematics & cellular metrics for ${COUNTRY_METADATA[country].name}.`, 'info');
  };

  const handleViewInFleet = () => {
    setFilter('searchQuery', meta.name);
    setActiveModule('fleet-management');
  };

  // Get current active traffic dataset for the modal
  const activeOperatorDistribution = useMemo(() => {
    return COUNTRY_OPERATOR_DISTRIBUTION[currentCode] || COUNTRY_OPERATOR_DISTRIBUTION.India;
  }, [currentCode]);

  // Calculation of chart scale ticks based on active modal metric
  const chartDetails = useMemo(() => {
    if (!activeTrafficModal) return null;

    let metricKey: 'dataTB' | 'voiceHours' | 'smsK' = 'dataTB';
    let unitLabel = 'Data Usage (TB)';
    let axisLabel = 'Data Usage(TB)';
    let formatFn = (val: number) => val.toFixed(2);

    if (activeTrafficModal === 'voice') {
      metricKey = 'voiceHours';
      unitLabel = 'Voice Traffic (Hours)';
      axisLabel = 'Voice Traffic (Hours)';
      formatFn = (val: number) => `${val.toFixed(2)}h`;
    } else if (activeTrafficModal === 'sms') {
      metricKey = 'smsK';
      unitLabel = 'SMS Traffic (Thousands)';
      axisLabel = 'SMS Traffic (K)';
      formatFn = (val: number) => `${val.toFixed(1)}k`;
    }

    const values = activeOperatorDistribution.map(item => item[metricKey]);
    const maxObserved = Math.max(...values, 1);

    // Compute pleasant scale ticks (e.g. 0, 5, 10, 15, 20 like in the screenshot)
    let maxAxis = 20;
    let step = 5;

    if (metricKey === 'dataTB') {
      if (maxObserved > 15) {
        maxAxis = 20;
        step = 5;
      } else if (maxObserved > 8) {
        maxAxis = 15;
        step = 3;
      } else {
        maxAxis = 10;
        step = 2;
      }
    } else if (metricKey === 'voiceHours') {
      if (maxObserved > 25) {
        maxAxis = 35;
        step = 7;
      } else if (maxObserved > 15) {
        maxAxis = 25;
        step = 5;
      } else {
        maxAxis = 15;
        step = 3;
      }
    } else {
      if (maxObserved > 200) {
        maxAxis = 300;
        step = 60;
      } else if (maxObserved > 100) {
        maxAxis = 200;
        step = 40;
      } else {
        maxAxis = 120;
        step = 24;
      }
    }

    const ticks = [0, step, step * 2, step * 3, maxAxis];
    const totalVolume = values.reduce((a, b) => a + b, 0);

    return {
      metricKey,
      unitLabel,
      axisLabel,
      formatFn,
      maxAxis,
      ticks,
      totalVolume
    };
  }, [activeTrafficModal, activeOperatorDistribution]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#224375]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModule('executive-overview')}
            className="flex items-center gap-2 rounded-xl border border-[#224375] bg-[#0c1c33] px-3.5 py-2 text-xs font-mono text-sky-300 hover:bg-sky-500/20 hover:border-sky-400 transition-all cursor-pointer shadow-md group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Geographical Split</span>
          </button>
          <div className="h-5 w-[1px] bg-[#224375] hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{meta.flag}</span>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{meta.name}</span>
                <span className="text-slate-400 text-sm font-normal">Country Level Telematics</span>
              </h1>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Region: <strong className="text-sky-300 font-mono">{meta.region}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Select Country Drilldown: Compact Dropdown Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#224375] bg-[#0c182a] px-3.5 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-sky-400" />
          <span className="text-xs font-mono font-semibold text-slate-300">
            Select Country Drilldown:
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={currentCode}
              onChange={(e) => handleCountrySwitch(e.target.value as AllowedCountry)}
              aria-label="Select country drilldown"
              className="appearance-none rounded-lg border border-sky-500/50 bg-[#071322] hover:border-sky-400 text-white font-mono text-xs font-semibold pl-3 pr-8 py-1.5 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer shadow-inner transition-colors"
            >
              {ALLOWED_COUNTRIES.map((code) => {
                const cMeta = COUNTRY_METADATA[code];
                return (
                  <option key={code} value={code} className="bg-[#0c182a] text-white py-1">
                    {cMeta.flag} {cMeta.name} ({code})
                  </option>
                );
              })}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none" />
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            6 Operational Telematics Markets
          </span>
        </div>
      </div>

      {/* Country Telematics KPI Cards: Replaced to Monthly Data Traffic, Monthly Voice Traffic, Monthly SMS Traffic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Connected Vehicles */}
        <div className="rounded-2xl border border-[#224375] bg-[#0c182a] p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span className="flex items-center gap-1.5">
                <Car size={14} className="text-sky-400" />
                Connected Vehicles
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Active
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {meta.totalVehicles.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Card 2: Monthly Data Traffic (Clickable -> Opens Operator Distribution Graph) */}
        <div 
          onClick={() => setActiveTrafficModal('data')}
          className="rounded-2xl border border-sky-500/40 bg-[#0c182a] p-4 shadow-xl hover:border-sky-400 hover:bg-[#0f2442] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden ring-1 ring-transparent hover:ring-sky-400/30"
          title="Click to view Operator Distribution Graph"
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-500/20 transition-all pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span className="flex items-center gap-1.5 text-slate-200 group-hover:text-sky-300 transition-colors">
                <HardDrive size={14} className="text-sky-400" />
                Monthly Data Traffic
              </span>
              <span className="text-sky-300 font-bold bg-sky-500/15 group-hover:bg-sky-500/30 px-2 py-0.5 rounded text-[10px] border border-sky-400/40 flex items-center gap-1 transition-all">
                <span>Graph</span>
                <BarChart3 size={11} className="group-hover:scale-110 transition-transform" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-sky-300 tracking-tight flex items-baseline gap-1">
              <span>{meta.dataTB}</span>
              <span className="text-sm font-normal text-slate-400">TB</span>
            </div>
          </div>
        </div>

        {/* Card 3: Monthly Voice Traffic (Clickable -> Opens Operator Distribution Graph) */}
        <div 
          onClick={() => setActiveTrafficModal('voice')}
          className="rounded-2xl border border-emerald-500/40 bg-[#0c182a] p-4 shadow-xl hover:border-emerald-400 hover:bg-[#0f2a38] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden ring-1 ring-transparent hover:ring-emerald-400/30"
          title="Click to view Operator Distribution Graph"
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span className="flex items-center gap-1.5 text-slate-200 group-hover:text-emerald-300 transition-colors">
                <PhoneCall size={14} className="text-emerald-400" />
                Monthly Voice Traffic
              </span>
              <span className="text-emerald-300 font-bold bg-emerald-500/15 group-hover:bg-emerald-500/30 px-2 py-0.5 rounded text-[10px] border border-emerald-400/40 flex items-center gap-1 transition-all">
                <span>Graph</span>
                <BarChart3 size={11} className="group-hover:scale-110 transition-transform" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-300 tracking-tight">
              {meta.voiceMonthly}
            </div>
          </div>
        </div>

        {/* Card 4: Monthly SMS Traffic (Clickable -> Opens Operator Distribution Graph) */}
        <div 
          onClick={() => setActiveTrafficModal('sms')}
          className="rounded-2xl border border-amber-500/40 bg-[#0c182a] p-4 shadow-xl hover:border-amber-400 hover:bg-[#221c10] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden ring-1 ring-transparent hover:ring-amber-400/30"
          title="Click to view Operator Distribution Graph"
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span className="flex items-center gap-1.5 text-slate-200 group-hover:text-amber-300 transition-colors">
                <MessageSquare size={14} className="text-amber-400" />
                Monthly SMS Traffic
              </span>
              <span className="text-amber-300 font-bold bg-amber-500/15 group-hover:bg-amber-500/30 px-2 py-0.5 rounded text-[10px] border border-amber-400/40 flex items-center gap-1 transition-all">
                <span>Graph</span>
                <BarChart3 size={11} className="group-hover:scale-110 transition-transform" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-300 tracking-tight">
              {meta.smsMonthly}
            </div>
          </div>
        </div>
      </div>

      {/* Telematics Usage Analytics with Dynamic Interdependent Filters (Make, Model, Device Type) & Usage Category Tabs (Data, SMS, Voice) */}
      <TelematicsUsageAnalytics countryName={meta.name} />

      {/* Live Sample Vehicles in Country */}
      <div className="rounded-2xl border border-[#224375] bg-[#0c182a] p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#224375]">
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Car size={16} className="text-sky-400" />
              <span>Live Sample Connected Vehicles in {meta.name}</span>
            </h3>
            {/* <p className="text-xs text-slate-300 mt-0.5">
              Click any vehicle row to inspect attached TCU devices, EID, Profiles, and Active / Fallback ICCIDs
            </p> */}
          </div>

          {/* Right Corner: VIN Search Input */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none" />
              <input
                type="text"
                value={vinSearchQuery}
                onChange={(e) => setVinSearchQuery(e.target.value)}
                placeholder="Search VIN (e.g. SALWR...)"
                aria-label="Search inventory by VIN"
                className="w-48 sm:w-64 rounded-lg border border-sky-500/50 bg-[#071322] hover:border-sky-400 focus:border-sky-400 text-white font-mono text-xs pl-8 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-400 shadow-inner placeholder:text-slate-500 transition-colors"
              />
              {vinSearchQuery && (
                <button
                  onClick={() => setVinSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                  title="Clear VIN search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {vinSearchQuery && (
              <span className="text-[10px] font-mono text-sky-300 bg-sky-500/15 border border-sky-500/30 px-2 py-1 rounded-md shrink-0">
                {displayVehicles.length} match{displayVehicles.length === 1 ? '' : 'es'}
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#224375] text-[11px] text-slate-400">
                <th className="pb-3 font-semibold">VIN</th>
                <th className="pb-3 font-semibold">Make & Model</th>
                <th className="pb-3 font-semibold">Carrier / Tech</th>
                <th className="pb-3 font-semibold">Signal & Latency</th>
                <th className="pb-3 font-semibold text-right">Attached Devices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#224375]/50">
              {displayVehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-mono text-xs">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-slate-300">
                        No vehicles found matching VIN <strong className="text-sky-300">"{vinSearchQuery}"</strong>
                      </span>
                      <button
                        onClick={() => setVinSearchQuery('')}
                        className="text-xs text-sky-400 hover:text-white underline cursor-pointer mt-0.5"
                      >
                        Clear VIN Search
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                displayVehicles.map((v) => (
                  <tr 
                    key={v.vin} 
                    onClick={() => handleOpenVehicleDetails(v)}
                    className="hover:bg-[#0f2442] transition-colors cursor-pointer group"
                    title="Click row to view VIN device hierarchy, EID, Profiles & ICCIDs"
                  >
                    <td className="py-3.5 pr-4 font-bold text-sky-300 group-hover:text-white flex items-center gap-1.5">
                      <span>{v.vin}</span>
                      <ChevronRight size={13} className="text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    <td className="py-3.5 pr-4 text-white">
                      <div className="font-semibold">Jaguar Land Rover • {v.model}</div>
                      <div className="text-[10px] text-slate-400">{v.variant}</div>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-300">
                      <div>{v.networkOperator}</div>
                      <div className="text-[10px] text-sky-400">{v.networkTech || '5G SA'}</div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="text-emerald-400 font-semibold">{v.signalQuality || 'Excellent'} ({v.signalRssi} dBm)</div>
                      <div className="text-[10px] text-slate-400">{v.latencyMs}ms latency</div>
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/15 border border-sky-500/30 px-2.5 py-1 text-[11px] font-bold text-sky-300 group-hover:border-sky-400 transition-colors">
                        <Cpu size={12} />
                        <span>2 Devices Attached</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL: Operator Distribution Graph (Properly Sized & Scrollable Dark Theme Blue) */}
      {activeTrafficModal && chartDetails && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in-50 duration-200"
          onClick={() => setActiveTrafficModal(null)}
        >
          <div 
            className="relative w-full max-w-3xl max-h-[92vh] rounded-2xl bg-[#0a1628] text-slate-100 p-4 sm:p-6 shadow-2xl flex flex-col border border-sky-500/40 ring-1 ring-sky-500/30 animate-in zoom-in-95 duration-150 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed at top, never hidden) */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#224375] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <BarChart3 size={17} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg leading-none">{meta.flag}</span>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
                      Operator Distribution
                    </h2>
                    <span className="text-[11px] font-mono font-semibold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-400/40">
                      {chartDetails.unitLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                    National Carrier Breakdown for {meta.name} • Active Move™ SIM Fleet
                  </p>
                </div>
              </div>

              {/* Action Buttons & Close */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => setActiveTrafficModal(null)}
                  className="h-7 w-7 rounded-lg bg-[#0e213b] hover:bg-[#1c3c69] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#224375]"
                  title="Close popup"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Quick Metric Navigation Tabs (Fixed below header) */}
            <div className="shrink-0 flex flex-wrap items-center gap-1.5 border-b border-[#224375] py-2.5">
              <span className="text-[11px] font-semibold text-slate-400 font-mono mr-1">Dimension:</span>
              <button
                onClick={() => setActiveTrafficModal('data')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  activeTrafficModal === 'data'
                    ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-300/40'
                    : 'bg-[#0e213b] text-slate-300 hover:bg-[#153259] hover:text-white border border-[#224375]'
                }`}
              >
                <HardDrive size={12} />
                <span>Data Traffic (TB)</span>
              </button>

              <button
                onClick={() => setActiveTrafficModal('voice')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  activeTrafficModal === 'voice'
                    ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-300/40'
                    : 'bg-[#0e213b] text-slate-300 hover:bg-[#153259] hover:text-white border border-[#224375]'
                }`}
              >
                <PhoneCall size={12} />
                <span>Voice Traffic (Hours)</span>
              </button>

              <button
                onClick={() => setActiveTrafficModal('sms')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  activeTrafficModal === 'sms'
                    ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-300/40'
                    : 'bg-[#0e213b] text-slate-300 hover:bg-[#153259] hover:text-white border border-[#224375]'
                }`}
              >
                <MessageSquare size={12} />
                <span>SMS Traffic (K)</span>
              </button>
            </div>

            {/* Scrollable Body: Graph & Table */}
            <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-3.5 scrollbar-thin scrollbar-thumb-sky-500/20">
              {/* The Graph Layout in Dark Theme Blue */}
              <div className="bg-[#06101e] rounded-xl p-3.5 sm:p-4 border border-[#1b355d] shadow-[inset_0_2px_14px_rgba(0,0,0,0.7)]">
                {/* Header inside Chart area matching screenshot */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-white font-bold text-base font-mono tracking-tight">
                      Operator Distribution
                    </h3>
                    <span className="text-sky-300 font-semibold font-mono text-xs">
                      {chartDetails.unitLabel}
                    </span>
                  </div>
                </div>

                {/* Operator Name header with sort icon */}
                <div className="flex items-center text-[11px] font-bold text-sky-300 font-mono mb-2">
                  <div className="flex items-center gap-1.5 w-44 sm:w-56 shrink-0 pr-3">
                    <span>Operator Name</span>
                    <span className="text-sky-400">
                      <svg className="w-3 h-3 inline-block" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 3h12v1.5H2V3zm2 4h8v1.5H4V7zm2 4h4v1.5H6V11z"/>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Chart Grid with 100% Strict Row-by-Row Alignment */}
                <div className="flex flex-col">
                  {/* Bars & Names Row Container */}
                  <div className="relative">
                    {/* Continuous vertical Y-axis line placed at the exact boundary */}
                    <div className="absolute top-0 bottom-0 left-44 sm:left-56 w-[2px] bg-sky-400/80 z-10" />

                    <div className="space-y-3 py-1">
                      {activeOperatorDistribution.map((item, idx) => {
                        const val = item[chartDetails.metricKey];
                        const widthPct = Math.min(100, Math.max(0, (val / chartDetails.maxAxis) * 100));

                        return (
                          <div key={idx} className="flex items-center h-8 sm:h-8.5">
                            {/* Operator Name Column - guaranteed vertically centered with this row's bar */}
                            <div 
                              className="w-44 sm:w-56 shrink-0 pr-3 font-bold text-[11px] sm:text-xs text-slate-100 font-mono uppercase tracking-wide truncate"
                              title={item.operator}
                            >
                              {item.operator}
                            </div>

                            {/* Bar Column */}
                            <div className="flex-1 flex items-center h-full pl-2 relative">
                              {val > 0 ? (
                                <div
                                  className="h-6 sm:h-6.5 rounded-r-xs transition-all duration-500 ease-out shadow-md"
                                  style={{
                                    width: `${widthPct}%`,
                                    backgroundColor: item.color
                                  }}
                                />
                              ) : (
                                <div className="h-6 w-0" />
                              )}

                              {/* Label at the right of the bar */}
                              <span className="ml-2 font-bold text-white text-[11px] sm:text-xs font-mono shrink-0 drop-shadow-sm">
                                {val}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom X-Axis line and tick markers aligned to the bar column */}
                  <div className="flex">
                    {/* Offset spacer matching the operator name column width */}
                    <div className="w-44 sm:w-56 shrink-0" />

                    {/* X-Axis container starting right from the vertical line */}
                    <div className="flex-1 border-t-2 border-sky-400/80 relative pt-1 mt-0.5">
                      {/* Ticks line */}
                      <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-sky-200 font-mono px-0">
                        {chartDetails.ticks.map((tick, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <span className="h-1.5 w-[2px] bg-sky-400 -mt-1.5 mb-0.5" />
                            <span>{tick}</span>
                          </div>
                        ))}
                      </div>

                      {/* X-Axis Title with sort icon */}
                      <div className="mt-1.5 text-center text-[11px] font-bold text-sky-300 font-mono flex items-center justify-center gap-1.5">
                        <span>{chartDetails.axisLabel}</span>
                        <svg className="w-3 h-3 inline-block text-sky-400" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 3h12v1.5H2V3zm2 4h8v1.5H4V7zm2 4h4v1.5H6V11z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer Actions (Fixed at bottom) */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-[#224375] text-[11px] font-mono">
              <span className="text-slate-400 font-medium truncate">
                Tata Communications Move™ Global eSIM Core • GSMA Remote SIM Provisioning
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTrafficModal(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#224375] bg-[#0e213b] hover:bg-[#18355e] text-slate-200 hover:text-white font-medium transition-colors cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Vehicle Details & Attached Devices Hierarchy (VIN -> Make/Model -> Devices -> EID -> Profile -> ICCIDs) */}
      {selectedVehicleForDetails && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in-50 duration-200"
          onClick={() => setSelectedVehicleForDetails(null)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[92vh] rounded-2xl bg-[#0a1628] text-slate-100 p-4 sm:p-6 shadow-2xl flex flex-col border border-sky-500/40 ring-1 ring-sky-500/30 animate-in zoom-in-95 duration-150 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-[#224375] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0 shadow-sm">
                  <Cpu size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white font-mono flex items-center gap-2">
                      <span>Vehicle Device & eUICC Architecture</span>
                    </h2>
                    <span className="rounded-full bg-sky-500/20 border border-sky-400/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-sky-300">
                      {selectedVehicleDevices.length} Attached Devices
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    Make: <strong className="text-white">Jaguar Land Rover (JLR)</strong> | Model: <strong className="text-sky-300">{selectedVehicleForDetails.model}</strong> ({selectedVehicleForDetails.variant})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVehicleForDetails(null)}
                className="h-8 w-8 rounded-lg bg-[#0e213b] hover:bg-[#1c3c69] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#224375]"
                title="Close popup"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Vehicle Telematics Context Strip */}
            <div className="shrink-0 mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-[#071322] border border-[#224375] rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 block">Vehicle VIN</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-bold text-sky-300 truncate">{selectedVehicleForDetails.vin}</span>
                  <button
                    onClick={() => handleCopy(selectedVehicleForDetails.vin, 'vin', 'VIN')}
                    className="text-slate-400 hover:text-sky-300 transition-colors ml-1 p-0.5 cursor-pointer"
                    title="Copy VIN"
                  >
                    {copiedKey === 'vin' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div className="bg-[#071322] border border-[#224375] rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 block">Make & Model</span>
                <span className="font-bold text-white block mt-0.5 truncate">JLR {selectedVehicleForDetails.model}</span>
              </div>

              <div className="bg-[#071322] border border-[#224375] rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 block">Assembly Origin</span>
                <span className="font-bold text-slate-200 block mt-0.5 truncate">{selectedVehicleForDetails.plantName || 'Solihull Core'}</span>
              </div>

              <div className="bg-[#071322] border border-[#224375] rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 block">Active Profile</span>
                <span className="font-bold text-emerald-400 block mt-0.5 truncate">50039</span>
              </div>
            </div>

            {/* Accordion Device List Container (Accordion View Only) */}
            <div className="flex-1 overflow-y-auto pr-1 py-1 mt-3 space-y-3.5 scrollbar-thin scrollbar-thumb-sky-500/20">
              {selectedVehicleDevices.map((device, devIdx) => {
                const activeCount = device.profiles.reduce((sum, p) => sum + p.iccids.filter(i => i.status === 'Active').length, 0);
                const fallbackCount = device.profiles.reduce((sum, p) => sum + p.iccids.filter(i => i.status === 'Fallback').length, 0);
                const isAccordionOpen = !!expandedModalDevices[device.deviceId];

                return (
                  <div 
                    key={device.deviceId} 
                    className={`rounded-xl border transition-all ${
                      isAccordionOpen 
                        ? 'border-sky-500/40 bg-[#071322] shadow-lg space-y-3.5 p-4' 
                        : 'border-[#224375] bg-[#071322]/80 hover:border-sky-500/30 p-4'
                    }`}
                  >
                    {/* Accordion Device Header Button */}
                    <div 
                      onClick={() => {
                        setExpandedModalDevices(prev => ({
                          ...prev,
                          [device.deviceId]: !prev[device.deviceId]
                        }));
                      }}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer hover:bg-sky-500/5 rounded-lg p-1.5 -m-1.5 transition-colors select-none ${
                        isAccordionOpen ? 'pb-3 border-b border-[#224375]/70 mb-3.5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                          isAccordionOpen ? 'bg-sky-500 text-white shadow-sm' : 'bg-sky-600/20 border border-sky-400/30 text-sky-300'
                        }`}>
                          {devIdx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-white font-mono">
                              {device.deviceName}
                            </h3>
                            <span className="rounded bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-mono text-sky-300 font-semibold">
                              {device.subsystem}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
                        <span className="text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded font-bold">
                          {activeCount} Active • {fallbackCount} Fallback
                        </span>
                        <div className="h-6 w-6 rounded-md bg-[#0e213b] border border-[#224375] flex items-center justify-center text-sky-400">
                          {isAccordionOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} className="text-slate-400" />}
                        </div>
                      </div>
                    </div>

                    {isAccordionOpen && (
                      <>

                    {/* EID Bar (eUICC Identifier for this Device) */}
                    <div className="rounded-lg bg-[#0b1b31] border border-sky-500/30 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                          <Radio size={13} className="text-sky-400" />
                          <span>Device EID:</span>
                        </span>
                        <span className="font-mono text-xs font-bold text-white tracking-wider break-all select-all bg-[#081527] px-2 py-0.5 rounded border border-[#224375]">
                          {device.eid}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                          GSMA SGP.02 eUICC
                        </span>
                        <button
                          onClick={() => handleCopy(device.eid.replace(/\s+/g, ''), `eid-${device.deviceId}`, 'EID')}
                          className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 bg-[#132847] px-2 py-1 rounded border border-[#224375] transition-colors cursor-pointer"
                          title="Copy EID to clipboard"
                        >
                          {copiedKey === `eid-${device.deviceId}` ? (
                            <>
                              <Check size={11} className="text-emerald-400" />
                              <span className="text-emerald-400 text-[10px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span className="text-[10px]">Copy EID</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Profiles for this Device */}
                    <div className="space-y-3 pt-1">
                      <div className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                        <Layers size={13} className="text-indigo-400" />
                        <span>eUICC Profiles configured under this EID ({device.profiles.length} Profiles):</span>
                      </div>

                      {device.profiles.map((profile) => (
                        <div 
                          key={profile.id}
                          className="rounded-lg bg-[#0b1626] border border-[#224375] p-3 space-y-2.5"
                        >
                          {/* Profile Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-[#224375]/50">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="h-2 w-2 rounded-full bg-indigo-400" />
                              <span className="font-mono font-bold text-xs text-white">
                                {profile.name}
                              </span>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${
                                profile.type === 'Operational'
                                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                  : 'bg-sky-500/15 border-sky-500/30 text-sky-300'
                              }`}>
                                {profile.type} Profile
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                              <span>Spec: {profile.gsmaSpec}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-500" />
                              <span className="text-emerald-400 font-semibold">{profile.state}</span>
                            </div>
                          </div>

                          {/* Multiple ICCIDs under this Single Profile */}
                          <div className="space-y-1.5">
                            {/* <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-slate-400">
                              <span>Configured Multi-IMSI ICCIDs for this Profile ({profile.iccids.length} ICCIDs):</span>
                              <span>ICCID Status Breakdown</span>
                            </div> */}

                            <div className="overflow-x-auto">
                              <table className="w-full text-left font-mono text-xs">
                                <thead>
                                  <tr className="border-b border-[#224375]/50 text-[10px] text-slate-400">
                                    <th className="pb-2 font-semibold">ICCID Number</th>
                                    <th className="pb-2 font-semibold">Status (Active / Fallback)</th>
                                    <th className="pb-2 font-semibold">Network Carrier</th>
                                    <th className="pb-2 font-semibold">Technology</th>
                                    <th className="pb-2 font-semibold">Role / Allocation</th>
                                    <th className="pb-2 font-semibold text-right">APN & IP</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#224375]/40 text-[11px]">
                                  {profile.iccids.map((iccidItem) => {
                                    const isActive = iccidItem.status === 'Active';
                                    return (
                                      <tr 
                                        key={iccidItem.iccid}
                                        className={`hover:bg-[#132742]/50 transition-colors ${
                                          isActive ? 'bg-emerald-500/5' : 'bg-transparent'
                                        }`}
                                      >
                                        {/* ICCID */}
                                        <td className="py-2.5 pr-3">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-white select-all">
                                              {iccidItem.iccid}
                                            </span>
                                            <button
                                              onClick={() => handleCopy(iccidItem.iccid, `iccid-${iccidItem.iccid}`, 'ICCID')}
                                              className="text-slate-400 hover:text-sky-300 p-0.5 cursor-pointer"
                                              title="Copy ICCID"
                                            >
                                              {copiedKey === `iccid-${iccidItem.iccid}` ? (
                                                <Check size={11} className="text-emerald-400" />
                                              ) : (
                                                <Copy size={11} />
                                              )}
                                            </button>
                                          </div>
                                          <div className="text-[10px] text-slate-400">
                                            IMSI: {iccidItem.imsi}
                                          </div>
                                        </td>

                                        {/* Status: Active or Fallback */}
                                        <td className="py-2.5 pr-3">
                                          {isActive ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 shadow-sm shadow-emerald-500/20">
                                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                              <span>Active</span>
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                              <span>Fallback</span>
                                            </span>
                                          )}
                                        </td>

                                        {/* Operator */}
                                        <td className="py-2.5 pr-3 font-semibold text-sky-200">
                                          <div>{iccidItem.operator}</div>
                                          <div className="text-[10px] text-slate-400">{iccidItem.signalQuality}</div>
                                        </td>

                                        {/* Technology */}
                                        <td className="py-2.5 pr-3 text-slate-300 font-semibold">
                                          {iccidItem.networkTech}
                                        </td>

                                        {/* Role */}
                                        <td className="py-2.5 pr-3 text-slate-300">
                                          {iccidItem.role}
                                        </td>

                                        {/* APN & IP */}
                                        <td className="py-2.5 text-right font-mono text-[10px]">
                                          <div className="text-slate-300">{iccidItem.apn}</div>
                                          <div className="text-slate-400">{iccidItem.ipAddress}</div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

            {/* Modal Footer Actions */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-[#224375] text-[11px] font-mono">
              <span className="text-slate-400 truncate">
                Tata Communications Move™ Automotive eSIM Core • Multi-IMSI Dynamic Failover
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    navigateToCockpit(selectedVehicleForDetails.vin);
                    setSelectedVehicleForDetails(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-md cursor-pointer text-xs flex items-center gap-1"
                >
                  <span>Vehicle Cockpit 360°</span>
                  <ExternalLink size={12} />
                </button>
                <button
                  onClick={() => setSelectedVehicleForDetails(null)}
                  className="px-4 py-1.5 rounded-lg border border-[#224375] bg-[#0e213b] hover:bg-[#18355e] text-slate-200 hover:text-white font-medium transition-colors cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
