"use client";

import React, { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShieldIcon from "@mui/icons-material/Shield";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailIcon from "@mui/icons-material/Mail";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            flex: 1,
          }}
        >
          {/* MAIN GRID */}
          <Grid
            container
            sx={{
              minHeight: "100vh",
            }}
          >
            {/* LEFT SIDE */}
            <Grid
              size={{
                xs: 12,
                md: 7,
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                px: {
                  xs: 4,
                  md: 10,
                },
                py: {
                  xs: 8,
                  md: 0,
                },
              }}
            >
              {/* LOGO */}
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: "center",
                  mb: 5,
                }}
              >
                <ShieldIcon
                  sx={{
                    color: "#00796b",
                    fontSize: 36,
                  }}
                />

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  SafeComm
                </Typography>
              </Stack>

              {/* TITLE */}
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.15,
                  maxWidth: "700px",
                  fontSize: {
                    xs: "2.5rem",
                    md: "4.2rem",
                  },
                }}
              >
                Institutional security,
                <br />
                built for our community.
              </Typography>

              {/* DESCRIPTION */}
              <Typography
                sx={{
                  mt: 4,
                  color: "#4b5563",
                  fontSize: "1.05rem",
                  lineHeight: 1.9,
                  maxWidth: "560px",
                }}
              >
                Access your resident portal to report concerns,
                track active cases, and receive real-time
                neighborhood alerts from your local
                administration.
              </Typography>

              {/* INFO CARDS */}
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={3}
                sx={{
                  mt: 8,
                }}
              >
                {/* CARD 1 */}
                <Card
                  sx={{
                    minWidth: 230,
                    borderRadius: "18px",
                    border: "1px solid #e5e7eb",
                    boxShadow:
                      "0px 4px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <ShieldIcon
                      sx={{
                        color: "#00796b",
                        mb: 2,
                      }}
                    />

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      256-bit
                    </Typography>

                    <Typography
                      sx={{
                        color: "#6b7280",
                        mt: 1,
                      }}
                    >
                      Encrypted Protocol
                    </Typography>
                  </CardContent>
                </Card>

                {/* CARD 2 */}
                <Card
                  sx={{
                    minWidth: 230,
                    borderRadius: "18px",
                    border: "1px solid #e5e7eb",
                    boxShadow:
                      "0px 4px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <ShieldIcon
                      sx={{
                        color: "#00796b",
                        mb: 2,
                      }}
                    />

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      Verified
                    </Typography>

                    <Typography
                      sx={{
                        color: "#6b7280",
                        mt: 1,
                      }}
                    >
                      Resident Identity
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            {/* RIGHT SIDE */}
            <Grid
              size={{
                xs: 12,
                md: 5,
              }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                  "linear-gradient(to bottom right, #eef2f3, #f8fafc)",
                px: 3,
                py: {
                  xs: 6,
                  md: 0,
                },
              }}
            >
              {/* LOGIN CARD */}
              <Card
                sx={{
                  width: "100%",
                  maxWidth: 430,
                  borderRadius: "24px",
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 4,
                      md: 5,
                    },
                  }}
                >
                  {/* HEADER */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    Resident Login
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      mb: 5,
                      color: "#6b7280",
                    }}
                  >
                    Enter your credentials to secure your
                    session.
                  </Typography>

                  {/* EMAIL LABEL */}
                  <Typography
                    sx={{
                      mb: 1,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      color: "#374151",
                    }}
                  >
                    EMAIL / USERNAME
                  </Typography>

                  {/* EMAIL INPUT */}
                  <TextField
                    fullWidth
                    placeholder="e.g. resident@safecomm.gov"
                    variant="outlined"
                    sx={{
                      mb: 4,
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailIcon/>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />


                  {/* PASSWORD LABEL */}
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        color: "#374151",
                      }}
                    >
                      PASSWORD
                    </Typography>

                    <Typography
                      sx={{
                        color: "#00796b",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      FORGOT PASSWORD?
                    </Typography>
                  </Stack>

                  {/* PASSWORD INPUT */}
                  <TextField
                    fullWidth
                    type={
                      showPassword ? "text" : "password"
                    }
                    placeholder="••••••••"
                    variant="outlined"
                    sx={{
                      mb: 4,
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon />
                          </InputAdornment>
                        ),

                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPassword(
                                  !showPassword
                                )
                              }
                            >
                              <VisibilityOutlinedIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />


                  {/* LOGIN BUTTON */}
                  <Button type="button"
                    onClick={() => router.push('/dashboard')}
                    fullWidth
                    variant="contained"
                    endIcon={<LoginIcon />}
                    sx={{
                      py: 1.7,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "1rem",
                      backgroundColor: "#00796b",
                      boxShadow:
                        "0 10px 25px rgba(0,121,107,0.25)",
                      "&:hover": {
                        backgroundColor: "#00695c",
                      },
                    }}
                  >
                    Log in
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* FOOTER */}
          <Box
            sx={{
              borderTop: "1px solid #e5e7eb",
              py: 3,
              px: {
                xs: 3,
                md: 6,
              },
              backgroundColor: "#f9fafb",
            }}
          >
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
              }}
            >
              {/* LEFT */}
              <Typography
                sx={{
                  color: "#6b7280",
                  fontSize: "0.85rem",
                }}
              >
                © 2024 SafeComm Governance Systems. All Rights
                Reserved.
              </Typography>

              {/* RIGHT */}
              <Stack
                direction="row"
                spacing={4}
                sx={{
                  flexWrap: "wrap",
                }}
              >
                {[
                  "Privacy Policy",
                  "Compliance",
                  "Emergency Support",
                ].map((item) => (
                  <Typography
                    key={item}
                    sx={{
                      color: "#6b7280",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
