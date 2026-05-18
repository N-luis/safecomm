"use client";

import React from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import BoltIcon from "@mui/icons-material/Bolt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* NAVBAR */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* LEFT SIDE */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#111",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                SafeComm
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#888",
                  letterSpacing: 1,
                }}
              >
                BARANGAY MANAGEMENT
              </Typography>
            </Stack>

            {/* RIGHT SIDE */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              {/* <Typography
                sx={{
                  color: "#111",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Login
              </Typography> */}

              {/*<Button
                variant="contained"
                sx={{
                  backgroundColor: "#00796b",
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2.5,
                  "&:hover": {
                    backgroundColor: "#00695c",
                  },
                }}
              >
                Create Account
              </Button>*/}

        <Button
         type="button"
         onClick={() => router.push('/sign')}
         variant="contained"
         sx={{
           backgroundColor: "#00796b",
           px: 3,
           py: 1,
           borderRadius: "10px",
           textTransform: "none",
           boxShadow: "0 8px 20px rgba(0, 121, 107, 0.25)",
           "&:hover": {
             backgroundColor: "#00695c",
           },
         }}
       >
         Log in
       </Button>

            </Stack>
          </Toolbar>
        </AppBar>

        {/* HERO SECTION */}
        <Container maxWidth="lg" sx={{ flex: 1 }}>
          <Box
            sx={{
              py: 10,
            }}
          >
            {/* SMALL TEXT */}
            <Typography
              sx={{
                color: "#00897b",
                letterSpacing: 4,
                fontSize: "0.75rem",
                mb: 3,
              }}
            >
              TRUSTED GOVERNANCE
            </Typography>

            {/* MAIN TITLE */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                maxWidth: "750px",
                lineHeight: 1.2,
                fontSize: {
                  xs: "2.5rem",
                  md: "4.5rem",
                },
              }}
            >
              Secure, Accessible, and Efficient{" "}
              <Box
                component="span"
                sx={{
                  color: "#00796b",
                }}
              >
                Barangay Services
              </Box>{" "}
              for Everyone.
            </Typography>

            {/* DESCRIPTION */}
            <Typography
              sx={{
                color: "#666",
                mt: 4,
                maxWidth: "620px",
                lineHeight: 1.8,
              }}
            >
              Welcome to SafeComm. We provide a centralized
              platform for residents to report cases, and stay informed about community safety
              measures with institutional clarity.
            </Typography>

            {/* BUTTONS */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 5,
              }}
            >
              <Button
              type="button"
              onClick={() => router.push('/create')}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: "#00796b",
                px: 4,
                py: 1.5,
                borderRadius: "10px",
                textTransform: "none",
                boxShadow: "0 8px 20px rgba(0, 121, 107, 0.25)",
                "&:hover": {
                backgroundColor: "#00695c",
            },
      }}
    >
     Get Started
        </Button>

            {/* <Button
                variant="outlined"
                sx={{
                  borderColor: "#ccc",
                  color: "#333",
                  px: 4,
                  py: 1.5,
                  borderRadius: "10px",
                  textTransform: "none",
                }}
              >
                Learn More
              </Button> */}
            </Stack>

            {/* CENTER TEXT */}
            <Typography
              align="center"
              sx={{
                mt: 12,
                mb: 6,
                color: "#777",
                fontSize: "0.9rem",
              }}
            >
              Your safety and privacy are the cornerstones of our
              digital infrastructure.
            </Typography>

            {/* FEATURE CARDS */}
            <Grid container columns={12} spacing={3}>
              {/* CARD 1 */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: "18px",
                    boxShadow: "none",
                    border: "1px solid #ececec",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "12px",
                        backgroundColor: "#b2dfdb",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <SecurityIcon
                        sx={{ color: "#00695c" }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Enterprise-Grade Security
                    </Typography>

                    <Typography
                      sx={{
                        color: "#666",
                        lineHeight: 1.8,
                      }}
                    >
                      We utilize state-of-the-art encryption to
                      ensure all resident data and case reports
                      remain confidential and tamper-proof.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* CARD 2 */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: "18px",
                    boxShadow: "none",
                    border: "1px solid #ececec",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "12px",
                        backgroundColor: "#b2dfdb",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <AccessibilityNewIcon
                        sx={{ color: "#00695c" }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Universal Accessibility
                    </Typography>

                    <Typography
                      sx={{
                        color: "#666",
                        lineHeight: 1.8,
                      }}
                    >
                      The interface is optimized for all devices
                      and follows international accessibility
                      standards, ensuring no resident is left
                      behind.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* CARD 3 */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: "18px",
                    boxShadow: "none",
                    border: "1px solid #ececec",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "12px",
                        backgroundColor: "#b2dfdb",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <BoltIcon
                        sx={{ color: "#00695c" }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Instant Processing
                    </Typography>

                    <Typography
                      sx={{
                        color: "#666",
                        lineHeight: 1.8,
                      }}
                    >
                      Say goodbye to long queues. SafeComm
                      streamlines document requests and case
                      reporting for immediate barangay action.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>

        {/* FOOTER */}
       <Box
  component="footer"
  sx={{
    width: "100%",
    borderTop: "1px solid #e5e7eb",
    py: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    textAlign: "center",
  }}
>
  <Box>
    <Typography
      sx={{
        fontWeight: 700,
        color: "#111827",
      }}
    >
      SafeComm
    </Typography>

    <Typography
      sx={{
        color: "#6b7280",
        fontSize: "0.9rem",
        mt: 0.5,
      }}
    >
      © 2026 Barangay Management System.
      All rights reserved.
    </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}