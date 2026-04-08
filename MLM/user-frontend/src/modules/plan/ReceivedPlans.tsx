import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    CircularProgress,
    Stack,
    Divider,
    Alert,
    Chip
} from '@mui/material';
import { getReceivedShares, acceptSharedPlan } from '../../api/plan.api';
import { toast } from 'sonner';
import designConfig from '../../config/designConfig';

export default function ReceivedPlans() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getReceivedShares();
            setPlans(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id: number) => {
        setAccepting(id);
        try {
            await acceptSharedPlan(id);
            toast.success("Plan accepted successfully! Your account is now active.");
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to accept plan");
        } finally {
            setAccepting(null);
        }
    };

    const parseFeatures = (features: any): string[] => {
        if (!features) return [];
        if (Array.isArray(features)) return features;
        try { return JSON.parse(features); } catch { return []; }
    };

    if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, background: "#f4f6f9", minHeight: "100vh" }}>
            <Typography variant="h4" fontWeight={800} mb={1}>
                📩 Received Plans
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
                These are plans shared with you by your sponsor. Accept one to activate your "First Purchase".
            </Typography>

            {plans.length === 0 ? (
                <Alert severity="info">You haven't received any shared plans yet.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {plans.map((item) => {
                        const features = parseFeatures(item.plan?.features);
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item.id}>
                                <Card sx={{
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {/* Header */}
                                    <Box sx={{
                                        p: 2,
                                        background: designConfig.colors.gradients.primary,
                                        color: 'white',
                                        borderRadius: '12px 12px 0 0'
                                    }}>
                                        <Typography variant="h6" fontWeight={800}>
                                            {item.plan?.planName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.85 }}>
                                            Shared by: {item.user?.firstName} {item.user?.lastName} ({item.user?.memberId})
                                        </Typography>
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {/* Description */}
                                        {item.plan?.description && (
                                            <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontStyle: 'italic' }}>
                                                {item.plan.description}
                                            </Typography>
                                        )}

                                        <Divider sx={{ mb: 2 }} />

                                        {/* Amounts */}
                                        <Stack spacing={1.5} mb={2}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary">Plan Amount</Typography>
                                                <Typography variant="body2" fontWeight={700}>₹{item.plan_amount}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary">DP Amount</Typography>
                                                <Typography variant="body2" fontWeight={700} color="primary.main">₹{item.dp_amount}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary">BV Points</Typography>
                                                <Typography variant="body2" fontWeight={700} color="secondary.main">{item.BV}</Typography>
                                            </Box>
                                        </Stack>

                                        {/* Features */}
                                        {features.length > 0 && (
                                            <Box>
                                                <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}>
                                                    FEATURES:
                                                </Typography>
                                                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                                                    {features.map((f: string, i: number) => (
                                                        <Chip key={i} label={f} size="small" variant="outlined" color="primary" />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        )}
                                    </CardContent>

                                    {/* Action */}
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            sx={{
                                                borderRadius: 2,
                                                fontWeight: 800,
                                                py: 1.2,
                                                background: designConfig.colors.gradients.primary
                                            }}
                                            onClick={() => handleAccept(item.id)}
                                            disabled={accepting !== null}
                                        >
                                            {accepting === item.id ? <CircularProgress size={24} color="inherit" /> : "Accept & Activate"}
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
}
