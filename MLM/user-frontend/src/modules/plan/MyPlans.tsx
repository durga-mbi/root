import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    TextField,
    Stack,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Paper,
    alpha,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { 
    TrendingUp, 
    ShieldCheck, 
    ArrowUpCircle, 
    Share2, 
    History,
    Wallet,
    Award
} from 'lucide-react';
import { sharePlanToDirect } from '../../api/plan.api';
import { getMyDirectsApi } from '../../api/user.api';
import { usePurchasesByUser } from '../../hooks/plan/usePurchasesByUser';
import { useWallet } from '../../hooks/useWallet';
import { useUserProfile } from '../../hooks/profile/useProfile';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function MyPlans() {
    const navigate = useNavigate();
    const { data: purchaseData, isLoading: isPurchasesLoading, refetch: refetchPurchases } = usePurchasesByUser();
    const { data: walletData, isLoading: isWalletLoading } = useWallet();
    const { data: userData, isLoading: isUserLoading } = useUserProfile();

    const [directs, setDirects] = useState<any[]>([]);
    const [isDirectsLoading, setIsDirectsLoading] = useState(false);
    const [sharing, setSharing] = useState(false);

    const [selectedShare, setSelectedShare] = useState<any>(null);
    const [selectedDirect, setSelectedDirect] = useState<string>('');
    const [openModal, setOpenModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const purchases = purchaseData?.data?.purchases || [];
    const wallet = walletData?.data?.data?.[0];
    const user = userData?.data;

    // Find the current active plan (latest APPROVED)
    const activePlan = purchases.find((p: any) => p.status === "APPROVED");

    useEffect(() => {
        fetchDirects();
    }, []);

    const fetchDirects = async () => {
        setIsDirectsLoading(true);
        try {
            const res = await getMyDirectsApi();
            setDirects(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDirectsLoading(false);
        }
    };

    const handleShareClick = (share: any, e: React.MouseEvent) => {
        e.stopPropagation();
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
            refetchPurchases();
        } catch (error: any) {
            toast.error(error.message || "Failed to share plan");
        } finally {
            setSharing(false);
        }
    };

    const filteredDirects = directs.filter(d => {
        const dPurchases = d.planPurchases || [];
        const hasApproved = dPurchases.some((pp: any) => pp.purchase_type === 'FIRST_PURCHASE' && pp.status === 'APPROVED');
        if (hasApproved) return false;

        const matchesSearch = (d.memberId && d.memberId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (`${d.firstName} ${d.lastName}`).toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getStatusLabel = () => {
        if (!activePlan) return 'Guest';
        if (user?.kycStatus === 'APPROVED') return 'Verified Member';
        if (user?.kycStatus === 'PENDING') return 'KYC Pending';
        return 'Active Member';
    };

    if (isPurchasesLoading || isWalletLoading || isUserLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress size={40} thickness={4} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, background: "#f8fafc", minHeight: "100vh" }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={900} sx={{ color: "#0f172a", letterSpacing: "-0.02em" }}>
                        My Memberships
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                        Manage your active plans and subscription history
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<ArrowUpCircle size={18} />}
                    onClick={() => navigate('/plan')}
                    sx={{ 
                        borderRadius: 3, 
                        px: 3, 
                        py: 1, 
                        fontWeight: 700,
                        boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
                        textTransform: "none"
                    }}
                >
                    Upgrade Plan
                </Button>
            </Stack>

            <Grid container spacing={4}>
                {/* Active Plan Hero */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    {activePlan ? (
                        <Card sx={{ 
                            borderRadius: 6, 
                            position: 'relative', 
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            color: 'white',
                            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)',
                            p: 4
                        }}>
                            {/* Decoration */}
                            <Box sx={{ 
                                position: 'absolute', top: -100, right: -100, width: 300, height: 300, 
                                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                                zIndex: 0
                            }} />

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                        <Chip 
                                            icon={<ShieldCheck size={14} color="#4ade80" />} 
                                            label="ACTIVE PLAN" 
                                            size="small"
                                            sx={{ bgcolor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', fontWeight: 800, border: '1px solid rgba(74, 222, 128, 0.2)' }}
                                        />
                                    </Stack>
                                    <Typography variant="h3" fontWeight={900} gutterBottom>
                                        {activePlan.plan?.planName}
                                    </Typography>

                                    <Grid container spacing={3} sx={{ mt: 2 }}>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>START DATE</Typography>
                                            <Typography variant="h6" fontWeight={700}>
                                                {dayjs(activePlan.createdAt).format('MMM DD, YYYY')}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>VALIDITY</Typography>
                                            <Typography variant="h6" fontWeight={700}>Lifetime</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', display: { xs: 'none', md: 'block' } }} />

                                <Box sx={{ minWidth: { md: '240px' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <TrendingUp size={14} /> EARNINGS FROM THIS PLAN
                                    </Typography>
                                    <Typography variant="h4" fontWeight={900} sx={{ my: 1, color: '#4ade80' }}>
                                        ₹{Number(wallet?.total_income || 0).toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                        Net accumulated income
                                    </Typography>
                                </Box>
                            </Stack>
                        </Card>
                    ) : (
                        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 6, border: '2px dashed #e2e8f0', bgcolor: 'white' }}>
                            <Award size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                            <Typography variant="h6" fontWeight={800} color="text.secondary">No Active Plan Found</Typography>
                            <Typography variant="body2" color="text.disabled" mb={3}>Purchase your first membership to start earning rewards.</Typography>
                            <Button variant="contained" onClick={() => navigate('/plan')} sx={{ borderRadius: 2 }}>Browse Plans</Button>
                        </Card>
                    )}
                </Grid>

                {/* Stats Sidebar */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={3}>
                        <Card sx={{ p: 3, borderRadius: 5, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <Stack spacing={2.5}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ p: 1.5, bgcolor: alpha('#6366f1', 0.1), borderRadius: 3, display: 'flex' }}>
                                        <Award size={24} color="#6366f1" />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={700}>CURRENT STATUS</Typography>
                                        <Typography variant="body1" fontWeight={800}>{getStatusLabel()}</Typography>
                                    </Box>
                                </Stack>
                                <Divider />
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ p: 1.5, bgcolor: alpha('#10b981', 0.1), borderRadius: 3, display: 'flex' }}>
                                        <TrendingUp size={24} color="#10b981" />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL MATCHED BV</Typography>
                                        <Typography variant="body1" fontWeight={800}>{wallet?.matched_bv || 0}</Typography>
                                    </Box>
                                </Stack>
                                <Divider />
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ p: 1.5, bgcolor: alpha('#f59e0b', 0.1), borderRadius: 3, display: 'flex' }}>
                                        <Wallet size={24} color="#f59e0b" />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={700}>DP BALANCE</Typography>
                                        <Typography variant="body1" fontWeight={800}>₹{Number(wallet?.balance_dp_amount || 0).toLocaleString()}</Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>
                </Grid>

                {/* Purchase History */}
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <History size={20} color="#64748b" />
                        <Typography variant="h6" fontWeight={800} color="#1e293b">Membership History</Typography>
                    </Box>
                    <TableContainer component={Paper} sx={{ borderRadius: 5, boxShadow: '0 4px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Package Name</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchases.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.disabled' }}>
                                            No purchase records found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    purchases.map((p: any) => (
                                        <TableRow key={p.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700}>{p.plan?.planName || "Unknown"}</Typography>
                                                <Typography variant="caption" color="text.secondary">BV: {p.BV}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={p.purchase_type.replace(/_/g, ' ')} 
                                                    size="small" 
                                                    variant="outlined"
                                                    sx={{ fontWeight: 600, fontSize: '0.7rem' }} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700}>₹{p.plan_amount}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{dayjs(p.createdAt).format('DD MMM, YYYY')}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={p.status} 
                                                    size="small"
                                                    color={p.status === 'APPROVED' ? 'success' : p.status === 'PENDING' ? 'warning' : 'error'}
                                                    sx={{ fontWeight: 800, borderRadius: 1.5, fontSize: '0.75rem' }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {p.purchase_type === "SHARE_PURCHASE" && p.share_status === "AVAILABLE" && p.status === "APPROVED" && (
                                                    <Button 
                                                        size="small" 
                                                        variant="contained" 
                                                        startIcon={<Share2 size={14} />}
                                                        onClick={(e) => handleShareClick(p, e)}
                                                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                                                    >
                                                        Share
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            {/* SHARE MODAL - Componentizing inside for context */}
            <Dialog open={openModal} onClose={() => !sharing && setOpenModal(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ p: 3, pb: 1, fontWeight: 900 }} component="div">
                    Assign Plan to Direct
                </DialogTitle>
                <DialogContent sx={{ p: 3, pt: 1 }}>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Search for a direct downline who doesn't have an active plan yet to assign this shared package.
                        </Typography>

                        <TextField
                            fullWidth
                            size="small"
                            label="Search Member ID or Name"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            placeholder="e.g. USER-1002"
                        />

                        <FormControl fullWidth size="small">
                            <InputLabel>Select Direct Member</InputLabel>
                            <Select
                                value={selectedDirect}
                                label="Select Direct Member"
                                onChange={(e) => setSelectedDirect(e.target.value)}
                                disabled={isDirectsLoading}
                                sx={{ borderRadius: 2 }}
                            >
                                {isDirectsLoading ? (
                                    <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} /> Loading members...</MenuItem>
                                ) : directs.length === 0 ? (
                                    <MenuItem disabled>You have no direct members yet</MenuItem>
                                ) : filteredDirects.length === 0 ? (
                                    <MenuItem disabled>No eligible members found</MenuItem>
                                ) : (
                                    filteredDirects.map((d) => (
                                        <MenuItem key={d.id} value={d.id}>
                                            {d.firstName} {d.lastName} ({d.memberId})
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setOpenModal(false)} disabled={sharing} sx={{ color: 'text.secondary', fontWeight: 700 }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmShare}
                        disabled={sharing || !selectedDirect}
                        sx={{ px: 4, borderRadius: 2, fontWeight: 800 }}
                    >
                        {sharing ? "Sharing..." : "Confirm Assign"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

