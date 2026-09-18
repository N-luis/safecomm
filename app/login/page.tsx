'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box, Button, Typography, Container, Grid, Card, CardContent,
  Chip, IconButton, List, ListItem, ListItemIcon, ListItemText,
  Dialog, DialogContent, TextField, InputAdornment, CircularProgress,
  Alert, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Shield, Assessment, FolderOpen, Warning,
  ManageAccounts, Security, CheckCircle, ArrowForward,
  Lock, Speed, AutoGraph,
  MenuOpen, Close, ChevronRight, VerifiedUser, Gavel,
  Groups, BubbleChart, Article as AuditIcon,
  Visibility, VisibilityOff,
} from '@mui/icons-material';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = React.ComponentType<any>;

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});
type LoginForm = z.infer<typeof loginSchema>;

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const features: { icon: IconComponent; title: string; desc: string; color: string; bg: string }[] = [
  { icon: Assessment, title: 'Incident Reports', desc: 'Submit, track, and manage community incident reports with real-time status updates.', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { icon: FolderOpen, title: 'Case Management', desc: 'Full lifecycle case tracking from initial filing through resolution with activity timelines.', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  { icon: Warning, title: 'Risk Prediction', desc: 'AI-powered risk scoring identifies high-priority cases and community hotspots.', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  { icon: AutoGraph, title: 'Analytics & Insights', desc: 'Interactive charts reveal trends, performance metrics, and community safety patterns.', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  { icon: Groups, title: 'Resident Registry', desc: 'Maintain comprehensive resident profiles linked directly to cases and incidents.', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  { icon: Security, title: 'VAWC Module', desc: 'Dedicated Violence Against Women and Children tracking with confidential access.', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  { icon: ManageAccounts, title: 'User Management', desc: 'Role-based access control for Admins, Officers, and VAWC Officers.', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  { icon: AuditIcon, title: 'Audit Logs', desc: 'Complete tamper-proof audit trail of every system action for accountability.', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
];

const stats: { label: string; value: number; suffix: string; icon: IconComponent }[] = [
  { label: 'Residents Protected', value: 45000, suffix: '+', icon: Groups },
  { label: 'Cases Resolved', value: 3800, suffix: '+', icon: CheckCircle },
  { label: 'Active Officers', value: 120, suffix: '', icon: VerifiedUser },
  { label: 'Avg Response Time', value: 24, suffix: 'h', icon: Speed },
];

const steps: { num: string; title: string; desc: string; icon: IconComponent; color: string }[] = [
  { num: '01', title: 'File a Report', desc: 'Residents or officers submit incident reports through a streamlined intake form.', icon: Assessment, color: '#3b82f6' },
  { num: '02', title: 'AI Risk Assessment', desc: 'The system automatically scores risk level and routes to the appropriate officer.', icon: BubbleChart, color: '#8b5cf6' },
  { num: '03', title: 'Case Resolution', desc: 'Officers track progress, update status, and close cases with full audit history.', icon: Gavel, color: '#22c55e' },
];

const roles: { role: string; desc: string; color: string; icon: IconComponent; perms: string[] }[] = [
  { role: 'Admin', desc: 'Full system access. User management, all reports, analytics, audit logs.', color: '#8b5cf6', icon: ManageAccounts, perms: ['User Management', 'Audit Logs', 'All Cases', 'System Settings'] },
  { role: 'Officer', desc: 'Handle incident reports and assigned cases with full case lifecycle tools.', color: '#3b82f6', icon: VerifiedUser, perms: ['Reports', 'Assigned Cases', 'Residents', 'Messages'] },
  { role: 'VAWC Officer', desc: 'Manage sensitive VAWC cases with confidential access controls.', color: '#ec4899', icon: Security, perms: ['VAWC Cases', 'Confidential Reports', 'Risk Alerts', 'Analytics'] },
];

const navLinks = ['Features', 'How It Works', 'Statistics', 'Modules'];

// ─── Login Dialog ─────────────────────────────────────────────────────────────
function LoginDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(`Welcome back, ${json.data.user.name}!`);
        const role = (json.data.user.role as string) ?? '';
        if (role === 'vawc_officer' || role === 'vawc' || role === 'vawc_lead') router.push('/vawc');
        else if (role === 'officer' || role === 'blotter_officer') router.push('/blotter-officer');
        else if (role === 'system_admin') router.push('/admin');
        else router.push('/dashboard');
        return;
      }

      // Not a staff account — try resident accounts before giving up
      const rRes = await fetch('/api/auth/resident-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const rJson = await rRes.json();
      if (rRes.ok && rJson.success) {
        toast.success(`Welcome back, ${rJson.data.resident.name}!`);
        router.push('/resident');
        return;
      }

      setLoginError(json.error || rJson.error || 'Invalid credentials');
    } catch {
      setLoginError('Network error. Please try again.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #0c1e46 0%, #071739 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          },
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -1 }}>
          <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'white' } }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: 2.5, mx: 'auto', mb: 2, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(59,130,246,0.4)' }}>
            <Shield sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '1.3rem' }}>Sign In</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mt: 0.5 }}>One account for SafCom — Admin, VAWC, Blotter &amp; Resident</Typography>
        </Box>

        {loginError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{loginError}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email" type="email" {...register('email')}
            error={!!errors.email} helperText={errors.email?.message}
            fullWidth autoComplete="email"
            sx={{
              '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#60a5fa' },
              '& .MuiFormHelperText-root': { color: '#f87171' },
            }}
          />
          <TextField
            label="Password" type={showPassword ? 'text' : 'password'} {...register('password')}
            error={!!errors.password} helperText={errors.password?.message}
            fullWidth autoComplete="current-password"
            sx={{
              '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#60a5fa' },
              '& .MuiFormHelperText-root': { color: '#f87171' },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(p => !p)} edge="end" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}
            sx={{ mt: 0.5, py: 1.4, fontWeight: 700, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 6px 20px rgba(59,130,246,0.4)', '&:hover': { background: 'linear-gradient(135deg, #2563eb, #1e40af)' } }}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>

        <Typography sx={{ mt: 3, textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
          You&apos;ll be taken to the right dashboard automatically based on your account.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f4f7fb', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' }}>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <Box
        component={motion.nav}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: scrolled ? 'rgba(7,23,57,0.95)' : 'linear-gradient(180deg, rgba(7,23,57,0.98) 0%, rgba(7,23,57,0.85) 100%)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
          transition: 'all 0.3s ease',
          px: { xs: 2, md: 4 }, py: 1.5,
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(59,130,246,0.4)' }}>
              <Shield sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '1.1rem', lineHeight: 1.1 }}>SafCom</Typography>
              <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase' }}>Admin Portal</Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {navLinks.map(link => (
                <Typography key={link} onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, '-'))} sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: 'white' } }}>
                  {link}
                </Typography>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {!isMobile && (
              <Button
                variant="outlined"
                onClick={() => router.push('/register')}
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', borderRadius: 2, fontWeight: 600, px: 2, py: 0.9, '&:hover': { borderColor: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.07)' }, transition: 'all 0.2s ease' }}
              >
                Create Account
              </Button>
            )}
            {isMobile && (
              <IconButton onClick={() => setMobileMenuOpen(o => !o)} sx={{ color: 'white' }}>
                {mobileMenuOpen ? <Close /> : <MenuOpen />}
              </IconButton>
            )}
          </Box>
        </Box>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <Box sx={{ py: 2, borderTop: '1px solid rgba(255,255,255,0.1)', mt: 1.5 }}>
                {navLinks.map(link => (
                  <Typography key={link} onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, '-'))} sx={{ color: 'rgba(255,255,255,0.8)', py: 1.5, px: 1, fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', display: 'block', '&:hover': { color: 'white' } }}>
                    {link}
                  </Typography>
                ))}
                <Box sx={{ pt: 1.5, display: 'flex', gap: 1.5 }}>
                  <Button fullWidth variant="outlined" onClick={() => router.push('/register')} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600 }}>Create Account</Button>
                  <Button fullWidth variant="contained" onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }} sx={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', fontWeight: 600 }}>Sign In</Button>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #071739 0%, #0c2461 50%, #1a3a6b 100%)', display: 'flex', alignItems: 'center', pt: { xs: 10, md: 0 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(3)].map((_, i) => (
            <Box key={i} component={motion.div} animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 2 }}
              sx={{ position: 'absolute', width: { xs: 300 + i * 100, md: 500 + i * 150 }, height: { xs: 300 + i * 100, md: 500 + i * 150 }, borderRadius: '50%', background: i === 0 ? 'radial-gradient(circle, rgba(59,130,246,1) 0%, transparent 70%)' : i === 1 ? 'radial-gradient(circle, rgba(139,92,246,1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(6,182,212,1) 0%, transparent 70%)', top: i === 0 ? '-10%' : i === 1 ? '40%' : '60%', left: i === 0 ? '-5%' : i === 1 ? '60%' : '20%' }} />
          ))}
          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
          <Grid container spacing={6} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <Chip icon={<Shield sx={{ fontSize: 14, color: '#60a5fa !important' }} />} label="Biñan City Public Safety Office"
                  sx={{ mb: 3, background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', fontWeight: 600, fontSize: '0.75rem', '& .MuiChip-icon': { color: '#60a5fa' } }} />
                <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.15, fontSize: { xs: '2.2rem', md: '3rem', lg: '3.5rem' }, mb: 2 }}>
                  Community Safety{' '}
                  <Box component="span" sx={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Management</Box>{' '}
                  System
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.75, mb: 4, maxWidth: 520 }}>
                  SafCom centralizes incident reporting, case tracking, VAWC management, and AI-powered risk analytics for Biñan City's public safety officers — all in one secure platform.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="contained" size="large" onClick={() => setLoginOpen(true)} endIcon={<ArrowForward />}
                      sx={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', px: 3.5, py: 1.5, fontWeight: 700, fontSize: '1rem', boxShadow: '0 8px 30px rgba(59,130,246,0.4)', '&:hover': { background: 'linear-gradient(135deg, #2563eb, #1e40af)' } }}>
                      Sign In
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="outlined" size="large" onClick={() => scrollTo('features')}
                      sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', px: 3, py: 1.5, fontWeight: 600, fontSize: '1rem', '&:hover': { borderColor: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.05)' } }}>
                      Explore Features
                    </Button>
                  </motion.div>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  {[{ icon: Lock, text: 'Secure & Encrypted' }, { icon: VerifiedUser, text: 'Role-Based Access' }, { icon: Speed, text: 'Real-Time Updates' }].map(item => (
                    <Box key={item.text} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <item.icon sx={{ fontSize: 16, color: '#60a5fa' }} />
                      <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{item.text}</Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
                <Box sx={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, p: 3, boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                      {['#ef4444', '#f59e0b', '#22c55e'].map(c => <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
                    </Box>
                    <Box sx={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', px: 1.5 }}>
                      <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>safcom.gov.ph/dashboard</Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    {[{ label: 'Total Reports', val: '1,284', color: '#3b82f6', delta: '+12%' }, { label: 'Active Cases', val: '89', color: '#f97316', delta: '-3%' }, { label: 'Resolved', val: '3,841', color: '#22c55e', delta: '+8%' }, { label: 'Critical', val: '14', color: '#ef4444', delta: '+2' }].map(s => (
                      <Grid size={6} key={s.label}>
                        <Box sx={{ background: 'rgba(255,255,255,0.06)', borderRadius: 2, p: 1.5, border: '1px solid rgba(255,255,255,0.06)' }}>
                          <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', mb: 0.5 }}>{s.label}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{s.val}</Typography>
                            <Typography sx={{ fontSize: '0.6rem', color: s.color }}>{s.delta}</Typography>
                          </Box>
                          <Box sx={{ mt: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                            <Box sx={{ height: '100%', borderRadius: 2, width: '65%', background: s.color }} />
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Box sx={{ background: 'rgba(255,255,255,0.04)', borderRadius: 2, p: 2, border: '1px solid rgba(255,255,255,0.06)', mb: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', mb: 1.5, fontWeight: 600 }}>Monthly Incidents</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, height: 50 }}>
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                          style={{ flex: 1, borderRadius: '3px 3px 0 0', background: i === 11 ? '#3b82f6' : 'rgba(59,130,246,0.35)' }} />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => <Typography key={i} sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)' }}>{m}</Typography>)}
                    </Box>
                  </Box>

                  {[{ id: 'C-2024-089', type: 'Domestic Dispute', risk: 'High', rColor: '#ef4444' }, { id: 'C-2024-088', type: 'VAWC Report', risk: 'Critical', rColor: '#dc2626' }, { id: 'C-2024-087', type: 'Noise Complaint', risk: 'Low', rColor: '#22c55e' }].map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.8, borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', minWidth: 70 }}>{c.id}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', flex: 1 }}>{c.type}</Typography>
                        <Box sx={{ px: 0.75, py: 0.25, borderRadius: 1, background: `${c.rColor}22`, border: `1px solid ${c.rColor}44` }}>
                          <Typography sx={{ fontSize: '0.55rem', color: c.rColor, fontWeight: 700 }}>{c.risk}</Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => scrollTo('statistics')}>
            <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</Typography>
            <Box sx={{ width: 1, height: 30, borderLeft: '1px solid rgba(255,255,255,0.2)', mx: 'auto' }} />
          </Box>
        </motion.div>
      </Box>

      {/* ── STATISTICS ──────────────────────────────────────────────────── */}
      <Box id="statistics" sx={{ background: 'linear-gradient(135deg, #071739 0%, #0c2461 100%)', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((s, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Box sx={{ width: 52, height: 52, borderRadius: 2.5, mx: 'auto', mb: 2, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <s.icon sx={{ color: '#60a5fa', fontSize: 24 }} />
                    </Box>
                    <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 800, color: 'white', lineHeight: 1 }}>
                      <AnimatedCounter target={s.value} suffix={s.suffix} />
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>{s.label}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, background: '#f4f7fb' }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Chip label="Platform Modules" sx={{ mb: 2, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)' }} />
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                Everything you need to{' '}
                <Box component="span" sx={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>keep communities safe</Box>
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 560, mx: 'auto' }}>A unified platform covering the full scope of community safety management.</Typography>
            </Box>
          </motion.div>
          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={f.title}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }} whileHover={{ y: -6 }}>
                  <Card sx={{ height: '100%', background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'box-shadow 0.3s ease', '&:hover': { boxShadow: `0 12px 40px ${f.color}22` } }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ width: 50, height: 50, borderRadius: 2.5, mb: 2.5, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <f.icon sx={{ color: f.color, fontSize: 26 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '0.95rem' }}>{f.title}</Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.65 }}>{f.desc}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #071739 0%, #0c2461 60%, #1a3a6b 100%)' }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Chip label="Workflow" sx={{ mb: 2, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontWeight: 600, border: '1px solid rgba(139,92,246,0.25)' }} />
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>How SafCom Works</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', maxWidth: 500, mx: 'auto' }}>A streamlined three-step process from initial report to full case resolution.</Typography>
            </Box>
          </motion.div>
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            {steps.map((step, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={step.num}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
                  <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                      <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: `${step.color}22`, border: `2px solid ${step.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <step.icon sx={{ color: step.color, fontSize: 36 }} />
                      </Box>
                      <Box sx={{ position: 'absolute', top: -6, right: -6, width: 26, height: 26, borderRadius: '50%', background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: 'white' }}>{step.num}</Typography>
                      </Box>
                    </Box>
                    {i < steps.length - 1 && !isMobile && (
                      <Box sx={{ position: 'absolute', top: '50%', right: '-12%', display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        <ChevronRight sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 32 }} />
                      </Box>
                    )}
                    <Typography sx={{ fontWeight: 700, color: 'white', mb: 1.5, fontSize: '1.1rem' }}>{step.title}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.7 }}>{step.desc}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── MODULES / ROLES ─────────────────────────────────────────────── */}
      <Box id="modules" sx={{ py: { xs: 8, md: 12 }, background: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <Chip label="Secure Platform" sx={{ mb: 2, background: 'rgba(34,197,94,0.1)', color: '#16a34a', fontWeight: 600, border: '1px solid rgba(34,197,94,0.2)' }} />
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 2, fontSize: { xs: '1.8rem', md: '2.2rem' }, lineHeight: 1.25 }}>Built for public safety professionals</Typography>
                <Typography sx={{ color: '#64748b', lineHeight: 1.8, mb: 4 }}>SafCom provides role-based access so every officer sees exactly what they need. Admins get full system oversight, VAWC Officers get confidential case access, and Officers manage their assigned workload.</Typography>
                <List dense disablePadding>
                  {['Encrypted case records and audit trails', 'Granular role-based permissions', 'Real-time notifications and alerts', 'Cross-module data integration', 'Mobile-responsive for field officers'].map(item => (
                    <ListItem key={item} disableGutters sx={{ py: 0.75 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}><CheckCircle sx={{ color: '#22c55e', fontSize: 18 }} /></ListItemIcon>
                      <ListItemText primary={item} slotProps={{ primary: { sx: { fontSize: '0.9rem', color: '#475569', fontWeight: 500 } } }} />
                    </ListItem>
                  ))}
                </List>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block', marginTop: 24 }}>
                  <Button variant="contained" size="large" onClick={() => setLoginOpen(true)} endIcon={<ArrowForward />}
                    sx={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', fontWeight: 700, px: 3.5, py: 1.5, boxShadow: '0 8px 25px rgba(59,130,246,0.35)', '&:hover': { background: 'linear-gradient(135deg, #2563eb, #1e40af)' } }}>
                    Start Using SafCom
                  </Button>
                </motion.div>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <Grid container spacing={2}>
                  {roles.map(r => (
                    <Grid size={{ xs: 12, sm: 4 }} key={r.role}>
                      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                        <Card sx={{ height: '100%', background: 'white', border: `1px solid ${r.color}22`, boxShadow: `0 4px 20px ${r.color}12`, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: `0 10px 30px ${r.color}25` } }}>
                          <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                              <Box sx={{ width: 36, height: 36, borderRadius: 2, background: `${r.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <r.icon sx={{ color: r.color, fontSize: 20 }} />
                              </Box>
                              <Chip label={r.role} size="small" sx={{ background: `${r.color}18`, color: r.color, fontWeight: 700, fontSize: '0.7rem' }} />
                            </Box>
                            <Typography sx={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.6, mb: 1.5 }}>{r.desc}</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {r.perms.map(p => <Chip key={p} label={p} size="small" sx={{ fontSize: '0.6rem', background: '#f1f5f9', color: '#475569', height: 20 }} />)}
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 10, md: 14 }, background: 'linear-gradient(135deg, #071739 0%, #0c2461 50%, #1a3a6b 100%)', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
          <Box sx={{ width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
        </Box>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Box sx={{ width: 70, height: 70, borderRadius: 3, mx: 'auto', mb: 3, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(59,130,246,0.4)' }}>
              <Shield sx={{ color: 'white', fontSize: 36 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>Ready to manage community safety?</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: 480, mx: 'auto' }}>Sign in to your SafCom account and start tracking incidents, managing cases, and protecting your community.</Typography>
          </motion.div>
        </Container>
      </Box>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <Box sx={{ background: '#040f24', py: 5 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3, textAlign: { xs: 'center', sm: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: 2, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield sx={{ color: 'white', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>SafCom</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Community Safety Platform</Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>© 2025 Biñan City Public Safety Office. All rights reserved.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
