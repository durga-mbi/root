import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Stack,
  IconButton,
} from "@mui/material";
import { useState, useMemo } from "react";
import {
  Wallet,
  TrendingUp,
  History,
  ChevronRight,
  PlusCircle,
  MinusCircle,
  CreditCard,
  Zap
} from "lucide-react";
import { useWallet } from "../../hooks/wallet/getWallet";
import { useWalletHistory } from "../../hooks/wallet/useWalletHistory";
import { useIncomeHistory } from "../../hooks/income/useIncomeHistory";
import designConfig from "../../config/designConfig";

const MyWallets = () => {
  const { data: walletData, isLoading: isWalletLoading, isError: isWalletError } = useWallet();
  const { data: walletHistory, isLoading: isWalletHistoryLoading } = useWalletHistory();
  const { data: incomeHistoryData, isLoading: isIncomeHistoryLoading } = useIncomeHistory();

  const [tabIndex, setTabIndex] = useState(0);

  // Unwrapping the actual wallet object from the nested response
  // structure: { data: { data: [wallet] } }
  const wallet = useMemo(() => {
    return (walletData as any)?.data?.data?.[0] || null;
  }, [walletData]);

  const mainBalance = useMemo(() => {
    if (!wallet) return 0;
    return Number(wallet.total_income);
  }, [wallet]);

  const commission = useMemo(() => {
    return Number(incomeHistoryData?.summary?.totalBinaryIncome || 0);
  }, [incomeHistoryData]);

  const bonus = useMemo(() => {
    return Number(incomeHistoryData?.summary?.totalRoyaltyIncome || 0);
  }, [incomeHistoryData]);

  const history = useMemo(() => {
    const combined = [];

    // Add unified income records
    if (incomeHistoryData?.history) {
      incomeHistoryData.history.forEach((h: any) => {
        combined.push({
          id: `income-${h.id}`,
          date: new Date(h.date),
          type: h.type === 'BINARY' ? 'Commission' : 'Bonus',
          amount: h.netIncome,
          status: 'SUCCESS',
          reference: h.matchedBV ? `${h.matchedBV} BV Match` : 'Royalty Pool',
          isCredit: true
        });
      });
    }

    // Add wallet transactions (withdrawals, etc.)
    if (walletHistory) {
      walletHistory.filter((t: any) => t.type !== 'INCOME').forEach((t: any) => {
        combined.push({
          id: `txn-${t.id}`,
          date: new Date(t.createdAt),
          type: t.type,
          amount: t.amount,
          status: t.status,
          reference: t.message || `Ref: #${t.reference_id || t.id}`,
          isCredit: ['ADJUSTMENT'].includes(t.type)
        });
      });
    }

    return combined.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [incomeHistoryData, walletHistory]);

  const filteredHistory = useMemo(() => {
    if (tabIndex === 0) return history; // All
    if (tabIndex === 1) return history.filter(h => h.id.startsWith('income-')); // Show only detailed breakdown for Incomes
    return history;
  }, [history, tabIndex]);

  if (isWalletLoading || isWalletHistoryLoading || isIncomeHistoryLoading)
    return (
      <Box p={5} textAlign="center" sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );

  const ENTITIES = [
    {
      label: "Main Balance",
      value: mainBalance,
      color: designConfig.colors.primary.main,
      icon: <Wallet size={24} />,
      bgColor: designConfig.colors.primary.light + '1A',
      description: "Available for withdrawal"
    },
    {
      label: "Commission",
      value: commission,
      color: "#1976D2",
      icon: <TrendingUp size={24} />,
      bgColor: "#E3F2FD",
      description: "Total binary matching"
    },
    {
      label: "Bonus",
      value: bonus,
      color: "#EF6C00",
      icon: <Zap size={24} />,
      bgColor: "#FFF3E0",
      description: "Royalty & special incentives"
    },
    {
      label: "Product (DP) Wallet",
      value: wallet?.balance_dp_amount || 0,
      color: "#2E7D32",
      icon: <CreditCard size={24} />,
      bgColor: "#E8F5E9",
      description: "For re-purchases"
    },
    {
      label: "Settled Payouts",
      value: Number(wallet?.total_withdraw || 0),
      color: "#9C27B0",
      icon: <History size={24} />,
      bgColor: "#F3E5F5",
      description: "Successfully disbursed to bank",
      link: "/payouts"
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "#f8fafc", minHeight: "100vh" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: designConfig.colors.text.primary }}>
            Wallet Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your earnings, bonuses, and transaction history
          </Typography>
        </Box>
      </Stack>

      {isWalletError && (
        <Alert severity="warning" sx={{ mb: 4, borderRadius: 3 }}>
          Some wallet information could not be retrieved. Values shown might be incomplete.
        </Alert>
      )}

      {/* 🚀 Main Entities Grid */}
      <Grid container spacing={3} mb={5}>
        {ENTITIES.map((entity, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                border: `1px solid ${designConfig.colors.background.border}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: designConfig.shadows.md }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      bgcolor: entity.bgColor,
                      color: entity.color,
                      display: 'flex'
                    }}
                  >
                    {entity.icon}
                  </Box>
                  <IconButton size="small" sx={{ bgcolor: '#f1f5f9' }}>
                    <ChevronRight size={16} />
                  </IconButton>
                </Box>

                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  {entity.label}
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ my: 0.5, color: designConfig.colors.text.primary }}>
                  ₹{Number(entity.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {entity.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 📊 Unified Transaction History */}
      <Typography variant="h5" fontWeight={800} mb={3}>
        Transaction History
      </Typography>

      <Card sx={{ borderRadius: 4, overflow: 'hidden', border: `1px solid ${designConfig.colors.background.border}` }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          sx={{
            px: 2,
            pt: 2,
            bgcolor: '#fff',
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minWidth: 100 }
          }}
        >
          <Tab label="All Activity" />
          <Tab label="Incomes" />
        </Tabs>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Transaction Type</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Reference</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Box sx={{ opacity: 0.5 }}>
                      <History size={48} />
                      <Typography mt={2} fontWeight={600}>No transactions found for this view</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {row.isCredit ? (
                          <PlusCircle size={16} color={designConfig.colors.success.main} />
                        ) : (
                          <MinusCircle size={16} color={designConfig.colors.error.main} />
                        )}
                        <Typography variant="body2" fontWeight={700}>
                          {row.type}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={800}
                        sx={{ color: row.isCredit ? designConfig.colors.success.main : designConfig.colors.error.main }}
                      >
                        {row.isCredit ? '+' : '-'} ₹{Number(row.amount).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.reference}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          bgcolor: row.status === 'ACTIVE' || row.status === 'SUCCESS' ? designConfig.colors.success.background : designConfig.colors.warning.background,
                          color: row.status === 'ACTIVE' || row.status === 'SUCCESS' ? designConfig.colors.success.main : designConfig.colors.warning.main
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default MyWallets;
