'use client';

import { useState } from 'react';
import {
  Box, Typography, Card, Chip, Button, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, IconButton, Divider,
} from '@mui/material';
import {
  VerifiedUser, Cancel, Refresh, FolderOpen, Person,
  CalendarToday, LocationOn, CheckCircle, ZoomIn,
  InsertDriveFile, ImageNotSupported, Close, Schedule,
  OpenInNew,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import toast from 'react-hot-toast';

const ACCENT = '#0ea5e9';

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: typeof CheckCircle }> = {
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

interface ResidentPage { residents: Resident[]; total: number; }

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(r => r.json().then(d => d.data));

const MotionTableRow = motion(TableRow);

function isImage(url: string | null): boolean {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(url) || url.includes('/uploads/');
}

function IdThumbnail({ url, onClick }: { url: string | null; onClick: () => void }) {
  if (!url) return (
    <Chip icon={<ImageNotSupported sx={{ fontSize: '14px !important' }} />}
      label="No ID" size="small"
      sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontSize: '0.68rem', height: 22 }} />
  );

  if (isImage(url)) return (
    <Box sx={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="ID" style={{ width: 52, height: 38, objectFit: 'cover', borderRadius: 6, border: '1.5px solid #e2e8f0', display: 'block' }} />
      <Box sx={{
        position: 'absolute', inset: 0, borderRadius: '6px',
        bgcolor: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0, '&:hover': { opacity: 1 }, transition: 'opacity 0.15s',
      }}>
        <ZoomIn sx={{ fontSize: 18, color: 'white' }} />
      </Box>
    </Box>
  );

  return (
    <Chip
      icon={<InsertDriveFile sx={{ fontSize: '14px !important' }} />}
      label="PDF"
      size="small"
      onClick={onClick}
      sx={{ bgcolor: '#eff6ff', color: '#3b82f6', fontSize: '0.68rem', height: 22, cursor: 'pointer', '&:hover': { bgcolor: '#dbeafe' } }}
    />
  );
}

function IdPreviewDialog({ resident, onClose }: { resident: Resident | null; onClose: () => void }) {
  if (!resident) return null;
  const s = STATUS_CONFIG[resident.status] ?? STATUS_CONFIG.Pending;
  const StatusIcon = s.icon;

  return (
    <Dialog open maxWidth="md" fullWidth onClose={onClose} slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 800, color: '#0c1e46', fontSize: '1rem' }}>
              {resident.firstName} {resident.lastName}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              {resident.residentNumber}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip icon={<StatusIcon sx={{ fontSize: '14px !important' }} />} label={s.label} size="small"
              sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: '0.72rem', height: 24 }} />
            <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          {/* ID Document */}
          <Box sx={{ flex: 1.5, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#374151', mb: 1.25 }}>Submitted ID Document</Typography>
            {resident.idDocument ? (
              isImage(resident.idDocument) ? (
                <Box sx={{ borderRadius: 2.5, overflow: 'hidden', border: '1.5px solid #e2e8f0', bgcolor: '#f8fafc', textAlign: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resident.idDocument}
                    alt="Submitted Government ID"
                    style={{ maxWidth: '100%', maxHeight: 380, objectFit: 'contain', display: 'block', margin: '0 auto' }}
                  />
                  <Box sx={{ px: 2, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0' }}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {resident.idDocument.split('/').pop()}
                    </Typography>
                    <Button size="small" href={resident.idDocument} target="_blank" rel="noopener noreferrer"
                      startIcon={<OpenInNew sx={{ fontSize: 14 }} />}
                      sx={{ color: ACCENT, fontWeight: 600, fontSize: '0.75rem' }}>
                      Open Full Size
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ borderRadius: 2.5, border: '1.5px solid #e2e8f0', bgcolor: '#eff6ff', p: 4, textAlign: 'center' }}>
                  <InsertDriveFile sx={{ fontSize: 48, color: '#3b82f6', mb: 1.5 }} />
                  <Typography sx={{ fontWeight: 600, color: '#0c1e46', mb: 0.5 }}>PDF Document</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mb: 2 }}>
                    {resident.idDocument.split('/').pop()}
                  </Typography>
                  <Button variant="outlined" href={resident.idDocument} target="_blank" rel="noopener noreferrer"
                    startIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                    sx={{ borderColor: '#3b82f6', color: '#3b82f6' }}>
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

          {/* Resident info */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#374151', mb: 1.25 }}>Resident Information</Typography>
            {[
              { label: 'Full Name', value: `${resident.firstName} ${resident.lastName}`, icon: Person },
              { label: 'Age / Gender', value: `${resident.age} years · ${resident.gender}`, icon: Person },
              { label: 'Barangay', value: resident.barangay, icon: LocationOn },
              { label: 'Address', value: resident.address, icon: LocationOn },
              { label: 'Contact', value: resident.contactNumber ?? '—', icon: Person },
              { label: 'Email', value: resident.email ?? '—', icon: Person },
              { label: 'Registered', value: new Date(resident.registeredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: CalendarToday },
            ].map(f => (
              <Box key={f.label} sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#0c1e46', fontWeight: 500 }}>{f.value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function IdVerificationPage() {
  const [filter, setFilter] = useState<'Pending' | 'Active' | 'Rejected' | 'all'>('Pending');
  const [rejectDialog, setRejectDialog] = useState<Resident | null>(null);
  const [previewResident, setPreviewResident] = useState<Resident | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  const params = new URLSearchParams({ limit: '50' });
  if (filter !== 'all') params.set('status', filter);
  const key = `/api/residents?${params.toString()}`;

  const { data, isLoading, mutate } = useSWR<ResidentPage>(key, fetcher, { refreshInterval: 30000 });
  const residents = data?.residents ?? [];

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
        mutate();
        setPreviewResident(null);
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
    { value: 'all' as const, label: 'All', color: '#64748b' },
  ];

  // Count badges
  const pendingCount = residents.filter(r => r.status === 'Pending').length;

  return (
    <Box sx={{ maxWidth: 1100 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0c1e46', letterSpacing: '-0.02em' }}>ID Verification</Typography>
            {pendingCount > 0 && filter !== 'Pending' && (
              <Chip label={`${pendingCount} pending`} size="small" sx={{ bgcolor: '#fff7ed', color: '#f97316', fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
            )}
          </Box>
          <Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>
            Review resident government IDs and approve or reject registrations
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />} onClick={() => mutate()} size="small"
          sx={{ borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: ACCENT, color: ACCENT } }}>
          Refresh
        </Button>
      </Box>

      {/* Filter tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <Chip key={t.value} label={t.value === 'Pending' && filter === 'Pending' ? `${t.label} (${residents.length})` : t.label}
            onClick={() => setFilter(t.value)}
            sx={{
              bgcolor: filter === t.value ? `${t.color}15` : '#f1f5f9',
              color: filter === t.value ? t.color : '#64748b',
              fontWeight: filter === t.value ? 700 : 400,
              border: filter === t.value ? `1px solid ${t.color}30` : '1px solid transparent',
              cursor: 'pointer', fontSize: '0.78rem',
            }}
          />
        ))}
      </Box>

      {filter === 'Pending' && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
          Click the ID thumbnail or <strong>View</strong> to see the full document before deciding. Approving sets the account to <strong>Active</strong> and allows the resident to log in.
        </Alert>
      )}

      <Card>
        {isLoading ? (
          <Box sx={{ p: 2.5 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="40%" height={22} />
                  <Skeleton variant="text" width="65%" height={16} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : residents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 9 }}>
            <FolderOpen sx={{ fontSize: 44, color: '#e2e8f0', display: 'block', mx: 'auto', mb: 1.5 }} />
            <Typography sx={{ fontWeight: 600, color: '#94a3b8', fontSize: '0.9rem' }}>
              {filter === 'Pending' ? 'No pending verifications — you\'re all caught up!' : 'No residents in this category'}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', bgcolor: '#f8fafc', py: 1.5 } }}>
                  <TableCell>Resident</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Submitted ID</TableCell>
                  <TableCell>Registered</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {residents.map((r, i) => {
                    const sCfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.Pending;
                    const StatusIcon = sCfg.icon;
                    const isActing = acting === r.id;
                    return (
                      <MotionTableRow key={r.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -16 }} transition={{ delay: i * 0.04 }}
                        sx={{ '&:hover': { bgcolor: '#f8fafc' } }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 38, height: 38, bgcolor: `${ACCENT}22`, color: ACCENT, fontSize: '0.8rem', fontWeight: 700 }}>
                              {`${r.firstName[0]}${r.lastName[0]}`}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0c1e46' }}>
                                {r.firstName} {r.lastName}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                                {r.residentNumber}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Person sx={{ fontSize: 12, color: '#94a3b8' }} />
                              <Typography sx={{ fontSize: '0.78rem', color: '#374151' }}>{r.age}y · {r.gender}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationOn sx={{ fontSize: 12, color: '#94a3b8' }} />
                              <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{r.barangay}</Typography>
                            </Box>
                            {r.email && <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>{r.email}</Typography>}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IdThumbnail url={r.idDocument} onClick={() => setPreviewResident(r)} />
                            {r.idDocument && (
                              <Tooltip title="Preview ID document">
                                <Button size="small" onClick={() => setPreviewResident(r)}
                                  sx={{ color: ACCENT, fontWeight: 600, fontSize: '0.72rem', minWidth: 0, px: 1, py: 0.25 }}>
                                  View
                                </Button>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 12, color: '#94a3b8' }} />
                            <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {new Date(r.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            icon={<StatusIcon sx={{ fontSize: '13px !important' }} />}
                            label={sCfg.label} size="small"
                            sx={{ bgcolor: sCfg.bg, color: sCfg.color, fontWeight: 700, fontSize: '0.72rem', height: 22 }}
                          />
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
                            <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'center' }}>
                              <Button size="small" onClick={() => setPreviewResident(r)}
                                sx={{ color: ACCENT, fontSize: '0.72rem', textTransform: 'none', fontWeight: 600 }}>
                                View
                              </Button>
                              {r.status !== 'Active' && (
                                <Button size="small" variant="contained" disabled={isActing}
                                  onClick={() => handleAction(r.id, 'approve')}
                                  sx={{ bgcolor: '#22c55e', '&:hover': { bgcolor: '#16a34a' }, borderRadius: 1.5, textTransform: 'none', fontSize: '0.72rem', py: 0.25, px: 1 }}>
                                  Approve
                                </Button>
                              )}
                            </Box>
                          )}
                        </TableCell>
                      </MotionTableRow>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Full ID Preview Dialog */}
      {previewResident && (
        <Box>
          <IdPreviewDialog resident={previewResident} onClose={() => setPreviewResident(null)} />
          {/* Approve / Reject inside preview */}
          {previewResident.status === 'Pending' && (
            <Dialog open maxWidth="md" fullWidth onClose={() => setPreviewResident(null)} slotProps={{ paper: { sx: { borderRadius: 3, mt: '80vh', maxHeight: '25vh' } } }}>
              <DialogContent sx={{ py: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="contained" size="large" disabled={!!acting}
                    startIcon={<CheckCircle />}
                    onClick={() => handleAction(previewResident.id, 'approve')}
                    sx={{ bgcolor: '#22c55e', '&:hover': { bgcolor: '#16a34a' }, borderRadius: 2, fontWeight: 700, px: 4 }}>
                    ✓ Verify & Activate Account
                  </Button>
                  <Button variant="outlined" size="large" disabled={!!acting}
                    startIcon={<Cancel />}
                    onClick={() => { setRejectDialog(previewResident); setPreviewResident(null); }}
                    sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' }, borderRadius: 2, fontWeight: 700 }}>
                    Reject
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          )}
        </Box>
      )}

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
            slotProps={{ input: { sx: { borderRadius: 2 } } }}
          />
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
