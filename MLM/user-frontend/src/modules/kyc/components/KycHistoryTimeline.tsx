import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Circle, CheckCircle2, XCircle, Clock } from "lucide-react";
import React from "react";
import { KycRecord } from "../../../api/kyc.api";

interface KycHistoryTimelineProps {
  history: KycRecord[];
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "APPROVED":
      return {
        color: "#22c55e",
        bgColor: "#f0fdf4",
        icon: <CheckCircle2 size={18} color="#22c55e" />,
        label: "Approved",
      };
    case "REJECT":
      return {
        color: "#ef4444",
        bgColor: "#fef2f2",
        icon: <XCircle size={18} color="#ef4444" />,
        label: "Rejected",
      };
    default:
      return {
        color: "#eab308",
        bgColor: "#fefce8",
        icon: <Clock size={18} color="#eab308" />,
        label: "Pending",
      };
  }
};

export const KycHistoryTimeline: React.FC<KycHistoryTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={800} mb={3} sx={{ color: "#1e293b" }}>
        KYC Submission History
      </Typography>

      <Box sx={{ position: "relative", pl: 4 }}>
        {/* Vertical Line */}
        <Box
          sx={{
            position: "absolute",
            left: "7px",
            top: "10px",
            bottom: "10px",
            width: "2px",
            background: "linear-gradient(to bottom, #e2e8f0 0%, #cbd5e1 100%)",
            borderRadius: "4px",
          }}
        />

        <Stack spacing={3}>
          {history.map((record, index) => {
            const config = getStatusConfig(record.status);
            const isLatest = index === 0;

            return (
              <Box key={record.id} sx={{ position: "relative" }}>
                {/* Dot */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "-31px",
                    top: "4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    bgcolor: isLatest ? config.color : "#cbd5e1",
                    border: "4px solid #fff",
                    boxShadow: isLatest ? `0 0 0 4px ${config.color}20` : "none",
                    zIndex: 2,
                  }}
                />

                <Card
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: isLatest ? `1px solid ${config.color}30` : "1px solid #e2e8f0",
                    boxShadow: isLatest ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                    background: isLatest ? `linear-gradient(135deg, #ffffff 0%, ${config.bgColor} 100%)` : "#fff",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                        Attempt #{history.length - index}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(record.createdAt).format("MMM DD, YYYY • hh:mm A")}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      icon={config.icon}
                      label={config.label}
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        bgcolor: config.bgColor,
                        color: config.color,
                        border: `1px solid ${config.color}20`,
                        "& .MuiChip-icon": { color: "inherit" },
                      }}
                    />
                  </Stack>

                  {record.status === "REJECT" && record.rejectReason && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        bgcolor: "#fff1f1",
                        borderRadius: 2,
                        borderLeft: "4px solid #ef4444",
                      }}
                    >
                      <Typography variant="caption" fontWeight={700} color="#991b1b" display="block">
                        Rejection Remark:
                      </Typography>
                      <Typography variant="body2" color="#991b1b">
                        {record.rejectReason}
                      </Typography>
                    </Box>
                  )}

                  {isLatest && record.status === "APPROVED" && (
                    <Typography variant="body2" sx={{ mt: 1, color: "#166534", fontWeight: 500 }}>
                      Your KYC has been successfully verified. All features are now unlocked.
                    </Typography>
                  )}
                </Card>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};
