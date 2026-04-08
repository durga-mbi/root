import { Box, Container, Grid } from "@mui/material";
import designConfig from '../../config/designConfig';
import DashboardHeader from "./components/HeaderSection";
import RecentEarnings from "./components/RecentEarnings";
import RecentMembers from "./components/RecentMembers.tsx";
 
export default function Home() {
    return (
        <Box sx={{
            bgcolor: designConfig.colors.background.light,
            minHeight: "100vh",
            pb: 10,
            backgroundImage: `radial-gradient(circle at 50% 0%, ${designConfig.colors.primary.main}05 0%, transparent 50%)`
        }}>
            <Container maxWidth={false} sx={{ pt: 2, px: { xs: 2, sm: 3, md: 4 } }}>
                {/* 1. Executive Control & Metrics Header */}
                <DashboardHeader />
 
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <RecentEarnings />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <RecentMembers />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
 
 