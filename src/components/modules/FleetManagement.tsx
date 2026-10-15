import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Grid, 
  List, 
  Signal, 
  Wifi, 
  Activity, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  RefreshCw, 
  Radio, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Vehicle, VehicleStatus } from '../../types';

export const FleetManagement: React.FC = () => {
  const { 
    filteredVehicles, 
    filters, 
    setFilter, 
    navigateToCockpit, 
    pingVehicle,
    switchEsimProfile,
    showToast
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedVins, setSelectedVins] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Vehicle>('healthScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Sorting
  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredVehicles, sortField, sortAsc]);

  const handleSort = (field: keyof Vehicle) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedVins.length === sortedVehicles.length) {
      setSelectedVins([]);
    } else {
      setSelectedVins(sortedVehicles.map(v => v.vin));
    }
  };

  const toggleSelectVin = (vin: string) => {
    setSelectedVins(prev => 
      prev.includes(vin) ? prev.filter(v => v !== vin) : [...prev, vin]
    );
  };

  const exportCsv = () => {
    const headers = ['VIN', 'Model', 'Variant', 'Plant', 'Status', 'Operator', 'SignalRssi', 'LatencyMs', 'DataMB', 'HealthScore', 'LastConnected'];
    const rows = sortedVehicles.map(v => [
      v.vin,
      v.model,
      v.variant,
      v.plantName,
      v.status,
      v.networkOperator,
      v.signalRssi,
      v.latencyMs,
      v.dataConsumptionMb,
      v.healthScore,
      v.lastConnected
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jlr_move_sim_fleet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Completed', `Exported ${sortedVehicles.length} vehicle records to CSV.`, 'success');
  };

  const handleBulkPing = () => {
    if (selectedVins.length === 0) return;
    showToast('Bulk Diagnostics Triggered', `Sent UDS telematics ping to ${selectedVins.length} selected vehicles.`, 'info');
    selectedVins.forEach(vin => pingVehicle(vin));
    setSelectedVins([]);
  };

  const handleBulkRspProfile = () => {
    if (selectedVins.length === 0) return;
    showToast('Bulk eUICC Profile Update', `Initiating GSMA RSP profile refresh for ${selectedVins.length} vehicles via Tata Move SM-DP+.`, 'info');
    selectedVins.forEach(vin => switchEsimProfile(vin));
    setSelectedVins([]);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#224375] pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Car size={22} className="text-sky-400" />
            Connected Vehicle Fleet Monitor
          </h1>
          {/* <p className="text-xs text-slate-300 mt-0.5">
            Real-time telemetry, Move SIM eUICC health, and live connected applications across the global fleet
          </p> */}
        </div>

        <div className="flex items-center gap-2.5">
          {selectedVins.length > 0 && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs font-mono text-sky-300 font-semibold">
                {selectedVins.length} selected
              </span>
              <button
                onClick={handleBulkPing}
                className="rounded-lg border border-sky-500/40 bg-sky-500/20 px-2.5 py-1.5 text-xs text-sky-300 font-semibold hover:bg-sky-500/30 transition-all"
              >
                Send Ping
              </button>
              <button
                onClick={handleBulkRspProfile}
                className="rounded-lg border border-[#224375] bg-[#1a3156] px-2.5 py-1.5 text-xs text-slate-200 font-semibold hover:bg-[#203c68] transition-all"
              >
                RSP Refresh
              </button>
            </div>
          )}

          {/* Table vs Grid toggle */}
          <div className="flex items-center rounded-lg border border-[#224375] bg-[#152744] p-0.5">
            <button
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              className={`rounded p-1.5 transition-all ${
                viewMode === 'table' ? 'bg-[#1a3156] text-sky-300 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              aria-label="Cards view"
              className={`rounded p-1.5 transition-all ${
                viewMode === 'cards' ? 'bg-[#1a3156] text-sky-300 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid size={16} />
            </button>
          </div>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-lg border border-[#224375] bg-[#1a3156] px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-[#203c68] hover:text-white transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Quick Status Count Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-mono text-slate-300">
            Showing <strong className="text-white">{sortedVehicles.length}</strong> of 443,620 total vehicles
          </span>
          {filters.searchQuery && (
            <span className="text-slate-400">
              Matching "<strong className="text-sky-300">{filters.searchQuery}</strong>"
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-emerald-400">Online: {sortedVehicles.filter(v => v.status === 'Online').length}</span>
          <span className="text-slate-400">Offline: {sortedVehicles.filter(v => v.status === 'Offline').length}</span>
          <span className="text-sky-400">Roaming: {sortedVehicles.filter(v => v.status === 'Roaming').length}</span>
          <span className="text-amber-400">Degraded: {sortedVehicles.filter(v => v.status === 'Degraded').length}</span>
          <span className="text-red-400">Critical: {sortedVehicles.filter(v => v.status === 'Critical').length}</span>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-xl border border-[#224375] bg-[#1a3156] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#224375] bg-[#152744] text-[10px] uppercase font-bold text-slate-300">
                <tr>
                  <th className="py-3 px-3 w-8">
                    <button 
                      onClick={toggleSelectAll} 
                      className="text-slate-400 hover:text-white"
                      aria-label="Select all vehicles"
                    >
                      {selectedVins.length > 0 && selectedVins.length === sortedVehicles.length ? (
                        <CheckSquare size={14} className="text-sky-400" />
                      ) : (
                        <Square size={14} />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('vin')}>
                    <div className="flex items-center gap-1">VIN <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('model')}>
                    <div className="flex items-center gap-1">Model & Variant <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3 px-3">Manufacturing Plant</th>
                  <th className="py-3 px-3">Move SIM (ICCID)</th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">Status <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3 px-3">Operator / Network</th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('signalRssi')}>
                    <div className="flex items-center gap-1">Signal (RSSI) <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('dataConsumptionMb')}>
                    <div className="flex items-center gap-1">Data (MB) <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('healthScore')}>
                    <div className="flex items-center gap-1">Health <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3 px-3 text-right">360° Cockpit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#224375]/60 font-mono text-[11px]">
                {sortedVehicles.map(veh => {
                  const isSelected = selectedVins.includes(veh.vin);
                  return (
                    <tr 
                      key={veh.vin}
                      className={`hover:bg-[#203c68]/60 transition-colors group cursor-pointer ${
                        isSelected ? 'bg-sky-950/40' : ''
                      }`}
                      onClick={() => navigateToCockpit(veh.vin)}
                    >
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <button className="text-slate-400 hover:text-white" onClick={() => toggleSelectVin(veh.vin)}>
                          {isSelected ? <CheckSquare size={14} className="text-sky-400" /> : <Square size={14} />}
                        </button>
                      </td>
                      <td className="py-3 px-3 font-bold text-white group-hover:text-sky-300">
                        {veh.vin}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-100">
                        <div className="font-semibold">{veh.model}</div>
                        <div className="text-[10px] text-slate-300 truncate max-w-[180px]">{veh.variant}</div>
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-200">
                        {veh.plantName.replace(' Plant', '')}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {veh.simIccid.slice(0, 8)}...{veh.simIccid.slice(-4)}
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          veh.status === 'Online' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50' :
                          veh.status === 'Roaming' ? 'bg-sky-950/80 text-sky-300 border border-sky-600/50' :
                          veh.status === 'Degraded' ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50' :
                          veh.status === 'Critical' ? 'bg-red-950/80 text-red-300 border border-red-600/50' :
                          'bg-[#152744] text-slate-300 border border-[#224375]'
                        }`}>
                          {veh.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-200">
                        <div>{veh.networkOperator.split(' ')[0]}</div>
                        <div className="text-[10px] font-mono text-sky-400">{veh.networkTech} · {veh.latencyMs}ms</div>
                      </td>
                      <td className="py-3 px-3 text-slate-200">
                        {veh.signalRssi} dBm
                      </td>
                      <td className="py-3 px-3 text-slate-200">
                        {veh.dataConsumptionMb.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${
                          veh.healthScore >= 95 ? 'text-sky-400' : veh.healthScore >= 80 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {veh.healthScore}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToCockpit(veh.vin);
                          }}
                          className="rounded bg-[#152744] hover:bg-sky-500 hover:text-slate-950 border border-[#224375] px-2.5 py-1 text-[10px] font-semibold text-sky-300 transition-all"
                        >
                          View 360°
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedVehicles.map(veh => (
            <div
              key={veh.vin}
              onClick={() => navigateToCockpit(veh.vin)}
              className="group cursor-pointer rounded-xl border border-[#224375] bg-[#1a3156] p-4 hover:border-sky-500/50 hover:bg-[#1f3b68] transition-all space-y-3 flex flex-col justify-between shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#224375]/80">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                    veh.status === 'Online' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50' :
                    veh.status === 'Roaming' ? 'bg-sky-950/80 text-sky-300 border border-sky-600/50' :
                    veh.status === 'Degraded' ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50' :
                    veh.status === 'Critical' ? 'bg-red-950/80 text-red-300 border border-red-600/50' :
                    'bg-[#152744] text-slate-300 border border-[#224375]'
                  }`}>
                    {veh.status}
                  </span>
                  <span className="font-mono text-[10px] text-slate-300">
                    {veh.city}, {veh.country}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    {veh.model}
                  </h3>
                  <p className="text-[11px] text-slate-300 truncate">{veh.variant}</p>
                  <p className="text-[10px] font-mono text-slate-300 mt-1">VIN: {veh.vin}</p>
                </div>

                <div className="mt-4 space-y-1.5 text-xs border-t border-[#224375]/60 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Carrier / Tech:</span>
                    <span className="font-mono text-slate-100">{veh.networkTech} · {veh.networkOperator.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Signal / Latency:</span>
                    <span className="font-mono text-slate-100">{veh.signalRssi} dBm · {veh.latencyMs}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Health Score:</span>
                    <span className={`font-mono font-bold ${
                      veh.healthScore >= 95 ? 'text-sky-400' : veh.healthScore >= 80 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {veh.healthScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Data Transferred:</span>
                    <span className="font-mono text-slate-100">{veh.dataConsumptionMb} MB</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#224375]/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  Ping: {veh.lastConnected}
                </span>
                <span className="text-xs font-semibold text-sky-400 group-hover:underline flex items-center gap-1">
                  View 360° →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
