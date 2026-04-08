// src/pages/Dashboard/Dashboard.tsx
import { Box } from "@mui/material";

// import AtCapAgents from "../components/dashboard/AtCapAgents";
import Card from "../components/dashboard/Card";
import PendingKYCApprovals from "../components/dashboard/PendingKYCApprovals";

const DashboardPage = () => {
  return (
    <Box
      sx={{
        px: { xs: 0.5, md: 1 },
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* Title */}
      {/* <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 3 }}
      >
        Dashboard Overview
      </Typography> */}

      {/* Top Cards Row */}
      <Box sx={{ mb: 2 }}>
        <Card />
      </Box>

      {/* Main Dashboard Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
          alignItems: "stretch",
        }}
      >


        <Box sx={{ display: "flex" }}>
          <PendingKYCApprovals />
        </Box>

        {/* <Box
          sx={{
            gridColumn: {
              xs: "span 1",
              md: "span 2",
            },
          }}
        >
          <RecentOrders />
        </Box> */}
      </Box>
    </Box>
  );
};

export default DashboardPage;