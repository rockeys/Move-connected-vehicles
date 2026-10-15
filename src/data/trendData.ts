export type TimeRange = '24h' | '7d' | '30d' | '12m';

export interface SimTrendPoint {
  label: string;
  timeDisplay: string;
  activeSims: number;
  provisionedInPeriod: number;
  suspendedSims: number;
  profileSwaps: number;
  activationRate: number;
}

export interface VehicleTrendPoint {
  label: string;
  timeDisplay: string;
  manufactured: number;
  connectedWithSim: number;
  penetrationRate: number;
  rangeRover: number;
  defender: number;
  discovery: number;
  jaguar: number;
  roamingVehicles: number;
}

export interface ConnectivityTrendPoint {
  label: string;
  timeDisplay: string;
  availabilityPercent: number;
  slaTarget: number;
  avgLatencyMs: number;
  packetLossPercent: number;
  fiveGStandalonePercent: number;
  fiveGNonStandalonePercent: number;
  fourGLtePercent: number;
  activeSessions: number;
}

export interface ThroughputTrendPoint {
  label: string;
  timeDisplay: string;
  totalDataPb: number;
  sotaPayloadTb: number;
  telematicsDataTb: number;
  voiceMinutesK: number;
  smsMillions: number;
}

// 12 Months Trend (Oct 2025 – Sep 2026 / Oct 2026)
export const SIM_TREND_12M: SimTrendPoint[] = [
  { label: 'Nov 25', timeDisplay: 'November 2025', activeSims: 362400, provisionedInPeriod: 32100, suspendedSims: 3100, profileSwaps: 14200, activationRate: 99.78 },
  { label: 'Dec 25', timeDisplay: 'December 2025', activeSims: 371200, provisionedInPeriod: 34800, suspendedSims: 2980, profileSwaps: 16500, activationRate: 99.80 },
  { label: 'Jan 26', timeDisplay: 'January 2026', activeSims: 379800, provisionedInPeriod: 33400, suspendedSims: 3240, profileSwaps: 18900, activationRate: 99.82 },
  { label: 'Feb 26', timeDisplay: 'February 2026', activeSims: 388500, provisionedInPeriod: 35100, suspendedSims: 3120, profileSwaps: 21300, activationRate: 99.84 },
  { label: 'Mar 26', timeDisplay: 'March 2026', activeSims: 397900, provisionedInPeriod: 38200, suspendedSims: 3050, profileSwaps: 23800, activationRate: 99.86 },
  { label: 'Apr 26', timeDisplay: 'April 2026', activeSims: 406200, provisionedInPeriod: 36400, suspendedSims: 2980, profileSwaps: 25100, activationRate: 99.87 },
  { label: 'May 26', timeDisplay: 'May 2026', activeSims: 414800, provisionedInPeriod: 37900, suspendedSims: 2890, profileSwaps: 27400, activationRate: 99.89 },
  { label: 'Jun 26', timeDisplay: 'June 2026', activeSims: 422600, provisionedInPeriod: 39100, suspendedSims: 2840, profileSwaps: 29200, activationRate: 99.90 },
  { label: 'Jul 26', timeDisplay: 'July 2026', activeSims: 429100, provisionedInPeriod: 36800, suspendedSims: 2790, profileSwaps: 31000, activationRate: 99.91 },
  { label: 'Aug 26', timeDisplay: 'August 2026', activeSims: 433400, provisionedInPeriod: 38500, suspendedSims: 2810, profileSwaps: 32400, activationRate: 99.92 },
  { label: 'Sep 26', timeDisplay: 'September 2026', activeSims: 437200, provisionedInPeriod: 40200, suspendedSims: 2750, profileSwaps: 33600, activationRate: 99.93 },
  { label: 'Oct 26', timeDisplay: 'October 2026 (MTD)', activeSims: 439810, provisionedInPeriod: 42100, suspendedSims: 2680, profileSwaps: 34120, activationRate: 99.94 }
];

export const SIM_TREND_30D: SimTrendPoint[] = [
  { label: 'Day 1', timeDisplay: 'Sep 14', activeSims: 435100, provisionedInPeriod: 1380, suspendedSims: 2780, profileSwaps: 1120, activationRate: 99.91 },
  { label: 'Day 5', timeDisplay: 'Sep 18', activeSims: 435850, provisionedInPeriod: 1410, suspendedSims: 2760, profileSwaps: 1180, activationRate: 99.92 },
  { label: 'Day 10', timeDisplay: 'Sep 23', activeSims: 436700, provisionedInPeriod: 1440, suspendedSims: 2740, profileSwaps: 1210, activationRate: 99.92 },
  { label: 'Day 15', timeDisplay: 'Sep 28', activeSims: 437650, provisionedInPeriod: 1490, suspendedSims: 2720, profileSwaps: 1250, activationRate: 99.93 },
  { label: 'Day 20', timeDisplay: 'Oct 03', activeSims: 438400, provisionedInPeriod: 1470, suspendedSims: 2700, profileSwaps: 1290, activationRate: 99.93 },
  { label: 'Day 25', timeDisplay: 'Oct 08', activeSims: 439150, provisionedInPeriod: 1520, suspendedSims: 2690, profileSwaps: 1340, activationRate: 99.94 },
  { label: 'Day 30', timeDisplay: 'Oct 13 (Today)', activeSims: 439810, provisionedInPeriod: 1560, suspendedSims: 2680, profileSwaps: 1380, activationRate: 99.94 }
];

export const SIM_TREND_7D: SimTrendPoint[] = [
  { label: 'Mon', timeDisplay: 'Oct 07', activeSims: 438900, provisionedInPeriod: 1510, suspendedSims: 2700, profileSwaps: 1290, activationRate: 99.93 },
  { label: 'Tue', timeDisplay: 'Oct 08', activeSims: 439050, provisionedInPeriod: 1530, suspendedSims: 2695, profileSwaps: 1310, activationRate: 99.93 },
  { label: 'Wed', timeDisplay: 'Oct 09', activeSims: 439220, provisionedInPeriod: 1545, suspendedSims: 2690, profileSwaps: 1325, activationRate: 99.94 },
  { label: 'Thu', timeDisplay: 'Oct 10', activeSims: 439410, provisionedInPeriod: 1550, suspendedSims: 2688, profileSwaps: 1340, activationRate: 99.94 },
  { label: 'Fri', timeDisplay: 'Oct 11', activeSims: 439580, provisionedInPeriod: 1570, suspendedSims: 2685, profileSwaps: 1365, activationRate: 99.94 },
  { label: 'Sat', timeDisplay: 'Oct 12', activeSims: 439710, provisionedInPeriod: 1240, suspendedSims: 2682, profileSwaps: 1120, activationRate: 99.94 },
  { label: 'Sun', timeDisplay: 'Oct 13 (Live)', activeSims: 439810, provisionedInPeriod: 1180, suspendedSims: 2680, profileSwaps: 980, activationRate: 99.94 }
];

export const SIM_TREND_24H: SimTrendPoint[] = [
  { label: '00:00', timeDisplay: '00:00 UTC', activeSims: 439620, provisionedInPeriod: 45, suspendedSims: 2684, profileSwaps: 48, activationRate: 99.94 },
  { label: '04:00', timeDisplay: '04:00 UTC', activeSims: 439655, provisionedInPeriod: 52, suspendedSims: 2683, profileSwaps: 55, activationRate: 99.94 },
  { label: '08:00', timeDisplay: '08:00 UTC (UK Shift)', activeSims: 439710, provisionedInPeriod: 142, suspendedSims: 2682, profileSwaps: 110, activationRate: 99.94 },
  { label: '12:00', timeDisplay: '12:00 UTC (Peak EOL)', activeSims: 439765, provisionedInPeriod: 168, suspendedSims: 2681, profileSwaps: 145, activationRate: 99.94 },
  { label: '16:00', timeDisplay: '16:00 UTC (US/EU Handover)', activeSims: 439790, provisionedInPeriod: 155, suspendedSims: 2680, profileSwaps: 128, activationRate: 99.94 },
  { label: '20:00', timeDisplay: '20:00 UTC', activeSims: 439805, provisionedInPeriod: 88, suspendedSims: 2680, profileSwaps: 74, activationRate: 99.94 },
  { label: 'Now', timeDisplay: 'Current Live Session', activeSims: 439810, provisionedInPeriod: 94, suspendedSims: 2680, profileSwaps: 82, activationRate: 99.94 }
];

// Vehicles with Move SIM vs Manufactured Trends
export const VEHICLE_TREND_12M: VehicleTrendPoint[] = [
  { label: 'Nov 25', timeDisplay: 'November 2025', manufactured: 389200, connectedWithSim: 358400, penetrationRate: 92.1, rangeRover: 182000, defender: 104000, discovery: 46400, jaguar: 26000, roamingVehicles: 48200 },
  { label: 'Dec 25', timeDisplay: 'December 2025', manufactured: 396800, connectedWithSim: 368100, penetrationRate: 92.8, rangeRover: 187000, defender: 107200, discovery: 47400, jaguar: 26500, roamingVehicles: 49800 },
  { label: 'Jan 26', timeDisplay: 'January 2026', manufactured: 404500, connectedWithSim: 377400, penetrationRate: 93.3, rangeRover: 192000, defender: 110500, discovery: 48100, jaguar: 26800, roamingVehicles: 51200 },
  { label: 'Feb 26', timeDisplay: 'February 2026', manufactured: 411800, connectedWithSim: 386200, penetrationRate: 93.8, rangeRover: 196500, defender: 113800, discovery: 48900, jaguar: 27000, roamingVehicles: 52400 },
  { label: 'Mar 26', timeDisplay: 'March 2026', manufactured: 419200, connectedWithSim: 395100, penetrationRate: 94.2, rangeRover: 201200, defender: 117100, discovery: 49600, jaguar: 27200, roamingVehicles: 53900 },
  { label: 'Apr 26', timeDisplay: 'April 2026', manufactured: 426100, connectedWithSim: 403800, penetrationRate: 94.8, rangeRover: 205800, defender: 120200, discovery: 50400, jaguar: 27400, roamingVehicles: 55100 },
  { label: 'May 26', timeDisplay: 'May 2026', manufactured: 433000, connectedWithSim: 412400, penetrationRate: 95.2, rangeRover: 210400, defender: 123400, discovery: 51100, jaguar: 27500, roamingVehicles: 56400 },
  { label: 'Jun 26', timeDisplay: 'June 2026', manufactured: 439500, connectedWithSim: 420800, penetrationRate: 95.7, rangeRover: 214900, defender: 126200, discovery: 51900, jaguar: 27800, roamingVehicles: 57900 },
  { label: 'Jul 26', timeDisplay: 'July 2026', manufactured: 445200, connectedWithSim: 427900, penetrationRate: 96.1, rangeRover: 218700, defender: 128900, discovery: 52400, jaguar: 27900, roamingVehicles: 59100 },
  { label: 'Aug 26', timeDisplay: 'August 2026', manufactured: 450400, connectedWithSim: 434200, penetrationRate: 96.4, rangeRover: 222100, defender: 131200, discovery: 52900, jaguar: 28000, roamingVehicles: 60200 },
  { label: 'Sep 26', timeDisplay: 'September 2026', manufactured: 454900, connectedWithSim: 439800, penetrationRate: 96.7, rangeRover: 225300, defender: 133400, discovery: 53200, jaguar: 27900, roamingVehicles: 61100 },
  { label: 'Oct 26', timeDisplay: 'October 2026', manufactured: 458230, connectedWithSim: 443620, penetrationRate: 96.8, rangeRover: 228700, defender: 135200, discovery: 53520, jaguar: 26200, roamingVehicles: 61840 }
];

export const VEHICLE_TREND_30D: VehicleTrendPoint[] = [
  { label: 'Sep 14', timeDisplay: 'Sep 14', manufactured: 452800, connectedWithSim: 437600, penetrationRate: 96.6, rangeRover: 224200, defender: 132800, discovery: 53000, jaguar: 27600, roamingVehicles: 60800 },
  { label: 'Sep 19', timeDisplay: 'Sep 19', manufactured: 453700, connectedWithSim: 438600, penetrationRate: 96.7, rangeRover: 224900, defender: 133200, discovery: 53100, jaguar: 27400, roamingVehicles: 61000 },
  { label: 'Sep 24', timeDisplay: 'Sep 24', manufactured: 454700, connectedWithSim: 439600, penetrationRate: 96.7, rangeRover: 225700, defender: 133700, discovery: 53200, jaguar: 27000, roamingVehicles: 61200 },
  { label: 'Sep 29', timeDisplay: 'Sep 29', manufactured: 455800, connectedWithSim: 440700, penetrationRate: 96.7, rangeRover: 226600, defender: 134100, discovery: 53300, jaguar: 26700, roamingVehicles: 61400 },
  { label: 'Oct 04', timeDisplay: 'Oct 04', manufactured: 456700, connectedWithSim: 441800, penetrationRate: 96.7, rangeRover: 227400, defender: 134500, discovery: 53400, jaguar: 26500, roamingVehicles: 61600 },
  { label: 'Oct 09', timeDisplay: 'Oct 09', manufactured: 457500, connectedWithSim: 442800, penetrationRate: 96.8, rangeRover: 228100, defender: 134900, discovery: 53480, jaguar: 26320, roamingVehicles: 61750 },
  { label: 'Oct 13', timeDisplay: 'Oct 13 (Latest)', manufactured: 458230, connectedWithSim: 443620, penetrationRate: 96.8, rangeRover: 228700, defender: 135200, discovery: 53520, jaguar: 26200, roamingVehicles: 61840 }
];

export const VEHICLE_TREND_7D: VehicleTrendPoint[] = [
  { label: 'Mon', timeDisplay: 'Oct 07', manufactured: 457100, connectedWithSim: 442300, penetrationRate: 96.8, rangeRover: 227800, defender: 134700, discovery: 53440, jaguar: 26360, roamingVehicles: 61680 },
  { label: 'Tue', timeDisplay: 'Oct 08', manufactured: 457320, connectedWithSim: 442550, penetrationRate: 96.8, rangeRover: 228000, defender: 134800, discovery: 53460, jaguar: 26290, roamingVehicles: 61710 },
  { label: 'Wed', timeDisplay: 'Oct 09', manufactured: 457540, connectedWithSim: 442800, penetrationRate: 96.8, rangeRover: 228150, defender: 134900, discovery: 53480, jaguar: 26270, roamingVehicles: 61740 },
  { label: 'Thu', timeDisplay: 'Oct 10', manufactured: 457780, connectedWithSim: 443100, penetrationRate: 96.8, rangeRover: 228350, defender: 135000, discovery: 53500, jaguar: 26250, roamingVehicles: 61780 },
  { label: 'Fri', timeDisplay: 'Oct 11', manufactured: 458020, connectedWithSim: 443380, penetrationRate: 96.8, rangeRover: 228520, defender: 135110, discovery: 53510, jaguar: 26240, roamingVehicles: 61810 },
  { label: 'Sat', timeDisplay: 'Oct 12', manufactured: 458150, connectedWithSim: 443520, penetrationRate: 96.8, rangeRover: 228630, defender: 135160, discovery: 53515, jaguar: 26215, roamingVehicles: 61830 },
  { label: 'Sun', timeDisplay: 'Oct 13', manufactured: 458230, connectedWithSim: 443620, penetrationRate: 96.8, rangeRover: 228700, defender: 135200, discovery: 53520, jaguar: 26200, roamingVehicles: 61840 }
];

export const VEHICLE_TREND_24H: VehicleTrendPoint[] = [
  { label: '00:00', timeDisplay: '00:00 UTC', manufactured: 458160, connectedWithSim: 443550, penetrationRate: 96.8, rangeRover: 228640, defender: 135170, discovery: 53518, jaguar: 26222, roamingVehicles: 61832 },
  { label: '04:00', timeDisplay: '04:00 UTC', manufactured: 458175, connectedWithSim: 443565, penetrationRate: 96.8, rangeRover: 228650, defender: 135175, discovery: 53518, jaguar: 26222, roamingVehicles: 61834 },
  { label: '08:00', timeDisplay: '08:00 UTC', manufactured: 458195, connectedWithSim: 443585, penetrationRate: 96.8, rangeRover: 228665, defender: 135185, discovery: 53519, jaguar: 26216, roamingVehicles: 61836 },
  { label: '12:00', timeDisplay: '12:00 UTC', manufactured: 458215, connectedWithSim: 443605, penetrationRate: 96.8, rangeRover: 228680, defender: 135195, discovery: 53520, jaguar: 26210, roamingVehicles: 61838 },
  { label: '16:00', timeDisplay: '16:00 UTC', manufactured: 458225, connectedWithSim: 443615, penetrationRate: 96.8, rangeRover: 228695, defender: 135198, discovery: 53520, jaguar: 26202, roamingVehicles: 61839 },
  { label: '20:00', timeDisplay: '20:00 UTC', manufactured: 458228, connectedWithSim: 443618, penetrationRate: 96.8, rangeRover: 228698, defender: 135199, discovery: 53520, jaguar: 26201, roamingVehicles: 61840 },
  { label: 'Now', timeDisplay: 'Current Live Fleet', manufactured: 458230, connectedWithSim: 443620, penetrationRate: 96.8, rangeRover: 228700, defender: 135200, discovery: 53520, jaguar: 26200, roamingVehicles: 61840 }
];

// Connectivity, Availability & SLA Trends
export const CONNECTIVITY_TREND_12M: ConnectivityTrendPoint[] = [
  { label: 'Nov 25', timeDisplay: 'November 2025', availabilityPercent: 99.968, slaTarget: 99.95, avgLatencyMs: 38, packetLossPercent: 0.042, fiveGStandalonePercent: 24, fiveGNonStandalonePercent: 42, fourGLtePercent: 34, activeSessions: 332000 },
  { label: 'Dec 25', timeDisplay: 'December 2025', availabilityPercent: 99.970, slaTarget: 99.95, avgLatencyMs: 36, packetLossPercent: 0.038, fiveGStandalonePercent: 26, fiveGNonStandalonePercent: 42, fourGLtePercent: 32, activeSessions: 341000 },
  { label: 'Jan 26', timeDisplay: 'January 2026', availabilityPercent: 99.971, slaTarget: 99.95, avgLatencyMs: 35, packetLossPercent: 0.034, fiveGStandalonePercent: 28, fiveGNonStandalonePercent: 43, fourGLtePercent: 29, activeSessions: 350000 },
  { label: 'Feb 26', timeDisplay: 'February 2026', availabilityPercent: 99.973, slaTarget: 99.95, avgLatencyMs: 33, packetLossPercent: 0.029, fiveGStandalonePercent: 30, fiveGNonStandalonePercent: 43, fourGLtePercent: 27, activeSessions: 359000 },
  { label: 'Mar 26', timeDisplay: 'March 2026', availabilityPercent: 99.975, slaTarget: 99.95, avgLatencyMs: 31, packetLossPercent: 0.025, fiveGStandalonePercent: 33, fiveGNonStandalonePercent: 42, fourGLtePercent: 25, activeSessions: 369000 },
  { label: 'Apr 26', timeDisplay: 'April 2026', availabilityPercent: 99.976, slaTarget: 99.95, avgLatencyMs: 29, packetLossPercent: 0.022, fiveGStandalonePercent: 35, fiveGNonStandalonePercent: 42, fourGLtePercent: 23, activeSessions: 378000 },
  { label: 'May 26', timeDisplay: 'May 2026', availabilityPercent: 99.978, slaTarget: 99.95, avgLatencyMs: 28, packetLossPercent: 0.019, fiveGStandalonePercent: 38, fiveGNonStandalonePercent: 41, fourGLtePercent: 21, activeSessions: 386000 },
  { label: 'Jun 26', timeDisplay: 'June 2026', availabilityPercent: 99.979, slaTarget: 99.95, avgLatencyMs: 27, packetLossPercent: 0.017, fiveGStandalonePercent: 40, fiveGNonStandalonePercent: 40, fourGLtePercent: 20, activeSessions: 394000 },
  { label: 'Jul 26', timeDisplay: 'July 2026', availabilityPercent: 99.980, slaTarget: 99.95, avgLatencyMs: 26, packetLossPercent: 0.015, fiveGStandalonePercent: 41, fiveGNonStandalonePercent: 40, fourGLtePercent: 19, activeSessions: 401000 },
  { label: 'Aug 26', timeDisplay: 'August 2026', availabilityPercent: 99.981, slaTarget: 99.95, avgLatencyMs: 25, packetLossPercent: 0.014, fiveGStandalonePercent: 43, fiveGNonStandalonePercent: 39, fourGLtePercent: 18, activeSessions: 406000 },
  { label: 'Sep 26', timeDisplay: 'September 2026', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24, packetLossPercent: 0.012, fiveGStandalonePercent: 44, fiveGNonStandalonePercent: 38, fourGLtePercent: 18, activeSessions: 410000 },
  { label: 'Oct 26', timeDisplay: 'October 2026 (Live)', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24, packetLossPercent: 0.011, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 412850 }
];

export const CONNECTIVITY_TREND_30D: ConnectivityTrendPoint[] = [
  { label: 'Sep 14', timeDisplay: 'Sep 14', availabilityPercent: 99.980, slaTarget: 99.95, avgLatencyMs: 25.1, packetLossPercent: 0.014, fiveGStandalonePercent: 44, fiveGNonStandalonePercent: 38, fourGLtePercent: 18, activeSessions: 408200 },
  { label: 'Sep 19', timeDisplay: 'Sep 19', availabilityPercent: 99.981, slaTarget: 99.95, avgLatencyMs: 24.8, packetLossPercent: 0.013, fiveGStandalonePercent: 44, fiveGNonStandalonePercent: 38, fourGLtePercent: 18, activeSessions: 409100 },
  { label: 'Sep 24', timeDisplay: 'Sep 24', availabilityPercent: 99.981, slaTarget: 99.95, avgLatencyMs: 24.5, packetLossPercent: 0.012, fiveGStandalonePercent: 45, fiveGNonStandalonePercent: 38, fourGLtePercent: 17, activeSessions: 410200 },
  { label: 'Sep 29', timeDisplay: 'Sep 29', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24.3, packetLossPercent: 0.012, fiveGStandalonePercent: 45, fiveGNonStandalonePercent: 38, fourGLtePercent: 17, activeSessions: 411100 },
  { label: 'Oct 04', timeDisplay: 'Oct 04', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24.1, packetLossPercent: 0.011, fiveGStandalonePercent: 45, fiveGNonStandalonePercent: 38, fourGLtePercent: 17, activeSessions: 411800 },
  { label: 'Oct 09', timeDisplay: 'Oct 09', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24.0, packetLossPercent: 0.011, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 412400 },
  { label: 'Oct 13', timeDisplay: 'Oct 13', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24.0, packetLossPercent: 0.011, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 412850 }
];

export const CONNECTIVITY_TREND_7D: ConnectivityTrendPoint[] = [
  { label: 'Mon', timeDisplay: 'Oct 07', availabilityPercent: 99.981, slaTarget: 99.95, avgLatencyMs: 24.2, packetLossPercent: 0.012, fiveGStandalonePercent: 45, fiveGNonStandalonePercent: 38, fourGLtePercent: 17, activeSessions: 412100 },
  { label: 'Tue', timeDisplay: 'Oct 08', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24.1, packetLossPercent: 0.011, fiveGStandalonePercent: 45, fiveGNonStandalonePercent: 38, fourGLtePercent: 17, activeSessions: 412300 },
  { label: 'Wed', timeDisplay: 'Oct 09', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24.0, packetLossPercent: 0.011, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 412450 },
  { label: 'Thu', timeDisplay: 'Oct 10', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24.0, packetLossPercent: 0.011, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 412600 },
  { label: 'Fri', timeDisplay: 'Oct 11', availabilityPercent: 99.983, slaTarget: 99.95, avgLatencyMs: 23.9, packetLossPercent: 0.010, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 412750 },
  { label: 'Sat', timeDisplay: 'Oct 12', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24.0, packetLossPercent: 0.011, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 412800 },
  { label: 'Sun', timeDisplay: 'Oct 13', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24.0, packetLossPercent: 0.011, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 412850 }
];

export const CONNECTIVITY_TREND_24H: ConnectivityTrendPoint[] = [
  { label: '00:00', timeDisplay: '00:00 UTC', availabilityPercent: 99.984, slaTarget: 99.95, avgLatencyMs: 22.8, packetLossPercent: 0.008, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 398000 },
  { label: '04:00', timeDisplay: '04:00 UTC', availabilityPercent: 99.983, slaTarget: 99.95, avgLatencyMs: 23.1, packetLossPercent: 0.009, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 402100 },
  { label: '08:00', timeDisplay: '08:00 UTC', availabilityPercent: 99.981, slaTarget: 99.95, avgLatencyMs: 24.8, packetLossPercent: 0.013, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 411500 },
  { label: '12:00', timeDisplay: '12:00 UTC', availabilityPercent: 99.980, slaTarget: 99.95, avgLatencyMs: 25.2, packetLossPercent: 0.014, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 413200 },
  { label: '16:00', timeDisplay: '16:00 UTC', availabilityPercent: 99.981, slaTarget: 99.95, avgLatencyMs: 24.9, packetLossPercent: 0.012, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 414100 },
  { label: '20:00', timeDisplay: '20:00 UTC', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 23.8, packetLossPercent: 0.010, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 413000 },
  { label: 'Now', timeDisplay: 'Live Fleet Pulse', availabilityPercent: 99.982, slaTarget: 99.95, avgLatencyMs: 24.0, packetLossPercent: 0.011, fiveGStandalonePercent: 46, fiveGNonStandalonePercent: 38, fourGLtePercent: 16, activeSessions: 412850 }
];

// Plant-specific scaling factors and characteristics
export const PLANT_MULTIPLIERS: Record<string, {
  share: number;
  simActivationRate: number;
  models: string[];
  name: string;
  country: string;
}> = {
  solihull: {
    share: 148500 / 444500,
    simActivationRate: 99.85,
    models: ['Range Rover', 'Range Rover Sport', 'Range Rover Velar'],
    name: 'Solihull Assembly Plant',
    country: 'UK'
  },
  nitra: {
    share: 112400 / 444500,
    simActivationRate: 99.83,
    models: ['Defender 110', 'Defender 90', 'Defender 130', 'Discovery 5'],
    name: 'Nitra Manufacturing Centre',
    country: 'Slovakia'
  },
  halewood: {
    share: 86300 / 444500,
    simActivationRate: 99.87,
    models: ['Range Rover Evoque', 'Discovery Sport', 'Electric EMA'],
    name: 'Halewood Operations',
    country: 'UK'
  },
  changshu: {
    share: 64200 / 444500,
    simActivationRate: 99.70,
    models: ['Range Rover Evoque LWB', 'Discovery Sport L', 'Jaguar XFL'],
    name: 'Changshu Plant (CJLR)',
    country: 'China'
  },
  pune: {
    share: 18900 / 444500,
    simActivationRate: 99.84,
    models: ['Range Rover Velar CKD', 'Range Rover Evoque', 'Jaguar F-PACE'],
    name: 'Pune Manufacturing Facility',
    country: 'India'
  },
  itatiaia: {
    share: 14200 / 444500,
    simActivationRate: 99.72,
    models: ['Discovery Sport FlexFuel', 'Range Rover Evoque Brasil'],
    name: 'Itatiaia Assembly Centre',
    country: 'Brazil'
  }
};

// Helper accessors with optional plant-specific filtering
export const getSimTrendData = (range: TimeRange, plantId?: string): SimTrendPoint[] => {
  let baseData: SimTrendPoint[];
  switch (range) {
    case '24h': baseData = SIM_TREND_24H; break;
    case '7d': baseData = SIM_TREND_7D; break;
    case '30d': baseData = SIM_TREND_30D; break;
    case '12m': baseData = SIM_TREND_12M; break;
  }

  if (!plantId || plantId === 'all') {
    return baseData;
  }

  const plantInfo = PLANT_MULTIPLIERS[plantId];
  if (!plantInfo) return baseData;

  return baseData.map(d => ({
    ...d,
    activeSims: Math.round(d.activeSims * plantInfo.share),
    provisionedInPeriod: Math.max(1, Math.round(d.provisionedInPeriod * plantInfo.share)),
    suspendedSims: Math.round(d.suspendedSims * plantInfo.share),
    profileSwaps: Math.round(d.profileSwaps * plantInfo.share),
    activationRate: plantInfo.simActivationRate
  }));
};

export const getVehicleTrendData = (range: TimeRange, plantId?: string): VehicleTrendPoint[] => {
  let baseData: VehicleTrendPoint[];
  switch (range) {
    case '24h': baseData = VEHICLE_TREND_24H; break;
    case '7d': baseData = VEHICLE_TREND_7D; break;
    case '30d': baseData = VEHICLE_TREND_30D; break;
    case '12m': baseData = VEHICLE_TREND_12M; break;
  }

  if (!plantId || plantId === 'all') {
    return baseData;
  }

  const plantInfo = PLANT_MULTIPLIERS[plantId];
  if (!plantInfo) return baseData;

  return baseData.map(d => {
    const manufactured = Math.round(d.manufactured * plantInfo.share);
    const connectedWithSim = Math.round(d.connectedWithSim * plantInfo.share);
    const penetrationRate = manufactured > 0 
      ? Math.round((connectedWithSim / manufactured) * 1000) / 10 
      : plantInfo.simActivationRate;

    return {
      ...d,
      manufactured,
      connectedWithSim,
      penetrationRate,
      rangeRover: Math.round(d.rangeRover * plantInfo.share),
      defender: Math.round(d.defender * plantInfo.share),
      discovery: Math.round(d.discovery * plantInfo.share),
      jaguar: Math.round(d.jaguar * plantInfo.share),
      roamingVehicles: Math.round(d.roamingVehicles * plantInfo.share)
    };
  });
};

export const getConnectivityTrendData = (range: TimeRange, plantId?: string): ConnectivityTrendPoint[] => {
  let baseData: ConnectivityTrendPoint[];
  switch (range) {
    case '24h': baseData = CONNECTIVITY_TREND_24H; break;
    case '7d': baseData = CONNECTIVITY_TREND_7D; break;
    case '30d': baseData = CONNECTIVITY_TREND_30D; break;
    case '12m': baseData = CONNECTIVITY_TREND_12M; break;
  }

  if (!plantId || plantId === 'all') {
    return baseData;
  }

  const plantInfo = PLANT_MULTIPLIERS[plantId];
  if (!plantInfo) return baseData;

  return baseData.map(d => ({
    ...d,
    activeSessions: Math.round(d.activeSessions * plantInfo.share)
  }));
};
