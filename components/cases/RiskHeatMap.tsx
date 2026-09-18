'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';

type RiskLevel = 'High' | 'Medium' | 'Low';

const LEVEL_COLOR: Record<RiskLevel, string> = {
  High: '#ef4444',
  Medium: '#f97316',
  Low: '#22c55e',
};

// ─── Biñan 2nd street-level nodes ────────────────────────────────────────────

interface Zone {
  id: string; name: string; x: number; y: number;
  level: RiskLevel; incidents: number; desc: string;
  illZoneId?: string; // links to ILL_ZONES for illustration highlight
}

// Incident counts match ILL_ZONES: hall(5) chapel(3) commercial(2) east(2) south(1) west(1)
const ZONES: Zone[] = [
  // ── High ──────────────────────────────────────────────────────────────────
  { id: 'hall',      name: 'Brgy. Hall Corridor',        x: 148, y: 128, level: 'High',   incidents: 5, illZoneId: 'hall',       desc: 'Highest case concentration — Hall & surrounding block on Biñan 2nd Road' },
  { id: 'chapel',    name: 'Chapel Junction',             x: 270, y: 128, level: 'High',   incidents: 3, illZoneId: 'chapel',     desc: 'Chapel / Church area — domestic and community dispute hotspot' },
  // ── Medium ────────────────────────────────────────────────────────────────
  { id: 'market',    name: 'MacArthur Commercial Strip',  x: 148, y: 55,  level: 'Medium', incidents: 2, illZoneId: 'commercial', desc: 'Market stalls along MacArthur Hwy — petty crime watch area' },
  { id: 'east-res',  name: 'East Residential Zone',       x: 435, y: 128, level: 'Medium', incidents: 2, illZoneId: 'east',       desc: 'East blocks along Del Pilar St. — rising trend in blotter reports' },
  { id: 'mac-rizal', name: 'MacArthur × Rizal St.',       x: 210, y: 80,  level: 'Medium', incidents: 1, illZoneId: 'commercial', desc: 'Mid-MacArthur junction — moderate commercial activity, active foot traffic' },
  { id: 'binan-del', name: 'Biñan 2nd × Del Pilar St.',  x: 332, y: 162, level: 'Medium', incidents: 1, illZoneId: 'east',       desc: 'Eastern Biñan 2nd junction — moderate risk, rising trend' },
  // ── Low ───────────────────────────────────────────────────────────────────
  { id: 'mac-san',   name: 'MacArthur × San Isidro St.', x: 80,  y: 80,  level: 'Low',    incidents: 0, illZoneId: 'west',       desc: 'Northwest corner — quiet start of MacArthur near west residential' },
  { id: 'mac-del',   name: 'MacArthur × Del Pilar St.',  x: 332, y: 80,  level: 'Low',    incidents: 0, illZoneId: 'commercial', desc: 'Northeast MacArthur junction — low activity, stable area' },
  { id: 'binan-san', name: 'Biñan 2nd × San Isidro St.', x: 80,  y: 162, level: 'Low',    incidents: 1, illZoneId: 'west',       desc: 'West entry of Biñan 2nd Road — low severity, quiet residential block' },
  { id: 'binan-riz', name: 'Biñan 2nd × Rizal St.',      x: 210, y: 162, level: 'Low',    incidents: 0, illZoneId: 'hall',       desc: 'Mid Biñan 2nd at Rizal — connects Hall and Chapel corridors' },
  { id: 'bball',     name: 'Basketball Court Area',       x: 148, y: 215, level: 'Low',    incidents: 0, illZoneId: 'south',      desc: 'Community court — safe space, low risk, mostly youth activity' },
  { id: 'local-san', name: 'Local Ln × San Isidro St.',  x: 80,  y: 252, level: 'Low',    incidents: 0, illZoneId: 'south',      desc: 'Southwest Local Lane corner — very quiet residential block' },
  { id: 'south-ctr', name: 'South Quarter Center',        x: 228, y: 252, level: 'Low',    incidents: 1, illZoneId: 'south',      desc: 'Southern gardens and residential lots — minimal incidents' },
  { id: 'local-del', name: 'Local Ln × Del Pilar St.',   x: 380, y: 252, level: 'Low',    incidents: 0, illZoneId: 'south',      desc: 'Southeast Local Lane junction — quiet area, no active cases' },
];

// Street segment edges (road connections between nodes)
const STREETS: [string, string][] = [
  // MacArthur Highway (top horizontal)
  ['mac-san', 'market'], ['market', 'mac-rizal'], ['mac-rizal', 'mac-del'],
  // Biñan 2nd Road (middle horizontal)
  ['binan-san', 'hall'], ['hall', 'binan-riz'], ['binan-riz', 'chapel'], ['chapel', 'binan-del'], ['binan-del', 'east-res'],
  // Local Lane (bottom horizontal)
  ['local-san', 'bball'], ['bball', 'south-ctr'], ['south-ctr', 'local-del'],
  // San Isidro St. (left vertical)
  ['mac-san', 'binan-san'], ['binan-san', 'local-san'],
  // Interior access lane (Hall area, between San Isidro and Rizal)
  ['market', 'hall'],
  // Rizal St. (middle vertical)
  ['mac-rizal', 'binan-riz'],
  // Del Pilar St. (right vertical)
  ['mac-del', 'binan-del'], ['binan-del', 'local-del'],
  // East side access
  ['mac-del', 'east-res'],
];

const HEAT_R: Record<RiskLevel, number> = { High: 52, Medium: 40, Low: 26 };
const NODE_R: Record<RiskLevel, number> = { High: 13, Medium: 10, Low: 8 };

// ─── Biñan 2nd illustration data ─────────────────────────────────────────────

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
  { id:'hall',       label:'Civic Center (Brgy. Hall)', level:'High',   incidents:5, x:90,  y:80,  w:95,  h:65,  detail:'Barangay Hall corridor — highest concentration of blotter cases' },
  { id:'chapel',     label:'Chapel / Church Area',      level:'High',   incidents:3, x:197, y:80,  w:103, h:65,  detail:'Chapel area — domestic and community dispute hotspot' },
  { id:'commercial', label:'MacArthur Commercial Strip', level:'Medium', incidents:2, x:90,  y:0,   w:210, h:65,  detail:'Commercial district along MacArthur Highway, petty crime watch area' },
  { id:'east',       label:'East Residential Zone',     level:'Medium', incidents:2, x:311, y:0,   w:209, h:213, detail:'East blocks — moderate risk, rising trend in reports' },
  { id:'south',      label:'South Quarter',             level:'Low',    incidents:1, x:0,   y:213, w:520, h:77,  detail:'Southern gardens and residential lots — minimal incidents' },
  { id:'west',       label:'West Residential',          level:'Low',    incidents:1, x:0,   y:80,  w:78,  h:133, detail:'West blocks — quiet zone, low severity' },
];

// ─── Biñan 2nd illustration sub-component ────────────────────────────────────

function BinanIllustration({ activeIllZoneId }: { activeIllZoneId: string | null }) {
  const [hoveredZone, setHoveredZone] = useState<IllZone | null>(null);

  const pinnedZone = activeIllZoneId
    ? ILL_ZONES.find(z => z.id === activeIllZoneId) ?? null
    : null;
  const displayZone = hoveredZone ?? pinnedZone;
  const isPinnedVisible = pinnedZone !== null && hoveredZone === null;

  return (
    <Box sx={{
      border: `2px solid ${pinnedZone ? `${LEVEL_COLOR[pinnedZone.level]}88` : 'transparent'}`,
      borderRadius: 2.5,
      transition: 'border-color 0.35s, box-shadow 0.35s',
      boxShadow: pinnedZone ? `0 0 0 5px ${LEVEL_COLOR[pinnedZone.level]}10` : 'none',
    }}>
      {pinnedZone && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75, px: 0.25 }}>
          <Box sx={{
            width: 7, height: 7, borderRadius: '50%', bgcolor: LEVEL_COLOR[pinnedZone.level], flexShrink: 0,
            animation: 'pulse 1.8s ease-in-out infinite',
            '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.35 } },
          }} />
          <Typography sx={{ fontSize: '0.67rem', color: LEVEL_COLOR[pinnedZone.level], fontWeight: 700, letterSpacing: '0.02em' }}>
            Linked from street network — {pinnedZone.label} highlighted below
          </Typography>
        </Box>
      )}

      <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e8edf2', bgcolor: '#faf6ef', position: 'relative' }}>
        <svg viewBox="0 0 520 290" width="100%" style={{ display: 'block' }}
          aria-label="Biñan 2nd, Bocaue, Bulacan area illustration">
          <defs>
            <filter id="bn-h"><feGaussianBlur stdDeviation="15" /></filter>
            <filter id="bn-m"><feGaussianBlur stdDeviation="11" /></filter>
            <filter id="bn-l"><feGaussianBlur stdDeviation="7"  /></filter>
            <pattern id="bn-dots" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="9" cy="9" r="0.7" fill="#ddd5c0" />
            </pattern>
          </defs>

          <rect width="520" height="290" fill="#faf6ef" />
          <rect width="520" height="290" fill="url(#bn-dots)" />

          {/* ── Risk heat blobs ── */}
          <circle cx="137" cy="112" r="76" fill="#ef4444" opacity="0.17" filter="url(#bn-h)" />
          <circle cx="248" cy="112" r="64" fill="#ef4444" opacity="0.15" filter="url(#bn-h)" />
          <circle cx="138" cy="32"  r="52" fill="#f97316" opacity="0.12" filter="url(#bn-m)" />
          <circle cx="415" cy="112" r="70" fill="#f97316" opacity="0.11" filter="url(#bn-m)" />
          <circle cx="260" cy="252" r="72" fill="#22c55e" opacity="0.10" filter="url(#bn-l)" />
          <circle cx="39"  cy="112" r="48" fill="#22c55e" opacity="0.09" filter="url(#bn-l)" />

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

          {/* ── Active zone highlight (pinned from network) ── */}
          {ILL_ZONES.map(z => {
            const isPinned = pinnedZone?.id === z.id;
            if (!isPinned) return null;
            return (
              <rect key={`pin-${z.id}`} x={z.x} y={z.y} width={z.w} height={z.h}
                fill={`${LEVEL_COLOR[z.level]}20`}
                stroke={LEVEL_COLOR[z.level]} strokeWidth={2.5} rx={3}
                style={{ pointerEvents: 'none' }}>
                <animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
              </rect>
            );
          })}

          {/* ── Gardens ── */}
          {GARDENS.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx={3} fill="#c6f0c2" stroke="#a3d9a3" strokeWidth={0.7} />
          ))}

          {/* ── Regular buildings ── */}
          {HOUSES.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
          ))}

          {/* ── Shops ── */}
          {SHOPS.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx={1} fill="#c8efc8" stroke="#96d496" strokeWidth={0.8} />
          ))}
          <text x="138" y="42" textAnchor="middle" fontSize={6} fill="#2d7a2d" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Market</text>

          {/* ── School ── */}
          <rect x="207" y="8" width="46" height="30" rx={2} fill="#fde68a" stroke="#d97706" strokeWidth={1.2} />
          <text x="230" y="21" textAnchor="middle" fontSize={7} fill="#92400e" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">School</text>
          <text x="230" y="31" textAnchor="middle" fontSize={5.5} fill="#b45309" fontFamily="Inter,system-ui,sans-serif">Elem.</text>

          {/* ── Barangay Hall ── */}
          <rect x="97" y="84" width="62" height="44" rx={2} fill="#bfdbfe" stroke="#3b82f6" strokeWidth={1.5} />
          <line x1="128" y1="82" x2="128" y2="68" stroke="#475569" strokeWidth={1.5} />
          <rect x="128" y="68" width="11" height="7" rx={1} fill="#3b82f6" opacity={0.85} />
          <rect x="112" y="127" width="32" height={4} rx={1} fill="#93c5fd" />
          <text x="128" y="102" textAnchor="middle" fontSize={7.5} fill="#1d4ed8" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">Brgy.</text>
          <text x="128" y="113" textAnchor="middle" fontSize={7.5} fill="#1d4ed8" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">Hall</text>
          <rect x="94" y="82" width="67" height="48" rx={3} fill="none" stroke="#93c5fd" strokeWidth={0.9} strokeDasharray="3,2" />
          <rect x="165" y="84"  width="12" height={10} rx={1} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.5} />
          <rect x="165" y="100" width="14" height={10} rx={1} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.5} />
          <rect x="165" y="116" width="12" height={14} rx={1} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.5} />

          {/* ── Chapel ── */}
          <rect x="210" y="82" width="40" height="46" rx={2} fill="#fce7f3" stroke="#ec4899" strokeWidth={1.2} />
          <line x1="230" y1="74" x2="230" y2="90" stroke="#be185d" strokeWidth={2.5} />
          <line x1="223" y1="80" x2="237" y2="80" stroke="#be185d" strokeWidth={2.5} />
          <rect x="224" y="114" width="12" height={14} rx={6} fill="#f9a8d4" stroke="#ec4899" strokeWidth={0.8} />
          <text x="230" y="106" textAnchor="middle" fontSize={7} fill="#9d174d" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">Chapel</text>
          <rect x="258" y="84"  width="16" height={11} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
          <rect x="258" y="100" width="16" height={11} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
          <rect x="258" y="115" width="16" height={14} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
          <rect x="278" y="84"  width="14" height={11} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
          <rect x="278" y="100" width="14" height={11} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />
          <rect x="278" y="115" width="14" height={14} rx={1} fill="#ddd4b8" stroke="#c6bc9e" strokeWidth={0.5} />

          {/* ── Basketball Court ── */}
          <rect x="97" y="162" width="74" height="40" rx={2} fill="#fffbeb" stroke="#f59e0b" strokeWidth={1.5} />
          <rect x="101" y="166" width="66" height="32" rx={1} fill="#fef9e7" />
          <ellipse cx="134" cy="182" rx={12} ry={10} fill="none" stroke="#f59e0b" strokeWidth={1} />
          <line x1="134" y1="166" x2="134" y2="198" stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="2,2" />
          <rect x="101" y="172" width={8} height={20} fill="none" stroke="#f59e0b" strokeWidth={0.8} />
          <rect x="159" y="172" width={8} height={20} fill="none" stroke="#f59e0b" strokeWidth={0.8} />
          <text x="134" y="210" textAnchor="middle" fontSize={6.5} fill="#92400e" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Basketball Court</text>

          {/* ── Trees ── */}
          {TREES.map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={5.5} fill="#6ee7b7" opacity={0.85} />
              <circle cx={cx} cy={cy} r={3.5} fill="#34d399" opacity={0.7} />
            </g>
          ))}

          {/* ── Street labels ── */}
          <text x="260" y="59" textAnchor="middle" fontSize={9} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">MacArthur Highway</text>
          <text x="260" y="141" textAnchor="middle" fontSize={7.5} fill="#4b5563" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Biñan 2nd Road</text>
          <text x="260" y="202" textAnchor="middle" fontSize={6.5} fill="#6b7280" fontFamily="Inter,system-ui,sans-serif">Local Lane</text>
          <text x="84" y="28" textAnchor="middle" fontSize={6} fill="#6b7280" fontFamily="Inter,system-ui,sans-serif" transform="rotate(-90,84,28)">San Isidro St.</text>
          <text x="191" y="28" textAnchor="middle" fontSize={6} fill="#6b7280" fontFamily="Inter,system-ui,sans-serif" transform="rotate(-90,191,28)">Rizal St.</text>
          <text x="305" y="28" textAnchor="middle" fontSize={6} fill="#6b7280" fontFamily="Inter,system-ui,sans-serif" transform="rotate(-90,305,28)">Del Pilar St.</text>

          {/* ── Risk zone labels ── */}
          <rect x="94"  y="135" width="40" height="11" rx={3} fill="#fef2f2" stroke="#fca5a5" strokeWidth={0.7} />
          <text x="114" y="143" textAnchor="middle" fontSize={6} fill="#ef4444" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">● HIGH</text>
          <rect x="202" y="135" width="40" height="11" rx={3} fill="#fef2f2" stroke="#fca5a5" strokeWidth={0.7} />
          <text x="222" y="143" textAnchor="middle" fontSize={6} fill="#ef4444" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">● HIGH</text>
          <rect x="346" y="135" width="52" height="11" rx={3} fill="#fff7ed" stroke="#fed7aa" strokeWidth={0.7} />
          <text x="372" y="143" textAnchor="middle" fontSize={6} fill="#f97316" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">● MEDIUM</text>
          <rect x="202" y="276" width="34" height="11" rx={3} fill="#f0fdf4" stroke="#bbf7d0" strokeWidth={0.7} />
          <text x="219" y="284" textAnchor="middle" fontSize={6} fill="#22c55e" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">● LOW</text>

          {/* ── Location pin ── */}
          <g transform="translate(128,80)">
            <circle cx={0} cy={0} r={8} fill="#ef4444" opacity={0}>
              <animate attributeName="r" values="8;26;8" dur="2.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <circle cx={0} cy={0} r={8} fill="#ef4444" opacity={0}>
              <animate attributeName="r" values="8;18;8" dur="2.8s" begin="0.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2.8s" begin="0.9s" repeatCount="indefinite" />
            </circle>
            <path d="M 0 -20 C -8 -20 -8 -7 0 0 C 8 -7 8 -20 0 -20 Z" fill="#ef4444" stroke="white" strokeWidth={1.5} />
            <circle cx={0} cy={-13} r={4} fill="white" />
          </g>
          <rect x="56" y="60" width="76" height="16" rx={4} fill="white" opacity={0.93} stroke="#fca5a5" strokeWidth={0.8} />
          <text x="94" y="71.5" textAnchor="middle" fontSize={8} fill="#ef4444" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">▲ Biñan 2nd</text>

          {/* ── Hover zones ── */}
          {ILL_ZONES.map(z => {
            const isHov = hoveredZone?.id === z.id;
            const isPinned = pinnedZone?.id === z.id;
            return (
              <rect key={z.id} x={z.x} y={z.y} width={z.w} height={z.h}
                fill="transparent"
                stroke={(isHov || isPinned) ? LEVEL_COLOR[z.level] : 'transparent'}
                strokeWidth={isHov ? 2.5 : isPinned ? 2 : 0}
                rx={3} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredZone(z)}
                onMouseLeave={() => setHoveredZone(null)}
              />
            );
          })}

          {/* ── North arrow ── */}
          <g transform="translate(499,18)">
            <circle r={13} fill="white" stroke="#e2e8f0" strokeWidth={0.8} />
            <text y={4} textAnchor="middle" fontSize={7.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">N</text>
            <polygon points="0,-10 2.5,-2 0,-6 -2.5,-2" fill="#0c1e46" />
          </g>

          {/* ── Legend ── */}
          <rect x="6" y="265" width="136" height="20" rx={4} fill="rgba(255,255,255,0.9)" stroke="#e8edf2" strokeWidth={0.7} />
          <circle cx="18" cy="275" r={4} fill="#ef4444" />
          <text x="26" y="278.5" fontSize={6.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">High</text>
          <circle cx="53" cy="275" r={4} fill="#f97316" />
          <text x="61" y="278.5" fontSize={6.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Medium</text>
          <circle cx="100" cy="275" r={4} fill="#22c55e" />
          <text x="108" y="278.5" fontSize={6.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Low</text>
        </svg>

        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: 'linear-gradient(to bottom, rgba(250,246,239,0.95) 65%, transparent)',
          px: 1.5, pt: 0.75, pb: 1.5, pointerEvents: 'none',
        }}>
          <Typography sx={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Biñan 2nd, Bocaue, Bulacan — Area Detail
          </Typography>
        </Box>
      </Box>

      {/* Info panel */}
      <Box sx={{
        mt: 1, minHeight: 46, borderRadius: 2,
        border: `1px solid ${displayZone ? `${LEVEL_COLOR[displayZone.level]}40` : '#f1f5f9'}`,
        bgcolor: displayZone ? `${LEVEL_COLOR[displayZone.level]}06` : '#fafbfc',
        px: 2, py: 0.9,
        display: 'flex', alignItems: 'center', gap: 1.5,
        transition: 'all 0.15s',
      }}>
        {displayZone ? (
          <>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: LEVEL_COLOR[displayZone.level], flexShrink: 0 }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.15, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0c1e46' }}>{displayZone.label}</Typography>
                <Chip label={`${displayZone.level} Risk`} size="small"
                  sx={{ bgcolor: `${LEVEL_COLOR[displayZone.level]}18`, color: LEVEL_COLOR[displayZone.level], fontWeight: 700, fontSize: '0.6rem', height: 18 }} />
                <Chip label={`${displayZone.incidents} incident${displayZone.incidents !== 1 ? 's' : ''}`} size="small"
                  sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '0.6rem', height: 18 }} />
                {isPinnedVisible && (
                  <Chip label="↑ from network" size="small"
                    sx={{ bgcolor: `${LEVEL_COLOR[displayZone.level]}12`, color: LEVEL_COLOR[displayZone.level], fontSize: '0.6rem', height: 18, fontWeight: 600 }} />
                )}
              </Box>
              <Typography sx={{ fontSize: '0.71rem', color: '#64748b' }}>{displayZone.detail}</Typography>
            </Box>
          </>
        ) : (
          <Typography sx={{ fontSize: '0.71rem', color: '#94a3b8', fontStyle: 'italic' }}>
            Hover over a zone — or click a node in the street network above to highlight it here
          </Typography>
        )}
      </Box>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RiskHeatMap() {
  const [filter, setFilter]             = useState<RiskLevel | 'All'>('All');
  const [hovered, setHovered]           = useState<Zone | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const illRef = useRef<HTMLDivElement>(null);

  const handleZoneClick = (z: Zone) => {
    const next = selectedZone === z.id ? null : z.id;
    setSelectedZone(next);
  };

  // Scroll illustration into view when a node with an illZoneId is selected
  useEffect(() => {
    if (selectedZone && illRef.current) {
      const zone = ZONES.find(z => z.id === selectedZone);
      if (zone?.illZoneId) {
        illRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedZone]);

  const zoneMap = Object.fromEntries(ZONES.map(z => [z.id, z]));
  const visible = (z: Zone) => filter === 'All' || z.level === filter;

  const counts: Record<RiskLevel, number> = {
    High:   ZONES.filter(z => z.level === 'High').length,
    Medium: ZONES.filter(z => z.level === 'Medium').length,
    Low:    ZONES.filter(z => z.level === 'Low').length,
  };

  const activeIllZoneId = selectedZone
    ? (ZONES.find(z => z.id === selectedZone)?.illZoneId ?? null)
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
          Click a node to highlight it in the map below
        </Typography>
      </Box>

      {/* ── Street risk network SVG ── */}
      <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e8edf2', bgcolor: '#f8fafc', position: 'relative' }}>
        <svg viewBox="0 0 560 310" width="100%" style={{ display: 'block' }}>
          <defs>
            <filter id="rhm-h"><feGaussianBlur stdDeviation="14" /></filter>
            <filter id="rhm-m"><feGaussianBlur stdDeviation="10" /></filter>
            <filter id="rhm-l"><feGaussianBlur stdDeviation="7"  /></filter>
            <pattern id="rhm-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect width="560" height="310" fill="#f8fafc" />
          <rect width="560" height="310" fill="url(#rhm-grid)" />

          {/* Map header */}
          <text x="16" y="20" fontSize="8.5" fill="#94a3b8"
            fontFamily="Inter,system-ui,sans-serif" fontWeight="600" letterSpacing="1.2">
            BIÑAN 2ND, BOCAUE — STREET RISK NETWORK
          </text>

          {/* ── Road backgrounds (drawn before blobs so they sit under) ── */}
          {/* MacArthur Highway */}
          <line x1="52" y1="80" x2="460" y2="80" stroke="#e2e8f0" strokeWidth="11" strokeLinecap="round" />
          <line x1="52" y1="80" x2="460" y2="80" stroke="#d1d5db" strokeWidth="7"  strokeLinecap="round" />
          <line x1="52" y1="80" x2="460" y2="80" stroke="#f0c040" strokeWidth="0.9" strokeLinecap="round" strokeDasharray="12,8" />
          {/* Biñan 2nd Road */}
          <line x1="52" y1="162" x2="460" y2="162" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
          <line x1="52" y1="162" x2="460" y2="162" stroke="#d1d5db" strokeWidth="5" strokeLinecap="round" />
          <line x1="52" y1="162" x2="460" y2="162" stroke="white"   strokeWidth="0.7" strokeLinecap="round" strokeDasharray="8,6" opacity={0.6} />
          {/* Local Lane */}
          <line x1="52" y1="252" x2="405" y2="252" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
          <line x1="52" y1="252" x2="405" y2="252" stroke="#d1d5db" strokeWidth="3.5" strokeLinecap="round" />
          {/* San Isidro St. */}
          <line x1="80" y1="40" x2="80" y2="272" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
          <line x1="80" y1="40" x2="80" y2="272" stroke="#d1d5db" strokeWidth="3.5" strokeLinecap="round" />
          {/* Rizal St. */}
          <line x1="210" y1="40" x2="210" y2="272" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
          <line x1="210" y1="40" x2="210" y2="272" stroke="#d1d5db" strokeWidth="3.5" strokeLinecap="round" />
          {/* Del Pilar St. */}
          <line x1="332" y1="40" x2="332" y2="272" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
          <line x1="332" y1="40" x2="332" y2="272" stroke="#d1d5db" strokeWidth="3.5" strokeLinecap="round" />

          {/* ── Street name labels ── */}
          <text x="280" y="72" textAnchor="middle" fontSize="7.5" fill="#9ca3af"
            fontFamily="Inter,system-ui,sans-serif" fontWeight="700" letterSpacing="0.5">MacArthur Highway</text>
          <text x="220" y="155" textAnchor="middle" fontSize="7.5" fill="#9ca3af"
            fontFamily="Inter,system-ui,sans-serif" fontWeight="700" letterSpacing="0.5">Biñan 2nd Road</text>
          <text x="230" y="245" textAnchor="middle" fontSize="7" fill="#9ca3af"
            fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Local Lane</text>
          <text x="64" y="166" textAnchor="middle" fontSize="6.5" fill="#b0b8c4"
            fontFamily="Inter,system-ui,sans-serif" fontWeight="600" transform="rotate(-90,64,166)">San Isidro St.</text>
          <text x="226" y="222" textAnchor="middle" fontSize="6.5" fill="#b0b8c4"
            fontFamily="Inter,system-ui,sans-serif" fontWeight="600" transform="rotate(-90,226,222)">Rizal St.</text>
          <text x="348" y="166" textAnchor="middle" fontSize="6.5" fill="#b0b8c4"
            fontFamily="Inter,system-ui,sans-serif" fontWeight="600" transform="rotate(-90,348,166)">Del Pilar St.</text>

          {/* ── Heat blobs ── */}
          {ZONES.map(z => {
            const vis = visible(z);
            const baseOp = z.level === 'High' ? 0.22 : z.level === 'Medium' ? 0.16 : 0.10;
            const opacity = vis ? (filter === 'All' ? baseOp : 0.32) : 0.02;
            const fid = z.level === 'High' ? 'rhm-h' : z.level === 'Medium' ? 'rhm-m' : 'rhm-l';
            return (
              <circle key={`blob-${z.id}`} cx={z.x} cy={z.y} r={HEAT_R[z.level]}
                fill={LEVEL_COLOR[z.level]} opacity={opacity} filter={`url(#${fid})`} />
            );
          })}

          {/* ── Risk-colored street edges ── */}
          {STREETS.map(([a, b]) => {
            const zA = zoneMap[a]; const zB = zoneMap[b];
            if (!zA || !zB) return null;
            const visA = visible(zA), visB = visible(zB);
            if (!visA && !visB) return null;
            const riskLevel: RiskLevel = [zA.level, zB.level].includes('High') ? 'High'
              : [zA.level, zB.level].includes('Medium') ? 'Medium' : 'Low';
            const color  = LEVEL_COLOR[riskLevel];
            const width  = riskLevel === 'High' ? 5.5 : riskLevel === 'Medium' ? 4 : 3;
            const isSel  = selectedZone === zA.id || selectedZone === zB.id;
            return (
              <line key={`edge-${a}-${b}`} x1={zA.x} y1={zA.y} x2={zB.x} y2={zB.y}
                stroke={color} strokeWidth={isSel ? width + 2 : width}
                strokeLinecap="round" opacity={isSel ? 0.75 : 0.45} />
            );
          })}

          {/* ── High-risk pulse rings ── */}
          {ZONES.filter(z => z.level === 'High' && visible(z)).map(z => (
            <circle key={`pulse-${z.id}`} cx={z.x} cy={z.y} r={NODE_R.High}
              fill="none" stroke={LEVEL_COLOR.High} strokeWidth={2} opacity={0}>
              <animate attributeName="r" values={`${NODE_R.High};${NODE_R.High+20};${NODE_R.High}`} dur="2.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2.3s" repeatCount="indefinite" />
            </circle>
          ))}

          {/* ── Selected node ring ── */}
          {selectedZone && (() => {
            const sz = zoneMap[selectedZone];
            if (!sz) return null;
            return (
              <circle cx={sz.x} cy={sz.y} r={NODE_R[sz.level] + 8}
                fill="none" stroke={LEVEL_COLOR[sz.level]} strokeWidth={2.5}
                opacity={0.7} style={{ pointerEvents: 'none' }}>
                <animate attributeName="stroke-opacity" values="0.7;0.2;0.7" dur="1.6s" repeatCount="indefinite" />
              </circle>
            );
          })()}

          {/* ── Zone nodes ── */}
          {ZONES.map(z => {
            const vis  = visible(z);
            const isHov = hovered?.id === z.id;
            const isSel = selectedZone === z.id;
            const r = NODE_R[z.level] + (isHov || isSel ? 2 : 0);
            return (
              <g key={z.id} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(z)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleZoneClick(z)}>
                <circle cx={z.x} cy={z.y} r={NODE_R[z.level] + 10} fill="transparent" />
                <circle cx={z.x} cy={z.y} r={r}
                  fill={vis ? LEVEL_COLOR[z.level] : '#d1d5db'}
                  stroke="white" strokeWidth={isSel ? 3 : vis ? 2.5 : 1.5}
                  opacity={vis ? 1 : 0.2} />
                {vis && z.incidents >= 1 && NODE_R[z.level] >= 10 && (
                  <text x={z.x} y={z.y + 3.5} textAnchor="middle" fontSize={8} fill="white"
                    fontFamily="Inter,system-ui,sans-serif" fontWeight="700" style={{ pointerEvents: 'none' }}>
                    {z.incidents}
                  </text>
                )}
                {vis && (
                  <text x={z.x} y={z.y + NODE_R[z.level] + 11} textAnchor="middle" fontSize={7}
                    fill={isHov || isSel ? '#0c1e46' : '#475569'}
                    fontFamily="Inter,system-ui,sans-serif"
                    fontWeight={isHov || isSel ? '700' : '500'}
                    style={{ pointerEvents: 'none' }}>
                    {z.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Hover ring */}
          {hovered && hovered.id !== selectedZone && (
            <circle cx={hovered.x} cy={hovered.y} r={NODE_R[hovered.level] + 5}
              fill="none" stroke={LEVEL_COLOR[hovered.level]} strokeWidth={2} opacity={0.5}
              style={{ pointerEvents: 'none' }} />
          )}

          {/* ── North arrow ── */}
          <g transform="translate(534,26)">
            <circle r={13} fill="white" stroke="#e2e8f0" strokeWidth={1} />
            <text y={4} textAnchor="middle" fontSize={8.5} fill="#374151"
              fontFamily="Inter,system-ui,sans-serif" fontWeight="700">N</text>
            <polygon points="0,-11 2.5,-3 0,-7 -2.5,-3" fill="#0c1e46" />
          </g>

          {/* ── Legend ── */}
          <g>
            <rect x={6} y={268} width={148} height={20} rx={4}
              fill="rgba(255,255,255,0.92)" stroke="#e8edf2" strokeWidth={0.7} />
            <circle cx={18} cy={278} r={4} fill="#ef4444" />
            <text x={26} y={281.5} fontSize={6.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">High</text>
            <circle cx={55} cy={278} r={4} fill="#f97316" />
            <text x={63} y={281.5} fontSize={6.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Medium</text>
            <circle cx={108} cy={278} r={4} fill="#22c55e" />
            <text x={116} y={281.5} fontSize={6.5} fill="#374151" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">Low</text>
          </g>
        </svg>
      </Box>

      {/* ── Hover / select info panel ── */}
      <Box sx={{
        mt: 1.25, minHeight: 48, borderRadius: 2,
        border: `1px solid ${hovered ? `${LEVEL_COLOR[hovered.level]}40` : '#f1f5f9'}`,
        bgcolor: hovered ? `${LEVEL_COLOR[hovered.level]}06` : '#fafbfc',
        px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1.5, transition: 'all 0.15s',
      }}>
        {hovered ? (
          <>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: LEVEL_COLOR[hovered.level], flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.15, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0c1e46' }}>{hovered.name}</Typography>
                <Chip label={`${hovered.level} Risk`} size="small"
                  sx={{ bgcolor: `${LEVEL_COLOR[hovered.level]}18`, color: LEVEL_COLOR[hovered.level], fontWeight: 700, fontSize: '0.62rem', height: 18 }} />
                {hovered.incidents > 0 && (
                  <Chip label={`${hovered.incidents} incident${hovered.incidents !== 1 ? 's' : ''}`} size="small"
                    sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '0.62rem', height: 18 }} />
                )}
                {hovered.illZoneId && (
                  <Chip label="↓ highlights area below" size="small"
                    sx={{ bgcolor: `${LEVEL_COLOR[hovered.level]}12`, color: LEVEL_COLOR[hovered.level], fontSize: '0.6rem', height: 18, fontWeight: 600 }} />
                )}
              </Box>
              <Typography sx={{ fontSize: '0.73rem', color: '#64748b' }}>{hovered.desc}</Typography>
            </Box>
          </>
        ) : (
          <Typography sx={{ fontSize: '0.73rem', color: '#94a3b8', fontStyle: 'italic' }}>
            Hover over a street node · Click to highlight the corresponding zone in the geographic view below
          </Typography>
        )}
      </Box>

      {/* ── Divider ── */}
      <Box ref={illRef} sx={{ mt: 2.5, mb: 1.5 }}>
        <Divider>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }}>
              <Box component="span" sx={{
                display: 'block', width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
              }} />
            </Box>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0c1e46', letterSpacing: '0.01em' }}>
              Biñan 2nd, Bocaue — Geographic Reference
            </Typography>
            <Chip label="Area View" size="small"
              sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 700, fontSize: '0.62rem', height: 18 }} />
            {activeIllZoneId && (
              <Chip label="● Linked" size="small"
                sx={{
                  bgcolor: '#ef444418', color: '#ef4444', fontWeight: 700, fontSize: '0.62rem', height: 18,
                  animation: 'fadeIn 0.3s ease',
                  '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
                }} />
            )}
          </Box>
        </Divider>
      </Box>

      <BinanIllustration activeIllZoneId={activeIllZoneId} />

      {/* ── Summary chips ── */}
      <Box sx={{ display: 'flex', gap: 0.75, mt: 1.5, flexWrap: 'wrap' }}>
        {(['High', 'Medium', 'Low'] as RiskLevel[]).map(lv => {
          const names = ZONES.filter(z => z.level === lv).map(z => z.name);
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
