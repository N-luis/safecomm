'use client';

import { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';

type RiskLevel = 'High' | 'Medium' | 'Low';

const LEVEL_COLOR: Record<RiskLevel, string> = {
  High: '#ef4444',
  Medium: '#f97316',
  Low: '#22c55e',
};

// ─── Street nodes, positioned in the map's own coordinate space (520 × 290) ───
// Road centrelines: MacArthur y=71.5 · Biñan 2nd y=151 · Local Ln y=209
//                   San Isidro x=84 · Rizal x=191 · Del Pilar x=305.5

interface Zone {
  id: string; name: string; short: string;
  x: number; y: number;
  level: RiskLevel; incidents: number; desc: string;
  illZoneId: string;
  major: boolean; // major nodes keep a permanent label
}

const ZONES: Zone[] = [
  // ── High ──────────────────────────────────────────────────────────────────
  { id: 'hall',      name: 'Brgy. Hall Corridor',         short: 'Brgy. Hall',      x: 128,   y: 112,  level: 'High',   incidents: 5, illZoneId: 'hall',       major: true,
    desc: 'Highest case concentration — Barangay Hall block fronting Biñan 2nd Road' },
  { id: 'chapel',    name: 'Chapel Junction',             short: 'Chapel',          x: 230,   y: 110,  level: 'High',   incidents: 3, illZoneId: 'chapel',     major: true,
    desc: 'Chapel / Church area — domestic and community dispute hotspot' },

  // ── Medium ────────────────────────────────────────────────────────────────
  { id: 'market',    name: 'MacArthur Commercial Strip',  short: 'Market Strip',    x: 138,   y: 71.5, level: 'Medium', incidents: 2, illZoneId: 'commercial', major: false,
    desc: 'Market stalls along MacArthur Highway — petty crime watch area' },
  { id: 'east-res',  name: 'East Residential Zone',       short: 'East Residential', x: 415,  y: 106,  level: 'Medium', incidents: 2, illZoneId: 'east',       major: true,
    desc: 'East blocks beyond Del Pilar St. — rising trend in blotter reports' },
  { id: 'mac-rizal', name: 'MacArthur × Rizal St.',       short: 'Mac × Rizal',     x: 191,   y: 71.5, level: 'Medium', incidents: 1, illZoneId: 'commercial', major: false,
    desc: 'Mid-MacArthur junction — moderate commercial activity, heavy foot traffic' },
  { id: 'binan-del', name: 'Biñan 2nd × Del Pilar St.',   short: 'Biñan × Del Pilar', x: 305.5, y: 151, level: 'Medium', incidents: 1, illZoneId: 'east',      major: false,
    desc: 'Eastern Biñan 2nd junction — moderate risk, rising trend' },

  // ── Low ───────────────────────────────────────────────────────────────────
  { id: 'mac-san',   name: 'MacArthur × San Isidro St.',  short: 'Mac × San Isidro', x: 84,   y: 71.5, level: 'Low',    incidents: 0, illZoneId: 'west',       major: false,
    desc: 'Northwest corner — quiet start of MacArthur near west residential' },
  { id: 'mac-del',   name: 'MacArthur × Del Pilar St.',   short: 'Mac × Del Pilar', x: 305.5, y: 71.5, level: 'Low',    incidents: 0, illZoneId: 'commercial', major: false,
    desc: 'Northeast MacArthur junction — low activity, stable area' },
  { id: 'binan-san', name: 'Biñan 2nd × San Isidro St.',  short: 'Biñan × San Isidro', x: 84, y: 151,  level: 'Low',    incidents: 1, illZoneId: 'west',       major: false,
    desc: 'West entry of Biñan 2nd Road — low severity, quiet residential block' },
  { id: 'binan-riz', name: 'Biñan 2nd × Rizal St.',       short: 'Biñan × Rizal',   x: 191,   y: 151,  level: 'Low',    incidents: 0, illZoneId: 'hall',       major: false,
    desc: 'Mid Biñan 2nd at Rizal — connects the Hall and Chapel corridors' },
  { id: 'bball',     name: 'Basketball Court Area',       short: 'Basketball Court', x: 134,  y: 182,  level: 'Low',    incidents: 0, illZoneId: 'south',      major: true,
    desc: 'Community court — safe space, low risk, mostly youth activity' },
  { id: 'local-san', name: 'Local Ln × San Isidro St.',   short: 'Local × San Isidro', x: 84, y: 209,  level: 'Low',    incidents: 0, illZoneId: 'south',      major: false,
    desc: 'Southwest Local Lane corner — very quiet residential block' },
  { id: 'south-ctr', name: 'South Quarter Center',        short: 'South Quarter',   x: 240,   y: 248,  level: 'Low',    incidents: 1, illZoneId: 'south',      major: true,
    desc: 'Southern gardens and residential lots — minimal incidents' },
  { id: 'local-del', name: 'Local Ln × Del Pilar St.',    short: 'Local × Del Pilar', x: 305.5, y: 209, level: 'Low',   incidents: 0, illZoneId: 'south',      major: false,
    desc: 'Southeast Local Lane junction — quiet area, no active cases' },
];

// Street segments — intersections run along real road centrelines, landmarks
// hang off them as short access spurs.
const STREETS: [string, string][] = [
  // MacArthur Highway
  ['mac-san', 'market'], ['market', 'mac-rizal'], ['mac-rizal', 'mac-del'],
  // Biñan 2nd Road
  ['binan-san', 'binan-riz'], ['binan-riz', 'binan-del'],
  // Local Lane
  ['local-san', 'local-del'],
  // San Isidro St.
  ['mac-san', 'binan-san'], ['binan-san', 'local-san'],
  // Rizal St.
  ['mac-rizal', 'binan-riz'],
  // Del Pilar St.
  ['mac-del', 'binan-del'], ['binan-del', 'local-del'],
  // Barangay Hall access
  ['binan-san', 'hall'], ['hall', 'binan-riz'], ['market', 'hall'],
  // Chapel access
  ['binan-riz', 'chapel'], ['chapel', 'binan-del'],
  // East residential access
  ['mac-del', 'east-res'], ['binan-del', 'east-res'],
  // South quarter access
  ['local-san', 'bball'], ['south-ctr', 'local-del'],
];

const HEAT_R: Record<RiskLevel, number> = { High: 44, Medium: 32, Low: 20 };
const NODE_R: Record<RiskLevel, number> = { High: 11, Medium: 9, Low: 7 };
const HEAT_OP: Record<RiskLevel, number> = { High: 0.20, Medium: 0.14, Low: 0.09 };

// ─── Base map artwork ────────────────────────────────────────────────────────

const HOUSES: [number, number, number, number][] = [
  [8,8,14,10],[28,8,14,10],[50,8,18,12],[8,28,16,10],[32,28,14,10],[52,28,16,10],[10,46,12,10],[30,46,18,10],[54,46,14,10],
  [96,10,22,12],[124,10,18,12],[148,10,22,12],
  [260,10,14,10],[280,10,14,10],[200,46,14,12],[220,46,14,12],[240,46,14,12],[262,46,14,12],[282,46,14,12],
  [318,8,14,10],[340,8,16,10],[362,8,14,10],[384,8,18,10],[408,8,14,10],
  [318,26,16,10],[344,26,14,10],[364,26,18,10],
  [318,44,14,12],[342,44,16,12],[364,44,14,12],[386,44,18,12],
  [8,86,14,10],[28,86,16,10],[50,86,18,10],[8,104,16,10],[30,104,14,10],[52,104,16,10],
  [8,122,14,15],[30,122,18,15],[54,122,14,15],
  [318,84,16,11],[340,84,18,11],[364,84,16,11],[386,84,20,11],[412,84,16,11],
  [318,102,18,11],[342,102,16,11],[364,102,18,11],[388,102,18,11],
  [318,120,16,17],[340,120,18,17],[364,120,16,17],[386,120,20,17],[412,120,16,17],
  [8,162,14,10],[28,162,16,10],[50,162,18,10],[8,180,60,16],
  [200,162,14,10],[220,162,14,10],[240,162,14,10],[260,162,14,10],[280,162,14,10],
  [200,180,14,14],[222,180,16,14],[242,180,14,14],[260,180,16,14],[282,180,12,14],
  [318,162,16,11],[340,162,18,11],[364,162,16,11],[386,162,18,11],
  [318,180,18,16],[342,180,16,16],[364,180,18,16],[388,180,16,16],
  [58,220,22,25],[88,220,18,22],[115,220,22,25],[145,220,18,20],
  [270,220,22,22],[300,220,18,22],[358,220,22,22],[388,220,18,22],
];

const SHOPS: [number, number, number, number][] = [
  [94,48,20,14],[118,48,20,14],[142,48,20,14],[166,48,14,14],
];

const TREES: [number, number][] = [
  [74,58],[72,78],[66,100],[76,125],[181,90],[177,110],[179,132],
  [294,85],[296,110],[292,132],[180,158],[296,163],[74,162],[183,215],
  [298,215],[78,215],[10,215],[500,40],[500,100],[500,160],[448,215],
];

const GARDENS: [number, number, number, number][] = [
  [10,220,40,55],[200,220,60,55],[320,220,28,55],[415,220,28,55],
];

interface IllZone {
  id: string; label: string; level: RiskLevel; incidents: number;
  x: number; y: number; w: number; h: number; detail: string;
}

const ILL_ZONES: IllZone[] = [
  { id:'hall',       label:'Civic Center (Brgy. Hall)',   level:'High',   incidents:5, x:90,  y:80,  w:95,  h:65,  detail:'Barangay Hall corridor — highest concentration of blotter cases' },
  { id:'chapel',     label:'Chapel / Church Area',        level:'High',   incidents:3, x:197, y:80,  w:103, h:65,  detail:'Chapel area — domestic and community dispute hotspot' },
  { id:'commercial', label:'MacArthur Commercial Strip',  level:'Medium', incidents:2, x:90,  y:0,   w:210, h:65,  detail:'Commercial district along MacArthur Highway, petty crime watch area' },
  { id:'east',       label:'East Residential Zone',       level:'Medium', incidents:2, x:311, y:0,   w:209, h:213, detail:'East blocks — moderate risk, rising trend in reports' },
  { id:'south',      label:'South Quarter',               level:'Low',    incidents:1, x:0,   y:213, w:520, h:77,  detail:'Southern gardens and residential lots — minimal incidents' },
  { id:'west',       label:'West Residential',            level:'Low',    incidents:1, x:0,   y:80,  w:78,  h:133, detail:'West blocks — quiet zone, low severity' },
];

// ─── Component ───────────────────────────────────────────────────────────────

interface RiskHeatMapProps {
  title?: string;
  contextLabel?: string;
  accent?: string;
}

export default function RiskHeatMap({
  title        = 'Biñan 2nd, Bocaue — Street Risk Heatmap',
  contextLabel = 'Geographic view',
  accent       = '#1d4ed8',
}: RiskHeatMapProps = {}) {
  const [filter, setFilter]           = useState<RiskLevel | 'All'>('All');
  const [hovered, setHovered]         = useState<Zone | null>(null);
  const [hoveredArea, setHoveredArea] = useState<IllZone | null>(null);
  const [selected, setSelected]       = useState<string | null>(null);

  const zoneMap = Object.fromEntries(ZONES.map(z => [z.id, z]));
  const visible = (z: Zone) => filter === 'All' || z.level === filter;

  const counts: Record<RiskLevel, number> = {
    High:   ZONES.filter(z => z.level === 'High').length,
    Medium: ZONES.filter(z => z.level === 'Medium').length,
    Low:    ZONES.filter(z => z.level === 'Low').length,
  };

  const selectedNode = selected ? zoneMap[selected] ?? null : null;
  const pinnedArea   = selectedNode
    ? ILL_ZONES.find(a => a.id === selectedNode.illZoneId) ?? null
    : null;

  // Info panel: hovered node → hovered area → selected node → empty
  const panel =
    hovered
      ? { color: LEVEL_COLOR[hovered.level], title: hovered.name, level: hovered.level,
          incidents: hovered.incidents, desc: hovered.desc, tag: 'Street node' }
      : hoveredArea
        ? { color: LEVEL_COLOR[hoveredArea.level], title: hoveredArea.label, level: hoveredArea.level,
            incidents: hoveredArea.incidents, desc: hoveredArea.detail, tag: 'Area' }
        : selectedNode
          ? { color: LEVEL_COLOR[selectedNode.level], title: selectedNode.name, level: selectedNode.level,
              incidents: selectedNode.incidents, desc: selectedNode.desc, tag: 'Pinned' }
          : null;

  const filters: { label: RiskLevel | 'All'; color: string }[] = [
    { label: 'All',    color: '#0c1e46' },
    { label: 'High',   color: '#ef4444' },
    { label: 'Medium', color: '#f97316' },
    { label: 'Low',    color: '#22c55e' },
  ];

  return (
    <Box>
      {/* ── Filter chips ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {filters.map(f => {
            const active = filter === f.label;
            const count = f.label === 'All' ? ZONES.length : counts[f.label as RiskLevel];
            return (
              <Chip
                key={f.label}
                label={`${f.label} (${count})`}
                onClick={() => setFilter(f.label)}
                size="small"
                sx={{
                  fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer',
                  bgcolor: active ? `${f.color}18` : '#f8fafc',
                  color:   active ? f.color : '#64748b',
                  border:  `1.5px solid ${active ? f.color : '#e8edf2'}`,
                  '&:hover': { bgcolor: `${f.color}14` }, transition: 'all 0.15s',
                }}
              />
            );
          })}
        </Box>
        <Typography sx={{ fontSize: '0.67rem', color: '#94a3b8', fontStyle: 'italic', ml: 'auto' }}>
          Hover a node or block · click a node to pin its zone
        </Typography>
      </Box>

      {/* ── Combined map ── */}
      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', border: '1px solid #e8edf2', bgcolor: '#fff' }}>
        {/* Header bar */}
        <Box sx={{
          px: 1.75, py: 1, borderBottom: '1px solid #eef2f6',
          display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap',
        }}>
          <Typography sx={{
            fontSize: '0.7rem', color: '#0c1e46', fontWeight: 800,
            letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            {title}
          </Typography>
          <Chip label={contextLabel} size="small"
            sx={{ bgcolor: `${accent}14`, color: accent, fontWeight: 700, fontSize: '0.6rem', height: 18 }} />
          {pinnedArea && (
            <Chip label={`● ${pinnedArea.label}`} size="small"
              sx={{
                bgcolor: `${LEVEL_COLOR[pinnedArea.level]}18`, color: LEVEL_COLOR[pinnedArea.level],
                fontWeight: 700, fontSize: '0.6rem', height: 18,
                animation: 'fadeIn 0.3s ease',
                '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
              }} />
          )}
          <Typography sx={{ fontSize: '0.63rem', color: '#94a3b8', ml: 'auto' }}>
            {ZONES.reduce((s, z) => s + z.incidents, 0)} incidents · {ZONES.length} monitored points
          </Typography>
        </Box>

        <Box sx={{ bgcolor: '#faf6ef' }}>
          <svg viewBox="0 0 520 290" width="100%" style={{ display: 'block' }}
            aria-label="Biñan 2nd, Bocaue street-level risk heatmap over area map">
            <defs>
              <filter id="rh-h"><feGaussianBlur stdDeviation="15" /></filter>
              <filter id="rh-m"><feGaussianBlur stdDeviation="11" /></filter>
              <filter id="rh-l"><feGaussianBlur stdDeviation="7"  /></filter>
              <pattern id="rh-dots" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="9" cy="9" r="0.7" fill="#ddd5c0" />
              </pattern>
            </defs>

            <rect width="520" height="290" fill="#faf6ef" />
            <rect width="520" height="290" fill="url(#rh-dots)" />

            {/* ── Block fills ── */}
            <rect x="0"   y="0"   width="78"  height="65"  fill="#f5f0e4" />
            <rect x="90"  y="0"   width="95"  height="65"  fill="#f2ede0" />
            <rect x="197" y="0"   width="103" height="65"  fill="#f5f0e4" />
            <rect x="311" y="0"   width="209" height="65"  fill="#f5f0e4" />
            <rect x="0"   y="80"  width="78"  height="65"  fill="#f5f0e4" />
            <rect x="90"  y="80"  width="95"  height="65"  fill="#eff6ff" />
            <rect x="197" y="80"  width="103" height="65"  fill="#fdf2f8" />
            <rect x="311" y="80"  width="209" height="65"  fill="#f5f0e4" />
            <rect x="0"   y="157" width="78"  height="48"  fill="#f5f0e4" />
            <rect x="90"  y="157" width="95"  height="48"  fill="#fffbeb" />
            <rect x="197" y="157" width="103" height="48"  fill="#f5f0e4" />
            <rect x="311" y="157" width="209" height="48"  fill="#f5f0e4" />
            <rect x="0"   y="213" width="520" height="77"  fill="#f0f7ee" />

            {/* ── Risk heat, generated from the street nodes ── */}
            {ZONES.map(z => {
              const vis = visible(z);
              const op  = vis ? (filter === 'All' ? HEAT_OP[z.level] : HEAT_OP[z.level] * 1.6) : 0.015;
              const fid = z.level === 'High' ? 'rh-h' : z.level === 'Medium' ? 'rh-m' : 'rh-l';
              return (
                <circle key={`blob-${z.id}`} cx={z.x} cy={z.y} r={HEAT_R[z.level]}
                  fill={LEVEL_COLOR[z.level]} opacity={op} filter={`url(#${fid})`} />
              );
            })}

            {/* ── Roads ── */}
            <rect x="0" y="63" width="520" height="17" fill="#bdb5a4" />
            <rect x="0" y="62" width="520" height="3"  fill="#cec6b5" />
            <rect x="0" y="78" width="520" height="3"  fill="#cec6b5" />
            <line x1="0" y1="71.5" x2="520" y2="71.5" stroke="#f0c040" strokeWidth="1.5" strokeDasharray="16,10" />
            <rect x="0" y="145" width="520" height="12" fill="#cdc5b4" />
            <line x1="0" y1="151" x2="520" y2="151" stroke="white" strokeWidth="1" strokeDasharray="8,6" opacity="0.55" />
            <rect x="0" y="205" width="520" height="8" fill="#d4ccbb" />
            <rect x="78"  y="0" width="12" height="290" fill="#cdc5b4" />
            <rect x="185" y="0" width="12" height="290" fill="#cdc5b4" />
            <rect x="300" y="0" width="11" height="290" fill="#cdc5b4" />

            {/* ── Gardens ── */}
            {GARDENS.map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx={3} fill="#c6f0c2" stroke="#a3d9a3" strokeWidth={0.7} />
            ))}

            {/* ── Buildings ── */}
            {HOUSES.map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
            ))}
            {SHOPS.map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx={1} fill="#c8efc8" stroke="#96d496" strokeWidth={0.8} />
            ))}
            <text x="138" y="42" textAnchor="middle" fontSize={6} fill="#2d7a2d" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Market</text>

            {/* School */}
            <rect x="207" y="8" width="46" height="30" rx={2} fill="#fde68a" stroke="#d97706" strokeWidth={1.2} />
            <text x="230" y="21" textAnchor="middle" fontSize={7} fill="#92400e" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">School</text>
            <text x="230" y="31" textAnchor="middle" fontSize={5.5} fill="#b45309" fontFamily="Inter,system-ui,sans-serif">Elem.</text>

            {/* Barangay Hall */}
            <rect x="97" y="84" width="62" height="44" rx={2} fill="#bfdbfe" stroke="#3b82f6" strokeWidth={1.5} />
            <line x1="128" y1="82" x2="128" y2="68" stroke="#475569" strokeWidth={1.5} />
            <rect x="128" y="68" width="11" height="7" rx={1} fill="#3b82f6" opacity={0.85} />
            <rect x="94" y="82" width="67" height="48" rx={3} fill="none" stroke="#93c5fd" strokeWidth={0.9} strokeDasharray="3,2" />
            <rect x="165" y="84"  width="12" height={10} rx={1} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.5} />
            <rect x="165" y="100" width="14" height={10} rx={1} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.5} />
            <rect x="165" y="116" width="12" height={14} rx={1} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.5} />

            {/* Chapel */}
            <rect x="210" y="82" width="40" height="46" rx={2} fill="#fce7f3" stroke="#ec4899" strokeWidth={1.2} />
            <line x1="230" y1="74" x2="230" y2="90" stroke="#be185d" strokeWidth={2.5} />
            <line x1="223" y1="80" x2="237" y2="80" stroke="#be185d" strokeWidth={2.5} />
            <rect x="258" y="84"  width="16" height={11} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
            <rect x="258" y="100" width="16" height={11} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
            <rect x="258" y="115" width="16" height={14} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
            <rect x="278" y="84"  width="14" height={11} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
            <rect x="278" y="100" width="14" height={11} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
            <rect x="278" y="115" width="14" height={14} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />

            {/* Basketball court */}
            <rect x="97" y="162" width="74" height="40" rx={2} fill="#fffbeb" stroke="#f59e0b" strokeWidth={1.5} />
            <rect x="101" y="166" width="66" height="32" rx={1} fill="#fef9e7" />
            <ellipse cx="134" cy="182" rx={12} ry={10} fill="none" stroke="#f59e0b" strokeWidth={1} />
            <rect x="101" y="172" width={8} height={20} fill="none" stroke="#f59e0b" strokeWidth={0.8} />
            <rect x="159" y="172" width={8} height={20} fill="none" stroke="#f59e0b" strokeWidth={0.8} />

            {/* Trees */}
            {TREES.map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={5.5} fill="#6ee7b7" opacity={0.85} />
                <circle cx={cx} cy={cy} r={3.5} fill="#34d399" opacity={0.7} />
              </g>
            ))}

            {/* ── Street name labels ── */}
            <text x="260" y="59" textAnchor="middle" fontSize={9} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">MacArthur Highway</text>
            <text x="260" y="141" textAnchor="middle" fontSize={7.5} fill="#4b5563" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Biñan 2nd Road</text>
            <text x="260" y="202" textAnchor="middle" fontSize={6.5} fill="#6b7280" fontFamily="Inter,system-ui,sans-serif">Local Lane</text>
            <text x="84" y="28" textAnchor="middle" fontSize={6} fill="#6b7280" fontFamily="Inter,system-ui,sans-serif" transform="rotate(-90,84,28)">San Isidro St.</text>
            <text x="191" y="28" textAnchor="middle" fontSize={6} fill="#6b7280" fontFamily="Inter,system-ui,sans-serif" transform="rotate(-90,191,28)">Rizal St.</text>
            <text x="305" y="28" textAnchor="middle" fontSize={6} fill="#6b7280" fontFamily="Inter,system-ui,sans-serif" transform="rotate(-90,305,28)">Del Pilar St.</text>

            {/* ── Area hover targets (under the network so nodes win) ── */}
            {ILL_ZONES.map(a => {
              const isHov = hoveredArea?.id === a.id;
              const isPin = pinnedArea?.id === a.id;
              return (
                <rect key={a.id} x={a.x} y={a.y} width={a.w} height={a.h}
                  fill="transparent"
                  stroke={(isHov || isPin) ? LEVEL_COLOR[a.level] : 'transparent'}
                  strokeWidth={isHov ? 2.5 : 0}
                  rx={3} style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredArea(a)}
                  onMouseLeave={() => setHoveredArea(null)}
                />
              );
            })}

            {/* ── Pinned area highlight ── */}
            {pinnedArea && (
              <rect x={pinnedArea.x} y={pinnedArea.y} width={pinnedArea.w} height={pinnedArea.h}
                fill={`${LEVEL_COLOR[pinnedArea.level]}14`}
                stroke={LEVEL_COLOR[pinnedArea.level]} strokeWidth={2.5} rx={3}
                style={{ pointerEvents: 'none' }}>
                <animate attributeName="stroke-opacity" values="1;0.35;1" dur="1.8s" repeatCount="indefinite" />
              </rect>
            )}

            {/* ── Risk-coloured street segments ── */}
            {STREETS.map(([a, b]) => {
              const zA = zoneMap[a]; const zB = zoneMap[b];
              if (!zA || !zB) return null;
              if (!visible(zA) && !visible(zB)) return null;
              const lvl: RiskLevel = [zA.level, zB.level].includes('High') ? 'High'
                : [zA.level, zB.level].includes('Medium') ? 'Medium' : 'Low';
              const w = lvl === 'High' ? 4.5 : lvl === 'Medium' ? 3.4 : 2.4;
              const isSel = selected === zA.id || selected === zB.id;
              return (
                <line key={`edge-${a}-${b}`} x1={zA.x} y1={zA.y} x2={zB.x} y2={zB.y}
                  stroke={LEVEL_COLOR[lvl]} strokeWidth={isSel ? w + 1.8 : w}
                  strokeLinecap="round" opacity={isSel ? 0.85 : 0.55}
                  style={{ pointerEvents: 'none' }} />
              );
            })}

            {/* ── High-risk pulse rings ── */}
            {ZONES.filter(z => z.level === 'High' && visible(z)).map(z => (
              <circle key={`pulse-${z.id}`} cx={z.x} cy={z.y} r={NODE_R.High}
                fill="none" stroke={LEVEL_COLOR.High} strokeWidth={2} opacity={0}
                style={{ pointerEvents: 'none' }}>
                <animate attributeName="r" values={`${NODE_R.High};${NODE_R.High + 17};${NODE_R.High}`} dur="2.3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.55;0;0.55" dur="2.3s" repeatCount="indefinite" />
              </circle>
            ))}

            {/* ── Selected node ring ── */}
            {selectedNode && (
              <circle cx={selectedNode.x} cy={selectedNode.y} r={NODE_R[selectedNode.level] + 7}
                fill="none" stroke={LEVEL_COLOR[selectedNode.level]} strokeWidth={2.5}
                opacity={0.75} style={{ pointerEvents: 'none' }}>
                <animate attributeName="stroke-opacity" values="0.75;0.2;0.75" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}

            {/* ── Street nodes ── */}
            {ZONES.map(z => {
              const vis   = visible(z);
              const isHov = hovered?.id === z.id;
              const isSel = selected === z.id;
              const r     = NODE_R[z.level] + (isHov || isSel ? 2 : 0);
              const showLabel = vis && (z.major || isHov || isSel);
              return (
                <g key={z.id} style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(z)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(prev => prev === z.id ? null : z.id)}>
                  <circle cx={z.x} cy={z.y} r={NODE_R[z.level] + 9} fill="transparent" />
                  <circle cx={z.x} cy={z.y} r={r}
                    fill={vis ? LEVEL_COLOR[z.level] : '#cbd5e1'}
                    stroke="white" strokeWidth={isSel ? 3 : 2.2}
                    opacity={vis ? 1 : 0.25} />
                  {vis && z.incidents >= 1 && NODE_R[z.level] >= 9 && (
                    <text x={z.x} y={z.y + 3.2} textAnchor="middle" fontSize={8} fill="white"
                      fontFamily="Inter,system-ui,sans-serif" fontWeight="700"
                      style={{ pointerEvents: 'none' }}>
                      {z.incidents}
                    </text>
                  )}
                  {showLabel && (
                    <text x={z.x} y={z.y + NODE_R[z.level] + 11} textAnchor="middle" fontSize={7}
                      fontFamily="Inter,system-ui,sans-serif"
                      fontWeight={isHov || isSel ? 700 : 600}
                      fill={isHov || isSel ? '#0c1e46' : '#334155'}
                      stroke="#faf6ef" strokeWidth={3} paintOrder="stroke" strokeLinejoin="round"
                      style={{ pointerEvents: 'none' }}>
                      {z.short}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Hover ring */}
            {hovered && hovered.id !== selected && (
              <circle cx={hovered.x} cy={hovered.y} r={NODE_R[hovered.level] + 5}
                fill="none" stroke={LEVEL_COLOR[hovered.level]} strokeWidth={2} opacity={0.5}
                style={{ pointerEvents: 'none' }} />
            )}

            {/* ── North arrow ── */}
            <g transform="translate(499,18)" style={{ pointerEvents: 'none' }}>
              <circle r={13} fill="white" stroke="#e2e8f0" strokeWidth={0.8} />
              <text y={4} textAnchor="middle" fontSize={7.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">N</text>
              <polygon points="0,-10 2.5,-2 0,-6 -2.5,-2" fill="#0c1e46" />
            </g>

            {/* ── Legend ── */}
            <g style={{ pointerEvents: 'none' }}>
              <rect x="6" y="265" width="150" height="20" rx={4} fill="rgba(255,255,255,0.92)" stroke="#e8edf2" strokeWidth={0.7} />
              <circle cx="18" cy="275" r={4} fill="#ef4444" />
              <text x="26" y="278.5" fontSize={6.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">High</text>
              <circle cx="55" cy="275" r={4} fill="#f97316" />
              <text x="63" y="278.5" fontSize={6.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Medium</text>
              <circle cx="110" cy="275" r={4} fill="#22c55e" />
              <text x="118" y="278.5" fontSize={6.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Low</text>
            </g>
          </svg>
        </Box>
      </Box>

      {/* ── Info panel ── */}
      <Box sx={{
        mt: 1.25, minHeight: 48, borderRadius: 2,
        border: `1px solid ${panel ? `${panel.color}40` : '#f1f5f9'}`,
        bgcolor: panel ? `${panel.color}06` : '#fafbfc',
        px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1.5, transition: 'all 0.15s',
      }}>
        {panel ? (
          <>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: panel.color, flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.15, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0c1e46' }}>{panel.title}</Typography>
                <Chip label={`${panel.level} Risk`} size="small"
                  sx={{ bgcolor: `${panel.color}18`, color: panel.color, fontWeight: 700, fontSize: '0.62rem', height: 18 }} />
                {panel.incidents > 0 && (
                  <Chip label={`${panel.incidents} incident${panel.incidents !== 1 ? 's' : ''}`} size="small"
                    sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '0.62rem', height: 18 }} />
                )}
                <Chip label={panel.tag} size="small"
                  sx={{ bgcolor: '#f8fafc', color: '#94a3b8', fontSize: '0.6rem', height: 18, fontWeight: 600 }} />
              </Box>
              <Typography sx={{ fontSize: '0.73rem', color: '#64748b' }}>{panel.desc}</Typography>
            </Box>
          </>
        ) : (
          <Typography sx={{ fontSize: '0.73rem', color: '#94a3b8', fontStyle: 'italic' }}>
            Hover a street node for incident detail, or a city block for area context · click a node to pin it
          </Typography>
        )}
      </Box>

      {/* ── Summary chips ── */}
      <Box sx={{ display: 'flex', gap: 0.75, mt: 1.5, flexWrap: 'wrap' }}>
        {(['High', 'Medium', 'Low'] as RiskLevel[]).map(lv => {
          const names = ZONES.filter(z => z.level === lv).map(z => z.short);
          return (
            <Chip key={lv} label={`${lv}: ${names.join(' · ')}`} size="small"
              sx={{
                bgcolor: `${LEVEL_COLOR[lv]}12`, color: LEVEL_COLOR[lv],
                fontWeight: 600, fontSize: '0.63rem', height: 'auto', py: 0.3,
                '& .MuiChip-label': { whiteSpace: 'normal', lineHeight: 1.5 },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
