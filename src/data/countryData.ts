export interface CountrySaleMetrics {
  unitsSold: number;
  revenueUSD: string;
  marketShare: string;
  yoyGrowth: string;
  topSellingModels: string[];
}

export interface CountryUsageMetrics {
  activeConnectedVehicles: number;
  connectivityRatio: string;
  sessions: string;
  dataConsumption: string;
  sms: string;
  voice: string;
  primaryCarriers: string[];
  avgLatencyMs: number;
}

export interface CountryMarker {
  id: string;
  country: string;
  displayName: string;
  flag: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  category: 'sale' | 'usage' | 'both';
  status: 'optimal' | 'warning';
  saleMetrics: CountrySaleMetrics;
  usageMetrics: CountryUsageMetrics;
  metricsByDate?: Record<string, {
    sale: CountrySaleMetrics;
    usage: CountryUsageMetrics;
  }>;
}

export const COUNTRY_MARKERS: CountryMarker[] = [
  {
    id: 'india',
    country: 'India',
    displayName: 'India',
    flag: '🇮🇳',
    name: 'Mumbai & Delhi NCR Corridor',
    subtitle: '',
    lat: 20.5937,
    lng: 78.9629,
    category: 'both',
    status: 'optimal',
    saleMetrics: {
      unitsSold: 48200,
      revenueUSD: '$3.85B',
      marketShare: '16.4%',
      yoyGrowth: '+18.6%',
      topSellingModels: ['Range Rover', 'Defender 110', 'Range Rover Velar']
    },
    usageMetrics: {
      activeConnectedVehicles: 46920,
      connectivityRatio: '99.8%',
      sessions: '18.4 M',
      dataConsumption: '6840.40 GB',
      sms: '154.20 K',
      voice: '8h 12m 30s',
      primaryCarriers: ['Airtel Global Enterprise', 'Tata Telecommunications'],
      avgLatencyMs: 21
    },
    metricsByDate: {
      'Oct 2026': {
        sale: { unitsSold: 48200, revenueUSD: '$3.85B', marketShare: '16.4%', yoyGrowth: '+18.6%', topSellingModels: ['Range Rover', 'Defender 110', 'Range Rover Velar'] },
        usage: { activeConnectedVehicles: 46920, connectivityRatio: '99.8%', sessions: '18.4 M', dataConsumption: '6840.40 GB', sms: '154.20 K', voice: '8h 12m 30s', primaryCarriers: ['Airtel Global Enterprise'], avgLatencyMs: 21 }
      },
      'Sep 2026': {
        sale: { unitsSold: 46100, revenueUSD: '$3.68B', marketShare: '16.0%', yoyGrowth: '+17.9%', topSellingModels: ['Range Rover', 'Defender 110', 'Range Rover Velar'] },
        usage: { activeConnectedVehicles: 44800, connectivityRatio: '99.6%', sessions: '17.3 M', dataConsumption: '6480.10 GB', sms: '145.00 K', voice: '7h 48m 10s', primaryCarriers: ['Airtel Global Enterprise'], avgLatencyMs: 22 }
      },
      'Aug 2026': {
        sale: { unitsSold: 44000, revenueUSD: '$3.50B', marketShare: '15.5%', yoyGrowth: '+17.2%', topSellingModels: ['Range Rover', 'Defender 110', 'Range Rover Velar'] },
        usage: { activeConnectedVehicles: 42700, connectivityRatio: '99.5%', sessions: '16.2 M', dataConsumption: '6120.50 GB', sms: '136.00 K', voice: '7h 25m 40s', primaryCarriers: ['Airtel Global Enterprise'], avgLatencyMs: 22 }
      },
      'Jul 2026': {
        sale: { unitsSold: 41900, revenueUSD: '$3.32B', marketShare: '15.1%', yoyGrowth: '+16.5%', topSellingModels: ['Range Rover', 'Defender 110', 'Range Rover Velar'] },
        usage: { activeConnectedVehicles: 40600, connectivityRatio: '99.3%', sessions: '15.1 M', dataConsumption: '5760.00 GB', sms: '127.00 K', voice: '7h 02m 15s', primaryCarriers: ['Airtel Global Enterprise'], avgLatencyMs: 23 }
      }
    }
  },
  {
    id: 'uk',
    country: 'United Kingdom',
    displayName: 'United Kingdom',
    flag: '🇬🇧',
    name: 'Solihull & Halewood Operations',
    subtitle: '',
    lat: 52.5000,
    lng: -1.8000,
    category: 'both',
    status: 'optimal',
    saleMetrics: {
      unitsSold: 148500,
      revenueUSD: '$12.4B',
      marketShare: '34.2%',
      yoyGrowth: '+12.4%',
      topSellingModels: ['Range Rover', 'Defender 110', 'Range Rover Sport']
    },
    usageMetrics: {
      activeConnectedVehicles: 142280,
      connectivityRatio: '99.9%',
      sessions: '48.2 M',
      dataConsumption: '16420.80 GB',
      sms: '412.50 K',
      voice: '48h 22m 10s',
      primaryCarriers: ['Vodafone IoT Global', 'EE', 'O2 UK'],
      avgLatencyMs: 22
    },
    metricsByDate: {
      'Oct 2026': {
        sale: { unitsSold: 148500, revenueUSD: '$12.4B', marketShare: '34.2%', yoyGrowth: '+12.4%', topSellingModels: ['Range Rover', 'Defender 110', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 142280, connectivityRatio: '99.9%', sessions: '48.2 M', dataConsumption: '16420.80 GB', sms: '412.50 K', voice: '48h 22m 10s', primaryCarriers: ['Vodafone IoT Global'], avgLatencyMs: 22 }
      },
      'Sep 2026': {
        sale: { unitsSold: 145200, revenueUSD: '$12.1B', marketShare: '33.9%', yoyGrowth: '+11.8%', topSellingModels: ['Range Rover', 'Defender 110', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 139100, connectivityRatio: '99.8%', sessions: '45.8 M', dataConsumption: '15890.10 GB', sms: '394.20 K', voice: '46h 10m 05s', primaryCarriers: ['Vodafone IoT Global'], avgLatencyMs: 23 }
      },
      'Aug 2026': {
        sale: { unitsSold: 141900, revenueUSD: '$11.8B', marketShare: '33.5%', yoyGrowth: '+11.2%', topSellingModels: ['Range Rover', 'Defender 110', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 135800, connectivityRatio: '99.7%', sessions: '43.1 M', dataConsumption: '15120.40 GB', sms: '378.00 K', voice: '44h 05m 18s', primaryCarriers: ['Vodafone IoT Global'], avgLatencyMs: 24 }
      },
      'Jul 2026': {
        sale: { unitsSold: 138600, revenueUSD: '$11.5B', marketShare: '33.1%', yoyGrowth: '+10.6%', topSellingModels: ['Range Rover', 'Defender 110', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 132400, connectivityRatio: '99.6%', sessions: '40.6 M', dataConsumption: '14380.00 GB', sms: '360.50 K', voice: '41h 50m 42s', primaryCarriers: ['Vodafone IoT Global'], avgLatencyMs: 24 }
      }
    }
  },
  {
    id: 'france',
    country: 'France',
    displayName: 'France',
    flag: '🇫🇷',
    name: 'Paris',
    subtitle: '',
    lat: 46.2276,
    lng: 2.2137,
    category: 'both',
    status: 'optimal',
    saleMetrics: {
      unitsSold: 26400,
      revenueUSD: '$2.20B',
      marketShare: '8.4%',
      yoyGrowth: '+7.8%',
      topSellingModels: ['Range Rover Velar', 'Range Rover Evoque', 'Defender 90']
    },
    usageMetrics: {
      activeConnectedVehicles: 28100,
      connectivityRatio: '99.7%',
      sessions: '9.4 M',
      dataConsumption: '3420.50 GB',
      sms: '88.50 K',
      voice: '8h 45m 12s',
      primaryCarriers: ['Orange France', 'SFR'],
      avgLatencyMs: 24
    },
    metricsByDate: {
      'Oct 2026': {
        sale: { unitsSold: 26400, revenueUSD: '$2.20B', marketShare: '8.4%', yoyGrowth: '+7.8%', topSellingModels: ['Range Rover Velar', 'Range Rover Evoque', 'Defender 90'] },
        usage: { activeConnectedVehicles: 28100, connectivityRatio: '99.7%', sessions: '9.4 M', dataConsumption: '3420.50 GB', sms: '88.50 K', voice: '8h 45m 12s', primaryCarriers: ['Orange France'], avgLatencyMs: 24 }
      },
      'Sep 2026': {
        sale: { unitsSold: 25100, revenueUSD: '$2.09B', marketShare: '8.2%', yoyGrowth: '+7.3%', topSellingModels: ['Range Rover Velar', 'Range Rover Evoque', 'Defender 90'] },
        usage: { activeConnectedVehicles: 26800, connectivityRatio: '99.5%', sessions: '8.9 M', dataConsumption: '3240.20 GB', sms: '84.00 K', voice: '8h 15m 30s', primaryCarriers: ['Orange France'], avgLatencyMs: 25 }
      },
      'Aug 2026': {
        sale: { unitsSold: 23900, revenueUSD: '$1.98B', marketShare: '7.9%', yoyGrowth: '+6.9%', topSellingModels: ['Range Rover Velar', 'Range Rover Evoque', 'Defender 90'] },
        usage: { activeConnectedVehicles: 25500, connectivityRatio: '99.4%', sessions: '8.4 M', dataConsumption: '3070.10 GB', sms: '79.50 K', voice: '7h 50m 15s', primaryCarriers: ['Orange France'], avgLatencyMs: 25 }
      },
      'Jul 2026': {
        sale: { unitsSold: 22700, revenueUSD: '$1.88B', marketShare: '7.6%', yoyGrowth: '+6.5%', topSellingModels: ['Range Rover Velar', 'Range Rover Evoque', 'Defender 90'] },
        usage: { activeConnectedVehicles: 24200, connectivityRatio: '99.2%', sessions: '7.9 M', dataConsumption: '2900.40 GB', sms: '75.00 K', voice: '7h 25m 10s', primaryCarriers: ['Orange France'], avgLatencyMs: 26 }
      }
    }
  },
  {
    id: 'uae',
    country: 'United Arab Emirates',
    displayName: 'United Arab Emirates',
    flag: '🇦🇪',
    name: 'Dubai & Abu Dhabi',
    subtitle: '',
    lat: 23.4241,
    lng: 53.8478,
    category: 'both',
    status: 'optimal',
    saleMetrics: {
      unitsSold: 28900,
      revenueUSD: '$3.10B',
      marketShare: '22.4%',
      yoyGrowth: '+15.4%',
      topSellingModels: ['Range Rover SV', 'Defender 130 V8', 'Range Rover Sport']
    },
    usageMetrics: {
      activeConnectedVehicles: 27600,
      connectivityRatio: '99.9%',
      sessions: '10.8 M',
      dataConsumption: '4150.30 GB',
      sms: '106.00 K',
      voice: '12h 40m 15s',
      primaryCarriers: ['e& (Etisalat) IoT', 'du Telecom'],
      avgLatencyMs: 17
    },
    metricsByDate: {
      'Oct 2026': {
        sale: { unitsSold: 28900, revenueUSD: '$3.10B', marketShare: '22.4%', yoyGrowth: '+15.4%', topSellingModels: ['Range Rover SV', 'Defender 130 V8', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 27600, connectivityRatio: '99.9%', sessions: '10.8 M', dataConsumption: '4150.30 GB', sms: '106.00 K', voice: '12h 40m 15s', primaryCarriers: ['e& (Etisalat) IoT'], avgLatencyMs: 17 }
      },
      'Sep 2026': {
        sale: { unitsSold: 27600, revenueUSD: '$2.95B', marketShare: '21.9%', yoyGrowth: '+14.8%', topSellingModels: ['Range Rover SV', 'Defender 130 V8', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 26300, connectivityRatio: '99.8%', sessions: '10.2 M', dataConsumption: '3920.10 GB', sms: '100.50 K', voice: '12h 05m 20s', primaryCarriers: ['e& (Etisalat) IoT'], avgLatencyMs: 18 }
      },
      'Aug 2026': {
        sale: { unitsSold: 26300, revenueUSD: '$2.80B', marketShare: '21.4%', yoyGrowth: '+14.2%', topSellingModels: ['Range Rover SV', 'Defender 130 V8', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 25000, connectivityRatio: '99.7%', sessions: '9.6 M', dataConsumption: '3690.40 GB', sms: '95.00 K', voice: '11h 30m 10s', primaryCarriers: ['e& (Etisalat) IoT'], avgLatencyMs: 18 }
      },
      'Jul 2026': {
        sale: { unitsSold: 25000, revenueUSD: '$2.65B', marketShare: '20.9%', yoyGrowth: '+13.6%', topSellingModels: ['Range Rover SV', 'Defender 130 V8', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 23700, connectivityRatio: '99.6%', sessions: '9.0 M', dataConsumption: '3460.20 GB', sms: '89.50 K', voice: '10h 55m 45s', primaryCarriers: ['e& (Etisalat) IoT'], avgLatencyMs: 19 }
      }
    }
  },
  {
    id: 'saudi',
    country: 'Saudi Arabia',
    displayName: 'Saudi Arabia',
    flag: '🇸🇦',
    name: 'Riyadh & Jeddah Desert Corridor',
    subtitle: '',
    lat: 23.8859,
    lng: 45.0792,
    category: 'both',
    status: 'optimal',
    saleMetrics: {
      unitsSold: 36400,
      revenueUSD: '$3.45B',
      marketShare: '24.8%',
      yoyGrowth: '+17.4%',
      topSellingModels: ['Range Rover SV', 'Defender 130 V8', 'Range Rover Sport']
    },
    usageMetrics: {
      activeConnectedVehicles: 34920,
      connectivityRatio: '99.8%',
      sessions: '12.4 M',
      dataConsumption: '4890.60 GB',
      sms: '118.00 K',
      voice: '14h 15m 45s',
      primaryCarriers: ['STC Enterprise IoT', 'Mobily IoT', 'Zain KSA'],
      avgLatencyMs: 18
    },
    metricsByDate: {
      'Oct 2026': {
        sale: { unitsSold: 36400, revenueUSD: '$3.45B', marketShare: '24.8%', yoyGrowth: '+17.4%', topSellingModels: ['Range Rover SV', 'Defender 130 V8', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 34920, connectivityRatio: '99.8%', sessions: '12.4 M', dataConsumption: '4890.60 GB', sms: '118.00 K', voice: '14h 15m 45s', primaryCarriers: ['STC Enterprise IoT'], avgLatencyMs: 18 }
      },
      'Sep 2026': {
        sale: { unitsSold: 34800, revenueUSD: '$3.29B', marketShare: '24.2%', yoyGrowth: '+16.8%', topSellingModels: ['Range Rover SV', 'Defender 130 V8', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 33300, connectivityRatio: '99.7%', sessions: '11.8 M', dataConsumption: '4620.10 GB', sms: '112.00 K', voice: '13h 40m 10s', primaryCarriers: ['STC Enterprise IoT'], avgLatencyMs: 18 }
      },
      'Aug 2026': {
        sale: { unitsSold: 33200, revenueUSD: '$3.13B', marketShare: '23.6%', yoyGrowth: '+16.2%', topSellingModels: ['Range Rover SV', 'Defender 130 V8', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 31700, connectivityRatio: '99.6%', sessions: '11.1 M', dataConsumption: '4360.20 GB', sms: '106.00 K', voice: '13h 05m 25s', primaryCarriers: ['STC Enterprise IoT'], avgLatencyMs: 19 }
      },
      'Jul 2026': {
        sale: { unitsSold: 31600, revenueUSD: '$2.97B', marketShare: '23.0%', yoyGrowth: '+15.6%', topSellingModels: ['Range Rover SV', 'Defender 130 V8', 'Range Rover Sport'] },
        usage: { activeConnectedVehicles: 30100, connectivityRatio: '99.5%', sessions: '10.5 M', dataConsumption: '4100.30 GB', sms: '100.00 K', voice: '12h 30m 15s', primaryCarriers: ['STC Enterprise IoT'], avgLatencyMs: 19 }
      }
    }
  }
];

export const getCountryMetrics = (marker: CountryMarker, date: string) => {
  if (marker.metricsByDate && marker.metricsByDate[date]) {
    return marker.metricsByDate[date];
  }
  return {
    sale: marker.saleMetrics,
    usage: marker.usageMetrics
  };
};
