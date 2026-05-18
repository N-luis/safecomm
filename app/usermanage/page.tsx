"use client";

import React from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AddIcon from "@mui/icons-material/Add";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const drawerWidth = 260;

const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: "User Management",
    icon: <GroupOutlinedIcon />,
    active: true,
  },
  {
    label: "Case Monitoring",
    icon: <DescriptionOutlinedIcon />,
  },
  {
    label: "AI Risk Analytics",
    icon: <PsychologyOutlinedIcon />,
  },
  {
    label: "Reports",
    icon: <AssessmentOutlinedIcon />,
  },
  {
    label: "Notifications",
    icon: <NotificationsOutlinedIcon />,
  },
  {
    label: "Search",
    icon: <SearchOutlinedIcon />,
  },
  {
    label: "Audit Logs",
    icon: <AssignmentOutlinedIcon />,
  },
];

const users = [
  {
    name: "Elena Reyes",
    email: "elena.reyes@barangay.gov",
    role: "VAWC Officer",
    status: "Active",
    joined: "Oct 12, 2023",
  },
  {
    name: "Ricardo Santos",
    email: "r.santos@barangay.gov",
    role: "Blotter Officer",
    status: "Active",
    joined: "Jan 05, 2024",
  },
  {
    name: "Maria Clara",
    email: "m.clara@barangay.gov",
    role: "Admin Assistant",
    status: "Inactive",
    joined: "Nov 20, 2022",
  },
  {
    name: "Juan Luna",
    email: "juan.luna@barangay.gov",
    role: "Security Officer",
    status: "Active",
    joined: "Feb 14, 2024",
  },
];

const stats = [
  {
    title: "TOTAL STAFF",
    value: "24",
    badge: "+2 New",
    icon: <BadgeOutlinedIcon />,
    color: "#14b8a6",
    bg: "#ecfeff",
  },
  {
    title: "TOTAL RESIDENTS",
    value: "1,402",
    badge: "",
    icon: <GroupsOutlinedIcon />,
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    title: "PENDING APPROVALS",
    value: "5",
    badge: "Priority",
    icon: <Inventory2OutlinedIcon />,
    color: "#f97316",
    bg: "#fff7ed",
  },
];

export default function UserManagementPage() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >
      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background:
              "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
            borderRight: "none",
            color: "#ffffff",
          },
        }}
      >
        {/* LOGO */}
        <Box sx={{ p: 3 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                backgroundColor: "#14b8a6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SecurityOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                }}
              >
                SafeComm
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: "#5eead4",
                }}
              >
                Barangay Management
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* MENU */}
        <List sx={{ px: 2, mt: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.label}
              sx={{
                borderRadius: "12px",
                mb: 1,
                borderLeft: item.active
                  ? "4px solid #14b8a6"
                  : "4px solid transparent",

                backgroundColor: item.active
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",

                "&:hover": {
                  backgroundColor:
                    "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#cbd5e1",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
              />
            </ListItemButton>
          ))}
        </List>

        {/* USER */}
        <Box
          sx={{
            mt: "auto",
            p: 3,
          }}
        >
          <Divider
            sx={{
              borderColor:
                "rgba(255,255,255,0.08)",
              mb: 3,
            }}
          />

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Avatar>H</Avatar>

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                Hon. Dela Cruz
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.82rem",
                  color: "#94a3b8",
                }}
              >
                Barangay Captain
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Drawer>

      {/* MAIN */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 4,
            py: 2.5,
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#111827",
              }}
            >
              User Management
            </Typography>

            <Stack
              direction="row"
              spacing={1}
            >
              <IconButton>
                <NotificationsOutlinedIcon />
              </IconButton>

              <IconButton>
                <CalendarMonthOutlinedIcon />
              </IconButton>

              <IconButton>
                <SettingsOutlinedIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {/* CONTENT */}
        <Box sx={{ p: 4 }}>
          {/* TABS + BUTTON */}
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={4}
            >
              <Typography
                sx={{
                  color: "#0f766e",
                  fontWeight: 700,
                  borderBottom:
                    "2px solid #14b8a6",
                  pb: 1,
                  cursor: "pointer",
                }}
              >
                Staff Members
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Residents
              </Typography>
            </Stack>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#0f766e",
                textTransform: "none",
                borderRadius: "10px",
                px: 3,
                py: 1.2,

                "&:hover": {
                  backgroundColor: "#115e59",
                },
              }}
            >
              Add New Member
            </Button>
          </Stack>

          {/* SEARCH */}
          <Card
            sx={{
              borderRadius: "18px",
              border: "1px solid #e5e7eb",
              mb: 3,
            }}
          >
            <CardContent>
              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                spacing={2}
              >
                <TextField
                fullWidth
                placeholder="Search by name, role, or ID..."
                slotProps={{
                    input: { // Replaces InputProps for better TypeScript support
                    startAdornment: (
                <InputAdornment position="start">
            <SearchOutlinedIcon />
            </InputAdornment>
            ),
        },
        }}
    />

                <TextField
                  select
                  defaultValue="All Roles"
                  sx={{
                    minWidth: 180,
                  }}
                >
                  <MenuItem value="All Roles">
                    All Roles
                  </MenuItem>
                </TextField>

                <TextField
                  select
                  defaultValue="All Status"
                  sx={{
                    minWidth: 180,
                  }}
                >
                  <MenuItem value="All Status">
                    All Status
                  </MenuItem>
                </TextField>
              </Stack>
            </CardContent>
          </Card>

          {/* TABLE */}
          <Card
            sx={{
              borderRadius: "18px",
              border: "1px solid #e5e7eb",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>NAME</TableCell>
                    <TableCell>ROLE</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell>JOINED DATE</TableCell>
                    <TableCell align="right">
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.name}
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            alignItems: "center",
                          }}
                        >
                          <Avatar>
                            {user.name.charAt(0)}
                          </Avatar>

                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 700,
                              }}
                            >
                              {user.name}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: "0.82rem",
                                color: "#64748b",
                              }}
                            >
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        {user.role}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          sx={{
                            backgroundColor:
                              user.status ===
                              "Active"
                                ? "#dcfce7"
                                : "#e2e8f0",

                            color:
                              user.status ===
                              "Active"
                                ? "#15803d"
                                : "#475569",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {user.joined}
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            justifyContent:
                              "flex-end",
                          }}
                        >
                          <IconButton size="small">
                            <BadgeOutlinedIcon />
                          </IconButton>

                          <IconButton size="small">
                            <BlockOutlinedIcon />
                          </IconButton>

                          <IconButton size="small">
                            <MoreVertOutlinedIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* FOOTER */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop:
                  "1px solid #e5e7eb",
              }}
            >
              <Stack
                direction="row"
                sx={{
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                  }}
                >
                  Showing 1 to 4 of 24 members
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                >
                  <Button
                    variant="outlined"
                    size="small"
                  >
                    1
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                  >
                    2
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                  >
                    3
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Card>

          {/* STATS */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3,1fr)",
              },
              gap: 3,
              mt: 4,
            }}
          >
            {stats.map((item) => (
              <Card
                key={item.title}
                sx={{
                  borderRadius: "18px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "12px",
                        backgroundColor: item.bg,
                        display: "flex",
                        justifyContent:
                          "center",
                        alignItems: "center",
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </Box>

                    {item.badge && (
                      <Typography
                        sx={{
                          color: item.color,
                          fontWeight: 700,
                          fontSize: "0.82rem",
                        }}
                      >
                        {item.badge}
                      </Typography>
                    )}
                  </Stack>

                  <Typography
                    sx={{
                      mt: 3,
                      color: "#64748b",
                      fontSize: "0.82rem",
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mt: 1,
                      color: "#111827",
                    }}
                  >
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}