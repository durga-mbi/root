import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { CheckCircle2, AlertCircle, XCircle, Clock, ShieldCheck, Upload } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { KycPayload } from "../../api/kyc.api";
import { useCreateKyc } from "../../hooks/Kyc/createKyc";
import { useMyKyc } from "../../hooks/Kyc/useGetKyc";
import { KycHistoryTimeline } from "./components/KycHistoryTimeline";
import { KycUploadModal } from "./components/KycUploadModal";

const getStatusTheme = (status: string | undefined) => {
  switch (status) {
    case "APPROVED":
      return {
        mainColor: "#10b981",
        gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        bgColor: "#ecfdf5",
        icon: <ShieldCheck size={48} color="#10b981" />,
        statusIcon: <CheckCircle2 size={18} />,
        label: "Verified",
        description: "Your identity has been verified. All platform features are now active.",
      };
    case "REJECT":
      return {
        mainColor: "#ef4444",
        gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        bgColor: "#fef2f2",
        icon: <XCircle size={48} color="#ef4444" />,
        statusIcon: <XCircle size={18} />,
        label: "Rejected",
        description: "Your KYC was rejected. Please review the remarks below and re-submit.",
      };
    case "PENDING":
      return {
        mainColor: "#f59e0b",
        gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        bgColor: "#fffbeb",
        icon: <Clock size={48} color="#f59e0b" />,
        statusIcon: <Clock size={18} />,
        label: "Pending Review",
        description: "Our team is currently reviewing your documents. This usually takes 24-48 hours.",
      };
    default:
      return {
        mainColor: "#64748b",
        gradient: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
        bgColor: "#f8fafc",
        icon: <AlertCircle size={48} color="#64748b" />,
        statusIcon: <AlertCircle size={18} />,
        label: "Not Uploaded",
        description: "Complete your KYC to unlock all features including withdrawals and rewards.",
      };
  }
};

export const Kyc = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: kycResponse, isLoading, refetch } = useMyKyc();
  const { mutate: submitKyc, isPending: isSubmitting } = useCreateKyc();

  const kycList = useMemo(() => kycResponse?.data ?? [], [kycResponse]);
  const latestRecord = kycList[0] ?? null;
  const kycStatus = latestRecord?.status;
  const theme = getStatusTheme(kycStatus);

  const handleKycSubmit = (payload: KycPayload) => {
    submitKyc(payload, {
      onSuccess: () => {
        toast.success("KYC documents submitted successfully");
        setIsModalOpen(false);
        refetch();
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to submit KYC");
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  const showUploadCTA = !kycStatus || kycStatus === "REJECT";

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} mb={5}>
        <Box>
          <Typography variant="h4" fontWeight={900} sx={{ color: "#0f172a", letterSpacing: "-0.02em" }}>
            Identity Verification
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
            Manage your KYC status and submission history
          </Typography>
        </Box>

        {kycStatus && (
          <Chip
            icon={theme.statusIcon}
            label={theme.label}
            sx={{
              bgcolor: theme.bgColor,
              color: theme.mainColor,
              fontWeight: 800,
              fontSize: "0.875rem",
              px: 1,
              py: 2.5,
              borderRadius: 2,
              border: `1px solid ${theme.mainColor}20`,
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
        )}
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "7fr 5fr" }, gap: 4 }}>
        {/* Left Column: Dashboard Card & Logic */}
        <Box>
          <Card
            sx={{
              p: 4,
              borderRadius: 5,
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
              background: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background Accent */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "150px",
                height: "150px",
                background: `radial-gradient(circle at top right, ${theme.mainColor}10, transparent)`,
                zIndex: 0,
              }}
            />

            <Stack spacing={4} sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
                <Box sx={{ p: 2, borderRadius: 4, bgcolor: theme.bgColor, display: "flex" }}>
                  {theme.icon}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: "#1e293b" }}>
                    {kycStatus ? `Status: ${theme.label}` : "Start Verification"}
                  </Typography>
                  <Typography color="text.secondary" sx={{ maxWidth: "400px", lineHeight: 1.6 }}>
                    {theme.description}
                  </Typography>
                </Box>
              </Box>

              {showUploadCTA && (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: kycStatus === "REJECT" ? "#fef2f2" : "#f8fafc",
                    border: kycStatus === "REJECT" ? "1px solid #fee2e2" : "1px solid #f1f5f9",
                  }}
                >
                  <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={3}>
                    <Box>
                      <Typography fontWeight={700} color={kycStatus === "REJECT" ? "#991b1b" : "#475569"}>
                        {kycStatus === "REJECT" ? "Ready to re-submit?" : "Ready to get verified?"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Have your Aadhaar and PAN cards ready.
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Upload size={18} />}
                      onClick={() => setIsModalOpen(true)}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.2,
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                      }}
                    >
                      {kycStatus === "REJECT" ? "Re-upload Documents" : "Upload KYC Now"}
                    </Button>
                  </Stack>
                </Box>
              )}

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight={800} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <ShieldCheck size={20} color="#6366f1" />
                  Why verify?
                </Typography>
                <Grid container spacing={2}>
                  {[
                    "Unlock withdrawals to bank account",
                    "Earn unlimited rewards and commissions",
                    "Enhanced account security",
                    "Compliance with regulatory guidelines",
                  ].map((benefit, idx) => (
                    <Grid key={idx} size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#6366f1" }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>{benefit}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Stack>
          </Card>
        </Box>

        {/* Right Column: History Timeline */}
        <Box>
          <KycHistoryTimeline history={kycList} />
          
          {kycList.length === 0 && !isLoading && (
            <Box
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 5,
                border: "2px dashed #e2e8f0",
                bgcolor: "#f8fafc",
                mt: 4
              }}
            >
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                No submission history found.
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Your attempts will appear here.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* KYC Upload Modal */}
      <KycUploadModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleKycSubmit}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
};