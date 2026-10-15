import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Eye, 
  RotateCw, 
  Compass, 
  Sliders, 
  ShieldAlert, 
  Maximize2, 
  Sparkles, 
  CheckCircle2, 
  Radio, 
  Sun, 
  Moon, 
  Droplets,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Vehicle } from '../../types';

interface PanoramicViewMonitorProps {
  vehicle: Vehicle;
}

export const PanoramicViewMonitor: React.FC<PanoramicViewMonitorProps> = ({ vehicle }) => {
  const [selectedCameraAngle, setSelectedCameraAngle] = useState<'3d_orbit' | 'front_wide' | 'rear_backup' | 'left_kerb' | 'right_blindspot' | 'transparent_hood'>('3d_orbit');
  const [steeringAngle, setSteeringAngle] = useState<number>(12); // degrees: -35 to +35
  const [nightVisionMode, setNightVisionMode] = useState<boolean>(false);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);
  const [showObstacleHeatmap, setShowObstacleHeatmap] = useState<boolean>(true);
  const [transparentChassis, setTransparentChassis] = useState<boolean>(false);
  const [lensWashingActive, setLensWashingActive] = useState<boolean>(false);

  // Proximity sensor simulated distances (in meters)
  const proximitySensors = {
    frontLeft: 1.4,
    frontCenter: 2.1,
    frontRight: 1.8,
    rearLeft: 0.85,
    rearCenter: 0.42, // Warning yellow/red
    rearRight: 0.78,
    leftKerb: 0.35,
    rightClearance: 1.2
  };

  const handleWashCameraLenses = () => {
    setLensWashingActive(true);
    setTimeout(() => {
      setLensWashingActive(false);
    }, 2000);
  };

  return (
    <div className="rounded-2xl border border-[#224375] bg-[#1a3156] overflow-hidden shadow-2xl">
      {/* Top Monitor Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#224375] bg-[#152744] px-5 py-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40">
            <Camera size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono font-bold text-white tracking-wide">
              <span>360° SURROUND-VIEW PANORAMIC VIEW MONITOR (PVM)</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-sky-300">
              ClearSight 4-Camera Optical Stitching · 1080p HDR 60fps · 18ms Edge Video Latency
            </p>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          {/* Night vision toggle */}
          <button
            onClick={() => setNightVisionMode(!nightVisionMode)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
              nightVisionMode
                ? 'border-emerald-500/50 bg-emerald-950/80 text-emerald-300'
                : 'border-[#224375] bg-[#1a3156] text-slate-200 hover:text-white'
            }`}
          >
            {nightVisionMode ? <Moon size={12} className="text-emerald-400" /> : <Sun size={12} />}
            Night Vision
          </button>

          {/* Transparent hood / ClearSight Ground View */}
          <button
            onClick={() => setTransparentChassis(!transparentChassis)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
              transparentChassis
                ? 'border-sky-500/50 bg-sky-950/80 text-sky-300'
                : 'border-[#224375] bg-[#1a3156] text-slate-200 hover:text-white'
            }`}
          >
            <Layers size={12} />
            ClearSight Ground View
          </button>

          {/* Camera lens cleaning jet */}
          <button
            onClick={handleWashCameraLenses}
            disabled={lensWashingActive}
            className="flex items-center gap-1.5 rounded-lg border border-[#224375] bg-[#1a3156] hover:bg-[#203c68] px-2.5 py-1 text-[11px] font-semibold text-sky-300 transition-all disabled:opacity-50"
          >
            <Droplets size={12} className={lensWashingActive ? 'animate-bounce text-cyan-400' : ''} />
            {lensWashingActive ? 'Washing Lenses...' : 'Lens Wash'}
          </button>
        </div>
      </div>

      {/* Main Viewport: Dual Split-Screen Panoramic Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] bg-[#101f37]">
        {/* Left Viewport (5 cols): Top-Down Orthographic Bird's-Eye View */}
        <div className="lg:col-span-5 p-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#224375] relative overflow-hidden bg-radial from-[#1a3156] to-[#101f37]">
          <div className="flex items-center justify-between pb-2 border-b border-[#224375]/60 z-10">
            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
              <Eye size={13} />
              Top-Down 360° Composite
            </span>
            <span className="text-[10px] font-mono text-slate-300">
              Steering: <strong className="text-white">{steeringAngle > 0 ? `+${steeringAngle}° R` : `${steeringAngle}° L`}</strong>
            </span>
          </div>

          {/* Top-Down Vehicle Diagram with 4 Camera Cones & Trajectory Guidelines */}
          <div className="relative w-full aspect-square max-h-[360px] mx-auto my-auto flex items-center justify-center select-none">
            {/* Ultrasonic Radar Ring Waves */}
            <div className="absolute inset-4 rounded-full border border-sky-500/10 pointer-events-none animate-pulse" />
            <div className="absolute inset-12 rounded-full border border-sky-500/15 pointer-events-none" />

            {/* Front Camera Field of View Cone */}
            <div 
              className={`absolute top-2 w-48 h-28 border-t-2 border-sky-400/40 rounded-t-full transition-opacity pointer-events-none ${
                selectedCameraAngle === 'front_wide' ? 'opacity-90 bg-sky-500/10' : 'opacity-30'
              }`}
            />

            {/* Rear Camera Field of View Cone with Warning distance */}
            <div 
              className={`absolute bottom-2 w-48 h-28 border-b-2 rounded-b-full transition-opacity pointer-events-none ${
                proximitySensors.rearCenter < 0.5 
                  ? 'border-red-400/80 bg-red-500/15 opacity-80' 
                  : 'border-amber-400/40 opacity-40'
              }`}
            />

            {/* Left Kerb Camera Cone */}
            <div 
              className={`absolute left-0 w-24 h-48 border-l-2 border-sky-400/40 rounded-l-full transition-opacity pointer-events-none ${
                selectedCameraAngle === 'left_kerb' ? 'opacity-90 bg-sky-500/10' : 'opacity-30'
              }`}
            />

            {/* Right Blind-spot Camera Cone */}
            <div 
              className={`absolute right-0 w-24 h-48 border-r-2 border-sky-400/40 rounded-r-full transition-opacity pointer-events-none ${
                selectedCameraAngle === 'right_blindspot' ? 'opacity-90 bg-sky-500/10' : 'opacity-30'
              }`}
            />

            {/* Dynamic Curving Tire Trajectory Tracks based on steering angle */}
            {showGuidelines && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                {/* Yellow dynamic predictive path */}
                <path
                  d={`M 140,240 Q ${140 + steeringAngle * 1.5},300 ${140 + steeringAngle * 2.8},340`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                  opacity="0.85"
                />
                <path
                  d={`M 220,240 Q ${220 + steeringAngle * 1.5},300 ${220 + steeringAngle * 2.8},340`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                  opacity="0.85"
                />
                {/* Red minimum stopping distance boundary (0.5m) */}
                <line
                  x1={120 + steeringAngle * 2.2}
                  y1="315"
                  x2={240 + steeringAngle * 2.2}
                  y2="315"
                  stroke="#f87171"
                  strokeWidth="2.5"
                  opacity="0.9"
                />
              </svg>
            )}

            {/* Vehicle Silhouette Graphic (Top-Down Orthographic View) */}
            <div className={`relative w-28 h-56 rounded-2xl border-2 transition-all shadow-2xl flex flex-col items-center justify-between p-2 z-20 ${
              transparentChassis
                ? 'bg-[#1a3156]/40 border-sky-400/60 backdrop-blur-xs'
                : 'bg-gradient-to-b from-[#102340] via-[#163056] to-[#0f203a] border-sky-400/80'
            }`}>
              {/* Front Windshield & Headlamps */}
              <div className="w-full flex items-center justify-between px-1">
                <span className="h-1.5 w-4 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
                {/* Front Grille Camera Lens Dot */}
                <span className="h-2 w-2 rounded-full bg-sky-400 ring-2 ring-sky-300 animate-pulse" title="Front Wide 180° Camera" />
                <span className="h-1.5 w-4 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
              </div>

              {/* Panoramic Glass Roof */}
              <div className="w-18 h-24 rounded-lg border border-sky-400/30 bg-[#1e3c68]/50 flex flex-col items-center justify-center text-center p-1">
                <span className="text-[9px] font-mono font-bold tracking-tight text-sky-200">
                  {vehicle.model.split(' ')[0]}
                </span>
                <span className="text-[8px] font-mono text-sky-400/80">360° PVM</span>
              </div>

              {/* Side Mirrors with Cameras */}
              <div className="absolute top-14 -left-3 h-3 w-3 rounded-full bg-sky-400 ring-2 ring-sky-300" title="Left Mirror Camera" />
              <div className="absolute top-14 -right-3 h-3 w-3 rounded-full bg-sky-400 ring-2 ring-sky-300" title="Right Mirror Camera" />

              {/* Rear Tailgate & Camera */}
              <div className="w-full flex items-center justify-between px-1">
                <span className="h-1.5 w-4 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                {/* Rear Backup Camera Lens Dot */}
                <span className="h-2 w-2 rounded-full bg-amber-400 ring-2 ring-amber-300" title="Rear Backup Camera" />
                <span className="h-1.5 w-4 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              </div>
            </div>

            {/* Proximity Distance Badges */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-sky-300 bg-[#152744]/95 border border-[#224375] px-2 py-0.5 rounded shadow">
              Front: {proximitySensors.frontCenter}m
            </div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-red-400 bg-red-950/90 border border-red-800 px-2 py-0.5 rounded shadow animate-pulse">
              Rear: {proximitySensors.rearCenter}m (STOPPING ZONE)
            </div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-mono text-amber-300 bg-[#152744]/95 border border-[#224375] px-1.5 py-0.5 rounded shadow">
              Kerb: {proximitySensors.leftKerb}m
            </div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-mono text-sky-300 bg-[#152744]/95 border border-[#224375] px-1.5 py-0.5 rounded shadow">
              Right: {proximitySensors.rightClearance}m
            </div>
          </div>

          {/* Steering Angle Slider Control */}
          <div className="pt-2 border-t border-[#224375]/60 z-10">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-1">
              <span>Predictive Trajectory Angle:</span>
              <span className="text-sky-300 font-bold">{steeringAngle}°</span>
            </div>
            <input
              type="range"
              min="-35"
              max="35"
              value={steeringAngle}
              onChange={(e) => setSteeringAngle(parseInt(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5">
              <span>Full Left (-35°)</span>
              <span>Straight (0°)</span>
              <span>Full Right (+35°)</span>
            </div>
          </div>
        </div>

        {/* Right Viewport (7 cols): Main Live Camera Feeds */}
        <div className="lg:col-span-7 p-4 flex flex-col justify-between relative bg-[#142643]">
          {/* Angle Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#224375]">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: '3d_orbit', label: '3D Surround Orbit' },
                { id: 'front_wide', label: 'Front Wide 180°' },
                { id: 'rear_backup', label: 'Rear Backup View' },
                { id: 'left_kerb', label: 'Left Kerb & Wheel' },
                { id: 'right_blindspot', label: 'Right Blind-Spot' },
                { id: 'transparent_hood', label: 'ClearSight Ground' }
              ].map(angle => (
                <button
                  key={angle.id}
                  onClick={() => setSelectedCameraAngle(angle.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-md transition-all ${
                    selectedCameraAngle === angle.id
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                      : 'bg-[#152744] text-slate-300 hover:text-white hover:bg-[#1a3156] border border-[#224375]'
                  }`}
                >
                  {angle.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-sky-400 font-semibold hidden sm:inline">
              HDR 60 FPS
            </span>
          </div>

          {/* Active Camera View Feed Simulation */}
          <div className={`relative flex-1 my-3 rounded-xl overflow-hidden border border-[#224375] flex items-center justify-center transition-all ${
            nightVisionMode ? 'bg-[#0f2e22] hue-rotate-90' : 'bg-[#112038]'
          }`}>
            {/* Camera feed overlay grid & optical crosshairs */}
            <div className="absolute inset-0 bg-cockpit-grid opacity-30 pointer-events-none" />

            {/* Central Crosshairs */}
            <div className="absolute h-8 w-8 border border-sky-400/40 rounded-full pointer-events-none flex items-center justify-center">
              <div className="h-1 w-1 rounded-full bg-sky-400" />
            </div>

            {/* Specific Angle View Artwork / Telemetry */}
            {selectedCameraAngle === '3d_orbit' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <img
                  src={vehicle.model.toLowerCase().includes('defender') 
                    ? 'public/images/jlr_defender_telematics_1790688221801.jpg' 
                    : 'public/images/jlr_range_rover_hero_1790688206035.jpg'}
                  alt="3D Panoramic Vehicle Orbit"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
                />
                <div className="relative z-10 rounded-xl bg-[#152744]/90 p-4 border border-[#224375] backdrop-blur-md max-w-sm space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300 font-mono flex items-center justify-center gap-1.5">
                    <Compass size={14} className="text-sky-400 animate-spin" />
                    3D Seamless Panoramic Orbit Stream
                  </span>
                  <p className="text-xs text-slate-200">
                    Real-time photometric fusion of all 4 wide-angle lenses around {vehicle.model}. Seamless zero-blindspot perimeter visibility for low-speed maneuvering and off-road rock crawl.
                  </p>
                </div>
              </div>
            )}

            {selectedCameraAngle === 'front_wide' && (
              <div className="relative w-full h-full flex flex-col justify-between p-4">
                <div className="flex justify-between items-center z-10">
                  <span className="rounded bg-[#152744]/90 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-[#224375]">
                    LENS: 180° ULTRA-WIDE FRONT GRILLE
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">CLEAR PATH</span>
                </div>

                {/* Trajectory Guide Overlay */}
                <div className="relative h-48 w-full flex items-center justify-center">
                  <svg className="w-full h-full">
                    <line x1="100" y1="180" x2="160" y2="40" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
                    <line x1="300" y1="180" x2="240" y2="40" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
                    <line x1="145" y1="80" x2="255" y2="80" stroke="#fbbf24" strokeWidth="2" />
                    <line x1="130" y1="120" x2="270" y2="120" stroke="#fbbf24" strokeWidth="2" />
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 z-10">
                  <span>DISTANCE TO CURB: 2.1M</span>
                  <span>JUNCTION VIEW ACTIVE</span>
                </div>
              </div>
            )}

            {selectedCameraAngle === 'rear_backup' && (
              <div className="relative w-full h-full flex flex-col justify-between p-4 bg-gradient-to-t from-red-950/30 to-transparent">
                <div className="flex justify-between items-center z-10">
                  <span className="rounded bg-[#152744]/90 px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-amber-600/40">
                    LENS: REAR BACKUP CAMERA + ACTIVE GUIDELINES
                  </span>
                  <span className="text-[10px] font-mono text-red-400 font-bold animate-pulse">
                    OBSTACLE DETECTED (0.42M)
                  </span>
                </div>

                {/* Reversing Trajectory Tracks */}
                <div className="relative h-48 w-full flex items-center justify-center">
                  <svg className="w-full h-full">
                    <path
                      d={`M 80,180 Q ${160 + steeringAngle * 2},80 ${200 + steeringAngle * 3},20`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3"
                    />
                    <path
                      d={`M 320,180 Q ${240 + steeringAngle * 2},80 ${200 + steeringAngle * 3},20`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3"
                    />
                    {/* Red Stop Bar */}
                    <line x1="110" y1="140" x2="290" y2="140" stroke="#f87171" strokeWidth="4" />
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 z-10">
                  <span>TRAILER HITCH ASSIST: READY</span>
                  <span className="text-red-400 font-bold">BRAKE ASSIST ARMED</span>
                </div>
              </div>
            )}

            {selectedCameraAngle === 'left_kerb' && (
              <div className="relative w-full h-full flex flex-col justify-between p-4">
                <div className="flex justify-between items-center z-10">
                  <span className="rounded bg-[#152744]/90 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-[#224375]">
                    LENS: LEFT DOOR MIRROR (PARALLEL KERB VIEW)
                  </span>
                  <span className="text-[10px] font-mono text-amber-300">WHEEL DISTANCE: 0.35M</span>
                </div>
                <div className="text-center text-xs text-slate-300 font-mono">
                  Guiding 22" Diamond-Turned Alloy Wheel Protection against high stone kerbs
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  AUTO-TILT MIRROR SYNCHRONIZED
                </div>
              </div>
            )}

            {selectedCameraAngle === 'right_blindspot' && (
              <div className="relative w-full h-full flex flex-col justify-between p-4">
                <div className="flex justify-between items-center z-10">
                  <span className="rounded bg-[#152744]/90 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-[#224375]">
                    LENS: RIGHT DOOR MIRROR BLIND-SPOT MONITOR
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">LANE MERGE CLEAR</span>
                </div>
                <div className="text-center text-xs text-slate-300 font-mono">
                  Real-time cyclist and pedestrian detection overlay with high-contrast motion vectors
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  BLIS (BLIND SPOT INFO SYSTEM) ACTIVE
                </div>
              </div>
            )}

            {selectedCameraAngle === 'transparent_hood' && (
              <div className="relative w-full h-full flex flex-col justify-between p-4">
                <div className="flex justify-between items-center z-10">
                  <span className="rounded bg-[#152744]/90 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/40">
                    CLEARSIGHT GROUND VIEW (TRANSPARENT HOOD)
                  </span>
                  <span className="text-[10px] font-mono text-sky-300">TERRAIN: ROCKS & RUTS</span>
                </div>
                <div className="text-center text-xs text-slate-200 font-mono max-w-sm mx-auto bg-[#152744]/90 p-3 rounded-lg border border-[#224375]">
                  Virtual projection reveals terrain directly under vehicle nose and engine bay. Wheel position projected in real-time.
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  ALL-TERRAIN PROGRESS CONTROL (ATPC) LINKED
                </div>
              </div>
            )}

            {/* Lens washing water spray simulation overlay */}
            {lensWashingActive && (
              <div className="absolute inset-0 bg-cyan-400/20 backdrop-blur-xs flex items-center justify-center z-30 animate-pulse">
                <div className="flex items-center gap-2 rounded-xl bg-[#152744]/95 px-4 py-2 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold">
                  <Droplets size={16} className="animate-spin" />
                  HIGH-PRESSURE CAMERA JET CLEANING IN PROGRESS...
                </div>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 pt-2 border-t border-[#224375]">
            <div className="flex items-center gap-4">
              <span>Transmission: <strong className="text-white">REVERSE (R)</strong></span>
              <span>Vehicle Speed: <strong className="text-white">4 km/h</strong></span>
              <span>Ultrasonic Radar: <strong className="text-emerald-400">12 Sensors Active</strong></span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400">Tata Move TCU Bearer:</span>
              <span className="text-sky-400 font-bold">Sub-20ms Video Link</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
