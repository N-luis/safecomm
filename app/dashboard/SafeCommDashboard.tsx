"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// Recharts may not be available in all environments (causes TS2307). Import dynamically with a
// fallback to avoid build-time errors when the package is not installed.
let ResponsiveContainer: any,
  Area: any,
  AreaChart: any,
  Cell: any,
  CartesianGrid: any,
  Pie: any,
  PieChart: any,
  ChartTooltip: any,
  XAxis: any,
  YAxis: any;
try {
  // @ts-ignore
  const recharts = require("recharts");
  ResponsiveContainer = recharts.ResponsiveContainer;
  Area = recharts.Area;
  AreaChart = recharts.AreaChart;
  Cell = recharts.Cell;
  CartesianGrid = recharts.CartesianGrid;
  Pie = recharts.Pie;
  PieChart = recharts.PieChart;
  ChartTooltip = recharts.Tooltip;
  XAxis = recharts.XAxis;
  YAxis = recharts.YAxis;
} catch (e) {
  // fallbacks: simple no-op components
  const noop = () => null;
  ResponsiveContainer = noop;
  Area = noop;
  AreaChart = noop;
  Cell = noop;
  CartesianGrid = noop;
  Pie = noop;
  PieChart = noop;
  ChartTooltip = noop;
  XAxis = noop;
  YAxis = noop;
}
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";

const drawerWidth = 260;

const menuItems = [
  { label: "Dashboard", icon: <DashboardOutlinedIcon /> },
  { label: "User Management", icon: <GroupOutlinedIcon /> },
  { label: "Case Monitoring", icon: <DescriptionOutlinedIcon /> },
  { label: "AI Risk Analytics", icon: <PsychologyOutlinedIcon /> },
  { label: "Reports", icon: <AssessmentOutlinedIcon /> },
  { label: "Notifications", icon: <NotificationsOutlinedIcon /> },
  { label: "Search", icon: <SearchOutlinedIcon /> },
  { label: "Audit Logs", icon: <AssignmentOutlinedIcon /> },
];

const staffMembers = [
  {
    name: "Elena Reyes",
    email: "elena.reyes@barangay.gov",
    role: "VAWC Officer",
    status: "Active",
    joinedDate: "Oct 12, 2023",
    avatar: "ER",
    color: "#0f766e",
  },
  {
    name: "Ricardo Santos",
    email: "r.santos@barangay.gov",
    role: "Blotter Officer",
    status: "Active",
    joinedDate: "Jan 05, 2024",
    avatar: "RS",
    color: "#334155",
  },
  {
    name: "Maria Clara",
    email: "m.clara@barangay.gov",
    role: "Admin Assistant",
    status: "Inactive",
    joinedDate: "Nov 20, 2022",
    avatar: "MC",
    color: "#115e59",
    pending: true,
  },
  {
    name: "Juan Luna",
    email: "juan.luna@barangay.gov",
    role: "Security Officer",
    status: "Active",
    joinedDate: "Feb 14, 2024",
    avatar: "JL",
    color: "#164e63",
  },
];

const resolutionPerformance = [
  { month: "JAN", days: 16 },
  { month: "FEB", days: 13 },
  { month: "MAR", days: 15 },
  { month: "APR", days: 24 },
  { month: "MAY", days: 18 },
  { month: "JUN", days: 23 },
];

const caseDistribution = [
  { name: "Ongoing", value: 35, color: "#089b91" },
  { name: "Resolved", value: 55, color: "#10182f" },
  { name: "Escalated", value: 10, color: "#c9181c" },
];

const registryCases = [
  {
    id: "#CAS-2023-0492",
    type: "Public Nuisance",
    status: "Ongoing",
    officer: "Officer Santos",
    date: "Oct 24, 2023",
    icon: <BusinessCenterOutlinedIcon fontSize="small" />,
    officerInitials: "OS",
    color: "#164e63",
  },
  {
    id: "#CAS-2023-0491",
    type: "Infrastructure",
    status: "Escalated",
    officer: "Officer Cruz",
    date: "Oct 22, 2023",
    icon: <ConstructionOutlinedIcon fontSize="small" />,
    officerInitials: "OC",
    color: "#0f766e",
  },
  {
    id: "#CAS-2023-0488",
    type: "Dispute Resolution",
    status: "Resolved",
    officer: "Officer Manuel",
    date: "Oct 19, 2023",
    icon: <GavelOutlinedIcon fontSize="small" />,
    officerInitials: "OM",
    color: "#64748b",
  },
];

type Overview = {
  stats: { residents: number; activeCases: number; alerts: number; safetyIndex: number };
  residents: Array<{ id: number; name: string; zone: string; status: string; risk: string }>;
  cases: Array<{ id: string; title: string; location: string; status: string; priority: string; reportedAt: string }>;
  alerts: Array<{ id: number; title: string; message: string; severity: string }>;
  activities: Array<{ title: string; description: string; color: string }>;
  trends: Array<{ month: string; reported: number; resolved: number }>;
  auditLogs: Array<{ id: number; action: string; actor: string; time: string }>;
};

type DialogState = { title: string; body: React.ReactNode } | null;

const blankCase = { title: "", location: "", priority: "Medium" };

export default function SafeCommDashboard({ initialView = "Dashboard" }: { initialView?: string }) {
  const [selectedMenu, setSelectedMenu] = useState(initialView);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ type: string; title: string; subtitle: string }>>([]);
  const [aiMessage, setAiMessage] = useState("Assess current barangay risk from active alerts and pending cases.");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [caseForm, setCaseForm] = useState(blankCase);
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState(0);
  const [userTab, setUserTab] = useState(0);
  const [staffSearch, setStaffSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("sm"));

  const loadOverview = async () => {
    const res = await fetch("/api/overview", { cache: "no-store" });
    setOverview(await res.json());
  };

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }
      const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
      const data = await res.json();
      setSearchResults(data.results);
    };
    const timeout = window.setTimeout(run, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const stats = useMemo(
    () => [
      {
        title: "TOTAL RESIDENTS",
        value: overview ? overview.stats.residents.toLocaleString() : "0",
        icon: <PersonOutlineOutlinedIcon />,
        badge: "+2.4%",
        color: "#0f766e",
        bg: "#ecfeff",
        view: "User Management",
      },
      {
        title: "ACTIVE CASES",
        value: overview ? String(overview.stats.activeCases) : "0",
        icon: <AssignmentOutlinedIcon />,
        badge: "8 Pending",
        color: "#d97706",
        bg: "#fff7ed",
        view: "Case Monitoring",
      },
      {
        title: "ACTIVE ALERTS",
        value: overview ? String(overview.stats.alerts) : "0",
        icon: <WarningAmberRoundedIcon />,
        color: "#dc2626",
        bg: "#fef2f2",
        border: true,
        view: "Notifications",
      },
      {
        title: "SAFETY INDEX",
        value: overview ? `${overview.stats.safetyIndex}%` : "0%",
        icon: <AssessmentOutlinedIcon />,
        badge: "This Month",
        color: "#475569",
        bg: "#f1f5f9",
        view: "Reports",
      },
    ],
    [overview],
  );

  const filteredStaff = useMemo(() => {
    const query = staffSearch.toLowerCase().trim();
    return staffMembers.filter((member) => {
      const matchesSearch =
        !query ||
        `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(query);
      const matchesRole = roleFilter === "All Roles" || member.role === roleFilter;
      const matchesStatus = statusFilter === "All Status" || member.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, staffSearch, statusFilter]);

  const chooseMenu = (label: string) => {
    setSelectedMenu(label);
    setMobileOpen(false);
  };

  const askAi = async () => {
    setAiLoading(true);
    setAiAnswer("");
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: aiMessage }),
    });
    const data = await res.json();
    setAiAnswer(data.answer);
    setAiLoading(false);
  };

  const createCase = async () => {
    const res = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(caseForm),
    });
    if (res.ok) {
      setCaseForm(blankCase);
      setToast("Case saved to the local database.");
      await loadOverview();
      setSelectedMenu("Case Monitoring");
    }
  };

  const openAddMember = () => {
    setDialog({
      title: "Add New Member",
      body: (
        <Stack spacing={2} sx={{ minWidth: { xs: "auto", sm: 420 } }}>
          <TextField label="Full name" placeholder="Enter staff member name" />
          <TextField label="Email" placeholder="member@barangay.gov" />
          <TextField select label="Role" defaultValue="VAWC Officer">
            {["VAWC Officer", "Blotter Officer", "Admin Assistant", "Security Officer"].map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            onClick={() => {
              setDialog(null);
              setToast("New member form is ready to connect to the database.");
            }}
          >
            Save Member
          </Button>
        </Stack>
      ),
    });
  };

  const drawerContent = (
    <Stack sx={{ height: "100%" }}>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              backgroundColor: "#14b8a6",
              display: "grid",
              placeItems: "center",
              color: "#fff",
            }}
          >
            <SecurityOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              SafeComm
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: "#5eead4", letterSpacing: 1 }}>
              BARANGAY MANAGEMENT
            </Typography>
          </Box>
        </Stack>
      </Box>

      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => chooseMenu(item.label)}
            selected={selectedMenu === item.label}
            sx={{
              borderRadius: 2,
              mb: 1,
              borderLeft: selectedMenu === item.label ? "4px solid #14b8a6" : "4px solid transparent",
              color: selectedMenu === item.label ? "#fff" : "#cbd5e1",
              "&.Mui-selected, &:hover, &.Mui-selected:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 3 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }} />
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar>A</Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>Captain A. Reyes</Typography>
            <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>Main Admin</Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );

  const panel = () => {
    if (!overview) {
      return (
        <Box sx={{ minHeight: 420, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      );
    }

    if (selectedMenu === "User Management") {
      return userManagementPanel;
    }
    if (selectedMenu === "Case Monitoring") {
      return caseMonitoringPanel;
    }
    if (selectedMenu === "AI Risk Analytics") {
      return aiPanel;
    }
    if (selectedMenu === "Reports") {
      return reportPanel;
    }
    if (selectedMenu === "Notifications") {
      return <DirectoryPanel title="Active Alerts" rows={overview.alerts.map((a) => [a.severity, a.title, a.message])} />;
    }
    if (selectedMenu === "Search") {
      return searchPanel;
    }
    if (selectedMenu === "Audit Logs") {
      return <DirectoryPanel title="Audit Logs" rows={overview.auditLogs.map((a) => [a.action, a.actor, new Date(a.time).toLocaleString()])} />;
    }
    return dashboardPanel;
  };

  const dashboardPanel = overview && (
    <Stack spacing={4}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "repeat(4, 1fr)" }, gap: 3 }}>
        {stats.map((item) => (
          <Card
            key={item.title}
            component="button"
            onClick={() => chooseMenu(item.view)}
            sx={{
              borderRadius: 2,
              border: item.border ? "2px solid #dc2626" : "1px solid #e5e7eb",
              boxShadow: "0px 4px 18px rgba(0,0,0,0.04)",
              textAlign: "left",
              cursor: "pointer",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
              "&:hover": { transform: "translateY(-3px)", boxShadow: "0 14px 32px rgba(15, 23, 42, 0.10)" },
            }}
          >
            <CardContent>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, backgroundColor: item.bg, display: "grid", placeItems: "center", color: item.color }}>
                  {item.icon}
                </Box>
                {item.badge && <Chip label={item.badge} size="small" />}
              </Stack>
              <Typography sx={{ mt: 3, color: "#6b7280", fontSize: "0.8rem", fontWeight: 800 }}>{item.title}</Typography>
              <Typography variant={compact ? "h4" : "h3"} sx={{ mt: 1, fontWeight: 800, color: item.color }}>
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 3 }}>
        <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb", minHeight: 420 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Crime & Security Trends</Typography>
              <Button variant="outlined" size="small" onClick={() => setDialog({ title: "Trend Filter", body: "Showing database-backed data for the last 6 months." })}>
                Last 6 Months
              </Button>
            </Stack>
            <Box sx={{ height: 290 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overview.trends}>
                  <defs>
                    <linearGradient id="reported" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Area type="monotone" dataKey="reported" stroke="#14b8a6" fill="url(#reported)" strokeWidth={3} />
                  <Area type="monotone" dataKey="resolved" stroke="#64748b" fill="url(#resolved)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Recent Activities</Typography>
            <Stack spacing={2.5}>
              {overview.activities.map((activity) => (
                <Button
                  key={`${activity.title}-${activity.description}`}
                  onClick={() => setDialog({ title: activity.title, body: activity.description })}
                  sx={{ justifyContent: "flex-start", p: 0.5, color: "inherit", textAlign: "left" }}
                >
                  <Stack direction="row" spacing={2}>
                    <Box sx={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: `${activity.color}15`, color: activity.color, display: "grid", placeItems: "center", fontWeight: 800 }}>
                      .
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{activity.title}</Typography>
                      <Typography sx={{ color: "#6b7280", fontSize: "0.92rem", mt: 0.5 }}>{activity.description}</Typography>
                    </Box>
                  </Stack>
                </Button>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );

  const userManagementPanel = overview && (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={userTab}
          onChange={(_, value) => setUserTab(value)}
          variant="scrollable"
          sx={{
            minHeight: 44,
            borderBottom: "1px solid #e5e7eb",
            "& .MuiTab-root": {
              minHeight: 44,
              fontWeight: 700,
              color: "#64748b",
              textTransform: "none",
            },
            "& .Mui-selected": { color: "#00897b" },
            "& .MuiTabs-indicator": { backgroundColor: "#00a19a", height: 2 },
          }}
        >
          <Tab label="Staff Members" />
          <Tab label="Residents" />
        </Tabs>
        <Button
          variant="contained"
          startIcon={<PersonAddAltOutlinedIcon />}
          onClick={openAddMember}
          sx={{ bgcolor: "#00695c", "&:hover": { bgcolor: "#00564c" } }}
        >
          Add New Member
        </Button>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          borderColor: "#e5e7eb",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.5fr 0.7fr 0.7fr" },
            gap: 2,
          }}
        >
          <TextField
            size="small"
            value={staffSearch}
            onChange={(event) => setStaffSearch(event.target.value)}
            placeholder="Search by name, role, or ID..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            size="small"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            {["All Roles", "VAWC Officer", "Blotter Officer", "Admin Assistant", "Security Officer"].map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {["All Status", "Active", "Inactive"].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {userTab === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: "#e5e7eb",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
          }}
        >
          <Box sx={{ overflowX: "auto", display: { xs: "none", md: "block" } }}>
            <Box sx={{ minWidth: 760 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 0.8fr 1.1fr 1fr",
                  gap: 2,
                  px: 3,
                  py: 2,
                  borderBottom: "1px solid #e5e7eb",
                  color: "#64748b",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  letterSpacing: 0.5,
                }}
              >
                <span>NAME</span>
                <span>ROLE</span>
                <span>STATUS</span>
                <span>JOINED DATE</span>
                <Box sx={{ textAlign: "right" }}>ACTIONS</Box>
              </Box>
              {filteredStaff.map((member) => (
                <StaffRow
                  key={member.email}
                  member={member}
                  onAction={(action) =>
                    setDialog({
                      title: `${action} ${member.name}`,
                      body: `${member.name} is a ${member.role} with ${member.status.toLowerCase()} status.`,
                    })
                  }
                />
              ))}
            </Box>
          </Box>

          <Stack spacing={1.5} sx={{ display: { xs: "flex", md: "none" }, p: 2 }}>
            {filteredStaff.map((member) => (
              <StaffMobileCard
                key={member.email}
                member={member}
                onAction={(action) =>
                  setDialog({
                    title: `${action} ${member.name}`,
                    body: `${member.name} is a ${member.role} with ${member.status.toLowerCase()} status.`,
                  })
                }
              />
            ))}
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              px: 3,
              py: 2,
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              borderTop: "1px solid #eef2f7",
              color: "#64748b",
            }}
          >
            <Typography sx={{ fontSize: "0.86rem" }}>
              Showing 1 to {filteredStaff.length} of 24 members
            </Typography>
            <Stack direction="row" spacing={0.8}>
              <IconButton size="small" onClick={() => setToast("Already on the first page.")}>
                <ChevronLeftOutlinedIcon fontSize="small" />
              </IconButton>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? "outlined" : "text"}
                  size="small"
                  onClick={() => setToast(`Page ${page} selected.`)}
                  sx={{ minWidth: 32, px: 0.5 }}
                >
                  {page}
                </Button>
              ))}
              <IconButton size="small" onClick={() => setToast("Next page selected.")}>
                <ChevronRightOutlinedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      ) : (
        <DirectoryPanel
          title="Residents"
          rows={overview.residents.map((r) => [r.name, r.zone, r.status, `${r.risk} risk`])}
        />
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, minmax(150px, 1fr))" },
          gap: 2,
          maxWidth: { lg: 780 },
        }}
      >
        <UserStatCard icon={<BadgeOutlinedIcon />} label="TOTAL STAFF" value="24" accent="+2 New" color="#0f766e" />
        <UserStatCard icon={<GroupsOutlinedIcon />} label="TOTAL RESIDENTS" value="1,402" color="#2563eb" />
        <UserStatCard icon={<PendingActionsOutlinedIcon />} label="PENDING APPROVALS" value="5" accent="Priority" color="#f97316" />
      </Box>
    </Stack>
  );

  const caseMonitoringPanel = (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: "#111827" }}>
          Case Monitoring
        </Typography>
        <Chip
          label="Live Updates"
          size="small"
          sx={{ bgcolor: "#dffbf4", color: "#00897b", fontWeight: 900 }}
        />
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }, gap: 3 }}>
        <CaseMetricCard
          title="TOTAL CASES"
          value="1,284"
          detail="+12% this month"
          icon={<FolderOpenOutlinedIcon />}
          color="#10182f"
          accent="#089b91"
          onClick={() => setDialog({ title: "Total Cases", body: "1,284 cases are recorded in the registry." })}
        />
        <CaseMetricCard
          title="ONGOING"
          value="456"
          detail="Active investigations"
          icon={<WorkOutlineOutlinedIcon />}
          color="#089b91"
          accent="#089b91"
          onClick={() => setDialog({ title: "Ongoing Cases", body: "456 cases are currently assigned for investigation." })}
        />
        <CaseMetricCard
          title="RESOLVED"
          value="792"
          detail="62% success rate"
          icon={<CheckCircleOutlineOutlinedIcon />}
          color="#10182f"
          accent="#00897b"
          onClick={() => setDialog({ title: "Resolved Cases", body: "792 cases have been closed successfully." })}
        />
        <CaseMetricCard
          title="ESCALATED"
          value="36"
          detail="Requires immediate action"
          icon={<PriorityHighOutlinedIcon />}
          color="#c9181c"
          accent="#c9181c"
          alert
          onClick={() => setDialog({ title: "Escalated Cases", body: "36 cases require immediate action from barangay leadership." })}
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 3 }}>
        <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)" }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>Resolution Performance</Typography>
                <Typography sx={{ color: "#64748b", mt: 0.5 }}>Average days to close cases by type</Typography>
              </Box>
              <Button variant="outlined" endIcon={<ChevronRightOutlinedIcon sx={{ transform: "rotate(90deg)" }} />} onClick={() => setToast("Showing last 6 months.")}>
                Last 6 Months
              </Button>
            </Stack>
            <Box sx={{ height: { xs: 280, md: 390 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={resolutionPerformance} margin={{ top: 30, right: 12, left: -20, bottom: 10 }}>
                  <defs>
                    <linearGradient id="caseDays" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#089b91" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#089b91" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#eef2f7" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontWeight: 700 }} />
                  <YAxis hide domain={[0, 30]} />
                  <ChartTooltip />
                  <Area type="monotone" dataKey="days" stroke="#089b91" fill="url(#caseDays)" strokeWidth={3} dot={{ r: 3, fill: "#089b91" }} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)" }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>Status Distribution</Typography>
            <Typography sx={{ color: "#64748b", mt: 0.5 }}>Current case load breakdown</Typography>
            <Box sx={{ height: 270, position: "relative", mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={caseDistribution} dataKey="value" innerRadius={72} outerRadius={104} startAngle={210} endAngle={-150} paddingAngle={3}>
                    {caseDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>100%</Typography>
                  <Typography sx={{ color: "#94a3b8", fontSize: "0.76rem", fontWeight: 900 }}>CASES</Typography>
                </Box>
              </Box>
            </Box>
            <Stack spacing={1.6}>
              {caseDistribution.map((item) => (
                <Stack key={item.name} direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: item.color }} />
                  <Typography sx={{ flex: 1, color: "#475569" }}>{item.name}</Typography>
                  <Typography sx={{ fontWeight: 900 }}>{item.value}%</Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", borderColor: "#e5e7eb", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ p: { xs: 2.5, md: 4 }, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>Active Cases Registry</Typography>
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" startIcon={<FilterListOutlinedIcon />} onClick={() => setToast("Case filters opened.")}>
              Filter
            </Button>
            <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => setDialog({ title: "Create Case", body: caseFormView })} sx={{ bgcolor: "#00897b", "&:hover": { bgcolor: "#00766d" } }}>
              New Case
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: { xs: "none", md: "block" }, overflowX: "auto" }}>
          <Box sx={{ minWidth: 860 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1.25fr 1.45fr 1fr 1.45fr 1.15fr 0.55fr", gap: 2, px: 4, py: 2.2, bgcolor: "#f1f5f9", color: "#64748b", fontSize: "0.78rem", fontWeight: 900, letterSpacing: 0.5 }}>
              <span>CASE ID</span>
              <span>TYPE</span>
              <span>STATUS</span>
              <span>ASSIGNED OFFICER</span>
              <span>DATE REPORTED</span>
              <Box sx={{ textAlign: "right" }}>ACTION</Box>
            </Box>
            {registryCases.map((item) => (
              <RegistryRow key={item.id} item={item} onOpen={() => setDialog({ title: item.id, body: `${item.type} is ${item.status.toLowerCase()} and assigned to ${item.officer}.` })} />
            ))}
          </Box>
        </Box>

        <Stack spacing={1.5} sx={{ display: { xs: "flex", md: "none" }, p: 2 }}>
          {registryCases.map((item) => (
            <RegistryMobileCard key={item.id} item={item} onOpen={() => setDialog({ title: item.id, body: `${item.type} is ${item.status.toLowerCase()} and assigned to ${item.officer}.` })} />
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ p: 3, bgcolor: "#f8fafc", justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}>
          <Typography sx={{ color: "#64748b", fontWeight: 700 }}>Showing 1 to 3 of 1,284 cases</Typography>
          <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: "space-between", sm: "flex-end" } }}>
            <Button variant="outlined" disabled>Previous</Button>
            <Button variant="outlined" onClick={() => setToast("Next registry page selected.")}>Next</Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );

  const aiPanel = (
    <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
      <CardContent>
        <Stack spacing={2.5}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>AI Risk Analytics</Typography>
          <TextField
            multiline
            minRows={4}
            value={aiMessage}
            onChange={(event) => setAiMessage(event.target.value)}
            placeholder="Ask for a risk assessment..."
          />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={aiLoading ? <CircularProgress color="inherit" size={18} /> : <SendOutlinedIcon />} onClick={askAi} disabled={aiLoading}>
              Analyze
            </Button>
            <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={() => setAiMessage("Assess current barangay risk from active alerts and pending cases.")}>
              Reset
            </Button>
          </Stack>
          {aiAnswer && <Alert severity="info" sx={{ whiteSpace: "pre-line" }}>{aiAnswer}</Alert>}
        </Stack>
      </CardContent>
    </Card>
  );

  const reportPanel = overview && (
    <Stack spacing={3}>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable">
        <Tab label="Overview" />
        <Tab label="Cases" />
        <Tab label="Safety" />
      </Tabs>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
        <Metric title="Resolved Cases" value={String(overview.cases.filter((c) => c.status === "Resolved").length)} />
        <Metric title="Open Alerts" value={String(overview.alerts.length)} />
        <Metric title="Monthly Index" value={`${overview.stats.safetyIndex}%`} />
      </Box>
      <DirectoryPanel title={tab === 1 ? "Case Report" : "Safety Report"} rows={overview.cases.map((c) => [c.id, c.title, c.status, c.priority])} />
    </Stack>
  );

  const searchPanel = (
    <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Search</Typography>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search residents, cases, zones..."
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchOutlinedIcon /></InputAdornment> } }}
          />
          <Stack spacing={1.5}>
            {searchResults.map((result) => (
              <Paper key={`${result.type}-${result.title}`} variant="outlined" sx={{ p: 2 }}>
                <Chip label={result.type} size="small" sx={{ mb: 1 }} />
                <Typography sx={{ fontWeight: 800 }}>{result.title}</Typography>
                <Typography sx={{ color: "#64748b" }}>{result.subtitle}</Typography>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  const caseFormView = (
    <Stack spacing={2} sx={{ minWidth: { xs: "auto", sm: 420 } }}>
      <TextField label="Case title" value={caseForm.title} onChange={(event) => setCaseForm((v) => ({ ...v, title: event.target.value }))} />
      <TextField label="Location" value={caseForm.location} onChange={(event) => setCaseForm((v) => ({ ...v, location: event.target.value }))} />
      <TextField select label="Priority" value={caseForm.priority} onChange={(event) => setCaseForm((v) => ({ ...v, priority: event.target.value }))}>
        {["Low", "Medium", "High"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
      </TextField>
      <Button variant="contained" onClick={createCase} disabled={!caseForm.title || !caseForm.location}>Save Case</Button>
    </Stack>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fb" }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: "block", lg: "none" }, "& .MuiDrawer-paper": drawerPaperSx }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: "none", lg: "block" }, width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": drawerPaperSx }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${drawerWidth}px)` }, p: { xs: 2, sm: 3, lg: 4 } }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, mb: 4, gap: 2 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { xs: "flex", lg: "none" } }}>
              <MenuOutlinedIcon />
            </IconButton>
            <Box>
              <Typography variant={compact ? "h5" : "h4"} sx={{ fontWeight: 800, color: "#111827" }}>{selectedMenu}</Typography>
              <Typography sx={{ color: "#6b7280", mt: 0.5 }}>Friday, May 22, 2026 - 09:42 AM</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              placeholder="Quick search..."
              size="small"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedMenu("Search");
              }}
              sx={{ width: { xs: "100%", sm: 250 }, backgroundColor: "#ffffff", borderRadius: 2 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchOutlinedIcon /></InputAdornment> } }}
            />
            <Tooltip title="Notifications"><IconButton onClick={() => chooseMenu("Notifications")}><Badge color="error" badgeContent={overview?.alerts.length ?? 0}><NotificationsOutlinedIcon /></Badge></IconButton></Tooltip>
            <Tooltip title="Calendar"><IconButton onClick={() => setDialog({ title: "Calendar", body: "Community mediation review is scheduled for May 23, 2026." })}><CalendarMonthOutlinedIcon /></IconButton></Tooltip>
            <Tooltip title="Settings"><IconButton onClick={() => setDialog({ title: "Settings", body: "SafeComm profile, alert thresholds, and access permissions are ready to configure." })}><SettingsOutlinedIcon /></IconButton></Tooltip>
            <Tooltip title="Controls"><IconButton onClick={() => setDialog({ title: "Dashboard Controls", body: "All visible components are clickable and connected to an action or detail panel." })}><TuneOutlinedIcon /></IconButton></Tooltip>
          </Stack>
        </Stack>
        {panel()}
      </Box>

      <Dialog open={Boolean(dialog)} onClose={() => setDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {dialog?.title}
          <IconButton onClick={() => setDialog(null)}><CloseOutlinedIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>{dialog?.body}</DialogContent>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast("")} message={toast} />
    </Box>
  );
}

const drawerPaperSx = {
  width: drawerWidth,
  boxSizing: "border-box",
  background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
  borderRight: "none",
  color: "#ffffff",
};

type StaffMember = (typeof staffMembers)[number];

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography sx={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 800 }}>{title}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>{value}</Typography>
    </Paper>
  );
}

function StaffRow({ member, onAction }: { member: StaffMember; onAction: (action: string) => void }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "2fr 1.2fr 0.8fr 1.1fr 1fr",
        gap: 2,
        alignItems: "center",
        px: 3,
        py: 2,
        borderBottom: "1px solid #eef2f7",
        "&:hover": { backgroundColor: "#f8fafc" },
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: member.color, fontSize: "0.8rem", fontWeight: 800 }}>
          {member.avatar}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{member.name}</Typography>
          <Typography sx={{ color: "#64748b", fontSize: "0.76rem", wordBreak: "break-word" }}>{member.email}</Typography>
        </Box>
      </Stack>
      <Typography sx={{ color: "#334155" }}>{member.role}</Typography>
      <Chip
        label={member.status}
        size="small"
        sx={{
          width: "fit-content",
          fontWeight: 800,
          color: member.status === "Active" ? "#059669" : "#64748b",
          bgcolor: member.status === "Active" ? "#dcfce7" : "#f1f5f9",
          border: "1px solid",
          borderColor: member.status === "Active" ? "#86efac" : "#e2e8f0",
        }}
      />
      <Typography sx={{ color: "#475569" }}>{member.joinedDate}</Typography>
      <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
        {member.pending ? (
          <Button size="small" onClick={() => onAction("Approve")} sx={{ bgcolor: "#ecfdf5", color: "#00897b", fontWeight: 800 }}>
            Approve
          </Button>
        ) : (
          <>
            <Tooltip title="Permissions">
              <IconButton size="small" onClick={() => onAction("Permissions for")}>
                <AdminPanelSettingsOutlinedIcon fontSize="small" sx={{ color: "#00897b" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Suspend">
              <IconButton size="small" onClick={() => onAction("Suspend")}>
                <BlockOutlinedIcon fontSize="small" sx={{ color: "#64748b" }} />
              </IconButton>
            </Tooltip>
          </>
        )}
        <Tooltip title="More actions">
          <IconButton size="small" onClick={() => onAction("Open actions for")}>
            <MoreVertOutlinedIcon fontSize="small" sx={{ color: "#64748b" }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}

function StaffMobileCard({ member, onAction }: { member: StaffMember; onAction: (action: string) => void }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar sx={{ bgcolor: member.color, fontWeight: 800 }}>{member.avatar}</Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 800 }}>{member.name}</Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.78rem", wordBreak: "break-word" }}>{member.email}</Typography>
          </Box>
          <Chip label={member.status} size="small" />
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between", color: "#475569" }}>
          <Typography>{member.role}</Typography>
          <Typography>{member.joinedDate}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
          {member.pending && <Button size="small" onClick={() => onAction("Approve")}>Approve</Button>}
          <IconButton size="small" onClick={() => onAction("Permissions for")}><AdminPanelSettingsOutlinedIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => onAction("Open actions for")}><MoreVertOutlinedIcon fontSize="small" /></IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}

function CaseMetricCard({
  title,
  value,
  detail,
  icon,
  color,
  accent,
  alert,
  onClick,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
  accent: string;
  alert?: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      component="button"
      onClick={onClick}
      sx={{
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        textAlign: "left",
        cursor: "pointer",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 16px 34px rgba(15, 23, 42, 0.10)" },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography sx={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 900, letterSpacing: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ color, fontWeight: 900, mt: 1 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              bgcolor: alert ? "#fee2e2" : "#e8f5f3",
              color: accent,
              display: "grid",
              placeItems: "center",
              "& svg": { fontSize: 34 },
            }}
          >
            {icon}
          </Box>
        </Stack>
        <Typography sx={{ color: alert ? "#dc2626" : accent, fontWeight: alert ? 800 : 700, mt: 2 }}>
          {detail}
        </Typography>
      </CardContent>
    </Card>
  );
}

function RegistryStatusChip({ status }: { status: string }) {
  const styles =
    status === "Escalated"
      ? { color: "#b91c1c", bgcolor: "#fee2e2", borderColor: "#fecaca" }
      : status === "Resolved"
        ? { color: "#0f766e", bgcolor: "#e0f2f1", borderColor: "#99d8d2" }
        : { color: "#00897b", bgcolor: "#dcfce7", borderColor: "#99f6e4" };

  return <Chip label={status} size="small" sx={{ width: "fit-content", fontWeight: 900, border: "1px solid", ...styles }} />;
}

type RegistryCase = (typeof registryCases)[number];

function RegistryRow({ item, onOpen }: { item: RegistryCase; onOpen: () => void }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1.25fr 1.45fr 1fr 1.45fr 1.15fr 0.55fr",
        gap: 2,
        alignItems: "center",
        px: 4,
        py: 2.5,
        borderTop: "1px solid #eef2f7",
        "&:hover": { bgcolor: "#f8fafc" },
      }}
    >
      <Typography sx={{ fontWeight: 900, color: "#111827" }}>{item.id}</Typography>
      <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", color: "#64748b" }}>
        {item.icon}
        <Typography sx={{ color: "#1f2937", fontWeight: 700 }}>{item.type}</Typography>
      </Stack>
      <RegistryStatusChip status={item.status} />
      <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: item.color, fontSize: "0.72rem", fontWeight: 900 }}>{item.officerInitials}</Avatar>
        <Typography sx={{ color: "#1f2937" }}>{item.officer}</Typography>
      </Stack>
      <Typography sx={{ color: "#64748b" }}>{item.date}</Typography>
      <Box sx={{ textAlign: "right" }}>
        <IconButton size="small" onClick={onOpen}>
          <MoreVertOutlinedIcon sx={{ color: "#94a3b8" }} />
        </IconButton>
      </Box>
    </Box>
  );
}

function RegistryMobileCard({ item, onOpen }: { item: RegistryCase; onOpen: () => void }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 900 }}>{item.id}</Typography>
            <Stack direction="row" spacing={1} sx={{ color: "#64748b", alignItems: "center", mt: 0.8 }}>
              {item.icon}
              <Typography>{item.type}</Typography>
            </Stack>
          </Box>
          <IconButton size="small" onClick={onOpen}>
            <MoreVertOutlinedIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <RegistryStatusChip status={item.status} />
          <Typography sx={{ color: "#64748b" }}>{item.date}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: item.color, fontSize: "0.7rem" }}>{item.officerInitials}</Avatar>
          <Typography>{item.officer}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

function UserStatCard({
  icon,
  label,
  value,
  accent,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
  color: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        minHeight: 130,
        borderColor: "#e5e7eb",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: `${color}12`, color, display: "grid", placeItems: "center" }}>
          {icon}
        </Box>
        {accent && <Typography sx={{ color, fontSize: "0.75rem", fontWeight: 900 }}>{accent}</Typography>}
      </Stack>
      <Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 900, letterSpacing: 0.5 }}>{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.5, color: "#111827" }}>{value}</Typography>
    </Paper>
  );
}

function DirectoryPanel({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{title}</Typography>
        <Stack spacing={1.5}>
          {rows.map((row) => (
            <Paper key={row.join("-")} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}>
                {row.map((cell, index) => (
                  <Typography key={`${cell}-${index}`} sx={{ fontWeight: index === 0 ? 800 : 500, color: index === 0 ? "#111827" : "#64748b" }}>
                    {cell}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
