import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { CheckCircle2, Star, Zap, Award, TrendingUp, ShieldCheck } from "lucide-react";
import React from "react";

export interface Plan {
  id: number;
  planName: string;
  price: number;
  BV: number;
  dp_amount: number;
  Description: string;
  status: string;
  features?: string[];
}

interface PlanCardProps {
  plan: Plan;
  isActive: boolean;
  onBuy: (plan: Plan) => void;
  isPopular?: boolean;
}

const getPlanIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("basic") || n.includes("starter")) return <Zap size={24} />;
  if (n.includes("premium") || n.includes("gold")) return <Award size={24} />;
  if (n.includes("elite") || n.includes("diamond")) return <Star size={24} />;
  return <TrendingUp size={24} />;
};

const getPlanTheme = (name: string, isActive: boolean) => {
  const n = name.toLowerCase();
  let baseColor = "#3b82f6"; // Blue default
  if (n.includes("premium") || n.includes("gold")) baseColor = "#f59e0b"; // Amber
  if (n.includes("elite") || n.includes("diamond")) baseColor = "#8b5cf6"; // Violet
  if (n.includes("basic")) baseColor = "#10b981"; // Emerald

  return {
    main: baseColor,
    light: alpha(baseColor, 0.1),
    lighter: alpha(baseColor, 0.05),
    dark: alpha(baseColor, 0.8),
    border: isActive ? baseColor : "#e2e8f0",
    shadow: isActive ? `0 0 20px ${alpha(baseColor, 0.3)}` : "0 4px 12px rgba(0,0,0,0.05)",
  };
};

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isActive, onBuy, isPopular }: PlanCardProps) => {
  const theme = getPlanTheme(plan.planName, isActive);
  const icon = getPlanIcon(plan.planName);

  const features = plan.features || [
    "Unlimited access to basic features",
    `Earn ${plan.BV} BV Points on purchase`,
    "Instant payout eligibility",
    "Priority support",
  ];

  return (
    <Card
      sx={{
        borderRadius: 5,
        border: `2px solid ${theme.border}`,
        boxShadow: theme.shadow,
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 12px 30px ${alpha(theme.main, 0.15)}`,
        },
        background: isActive ? `linear-gradient(135deg, #ffffff 0%, ${theme.lighter} 100%)` : "#fff",
      }}
    >
      {isPopular && !isActive && (
        <Box
          sx={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: theme.main,
            color: "#fff",
            px: 2,
            py: 0.5,
            borderRadius: 10,
            fontSize: "0.75rem",
            fontWeight: 800,
            zIndex: 1,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          MOST POPULAR
        </Box>
      )}

      {isActive && (
        <Box
          sx={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "#10b981",
            color: "#fff",
            px: 2,
            py: 0.5,
            borderRadius: 10,
            fontSize: "0.75rem",
            fontWeight: 800,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <ShieldCheck size={14} /> ACTIVE PLAN
        </Box>
      )}

      <Box sx={{ p: 4, pb: 2, textAlign: "center" }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            bgcolor: theme.light,
            color: theme.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" fontWeight={900} sx={{ color: "#0f172a", mb: 1 }}>
          {plan.planName}
        </Typography>
        <Stack direction="row" justifyContent="center" alignItems="baseline" spacing={0.5} mb={2}>
          <Typography variant="h3" fontWeight={900} color="primary" sx={{ letterSpacing: "-0.02em" }}>
            ₹{plan.price}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            / one-time
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
          <Chip
            label={`${plan.BV} BV Points`}
            size="small"
            sx={{
              bgcolor: "#f1f5f9",
              fontWeight: 700,
              color: "#475569",
              borderRadius: 1.5,
            }}
          />
          <Chip
            label={`DP: ₹${plan.dp_amount}`}
            size="small"
            sx={{
              bgcolor: theme.lighter,
              fontWeight: 700,
              color: theme.main,
              borderRadius: 1.5,
              border: `1px solid ${alpha(theme.main, 0.1)}`,
            }}
          />
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Box sx={{ p: 4, pt: 2, flexGrow: 1 }}>
        <Typography variant="subtitle2" fontWeight={800} color="text.secondary" mb={2}>
          BENEFITS & EARNINGS
        </Typography>
        <List sx={{ p: 0 }}>
          {features.map((feature: string, index: number) => (
            <ListItem key={index} sx={{ px: 0, py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <CheckCircle2 size={18} color={theme.main} />
              </ListItemIcon>
              <ListItemText
                primary={feature}
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: 500,
                  color: "#334155",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 4, pt: 0 }}>
        <Button
          fullWidth
          variant={isActive ? "outlined" : "contained"}
          color={isActive ? "success" : "primary"}
          size="large"
          onClick={() => onBuy(plan)}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 800,
            boxShadow: isActive ? "none" : `0 8px 20px ${alpha(theme.main, 0.25)}`,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          {isActive ? "Re-purchase Plan" : "Get Started Now"}
        </Button>
      </Box>
    </Card>
  );
};
