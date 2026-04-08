import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { ShoppingBag, TrendingUp } from "@mui/icons-material";
import SalesImage from "../../assets/Sales.png";
import OrderImage from "../../assets/Order.png";
import PendingImage from "../../assets/Pending.png";
import { GetDashboardData } from "../../hooks/Dashboard/getDashboardData";

type StatCardData = {
  id: string;
  label: string;
  value: string | number;
  change: string;
  changeLabel: string;
  changeColor: string;
  icon?: ReactNode;
  iconColor?: string;
  image?: string;
  iconBg: string;
};

function DashboardSummaryCards() {

  const { data, isLoading, error } = GetDashboardData();

  if (isLoading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  if (error) {
    return <Typography>Error loading dashboard</Typography>;
  }

  const dashboard = data?.data;

  const statCards: StatCardData[] = [
    {
      id: "users",
      label: "Total Users",
      value: dashboard?.totalUsers ?? 0,
      change: "",
      changeLabel: "",
      changeColor: "success.main",
      icon: <ShoppingBag fontSize="small" />,
      iconColor: "#1565c0",
      iconBg: "#e3f2fd",
    },
    {
      id: "plans",
      label: "Total Plans",
      value: dashboard?.totalPlans ?? 0,
      change: "",
      changeLabel: "",
      changeColor: "success.main",
      image: SalesImage,
      iconBg: "#e8f5e9",
    },
    {
      id: "today-income",
      label: "Today Income",
      value: `₹${dashboard?.todayIncome ?? 0}`,
      change: "",
      changeLabel: "",
      changeColor: "success.main",
      image: OrderImage,
      iconBg: "rgba(254, 197, 61, 0.2)",
    },
    {
      id: "yesterday-income",
      label: "Yesterday Income",
      value: `₹${dashboard?.yesterdayIncome ?? 0}`,
      change: "",
      changeLabel: "",
      changeColor: "success.main",
      image: OrderImage,
      iconBg: "rgba(197, 225, 165, 0.3)",
    },
    {
      id: "weekly-payout",
      label: "Weekly Payout",
      value: `₹${dashboard?.weeklyPayout ?? 0}`,
      change: "",
      changeLabel: "",
      changeColor: "success.main",
      image: PendingImage,
      iconBg: "rgba(255, 204, 128, 0.3)",
    },
    {
      id: "monthly-payout",
      label: "Monthly Payout",
      value: `₹${dashboard?.monthlyPayout ?? 0}`,
      change: "",
      changeLabel: "",
      changeColor: "success.main",
      image: PendingImage,
      iconBg: "rgba(255, 144, 102, 0.2)",
    },
    {
      id: "this-month-bv",
      label: "This Month BV",
      value: dashboard?.thisMonthBV ?? 0,
      change: "",
      changeLabel: "",
      changeColor: "success.main",
      image: SalesImage,
      iconBg: "rgba(144, 202, 249, 0.3)",
    },
    {
      id: "last-month-bv",
      label: "Last Month BV",
      value: dashboard?.lastMonthBV ?? 0,
      change: "",
      changeLabel: "",
      changeColor: "success.main",
      image: SalesImage,
      iconBg: "rgba(186, 104, 200, 0.2)",
    },
    {
      id: "today-orders",
      label: "Today New Orders",
      value: dashboard?.todayNewOrders ?? 0,
      change: "",
      changeLabel: "",
      changeColor: "info.main",
      image: OrderImage,
      iconBg: "rgba(3, 169, 244, 0.2)",
    },
    {
      id: "today-delivered",
      label: "Today Delivered",
      value: dashboard?.todayDeliveredOrders ?? 0,
      change: "",
      changeLabel: "",
      changeColor: "success.main",
      image: OrderImage,
      iconBg: "rgba(76, 175, 80, 0.2)",
    },
    {
      id: "today-order-dp",
      label: "Today Order DP",
      value: `₹${dashboard?.todayTotalDpAmount ?? 0}`,
      change: "",
      changeLabel: "",
      changeColor: "secondary.main",
      image: SalesImage,
      iconBg: "rgba(156, 39, 176, 0.2)",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(auto-fit, minmax(240px, 1fr))",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {statCards.map((stat) => (
        <Paper
          key={stat.id}
          sx={{
            p: 2,
            borderRadius: 1,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
                flex: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                {stat.label}
              </Typography>

              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                {stat.value}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <TrendingUp sx={{ fontSize: 16, color: "#4caf50" }} />

                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={stat.changeColor}
                >
                  {stat.change}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {stat.changeLabel}
                </Typography>
              </Box>
            </Box>

            {stat.icon ? (
              <Box
                sx={{
                  bgcolor: stat.iconBg,
                  color: stat.iconColor,
                  width: 48,
                  height: 48,
                  borderRadius: 3.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </Box>
            ) : (
              <Box
                sx={{
                  bgcolor: stat.iconBg,
                  width: 48,
                  height: 48,
                  borderRadius: 3.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1.25,
                  flexShrink: 0,
                }}
              >
                <img
                  src={stat.image}
                  alt={stat.label}
                  style={{
                    width: "28px",
                    height: "28px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default DashboardSummaryCards;