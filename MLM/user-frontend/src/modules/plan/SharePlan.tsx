import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Stack,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip
} from '@mui/material';
import { getAvailableShares, sharePlanToDirect } from '../../api/plan.api';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SharePlan() {
    const [shares, setShares] = useState<any[]>([]);
    const [directs, setDirects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sharing, setSharing] = useState(false);
    
    const [selectedShare, setSelectedShare] = useState<any>(null);
    const [selectedDirect, setSelectedDirect] = useState<string>('');
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sharesRes, directData] = await Promise.all([
                getAvailableShares(),
                fetch(`${BASE_URL}/v1/users/my-directs`, { credentials: 'include' }).then(res => res.json())
            ]);
            setShares(sharesRes);
            setDirects(directData.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleShareClick = (share: any) => {
        setSelectedShare(share);
        setOpenModal(true);
    };

    const handleConfirmShare = async () => {
        if (!selectedDirect) {
            toast.error("Please select a direct member");
            return;
        }

        setSharing(true);
        try {
            await sharePlanToDirect(selectedShare.id, Number(selectedDirect));
            toast.success("Plan shared successfully!");
            setOpenModal(false);
            setSelectedDirect('');
            fetchData(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || "Failed to share plan");
        } finally {
            setSharing(false);
        }
    };

    if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

    return (
        <Box p={4}>
            <Typography variant="h4" fontWeight={800} mb={4}>
                🎁 Share Plans
            </Typography>
            
            <Typography variant="body1" color="text.secondary" mb={4}>
                You can share your purchased "Share Plans" with your direct members to activate their accounts.
            </Typography>

            {shares.length === 0 ? (
                <Alert severity="info">You don't have any available share plans. Purchase a "Share Purchase" plan first.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {shares.map((share) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={share.id}>
                            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={700} color="primary">
                                        {share.plan.planName}
                                    </Typography>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Stack spacing={1}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">Amount</Typography>
                                            <Typography variant="body2" fontWeight={600}>₹{share.plan_amount}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">BV Points</Typography>
                                            <Typography variant="body2" fontWeight={600}>{share.BV}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">Status</Typography>
                                            <Chip size="small" label={share.share_status} color="success" />
                                        </Box>
                                    </Stack>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        sx={{ mt: 3, borderRadius: 2 }}
                                        onClick={() => handleShareClick(share)}
                                    >
                                        Share with Direct
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openModal} onClose={() => !sharing && setOpenModal(false)} fullWidth maxWidth="xs">
                <DialogTitle fontWeight={700}>Select Direct Member</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Typography variant="body2">
                            Select the direct member you want to share <strong>{selectedShare?.plan?.planName}</strong> with.
                        </Typography>
                        
                        <FormControl fullWidth>
                            <InputLabel>Direct Member</InputLabel>
                            <Select
                                value={selectedDirect}
                                label="Direct Member"
                                onChange={(e) => setSelectedDirect(e.target.value)}
                            >
                                {directs.map((d) => (
                                    <MenuItem key={d.id} value={d.id}>
                                        {d.firstName} {d.lastName} ({d.memberId})
                                    </MenuItem>
                                ))}
                                {directs.length === 0 && (
                                    <MenuItem disabled>No direct members found</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenModal(false)} disabled={sharing}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleConfirmShare} 
                        disabled={sharing || !selectedDirect}
                    >
                        {sharing ? <CircularProgress size={24} /> : "Confirm Share"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
