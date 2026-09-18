'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button,
  Skeleton, LinearProgress,
} from '@mui/material';
import {
  Psychology, Warning, CheckCircle, TrendingUp, FolderOpen,
  ArrowForward, Shield,
} from '@mui/icons-material';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(r => r.json().then(d => d.data));

const ACCENT = '#7c3aed';
const RISK_COLOR: Record<string, string> = { Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#22c55e' };

interface Stats { total: number; highRisk: number; active: number; resolved: number; }
interface TrendRow { month: string; total: number; highRisk: number; }
interface UrgentCase { id: string; caseNumber: string; subjectName: string; riskLevel: string; filedAt: string; }

export default function VawcAiRiskPage() {
  const router = useRouter();
  const { data: stats } = useSWR<Stats>('/api/vawc/stats', fetcher);
  const { data: trends } = useSWR<TrendRow[]>('/api/vawc/trends?period=6', fetcher);
  const { data: urgentData } = useSWR<{ cases: UrgentCase[] }>('/api/vawc/urgent?limit=6', fetcher);

  const total = stats?.total ?? 0;
  const highRisk = stats?.highRisk ?? 0;
  const riskRatio = total > 0 ? (highRisk / total) * 100 : 0;

  const riskTrend = riskRatio > 30 ? 'Critical' : riskRatio > 15 ? 'High' : riskRatio > 8 ? 'Medium' : 'Low';

  const radarData = trends?.slice(-6).map(t => ({
    subject: t.month,
    cases: t.total,
    highRisk: t.highRisk,
    resolved: t.total > 0 ? Math.round(((t.total - t.highRisk) / t.total) * 100) : 0,
  })) ?? [];

  const insights = [
    { icon: Psychology, title: 'Risk Score Engine', desc: 'Rule-based scoring using case type, frequency, and recurrence patterns across streets/barangays.', color: ACCENT },
    { icon: Warning, title: 'High-Risk Threshold', desc: `Currently ${riskRatio.toFixed(1)}% of VAWC cases are classified high/critical risk.`, color: riskRatio > 20 ? '#ef4444' : '#f59e0b' },
    { icon: TrendingUp, title: 'Trend Analysis', desc: `Monthly trend data from the last 6 months. ${trends?.length ? `Peak: ${Math.max(...(trends.map(t => t.highRisk)))} high-risk cases in a single month.` : 'Insufficient data.'}`, color: '#3b82f6' },
    { icon: CheckCircle, title: 'AI Upgrade Path', desc: 'Recommend: Gemini 2.0 Flash for NLP narrative analysis, or fine-tuned classifier on anonymised VAWC case text.', color: '#22c55e' },
  ];

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0c1e46', letterSpacing: '-0.02em' }}>AI Risk Prediction</Typography>
          <Chip label="RULE-BASED ENGINE v1" size="small" sx={{ bgcolor: `${ACCENT}12`, color: ACCENT, fontWeight: 700, fontSize: '0.62rem', height: 20 }} />
        </Box>
        <Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>Automated risk scoring and pattern analysis for VAWC case escalation</Typography>
      </Box>

      {/* Risk meter */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0c1e46', mb: 2 }}>Overall Risk Level</Typography>
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Box sx={{
                  width: 100, height: 100, borderRadius: '50%', mx: 'auto', mb: 2,
                  background: `conic-gradient(${RISK_COLOR[riskTrend]} ${riskRatio * 3.6}deg, #f1f5f9 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 0 8px white, 0 0 0 9px ${RISK_COLOR[riskTrend]}20`,
                  position: 'relative',
                }}>
                  <Box sx={{ width: 76, height: 76, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: RISK_COLOR[riskTrend], lineHeight: 1 }}>{riskRatio.toFixed(0)}%</Typography>
                    <Typography sx={{ fontSize: '0.58rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>High Risk</Typography>
                  </Box>
                </Box>
                <Chip label={riskTrend} sx={{ bgcolor: `${RISK_COLOR[riskTrend]}14`, color: RISK_COLOR[riskTrend], fontWeight: 700, fontSize: '0.8rem', mb: 1.5 }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {[
                  { label: 'Total Cases', value: total, color: '#14b8a6' },
                  { label: 'High / Critical', value: highRisk, color: '#ef4444' },
                  { label: 'Active', value: stats?.active ?? 0, color: '#3b82f6' },
                ].map(item => (
                  <Box key={item.label}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>{item.label}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: item.color }}>{item.value}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={total > 0 ? (item.value / total) * 100 : 0}
                      sx={{ height: 4, borderRadius: 2, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 2 } }} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Radar chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0c1e46', mb: 0.25 }}>6-Month Pattern Radar</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mb: 1.5 }}>Monthly case volume, high-risk proportion and resolution index</Typography>
              {!trends ? (
                <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2 }} />
              ) : radarData.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <FolderOpen sx={{ fontSize: 36, color: '#e2e8f0', display: 'block', mx: 'auto', mb: 1 }} />
                  <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>Not enough data for radar analysis</Typography>
                </Box>
              ) : (
                <Box sx={{ minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData} margin={{ top: 4, right: 20, bottom: 4, left: 20 }}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <PolarRadiusAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Radar name="Cases" dataKey="cases" stroke={ACCENT} fill={ACCENT} fillOpacity={0.15} strokeWidth={2} />
                      <Radar name="High Risk" dataKey="highRisk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.12} strokeWidth={1.5} strokeDasharray="5 3" />
                      <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '0.78rem' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Insight cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {insights.map((item, i) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card sx={{ '&:hover': { boxShadow: `0 4px 20px ${item.color}18` }, transition: 'box-shadow 0.2s', height: '100%' }}>
                <CardContent sx={{ p: 2.25 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: `${item.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon sx={{ fontSize: 18, color: item.color }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0c1e46', mb: 0.4 }}>{item.title}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.55 }}>{item.desc}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Urgent cases quick list */}
      {(urgentData?.cases?.length ?? 0) > 0 && (
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0c1e46' }}>Highest Risk — Action Required</Typography>
              <Button size="small" endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                onClick={() => router.push('/vawc/cases?filter=urgent')}
                sx={{ color: ACCENT, fontWeight: 600, fontSize: '0.78rem' }}>
                View All
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <AnimatePresence>
                {(urgentData?.cases ?? []).map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 2, p: 1.5,
                      borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9',
                      '&:hover': { bgcolor: '#f5f3ff', borderColor: `${ACCENT}20` }, transition: 'all 0.15s', cursor: 'pointer',
                    }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: `${RISK_COLOR[c.riskLevel] ?? '#64748b'}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Shield sx={{ fontSize: 16, color: RISK_COLOR[c.riskLevel] ?? '#64748b' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#0c1e46' }}>{c.subjectName}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>#{c.caseNumber}</Typography>
                      </Box>
                      <Chip label={c.riskLevel} size="small"
                        sx={{ bgcolor: `${RISK_COLOR[c.riskLevel] ?? '#64748b'}12`, color: RISK_COLOR[c.riskLevel] ?? '#64748b', fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
