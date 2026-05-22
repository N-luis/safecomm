"use client";

import React, { useState } from "react";

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
  Stack,
  TextField,
  Typography,
} from "@mui/material";

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

const drawerWidth = 260;

const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: "User Management",
    icon: <GroupOutlinedIcon />,
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

const stats = [
  {
    title: "TOTAL RESIDENTS",
    value: "12,482",
    icon: <PersonOutlineOutlinedIcon />,
    badge: "+2.4%",
    color: "#0f766e",
    bg: "#ecfeff",
  },
  {
    title: "ACTIVE CASES",
    value: "42",
    icon: <AssignmentOutlinedIcon />,
    badge: "8 Pending",
    color: "#d97706",
    bg: "#fff7ed",
  },
  {
    title: "ACTIVE ALERTS",
    value: "3",
    icon: <WarningAmberRoundedIcon />,
    color: "#dc2626",
    bg: "#fef2f2",
    border: true,
  },
  {
    title: "SAFETY INDEX",
    value: "94.8%",
    icon: <AssessmentOutlinedIcon />,
    badge: "This Month",
    color: "#475569",
    bg: "#f1f5f9",
  },
];

const activities = [
  {
    title: "New Case Filed",
    description:
      "Noise complaint reported at Block 12, Area B.",
    color: "#2563eb",
  },
  {
    title: "Case Resolved",
    description:
      "Dispute at Barangay Plaza successfully mediated.",
    color: "#059669",
  },
  {
    title: "System Update",
    description:
      "AI Risk models updated for Q4 analytics.",
    color: "#d97706",
  },
  {
    title: "New Resident Registered",
    description:
      "L. Santos added to Zone 4 digital registry.",
    color: "#6b7280",
  },
];

export default function DashboardPage() {
  const [selectedMenu, setSelectedMenu] =
    useState("Dashboard");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
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
                letterSpacing: 1,
              }}
            >
              BARANGAY MANAGEMENT
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* MENU */}
      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => {}}
            sx={{
              borderRadius: "12px",
              mb: 1,
              borderLeft:
                selectedMenu === item.label
                  ? "4px solid #14b8a6"
                  : "4px solid transparent",

              backgroundColor:
                selectedMenu === item.label
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",

              transition: "0.2s",

              "&:hover": {
                backgroundColor:
                  "rgba(255,255,255,0.08)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  selectedMenu === item.label
                    ? "#ffffff"
                    : "#94a3b8",

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
          <Avatar>A</Avatar>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              Captain A. Reyes
            </Typography>

            <Typography
              sx={{
                fontSize: "0.82rem",
                color: "#94a3b8",
              }}
            >
              Main Admin
            </Typography>
          </Box>
        </Stack>
      </Box>
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >
      {/* MOBILE DRAWER */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: {
            xs: "block",
            lg: "none",
          },

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background:
              "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
            color: "#ffffff",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* DESKTOP DRAWER */}
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            lg: "block",
          },

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
        {drawerContent}
      </Drawer>

      {/* MAIN */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
        }}
      >
        {/* HEADER */}
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            {/* MOBILE MENU BUTTON */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                display: {
                  xs: "flex",
                  lg: "none",
                },
              }}
            >
              <MenuOutlinedIcon />
            </IconButton>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {selectedMenu}
              </Typography>

              <Typography
                sx={{
                  color: "#6b7280",
                  mt: 1,
                }}
              >
                Monday, May 22, 2026 •
                09:42 AM
              </Typography>
            </Box>
          </Stack>

          {/* SEARCH */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Quick search..."
              size="small"
              sx={{
                width: 250,
                backgroundColor: "#ffffff",
                borderRadius: "12px",
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

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

        {/* STATS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              xl: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {stats.map((item) => (
            <Card
              key={item.title}
              sx={{
                borderRadius: "18px",
                border: item.border
                  ? "2px solid #dc2626"
                  : "1px solid #e5e7eb",

                boxShadow:
                  "0px 4px 18px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      backgroundColor:
                        item.bg,
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
                    <Chip
                      label={item.badge}
                      size="small"
                    />
                  )}
                </Stack>

                <Typography
                  sx={{
                    mt: 3,
                    color: "#9ca3af",
                    fontSize: "0.8rem",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    mt: 1,
                    fontWeight: 800,
                    color: item.color,
                  }}
                >
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "2fr 1fr",
            },
            gap: 3,
            mt: 4,
          }}
        >
          {/* CHART */}
          <Card
            sx={{
              borderRadius: "20px",
              border: "1px solid #e5e7eb",
              minHeight: 420,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                sx={{
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Crime & Security Trends
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Last 6 Months
                </Button>
              </Stack>

              <Box
                sx={{
                  height: 260,
                  borderRadius: "16px",
                  border:
                    "1px dashed #d1d5db",
                  background:
                    "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
                }}
              />

              <Stack
                direction="row"
                spacing={4}
                sx={{
                  mt: 4,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor:
                        "#14b8a6",
                    }}
                  />

                  <Typography>
                    Reported Incidents
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor:
                        "#cbd5e1",
                    }}
                  />

                  <Typography>
                    Resolved Cases
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* ACTIVITIES */}
          <Card
            sx={{
              borderRadius: "20px",
              border: "1px solid #e5e7eb",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                }}
              >
                Recent Activities
              </Typography>

              <Stack spacing={3}>
                {activities.map(
                  (activity) => (
                    <Stack
                      key={activity.title}
                      direction="row"
                      spacing={2}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius:
                            "50%",
                          backgroundColor:
                            `${activity.color}15`,
                          color:
                            activity.color,
                          display: "flex",
                          justifyContent:
                            "center",
                          alignItems:
                            "center",
                          fontWeight: 700,
                        }}
                      >
                        •
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {activity.title}
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              "#6b7280",
                            fontSize:
                              "0.92rem",
                            mt: 0.5,
                          }}
                        >
                          {
                            activity.description
                          }
                        </Typography>
                      </Box>
                    </Stack>
                  )
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}