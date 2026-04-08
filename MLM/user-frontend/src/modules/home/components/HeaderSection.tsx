import {
  Box, Card, CardContent, Grid, Typography, Button,
  Skeleton, Chip, Stack, IconButton, LinearProgress
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GroupsIcon from "@mui/icons-material/Groups";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BoltIcon from "@mui/icons-material/Bolt";

import { useEffect, useState, useCallback, useMemo } from "react";
import Confetti from "react-confetti";
import { getWallet } from "../../../api/wallet.api";
import { getTeamCountApi } from "../../../api/user.api";
import { getUserProfile } from "../../../api/profile.api";
import designConfig, { alpha } from "../../../config/designConfig";
import { REFERRAL_LINK } from "../../../config/copyurl.config";
import { toast } from "sonner";

export default function DashboardHeader() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiRecycle, setConfettiRecycle] = useState(true);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [copiedLeg, setCopiedLeg] = useState<"LEFT" | "RIGHT" | null>(null);

  const [walletData, setWalletData] = useState<any>(null);
  const [teamStats, setTeamStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Get userId from localStorage
  const userdata = localStorage.getItem("data");
  const sponsorId = userdata ? JSON.parse(userdata)?.id : null;
  const baseUrl = `${REFERRAL_LINK}/signup`;

  const referralUrl = useMemo(() => (leg: "LEFT" | "RIGHT") =>
    `${baseUrl}?sponsorId=${sponsorId}&leg=${leg}`, [baseUrl, sponsorId]);

  const copyLink = useCallback((leg: "LEFT" | "RIGHT") => {
    navigator.clipboard
      .writeText(referralUrl(leg))
      .then(() => {
        setCopiedLeg(leg);
        toast.success(`${leg} referral link copied!`);
        setTimeout(() => setCopiedLeg(null), 2500);
      })
      .catch(() => toast.error("Failed to copy link"));
  }, [referralUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wallet, team, userProfile] = await Promise.all([
          getWallet(),
          getTeamCountApi(),
          getUserProfile(),
        ]);
        setWalletData(wallet.data?.data?.[0]);
        setTeamStats(team.data);
        setProfile(userProfile.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const recycleTimer = setTimeout(() => setConfettiRecycle(false), 6000);
    const stopTimer = setTimeout(() => setShowConfetti(false), 12000);
    return () => {
      clearTimeout(recycleTimer);
      clearTimeout(stopTimer);
    };
  }, []);

  const cardRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      const rect = el.getBoundingClientRect();
      if (Math.abs(rect.width - cardSize.width) > 1 || Math.abs(rect.height - cardSize.height) > 1) {
        setCardSize({ width: rect.width, height: rect.height });
      }
    }
  }, [cardSize]);

  if (loading) {
    return (
      <Box px={2} mb={2} mt={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6 }}>
                  <Skeleton variant="rectangular" height={178} sx={{ borderRadius: 4 }} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Calculate BV Match Ratio
  const totalBv = (walletData?.total_left_bv ?? 0) + (walletData?.total_right_bv ?? 0);
  const bvMatchPerc = totalBv > 0 ? (Math.min(walletData?.total_left_bv, walletData?.total_right_bv) / Math.max(walletData?.total_left_bv, walletData?.total_right_bv)) * 100 : 0;

  return (
    <Box sx={{ px: { xs: 1, md: 0 }, mb: 4, mt: 2 }}>
      <Grid container spacing={3}>
        {/* ═══════════════ SIDEBAR: THE GROWTH HUB (4 cols) ═══════════════ */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            ref={cardRef}
            sx={{
              borderRadius: '24px',
              height: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              background: `linear-gradient(165deg, #fff 0%, ${alpha(designConfig.colors.primary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(designConfig.colors.primary.main, 0.05)}`,
            }}
          >
            {showConfetti && cardSize.width > 0 && (
              <Confetti
                width={cardSize.width}
                height={cardSize.height}
                numberOfPieces={confettiRecycle ? 150 : 0}
                recycle={confettiRecycle}
                gravity={0.12}
                colors={[designConfig.colors.primary.main, designConfig.colors.secondary.main, '#FFD700']}
                style={{ position: "absolute", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }}
              />
            )}

            <CardContent sx={{ p: '32px !important', zIndex: 1, position: "relative", textAlign: 'center' }}>
              <Box sx={{
                width: 80, height: 80, borderRadius: '24px',
                background: designConfig.colors.gradients.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 3,
                boxShadow: `0 10px 20px ${alpha(designConfig.colors.primary.main, 0.3)}`,
                position: 'relative',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <EmojiEventsIcon sx={{ fontSize: 40, color: "#fff" }} />
                <Box sx={{
                  position: 'absolute', inset: -4, borderRadius: '28px',
                  border: `2px solid ${alpha(designConfig.colors.primary.main, 0.2)}`,
                  animation: 'ripple 2s linear infinite'
                }} />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.5px' }}>
                Hello, {profile?.firstName}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 3 }}>
                Member ID: <Box component="span" sx={{ color: 'primary.main' }}>{profile?.memberId}</Box>
              </Typography>

              <Stack spacing={2} sx={{ mb: 1 }}>
                {/* Holographic Referral Link Style */}
                {[
                  { leg: 'LEFT' as const, color: designConfig.colors.primary.main },
                  { leg: 'RIGHT' as const, color: designConfig.colors.secondary.main }
                ].map(({ leg, color }) => (
                  <Box key={leg} sx={{
                    p: 2, borderRadius: '16px', bgcolor: alpha(color, 0.03),
                    border: `1px solid ${alpha(color, 0.1)}`,
                    textAlign: 'left', position: 'relative',
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: alpha(color, 0.05), borderColor: alpha(color, 0.2) }
                  }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color, display: 'flex', alignItems: 'center', mb: 1, fontSize: 10 }}>
                      <BoltIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      {leg} REFERRAL COMMAND
                    </Typography>
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff',
                      p: '8px 12px', borderRadius: '10px',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                      border: `1px solid ${designConfig.colors.background.border}`
                    }}>
                      <Typography variant="caption" noWrap sx={{ flex: 1, fontWeight: 700, fontSize: 11, fontFamily: 'Monospace', opacity: 0.6 }}>
                        {referralUrl(leg)}
                      </Typography>
                      <IconButton size="small" onClick={() => copyLink(leg)} sx={{ color: copiedLeg === leg ? 'success.main' : color }}>
                        {copiedLeg === leg ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>

            <style>{`
              @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
              @keyframes ripple { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }
            `}</style>
          </Card>
        </Grid>

        {/* ═══════════════ MAIN: QUANTUM METRICS GRID (8 cols) ═══════════════ */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            {/* 📌 Pulse Wallet Card */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{
                borderRadius: '24px', boxShadow: designConfig.shadows.md, height: '100%',
                bgcolor: '#fff', border: `1px solid ${designConfig.colors.background.border}`,
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': { transform: 'scale(1.02)' }
              }}>
                <CardContent sx={{ p: '24px !important' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                    <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: alpha(designConfig.colors.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AccountBalanceWalletIcon fontSize="small" />
                    </Box>
                    <Chip label="Live Wallet" size="small" sx={{ fontWeight: 800, fontSize: 10, bgcolor: alpha(designConfig.colors.success.main, 0.08), color: designConfig.colors.success.main }} />
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 800, display: 'block', mb: 0.5, fontSize: 11 }}>TOTAL EARNED (GROSS)</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, fontSize: 36, color: 'text.primary', mb: 2, letterSpacing: '-1px' }}>
                    ₹{walletData?.total_income ?? 0}
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{ pt: 2, borderTop: `1px solid ${designConfig.colors.background.border}` }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700, fontSize: 10, display: 'block' }}>WITHDRAWS</Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>₹{walletData?.total_withdraw ?? 0}</Typography>
                    </Box>
                    <Box sx={{ flex: 1, borderLeft: `1px solid ${designConfig.colors.background.border}`, pl: 1.5 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700, fontSize: 10, display: 'block' }}>MATCHED BV</Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{walletData?.matched_bv ?? 0}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* 📌 Network Strength Card */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{
                borderRadius: '24px', boxShadow: designConfig.shadows.md, height: '100%',
                bgcolor: '#fff', border: `1px solid ${designConfig.colors.background.border}`,
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': { transform: 'scale(1.02)' }
              }}>
                <CardContent sx={{ p: '24px !important' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                    <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: alpha(designConfig.colors.secondary.main, 0.1), color: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GroupsIcon fontSize="small" />
                    </Box>
                    <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: 24 }}>{teamStats?.total?.count ?? 0}</Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 800, display: 'block', mb: 1, fontSize: 11 }}>NETWORK STRENGTH</Typography>

                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box>
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 900, display: 'block' }}>LEFT SIDE</Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: 20 }}>{teamStats?.left?.count ?? 0}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: designConfig.colors.secondary.main, display: 'block' }}>RIGHT SIDE</Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: 20 }}>{teamStats?.right?.count ?? 0}</Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={teamStats?.total?.count > 0 ? (teamStats?.left?.count / teamStats?.total?.count) * 100 : 50}
                      sx={{
                        height: 6, borderRadius: 3, bgcolor: alpha(designConfig.colors.secondary.main, 0.1),
                        '& .MuiLinearProgress-bar': { bgcolor: designConfig.colors.primary.main, borderRadius: 3 }
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* 📌 Volume Velocity Card */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{
                borderRadius: '24px', boxShadow: designConfig.shadows.md, height: '100%',
                bgcolor: '#fff', border: `1px solid ${designConfig.colors.background.border}`,
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 1.0, 1)',
              }}>
                <CardContent sx={{ p: '24px !important' }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: alpha(designConfig.colors.success.main, 0.1), color: designConfig.colors.success.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUpIcon fontSize="small" />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Business Volume</Typography>
                  </Box>

                  <Grid container spacing={2} mb={2.5}>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: alpha(designConfig.colors.primary.main, 0.04), border: `1px solid ${alpha(designConfig.colors.primary.main, 0.1)}` }}>
                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700, fontSize: 9 }}>L-BV</Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: 18, color: 'primary.main' }}>{walletData?.total_left_bv ?? 0}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: alpha(designConfig.colors.secondary.main, 0.04), border: `1px solid ${alpha(designConfig.colors.secondary.main, 0.1)}` }}>
                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700, fontSize: 9 }}>R-BV</Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: 18, color: designConfig.colors.secondary.main }}>{walletData?.total_right_bv ?? 0}</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 800, fontSize: 9 }}>MATCH VELOCITY</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: designConfig.colors.success.main }}>{bvMatchPerc.toFixed(0)}% SYNCED</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={bvMatchPerc} sx={{ mt: 0.5, height: 4, borderRadius: 2, bgcolor: alpha(designConfig.colors.success.main, 0.1), '& .MuiLinearProgress-bar': { bgcolor: designConfig.colors.success.main } }} />
                </CardContent>
              </Card>
            </Grid>

            {/* 📌 Action Control Card */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{
                borderRadius: '24px', boxShadow: designConfig.shadows.md, height: '100%',
                background: designConfig.colors.gradients.dark, color: '#fff',
                border: 'none', overflow: 'hidden', position: 'relative'
              }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <CardContent sx={{ p: '24px !important', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>Command Center</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600, mb: 3 }}>Accelerate your network growth</Typography>

                  <Stack spacing={1.5} sx={{ mt: 'auto' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      startIcon={<AccountTreeIcon />}
                      href="/genealogy"
                      sx={{
                        height: 48, borderRadius: '14px', fontWeight: 900,
                        textTransform: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                        bgcolor: designConfig.colors.secondary.main,
                        '&:hover': { bgcolor: alpha(designConfig.colors.secondary.main, 0.9) }
                      }}
                    >
                      View Genealogy
                    </Button>
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 6 }}>
                        <Button
                          variant="outlined" fullWidth onClick={() => copyLink("LEFT")}
                          sx={{ height: 40, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: 11, textTransform: 'none', '&:hover': { border: '1px solid #fff', bgcolor: 'rgba(255,255,255,0.05)' } }}
                        >
                          Copy Left
                        </Button>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Button
                          variant="outlined" fullWidth onClick={() => copyLink("RIGHT")}
                          sx={{ height: 40, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: 11, textTransform: 'none', '&:hover': { border: '1px solid #fff', bgcolor: 'rgba(255,255,255,0.05)' } }}
                        >
                          Copy Right
                        </Button>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}