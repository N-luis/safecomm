'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box, Button, Typography, TextField, InputAdornment, IconButton,
  CircularProgress, Alert, Chip, Divider,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Shield, Lock, ArrowForward,
  RecordVoiceOver, VerifiedUser,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ACCENT = '#3b82f6';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof schema>;

export default function BlotterLoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    setApiError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) { setApiError(json.error || 'Login failed'); return; }
      const role = (json.data?.user?.role as string) ?? '';
      if (role !== 'officer' && role !== 'blotter_officer') {
        setApiError('This portal is for Blotter Officers only. Please use the appropriate portal to sign in.');
        return;
      }
      toast.success(`Welcome back, ${json.data.user.name}!`);
      router.push('/blotter-officer');
    } catch {
      setApiError('Network error. Please try again.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #071739 0%, #0c2461 60%, #1a3a6b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      px: 2, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      {[0, 1].map(i => (
        <Box key={i} component={motion.div}
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 9 + i * 2, repeat: Infinity, delay: i * 4 }}
          sx={{
            position: 'absolute',
            width: i === 0 ? 500 : 350,
            height: i === 0 ? 500 : 350,
            borderRadius: '50%',
            background: i === 0
              ? `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)`
              : 'radial-gradient(circle, #1d4ed8 0%, transparent 70%)',
            top: i === 0 ? '-15%' : '60%',
            left: i === 0 ? '60%' : '-10%',
            pointerEvents: 'none',
          }}
        />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%', maxWidth: 1000, gap: 0, borderRadius: 4, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.6)' }}>

        {/* ── Left decorative panel ─── */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' }, flex: 1,
          background: 'linear-gradient(160deg, #1d4ed8cc 0%, #1e3a8a 100%)',
          flexDirection: 'column', justifyContent: 'space-between', p: 5,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '1rem', lineHeight: 1.1 }}>SafeComm</Typography>
              <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Blotter Administration</Typography>
            </Box>
          </Box>

          <Box>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <RecordVoiceOver sx={{ fontSize: 34, color: 'white' }} />
              </Box>
              <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '1.7rem', lineHeight: 1.25, mb: 1.5 }}>
                Blotter Officer<br />Portal
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.7, mb: 3 }}>
                Access your assigned blotter cases, walk-in reports, and community incident management tools.
              </Typography>
              {[
                'Walk-in report intake',
                'Case classification & management',
                'AI-assisted risk prediction',
                'Community incident analytics',
              ].map(item => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>{item}</Typography>
                </Box>
              ))}
            </motion.div>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.75, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Lock sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
            <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
              Authorized personnel only. All access and actions are logged for accountability.
            </Typography>
          </Box>
        </Box>

        {/* ── Right login form ─── */}
        <Box sx={{
          width: { xs: '100%', md: 420 }, flexShrink: 0,
          background: 'linear-gradient(160deg, #0f172a 0%, #071739 100%)',
          p: { xs: 3, sm: 4.5 },
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>SafeComm Blotter</Typography>
          </Box>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <Chip
              icon={<VerifiedUser sx={{ fontSize: '14px !important' }} />}
              label="Blotter Officers Only" size="small"
              sx={{ bgcolor: `${ACCENT}22`, color: '#93c5fd', fontWeight: 700, fontSize: '0.65rem', border: `1px solid ${ACCENT}44`, mb: 2.5 }}
            />
            <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '1.6rem', lineHeight: 1.2, mb: 0.75 }}>
              Sign in to Blotter Portal
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', mb: 3.5 }}>
              Enter your credentials to access the Blotter module.
            </Typography>

            {apiError && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, '& .MuiAlert-message': { fontSize: '0.82rem' } }}>
                {apiError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Email Address" type="email" {...register('email')}
                error={!!errors.email} helperText={errors.email?.message}
                fullWidth autoComplete="email"
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white', borderRadius: 2, '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: `${ACCENT}80` }, '&.Mui-focused fieldset': { borderColor: ACCENT } },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#93c5fd' },
                  '& .MuiFormHelperText-root': { color: '#f87171' },
                }}
              />
              <TextField
                label="Password" type={showPw ? 'text' : 'password'} {...register('password')}
                error={!!errors.password} helperText={errors.password?.message}
                fullWidth autoComplete="current-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw(p => !p)} edge="end" sx={{ color: 'rgba(255,255,255,0.35)', '&:hover': { color: 'rgba(255,255,255,0.7)' } }}>
                          {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white', borderRadius: 2, '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: `${ACCENT}80` }, '&.Mui-focused fieldset': { borderColor: ACCENT } },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#93c5fd' },
                  '& .MuiFormHelperText-root': { color: '#f87171' },
                }}
              />

              <Button
                type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}
                endIcon={!isSubmitting && <ArrowForward sx={{ fontSize: 18 }} />}
                sx={{
                  mt: 0.5, py: 1.5, fontWeight: 700, fontSize: '0.95rem', borderRadius: 2,
                  background: `linear-gradient(135deg, #1d4ed8, ${ACCENT})`,
                  boxShadow: `0 6px 20px ${ACCENT}50`,
                  '&:hover': { background: 'linear-gradient(135deg, #1e40af, #2563eb)', transform: 'translateY(-1px)' },
                  '&:disabled': { opacity: 0.7 },
                  transition: 'all 0.2s ease',
                }}
              >
                {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.35)' }}>Admin or VAWC Officer?</Typography>
                <Button size="small" onClick={() => router.push('/login')}
                  startIcon={<Shield sx={{ fontSize: 14 }} />}
                  sx={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.77rem', p: 0, minWidth: 0, '&:hover': { color: '#93c5fd', bgcolor: 'transparent' }, textTransform: 'none' }}>
                  Admin Portal →
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.35)' }}>Are you a resident?</Typography>
                <Button size="small" onClick={() => router.push('/resident-login')}
                  sx={{ color: '#34d399', fontWeight: 600, fontSize: '0.77rem', p: 0, minWidth: 0, '&:hover': { color: '#6ee7b7', bgcolor: 'transparent' }, textTransform: 'none' }}>
                  Resident Portal →
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
