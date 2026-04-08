import { Box, Typography, Container, Paper, Stack, Button, IconButton, Divider, Tab, Tabs, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { useState } from "react";
import designConfig from "../../config/designConfig";
import { useMyOrders } from "../../hooks/useEcommerce";

const Order = () => {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    
    const { data: ordersData, isLoading } = useMyOrders();
    const orders = ordersData?.data || [];

    // Filter orders
    const activeOrders = orders.filter((o: any) => 
        !['DELIVERED', 'CANCELLED'].includes(o.orderStatus)
    );
    const completedOrders = orders.filter((o: any) => 
        ['DELIVERED', 'CANCELLED'].includes(o.orderStatus)
    );

    const currentOrders = tabValue === 0 ? activeOrders : completedOrders;

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (isLoading) {
        return <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff", pb: 10 }}>
            {/* Header */}
            <Box sx={{ position: "sticky", top: 0, zIndex: 1100, bgcolor: "#fff", borderBottom: '1px solid #f0f0f0' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => navigate('/home')}><KeyboardArrowLeftIcon /></IconButton>
                    <Typography variant="h5" fontWeight={900} color="primary">My Orders</Typography>
                </Box>

                <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                    <Tab label={`Active (${activeOrders.length})`} />
                    <Tab label={`History (${completedOrders.length})`} />
                </Tabs>
            </Box>

            <Container sx={{ px: 2, mt: 2 }}>
                <Stack spacing={2}>
                    {currentOrders.length > 0 ? (
                        currentOrders.map((order: any) => (
                            <Paper key={order.id} onClick={() => navigate(`/order-tracking/${order.id}`)} sx={{ p: 2, borderRadius: 3, border: '1px solid #e0e0e0', cursor: 'pointer' }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ width: 60, height: 60, bgcolor: '#f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Inventory2OutlinedIcon />
                                    </Box>
                                    <Box flex={1}>
                                        <Typography variant="subtitle2" fontWeight={700}>{order.orderNumber}</Typography>
                                        <Typography variant="caption" color="text.secondary">{new Date(order.orderDate).toLocaleDateString()}</Typography>
                                        <Typography variant="body2" color="primary" fontWeight={600}>{order.orderStatus}</Typography>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={700}>₹{order.totalPurchaseAmount}</Typography>
                                </Stack>
                            </Paper>
                        ))
                    ) : (
                        <Box textAlign="center" py={5}><Typography color="text.secondary">No orders found.</Typography></Box>
                    )}
                </Stack>
            </Container>
        </Box>
    );
};

export default Order;
