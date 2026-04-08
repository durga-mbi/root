import { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, CircularProgress,
    Alert, Chip, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Collapse, Paper, Button, Stack, Step, Stepper, StepLabel, Divider
} from '@mui/material';
import { 
    Eye, 
    EyeOff, 
    CreditCard, 
    Calendar, 
    ArrowUpRight, 
    ShieldCheck, 
    Hash,
    Receipt,
    Wallet,
    Info
} from 'lucide-react';
import { usePayoutHistory } from '../../hooks/payout/usePayoutHistory';
import { designConfig, alpha } from '../../config/designConfig';
import PageHeader from '../../components/common/PageHeader';

function PayoutRow({ row }: { row: any; key?: any }) {
    const [open, setOpen] = useState(false);
    const date = new Date(row.createdAt);
    const status = row.status === 'ACTIVE' ? 'Paid' : 'Pending';

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor: open ? '#f8fafc' : '' }}>
                <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Calendar size={16} color="#64748b" />
                        <Box>
                            <Typography variant="body2" fontWeight={700}>
                                {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </Box>
                    </Stack>
                </TableCell>
                <TableCell>
                    <Typography variant="body1" fontWeight={800} sx={{ color: designConfig.colors.primary.main }}>
                        ₹{Number(row.netAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Chip 
                        label={status} 
                        size="small" 
                        sx={{ 
                            fontWeight: 800, 
                            fontSize: '0.65rem',
                            bgcolor: row.status === 'ACTIVE' ? designConfig.colors.success.background : designConfig.colors.warning.background,
                            color: row.status === 'ACTIVE' ? designConfig.colors.success.main : designConfig.colors.warning.main
                        }} 
                    />
                </TableCell>
                <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CreditCard size={14} color="#64748b" />
                        <Typography variant="body2" fontWeight={600}>Bank Transfer</Typography>
                    </Stack>
                </TableCell>
                <TableCell>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={open ? <EyeOff size={14} /> : <Eye size={14} />}
                        onClick={() => setOpen(!open)}
                        sx={{ 
                            borderRadius: 2, 
                            textTransform: 'none', 
                            fontWeight: 700,
                            borderColor: alpha(designConfig.colors.primary.main, 0.2),
                            '&:hover': { background: alpha(designConfig.colors.primary.main, 0.05), borderColor: designConfig.colors.primary.main }
                        }}
                    >
                        {open ? 'Hide' : 'View'}
                    </Button>
                </TableCell>
            </TableRow>

            {/* Detailed Breakdown */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 2, p: 3, bgcolor: '#ffffff', borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, md: 7 }}>
                                    <Typography variant="subtitle2" fontWeight={800} mb={3} display="flex" alignItems="center" gap={1}>
                                        <Hash size={18} /> Transaction Details
                                    </Typography>
                                    
                                    <Stack spacing={2}>
                                        <Box display="flex" justifyContent="space-between" p={1.5} sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}>
                                            <Typography variant="body2" color="text.secondary">Payout ID</Typography>
                                            <Typography variant="body2" fontWeight={700}>PAY-TXN-{row.id}-{row.payoutId}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" p={1.5} sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}>
                                            <Typography variant="body2" color="text.secondary">Reference ID</Typography>
                                            <Typography variant="body2" fontWeight={700}>Cycle: {row.payout?.payoutCycle || 'N/A'}</Typography>
                                        </Box>
                                        <Box p={2} sx={{ bgcolor: alpha(designConfig.colors.primary.main, 0.03), borderRadius: 3, border: '1px dashed', borderColor: alpha(designConfig.colors.primary.main, 0.2) }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Payout Breakdown</Typography>
                                            <Stack spacing={1} mt={1.5}>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Gross Amount</Typography>
                                                    <Typography variant="body2" fontWeight={700}>₹{Number(row.totalAmount).toFixed(2)}</Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" color="error.main">TDS Deduction (5%)</Typography>
                                                    <Typography variant="body2" fontWeight={700} color="error.main">-₹{Number(row.tdsAmount).toFixed(2)}</Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" color="error.main">Admin Charges (5%)</Typography>
                                                    <Typography variant="body2" fontWeight={700} color="error.main">-₹{Number(row.adminCharges).toFixed(2)}</Typography>
                                                </Box>
                                                <Divider sx={{ my: 1 }} />
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body1" fontWeight={800}>Amount Disbursed</Typography>
                                                    <Typography variant="body1" fontWeight={900} color="primary.main">₹{Number(row.netAmount).toFixed(2)}</Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Grid>
                                
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Typography variant="subtitle2" fontWeight={800} mb={3} display="flex" alignItems="center" gap={1}>
                                        <ArrowUpRight size={18} /> Payout Status Timeline
                                    </Typography>
                                    
                                    <Stepper orientation="vertical" activeStep={row.status === 'ACTIVE' ? 3 : 1} sx={{ ml: 1 }}>
                                        <Step>
                                            <StepLabel optional={<Typography variant="caption">{date.toLocaleDateString()}</Typography>}>
                                                <Typography variant="body2" fontWeight={700}>Calculation Completed</Typography>
                                            </StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel optional={<Typography variant="caption">Approval Stage</Typography>}>
                                                <Typography variant="body2" fontWeight={700}>Admin Approved</Typography>
                                            </StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel>
                                                <Typography variant="body2" fontWeight={700} color={row.status === 'ACTIVE' ? 'success.main' : 'text.disabled'}>
                                                    Disbursement Success
                                                </Typography>
                                            </StepLabel>
                                        </Step>
                                    </Stepper>

                                    <Box mt={4} p={2} sx={{ bgcolor: designConfig.colors.success.background, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                        <ShieldCheck size={20} color={designConfig.colors.success.main} />
                                        <Box>
                                            <Typography variant="body2" fontWeight={800} color={designConfig.colors.success.main}>Secure Transaction</Typography>
                                            <Typography variant="caption" color="text.secondary">This payout has been verified and processed via bank transfer.</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

const SUMMARY_CARDS = (data: any) => [
    { label: 'Total Withdrawn', value: `₹${Number(data?.data?.reduce((acc: number, cur: any) => acc + Number(cur.netAmount), 0) || 0).toLocaleString()}`, color: designConfig.colors.primary.main, icon: <Wallet size={20} /> },
    { label: 'Pending Payouts', value: `₹0.00`, color: designConfig.colors.warning.main, icon: <Info size={20} /> },
    { label: 'Total Service Fees', value: `₹${Number(data?.data?.reduce((acc: number, cur: any) => acc + Number(cur.adminCharges), 0) || 0).toLocaleString()}`, color: designConfig.colors.error.main, icon: <Receipt size={20} /> },
];

const Payouts = () => {
    const { data, isLoading, isError } = usePayoutHistory();

    if (isLoading) return (
        <Box sx={{ pb: 4, bgcolor: designConfig.colors.background.light, minHeight: "100vh" }}>
            <PageHeader title="Payout History" />
            <Box p={5} textAlign="center">
                <CircularProgress />
                <Typography variant="body2" mt={2} color="text.secondary">Recovering payout records...</Typography>
            </Box>
        </Box>
    );

    if (isError) return (
        <Box sx={{ pb: 4, bgcolor: designConfig.colors.background.light, minHeight: "100vh" }}>
            <PageHeader title="Payout History" />
            <Box p={5}>
                <Alert severity="error">Failed to load payout history. Please check your network.</Alert>
            </Box>
        </Box>
    );

    const payouts: any[] = data?.data || [];

    return (
        <Box sx={{ pb: 4, bgcolor: designConfig.colors.background.light, minHeight: "100vh" }}>
            <PageHeader title="Payout History" />

            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="body2" color="text.secondary" mb={4}>View your bank transfer records and disbursement timelines</Typography>

                {/* Summary Grid */}
                <Grid container spacing={3} mb={5}>
                    {SUMMARY_CARDS(data).map((s) => (
                        <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
                            <Card sx={{ 
                                borderRadius: 4, 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)', 
                                border: '1px solid #e2e8f0',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: designConfig.shadows.md, transition: '0.2s' }
                            }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(s.color, 0.1), color: s.color }}>
                                        {s.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b' }}>{s.value}</Typography>
                                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>{s.label}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Payout Statement Table */}
                <Typography variant="subtitle1" fontWeight={800} mb={3} display="flex" alignItems="center" gap={1}>
                    <Receipt size={20} color={designConfig.colors.primary.main} /> Bank Disbursement Statement
                </Typography>

                {payouts.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 3 }}>
                        No payout records found yet. Withdrawals are processed according to the payout cycle.
                    </Alert>
                ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                                    <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Net Disbursed</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Method</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payouts.map((row: any) => (
                                    <PayoutRow key={row.id} row={row} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

export default Payouts;
