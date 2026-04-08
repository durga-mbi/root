import { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, CircularProgress,
    Alert, Chip, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Collapse, Paper, Button, Stack
} from '@mui/material';
import { Eye, EyeOff, Users, Award, TrendingUp, Calendar } from 'lucide-react';
import { useIncomeHistory } from '../../hooks/income/useIncomeHistory';
import { designConfig, alpha } from '../../config/designConfig';

function IncomeRow({ row }: { row: any }) {
    const [open, setOpen] = useState(false);
    const isBinary = row.type === 'BINARY';
    const isRoyalty = row.type === 'ROYALTY';

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor: open ? 'action.hover' : '' }}>
                <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Calendar size={16} color="#64748b" />
                        <Box>
                            <Typography variant="body2" fontWeight={700}>
                                {new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(row.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </Box>
                    </Stack>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight={800} color="primary.main">
                        ₹{Number(row.netIncome).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight={isBinary ? 700 : 400} sx={{ color: isBinary ? designConfig.colors.success.main : 'text.disabled' }}>
                        {isBinary ? `₹${Number(row.netIncome).toFixed(2)}` : '—'}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight={isRoyalty ? 700 : 400} sx={{ color: isRoyalty ? designConfig.colors.secondary.main : 'text.disabled' }}>
                        {isRoyalty ? `₹${Number(row.netIncome).toFixed(2)}` : '—'}
                    </Typography>
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
                            color: open ? 'error.main' : 'primary.main',
                            borderColor: open ? 'error.light' : 'primary.light'
                        }}
                    >
                        {open ? 'Hide' : 'View'}
                    </Button>
                </TableCell>
            </TableRow>

            {/* Breakdown View */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                            <Typography variant="subtitle2" fontWeight={800} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Users size={16} /> Income Breakdown
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>User</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Income Type</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isBinary ? (
                                        row.contributors.map((c: any, i: number) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                                                    <Typography variant="caption" sx={{ bgcolor: '#e2e8f0', px: 0.5, borderRadius: 1 }}>{c.memberId}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={`Binary match (${c.leg})`} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={700}>₹{(Number(row.netIncome) / 2).toFixed(2)}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>Global Royalty Pool</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label="Royalty Shared" size="small" color="secondary" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700}>₹{Number(row.netIncome).toFixed(2)}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            
                            <Box mt={2} p={1.5} sx={{ bgcolor: '#fff', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 4 }}>
                                        <Typography variant="caption" color="text.secondary">Gross Income</Typography>
                                        <Typography variant="body2" fontWeight={700}>₹{Number(row.grossIncome).toFixed(2)}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <Typography variant="caption" color="text.secondary">TDS (5%)</Typography>
                                        <Typography variant="body2" fontWeight={700} color="error.main">-₹{Number(row.tds).toFixed(2)}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <Typography variant="caption" color="text.secondary">Admin (5%)</Typography>
                                        <Typography variant="body2" fontWeight={700} color="error.main">-₹{Number(row.adminCharges).toFixed(2)}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

const SUMMARY_CARDS = (s: any) => [
    { label: 'Total Income', value: `₹${Number(s?.totalIncome || 0).toFixed(2)}`, color: designConfig.colors.primary.main, icon: <TrendingUp size={20} /> },
    { label: 'Binary Income', value: `₹${Number(s?.totalBinaryIncome || 0).toFixed(2)}`, color: designConfig.colors.success.main, icon: <Users size={20} /> },
    { label: 'Royalty Income', value: `₹${Number(s?.totalRoyaltyIncome || 0).toFixed(2)}`, color: designConfig.colors.secondary.main, icon: <Award size={20} /> },
];

export default function IncomeHistory() {
    const { data, isLoading } = useIncomeHistory();

    if (isLoading) return (
        <Box p={5} textAlign="center">
            <CircularProgress />
            <Typography variant="body2" mt={2} color="text.secondary">Loading financial records...</Typography>
        </Box>
    );

    const summary = data?.summary;
    const history: any[] = data?.history || [];

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, background: '#f8fafc', minHeight: '100vh' }}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Income Ledger</Typography>
                <Typography variant="body2" color="text.secondary">Track and audit every rupee earned from the network</Typography>
            </Box>

            {/* Summary cards */}
            <Grid container spacing={3} mb={5}>
                {SUMMARY_CARDS(summary).map((s) => (
                    <Grid key={s.label} item xs={12} sm={4}>
                        <Card sx={{ 
                            borderRadius: 4, 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)', 
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: designConfig.shadows.md }
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

            {/* Structured History Table */}
            <Typography variant="h6" fontWeight={800} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={20} /> Detailed Income Statement
            </Typography>

            {history.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 3 }}>No income records found for your account yet.</Alert>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                                <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Total Income</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Binary Income</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Royalty Income</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map((row: any) => (
                                <IncomeRow key={`${row.type}-${row.id}`} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
