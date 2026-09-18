'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Avatar, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Chip, IconButton, InputAdornment, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Tooltip,
  Switch, FormControlLabel, CircularProgress, Alert, Skeleton,
  Tabs, Tab, Divider,
} from '@mui/material';
import {
  Add, Search, Edit, PersonOff, PersonAdd, AdminPanelSettings, Badge, Security, Shield,
  People, Groups, Cancel, Schedule, CheckCircle, ImageNotSupported, InsertDriveFile,
  ZoomIn, Close, OpenInNew, Person, LocationOn, CalendarToday, FolderOpen, Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useSWR, { mutate } from 'swr';

const ACCENT = '#0ea5e9';

const RESIDENT_STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: typeof CheckCircle }> = {
  Pending:  { color: '#f97316', bg: '#fff7ed', label: 'Pending',  icon: Schedule },
  Active:   { color: '#22c55e', bg: '#f0fdf4', label: 'Verified', icon: CheckCircle },
  Rejected: { color: '#ef4444', bg: '#fef2f2', label: 'Rejected', icon: Cancel },
  Inactive: { color: '#94a3b8', bg: '#f8fafc', label: 'Inactive', icon: Cancel },
};

interface Resident {
  id: string; residentNumber: string; firstName: string; lastName: string;
  age: number; gender: string; barangay: string; address: string;
  contactNumber: string | null; email: string | null;
  idDocument: string | null; status: string; registeredAt: string;
}

function isImageDoc(url: string | null): boolean {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(url) || url.includes('/uploads/');
}

const ROLES = [
  { value: 'admin', label: 'Barangay Captain', color: '#8b5cf6', icon: AdminPanelSettings },
  { value: 'officer', label: 'Blotter Officer', color: '#3b82f6', icon: Badge },
  { value: 'vawc_officer', label: 'VAWC Officer', color: '#7c3aed', icon: Security },
  { value: 'system_admin', label: 'System Admin', color: '#0ea5e9', icon: Shield },
];

const ASSIGNABLE_ROLES = ROLES.filter(r => r.value !== 'system_admin');

function getRoleConfig(role: string) {
  return ROLES.find(r => r.value === role) ?? { label: role, color: '#6b7280', icon: Badge };
}

interface User {
  id: string; name: string; email: string; role: string;
  barangay: string | null; phone: string | null; active: boolean;
  createdAt: string; _count: { assignedCases: number };
}

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(r => r.json().then(d => d.data));

const MotionTableRow = motion(TableRow);

export default function AdminUsersPage() {
  const [tab, setTab] = useState<'officials' | 'residents'>('officials');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (roleFilter) params.set('role', roleFilter);
  if (showInactive) params.set('all', 'true');
  const key = `/api/users?${params.toString()}`;

  const { data: users, isLoading } = useSWR<User[]>(key, fetcher, { refreshInterval: 30000 });
  const { data: residentsData } = useSWR<{ residents: Resident[] }>('/api/residents?limit=100', fetcher, { refreshInterval: 30000 });
  const allResidents = residentsData?.residents ?? [];
  const pendingResidentCount = allResidents.filter(r => r.status === 'Pending').length;

  const roleStats = ROLES.map(r => ({ ...r, count: users?.filter(u => u.role === r.value && u.active).length ?? 0 }));

  async function handleDeactivate(user: User) {
    if (!confirm(`Deactivate ${user.name}?`)) return;
    const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { toast.success(`${user.name} deactivated`); mutate(key); }
    else { const e = await res.json(); toast.error(e.error ?? 'Failed'); }
  }

  async function handleReactivate(user: User) {
    const res = await fetch(`/api/users/${user.id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: true }) });
    if (res.ok) { toast.success(`${user.name} reactivated`); mutate(key); }
    else toast.error('Failed to reactivate');
  }

  return (
    <Box sx={{ maxWidth: 1100 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0c1e46', letterSpacing: '-0.02em' }}>User Management</Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>Manage official accounts and resident accounts in one place</Typography>
        </Box>
        {tab === 'officials' && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}
            sx={{ borderRadius: 2.5, textTransform: 'none', bgcolor: ACCENT, '&:hover': { bgcolor: '#0284c7' }, fontWeight: 600 }}>
            Add User
          </Button>
        )}
      </Box>

      {/* Tabs: Officials vs Residents */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3, minHeight: 0,
          '& .MuiTabs-indicator': { height: 3, borderRadius: 1.5, bgcolor: ACCENT },
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', minHeight: 0, py: 1.25, px: 2, color: '#64748b' },
          '& .Mui-selected': { color: `${ACCENT} !important` },
        }}
      >
        <Tab value="officials" icon={<Groups sx={{ fontSize: 18 }} />} iconPosition="start" label="Officials" />
        <Tab
          value="residents"
          icon={<People sx={{ fontSize: 18 }} />}
          iconPosition="start"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              User (Resident)
              {pendingResidentCount > 0 && (
                <Chip label={pendingResidentCount} size="small"
                  sx={{ height: 18, minWidth: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#fff7ed', color: '#f97316' }} />
              )}
            </Box>
          }
        />
      </Tabs>

      {tab === 'residents' ? (
        <ResidentsPanel residents={allResidents} />
      ) : (
      <>
      {/* Role stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {roleStats.map((r, i) => (
          <Grid key={r.value} size={{ xs: 6, sm: 3 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
              <Card sx={{ border: `1.5px solid ${r.color}22` }}>
                <CardContent sx={{ py: 2, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: r.color, lineHeight: 1 }}>
                    {isLoading ? '—' : r.count}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.25 }}>{r.label}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField size="small" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment>, sx: { borderRadius: 2 } } }}
            sx={{ minWidth: 240 }} />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Role</InputLabel>
            <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} label="Role" sx={{ borderRadius: 2 }}>
              <MenuItem value="">All Roles</MenuItem>
              {ROLES.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch checked={showInactive} onChange={e => setShowInactive(e.target.checked)} size="small" />}
            label={<Typography sx={{ fontSize: '0.85rem' }}>Show Inactive</Typography>}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', bgcolor: '#f8fafc', py: 1.5 } }}>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Cases</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => <TableCell key={j}><Skeleton variant="text" width={70} /></TableCell>)}
                  </TableRow>
                ))
              ) : !users?.length ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No users found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, i) => {
                  const rc = getRoleConfig(user.role);
                  return (
                    <MotionTableRow key={user.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, background: `${rc.color}30`, color: rc.color, fontSize: '0.8rem', fontWeight: 700, opacity: user.active ? 1 : 0.5 }}>
                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, opacity: user.active ? 1 : 0.5 }}>{user.name}</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={rc.label} size="small" sx={{ bgcolor: `${rc.color}18`, color: rc.color, fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.82rem' }}>{user.phone ?? '—'}</Typography>
                        {user.barangay && <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>{user.barangay}</Typography>}
                      </TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{user._count.assignedCases}</Typography></TableCell>
                      <TableCell>
                        <Chip label={user.active ? 'Active' : 'Inactive'} size="small"
                          sx={{ bgcolor: user.active ? '#22c55e18' : '#ef444418', color: user.active ? '#22c55e' : '#ef4444', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
                      </TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(user.createdAt).toLocaleDateString()}</Typography></TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit"><IconButton size="small" onClick={() => setEditUser(user)} sx={{ mr: 0.5 }}><Edit sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                        {user.active
                          ? <Tooltip title="Deactivate"><IconButton size="small" color="error" onClick={() => handleDeactivate(user)}><PersonOff sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                          : <Tooltip title="Reactivate"><IconButton size="small" color="success" onClick={() => handleReactivate(user)}><PersonAdd sx={{ fontSize: 17 }} /></IconButton></Tooltip>}
                      </TableCell>
                    </MotionTableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <UserFormDialog
        open={addOpen || Boolean(editUser)} mode={editUser ? 'edit' : 'add'} user={editUser}
        onClose={() => { setAddOpen(false); setEditUser(null); }}
        onSaved={() => mutate(key)}
      />
      </>
      )}
    </Box>
  );
}

// ─── Resident accounts panel (with inline ID verification) ──────────────────
function IdThumb({ url, onClick }: { url: string | null; onClick: () => void }) {
  if (!url) return (
    <Chip icon={<ImageNotSupported sx={{ fontSize: '14px !important' }} />} label="No ID" size="small"
      sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontSize: '0.68rem', height: 22 }} />
  );
  if (isImageDoc(url)) return (
    <Box sx={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="ID" style={{ width: 52, height: 38, objectFit: 'cover', borderRadius: 6, border: '1.5px solid #e2e8f0', display: 'block' }} />
      <Box sx={{ position: 'absolute', inset: 0, borderRadius: '6px', bgcolor: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, '&:hover': { opacity: 1 }, transition: 'opacity 0.15s' }}>
        <ZoomIn sx={{ fontSize: 18, color: 'white' }} />
      </Box>
    </Box>
  );
  return (
    <Chip icon={<InsertDriveFile sx={{ fontSize: '14px !important' }} />} label="PDF" size="small" onClick={onClick}
      sx={{ bgcolor: '#eff6ff', color: '#3b82f6', fontSize: '0.68rem', height: 22, cursor: 'pointer', '&:hover': { bgcolor: '#dbeafe' } }} />
  );
}

function ResidentsPanel({ residents }: { residents: Resident[] }) {
  const [filter, setFilter] = useState<'Pending' | 'Active' | 'Rejected' | 'all'>('Pending');
  const [preview, setPreview] = useState<Resident | null>(null);
  const [rejectDialog, setRejectDialog] = useState<Resident | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  const visible = filter === 'all' ? residents : residents.filter(r => r.status === filter);
  const statusStats = (['Pending', 'Active', 'Rejected'] as const).map(s => ({
    status: s, ...RESIDENT_STATUS_CONFIG[s], count: residents.filter(r => r.status === s).length,
  }));

  async function handleAction(id: string, action: 'approve' | 'reject', reason?: string) {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/residents/${id}/verify`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });
      if (res.ok) {
        toast.success(action === 'approve' ? '✓ Resident verified and activated!' : 'Resident registration rejected');
        mutate('/api/residents?limit=100');
        setPreview(null);
      } else {
        const e = await res.json();
        toast.error(e.error ?? 'Action failed');
      }
    } finally {
      setActing(null);
      setRejectDialog(null);
      setRejectReason('');
    }
  }

  const tabs = [
    { value: 'Pending' as const, label: 'Pending Review', color: '#f97316' },
    { value: 'Active' as const, label: 'Verified', color: '#22c55e' },
    { value: 'Rejected' as const, label: 'Rejected', color: '#ef4444' },
    { value: 'all' as const, label: 'All Residents', color: '#64748b' },
  ];

  return (
    <Box>
      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statusStats.map((s, i) => {
          const StatIcon = s.icon;
          return (
            <Grid key={s.status} size={{ xs: 6, sm: 4 }}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                <Card sx={{ border: `1.5px solid ${s.color}22` }}>
                  <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <StatIcon sx={{ fontSize: 19, color: s.color }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.count}</Typography>
                      <Typography sx={{ fontSize: '0.74rem', color: '#64748b' }}>{s.label}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <Chip key={t.value} label={t.value === 'Pending' && filter === 'Pending' ? `${t.label} (${visible.length})` : t.label}
              onClick={() => setFilter(t.value)}
              sx={{
                bgcolor: filter === t.value ? `${t.color}15` : '#f1f5f9',
                color: filter === t.value ? t.color : '#64748b',
                fontWeight: filter === t.value ? 700 : 400,
                border: filter === t.value ? `1px solid ${t.color}30` : '1px solid transparent',
                cursor: 'pointer', fontSize: '0.78rem',
              }} />
          ))}
        </Box>
        <Button variant="outlined" size="small" startIcon={<Refresh />} onClick={() => mutate('/api/residents?limit=100')}
          sx={{ borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: ACCENT, color: ACCENT } }}>
          Refresh
        </Button>
      </Box>

      {filter === 'Pending' && visible.length > 0 && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
          Click the ID thumbnail or <strong>View</strong> to inspect the submitted document. Approving activates the resident&apos;s account so they can sign in.
        </Alert>
      )}

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', bgcolor: '#f8fafc', py: 1.5 } }}>
                <TableCell>Resident</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Submitted ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <FolderOpen sx={{ fontSize: 38, color: '#e2e8f0', display: 'block', mx: 'auto', mb: 1 }} />
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                      {filter === 'Pending' ? 'No pending verifications — all caught up!' : 'No residents in this category'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {visible.map((r, i) => {
                    const sCfg = RESIDENT_STATUS_CONFIG[r.status] ?? RESIDENT_STATUS_CONFIG.Pending;
                    const StatusIcon = sCfg.icon;
                    const isActing = acting === r.id;
                    return (
                      <MotionTableRow key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -16 }} transition={{ delay: i * 0.04 }}
                        sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: `${ACCENT}22`, color: ACCENT, fontSize: '0.78rem', fontWeight: 700 }}>
                              {`${r.firstName[0]}${r.lastName[0]}`}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0c1e46' }}>{r.firstName} {r.lastName}</Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>{r.residentNumber}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                            <Typography sx={{ fontSize: '0.78rem', color: '#374151' }}>{r.age}y · {r.gender} · {r.barangay}</Typography>
                            {r.email && <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>{r.email}</Typography>}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IdThumb url={r.idDocument} onClick={() => setPreview(r)} />
                            {r.idDocument && (
                              <Button size="small" onClick={() => setPreview(r)}
                                sx={{ color: ACCENT, fontWeight: 600, fontSize: '0.72rem', minWidth: 0, px: 1, py: 0.25 }}>
                                View
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip icon={<StatusIcon sx={{ fontSize: '13px !important' }} />} label={sCfg.label} size="small"
                            sx={{ bgcolor: sCfg.bg, color: sCfg.color, fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
                        </TableCell>
                        <TableCell align="center">
                          {r.status === 'Pending' ? (
                            <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'center' }}>
                              <Tooltip title="Approve — activate account">
                                <Button size="small" variant="contained" disabled={isActing}
                                  startIcon={<CheckCircle sx={{ fontSize: 14 }} />}
                                  onClick={() => handleAction(r.id, 'approve')}
                                  sx={{ bgcolor: '#22c55e', '&:hover': { bgcolor: '#16a34a' }, borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem', py: 0.5, px: 1.25, minWidth: 72 }}>
                                  Verify
                                </Button>
                              </Tooltip>
                              <Tooltip title="Reject registration">
                                <Button size="small" variant="outlined" disabled={isActing}
                                  startIcon={<Cancel sx={{ fontSize: 14 }} />}
                                  onClick={() => { setRejectDialog(r); setRejectReason(''); }}
                                  sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' }, borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem', py: 0.5, px: 1.25, minWidth: 72 }}>
                                  Reject
                                </Button>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Button size="small" onClick={() => setPreview(r)}
                              sx={{ color: ACCENT, fontSize: '0.72rem', textTransform: 'none', fontWeight: 600 }}>
                              View
                            </Button>
                          )}
                        </TableCell>
                      </MotionTableRow>
                    );
                  })}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ID preview dialog */}
      <Dialog open={Boolean(preview)} onClose={() => setPreview(null)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        {preview && (() => {
          const s = RESIDENT_STATUS_CONFIG[preview.status] ?? RESIDENT_STATUS_CONFIG.Pending;
          const StatusIcon = s.icon;
          return (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: '#0c1e46', fontSize: '1rem' }}>{preview.firstName} {preview.lastName}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>{preview.residentNumber}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip icon={<StatusIcon sx={{ fontSize: '14px !important' }} />} label={s.label} size="small"
                      sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: '0.72rem', height: 24 }} />
                    <IconButton size="small" onClick={() => setPreview(null)}><Close fontSize="small" /></IconButton>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                  <Box sx={{ flex: 1.5, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#374151', mb: 1.25 }}>Submitted ID Document</Typography>
                    {preview.idDocument ? (
                      isImageDoc(preview.idDocument) ? (
                        <Box sx={{ borderRadius: 2.5, overflow: 'hidden', border: '1.5px solid #e2e8f0', bgcolor: '#f8fafc', textAlign: 'center' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={preview.idDocument} alt="Submitted Government ID"
                            style={{ maxWidth: '100%', maxHeight: 360, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                          <Box sx={{ px: 2, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0' }}>
                            <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>{preview.idDocument.split('/').pop()}</Typography>
                            <Button size="small" href={preview.idDocument} target="_blank" rel="noopener noreferrer"
                              startIcon={<OpenInNew sx={{ fontSize: 14 }} />} sx={{ color: ACCENT, fontWeight: 600, fontSize: '0.75rem' }}>
                              Open Full Size
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ borderRadius: 2.5, border: '1.5px solid #e2e8f0', bgcolor: '#eff6ff', p: 4, textAlign: 'center' }}>
                          <InsertDriveFile sx={{ fontSize: 48, color: '#3b82f6', mb: 1.5 }} />
                          <Typography sx={{ fontWeight: 600, color: '#0c1e46', mb: 0.5 }}>PDF Document</Typography>
                          <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mb: 2 }}>{preview.idDocument.split('/').pop()}</Typography>
                          <Button variant="outlined" href={preview.idDocument} target="_blank" rel="noopener noreferrer"
                            startIcon={<OpenInNew sx={{ fontSize: 16 }} />} sx={{ borderColor: '#3b82f6', color: '#3b82f6' }}>
                            Open PDF
                          </Button>
                        </Box>
                      )
                    ) : (
                      <Box sx={{ borderRadius: 2.5, border: '1.5px dashed #e2e8f0', p: 5, textAlign: 'center' }}>
                        <ImageNotSupported sx={{ fontSize: 40, color: '#e2e8f0', mb: 1 }} />
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>No ID document submitted</Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#374151', mb: 1.25 }}>Resident Information</Typography>
                    {[
                      { label: 'Full Name', value: `${preview.firstName} ${preview.lastName}`, icon: Person },
                      { label: 'Age / Gender', value: `${preview.age} years · ${preview.gender}`, icon: Person },
                      { label: 'Barangay', value: preview.barangay, icon: LocationOn },
                      { label: 'Address', value: preview.address, icon: LocationOn },
                      { label: 'Contact', value: preview.contactNumber ?? '—', icon: Person },
                      { label: 'Email', value: preview.email ?? '—', icon: Person },
                      { label: 'Registered', value: new Date(preview.registeredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: CalendarToday },
                    ].map(f => (
                      <Box key={f.label} sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: '#0c1e46', fontWeight: 500 }}>{f.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                {preview.status === 'Pending' && (
                  <>
                    <Divider sx={{ my: 2.5 }} />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button variant="contained" size="large" disabled={!!acting} startIcon={<CheckCircle />}
                        onClick={() => handleAction(preview.id, 'approve')}
                        sx={{ bgcolor: '#22c55e', '&:hover': { bgcolor: '#16a34a' }, borderRadius: 2, fontWeight: 700, px: 4 }}>
                        ✓ Verify & Activate Account
                      </Button>
                      <Button variant="outlined" size="large" disabled={!!acting} startIcon={<Cancel />}
                        onClick={() => { setRejectDialog(preview); setPreview(null); }}
                        sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' }, borderRadius: 2, fontWeight: 700 }}>
                        Reject
                      </Button>
                    </Box>
                  </>
                )}
              </DialogContent>
            </>
          );
        })()}
      </Dialog>

      {/* Reject reason dialog */}
      <Dialog open={Boolean(rejectDialog)} onClose={() => setRejectDialog(null)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#0c1e46' }}>Reject Registration</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          {rejectDialog && (
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
              Rejecting <strong>{rejectDialog.firstName} {rejectDialog.lastName}</strong> will prevent them from logging in. They can resubmit a clearer ID.
            </Alert>
          )}
          <TextField fullWidth size="small" multiline rows={3}
            label="Reason for rejection (shown to resident)"
            value={rejectReason} onChange={e => setRejectReason(e.target.value)}
            placeholder="e.g. ID image is blurry or unclear, invalid/expired document…"
            slotProps={{ input: { sx: { borderRadius: 2 } } }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setRejectDialog(null)} sx={{ borderRadius: 2, textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={() => rejectDialog && handleAction(rejectDialog.id, 'reject', rejectReason || undefined)}
            sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}>
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function UserFormDialog({ open, mode, user, onClose, onSaved }: {
  open: boolean; mode: 'add' | 'edit'; user: User | null; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'officer', barangay: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && mode === 'edit') setForm({ name: user.name, email: user.email, password: '', role: user.role, barangay: user.barangay ?? '', phone: user.phone ?? '' });
    else setForm({ name: '', email: '', password: '', role: 'officer', barangay: '', phone: '' });
    setError('');
  }, [open, user, mode]);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit() {
    setError('');
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required'); return; }
    if (mode === 'add' && form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setSaving(true);
    try {
      const payload: Record<string, string> = { name: form.name, email: form.email, role: form.role };
      if (form.phone) payload.phone = form.phone;
      if (form.barangay) payload.barangay = form.barangay;
      if (mode === 'add') payload.password = form.password;
      if (mode === 'edit' && form.password) payload.password = form.password;

      const res = await fetch(mode === 'add' ? '/api/users' : `/api/users/${user!.id}`, {
        method: mode === 'add' ? 'POST' : 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (res.ok) { toast.success(mode === 'add' ? 'User created!' : 'User updated!'); onSaved(); onClose(); }
      else { const e = await res.json(); setError(e.error ?? 'Failed'); }
    } finally { setSaving(false); }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{mode === 'add' ? 'Add New User' : `Edit — ${user?.name}`}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Full Name" fullWidth size="small" required value={form.name} onChange={e => set('name', e.target.value)} slotProps={{ input: { sx: { borderRadius: 2 } } }} />
          <TextField label="Email" fullWidth size="small" required value={form.email} onChange={e => set('email', e.target.value)} slotProps={{ input: { sx: { borderRadius: 2 } } }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label={mode === 'add' ? 'Password' : 'New Password (optional)'} type="password" fullWidth size="small"
            required={mode === 'add'} value={form.password} onChange={e => set('password', e.target.value)}
            helperText="Min 8 characters" slotProps={{ input: { sx: { borderRadius: 2 } } }} />
          <FormControl fullWidth size="small" required>
            <InputLabel>Role</InputLabel>
            <Select value={form.role} onChange={e => set('role', e.target.value)} label="Role" sx={{ borderRadius: 2 }}>
              {(mode === 'edit' && user?.role === 'system_admin' ? ROLES : ASSIGNABLE_ROLES).map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Phone" fullWidth size="small" value={form.phone} onChange={e => set('phone', e.target.value)} slotProps={{ input: { sx: { borderRadius: 2 } } }} />
          <TextField label="Area / Barangay" fullWidth size="small" value={form.barangay} onChange={e => set('barangay', e.target.value)} slotProps={{ input: { sx: { borderRadius: 2 } } }} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2, textTransform: 'none' }}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={saving}
          sx={{ borderRadius: 2, textTransform: 'none', bgcolor: ACCENT, '&:hover': { bgcolor: '#0284c7' } }}>
          {saving ? <CircularProgress size={20} color="inherit" /> : mode === 'add' ? 'Create User' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
