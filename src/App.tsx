import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

import { ExecutiveOverview } from './components/modules/ExecutiveOverview';
import { CountryVehicleDetails } from './components/modules/CountryVehicleDetails';
import { PlantIntelligence } from './components/modules/PlantIntelligence';
import { FleetManagement } from './components/modules/FleetManagement';
import { VehicleCockpit360 } from './components/modules/VehicleCockpit360';
import { SimManagement } from './components/modules/SimManagement';
import { NetworkOperationsCenter } from './components/modules/NetworkOperationsCenter';
import { VehicleHealthDiagnostics } from './components/modules/VehicleHealthDiagnostics';
import { ConnectedApplications } from './components/modules/ConnectedApplications';
import { BusinessValueRealization } from './components/modules/BusinessValueRealization';
import { AnalyticsReports } from './components/modules/AnalyticsReports';
import { AiInsightsAssistant } from './components/modules/AiInsightsAssistant';
import { AlertsIncidentManagement } from './components/modules/AlertsIncidentManagement';
import { AdminConfiguration } from './components/modules/AdminConfiguration';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeModule, activeToast, sidebarCollapsed, setSidebarCollapsed } = useApp();

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'executive-overview':
        return <ExecutiveOverview />;
      case 'country-details':
        return <CountryVehicleDetails />;
      case 'plant-intelligence':
        return <PlantIntelligence />;
      case 'fleet-management':
        return <FleetManagement />;
      case 'vehicle-360':
        return <VehicleCockpit360 />;
      case 'sim-management':
        return <SimManagement />;
      case 'network-operations':
        return <NetworkOperationsCenter />;
      case 'vehicle-health':
        return <VehicleHealthDiagnostics />;
      case 'connected-apps':
        return <ConnectedApplications />;
      case 'business-benefits':
        return <BusinessValueRealization />;
      case 'analytics-reports':
        return <AnalyticsReports />;
      case 'ai-insights':
        return <AiInsightsAssistant />;
      case 'alerts-incidents':
        return <AlertsIncidentManagement />;
      case 'administration':
        return <AdminConfiguration />;
      default:
        return <ExecutiveOverview />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0e1e36] text-slate-100 font-sans bg-cockpit-grid">
      {/* Collapsible Left Navigation */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Viewport Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navigation & Global Search */}
        <TopBar />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
          <div className="mx-auto max-w-7xl pb-12">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Real-time Global Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-xl border border-sky-500/40 bg-[#152744]/95 p-4 shadow-2xl backdrop-blur-xl max-w-md animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            {activeToast.type === 'success' ? (
              <CheckCircle2 size={16} />
            ) : activeToast.type === 'warning' ? (
              <AlertTriangle size={16} className="text-amber-400" />
            ) : (
              <Info size={16} />
            )}
          </div>
          <div className="space-y-0.5 pr-2">
            <h4 className="text-xs font-bold text-white tracking-wide">{activeToast.title}</h4>
            <p className="text-[11px] text-slate-200 leading-relaxed">{activeToast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
