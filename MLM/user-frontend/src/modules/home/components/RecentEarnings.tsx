import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import HistoryIcon from "@mui/icons-material/History";
import {
    Avatar,
    Box,
    Button,
    Card, CardContent,
    Chip,
    Divider,
    List, ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { getIncomeApi } from "../../../api/income.api";
import designConfig, { alpha } from "../../../config/designConfig";

export default function RecentEarnings() {
    const [earnings, setEarnings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const res = await getIncomeApi({ period: "LAST_30_DAYS" });
                setEarnings(res.data || []);
            } catch (err) {
                console.error("Failed to fetch earnings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    if (loading) {
        return (
            <Card sx={{ borderRadius: '24px', boxShadow: designConfig.shadows.md, height: '100%', border: `1px solid ${designConfig.colors.background.border}` }}>
                <CardContent sx={{ p: '24px !important' }}>
                    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2.5 }} />
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rectangular" height={72} sx={{ mb: 2, borderRadius: '16px' }} />
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{
            borderRadius: '24px',
            boxShadow: designConfig.shadows.md,
            height: '100%',
            border: `1px solid ${designConfig.colors.background.border}`,
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            transition: 'all 0.3s ease',
            '&:hover': { boxShadow: designConfig.shadows.lg ?? designConfig.shadows.md }
        }}>
            <CardContent sx={{ p: '24px !important', flex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HistoryIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                        Earnings Journal
                    </Typography>
                    <Chip
                        label="30 Day Activity"
                        size="small"
                        sx={{ fontWeight: 800, fontSize: 10, bgcolor: alpha(designConfig.colors.success.main, 0.08), color: designConfig.colors.success.main }}
                    />
                </Box>

                {earnings.length === 0 ? (
                    <Box sx={{
                        py: 8, textAlign: 'center',
                        bgcolor: alpha(designConfig.colors.background.default, 0.5),
                        borderRadius: '20px',
                        border: `1px dashed ${designConfig.colors.background.border}`
                    }}>
                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 800 }}>
                            The journal is empty.
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1, fontWeight: 600 }}>
                            Complete binary matches to record your first entry.
                        </Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {earnings.slice(0, 5).map((item, index) => (
                            <Box key={item.id || index}>
                                <ListItem sx={{ px: 0, py: 2 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{
                                            width: 48, height: 48,
                                            bgcolor: alpha(designConfig.colors.success.main, 0.08),
                                            color: designConfig.colors.success.main,
                                            border: `1px solid ${alpha(designConfig.colors.success.main, 0.15)}`,
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                                        }}>
                                            <CurrencyRupeeIcon sx={{ fontSize: 22 }} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 900, color: 'text.primary', fontSize: 16 }}>
                                                ₹{item.income}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                Matching Bonus <Box component="span" sx={{ opacity: 0.3 }}>•</Box> {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </Typography>
                                        }
                                    />
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Chip
                                            label={`+${item.matched_bv} BV`}
                                            size="small"
                                            sx={{
                                                height: 22, fontSize: 10, fontWeight: 900,
                                                bgcolor: alpha(designConfig.colors.primary.main, 0.08),
                                                color: 'primary.main',
                                                borderRadius: '6px'
                                            }}
                                        />
                                    </Box>
                                </ListItem>
                                {index < Math.min(earnings.length - 1, 4) && (
                                    <Divider variant="inset" sx={{ ml: '72px', borderStyle: 'dashed', opacity: 0.5 }} />
                                )}
                            </Box>
                        ))}
                    </List>
                )}
            </CardContent>
            <Box sx={{ p: '12px 24px 24px' }}>
                {/* <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardIosIcon sx={{ fontSize: '12px !important' }} />}
                    href="/my-wallet/earnings"
                    sx={{
                        fontWeight: 800,
                        textTransform: 'none',
                        color: 'text.primary',
                        borderColor: designConfig.colors.background.border,
                        borderRadius: '14px',
                        py: 1.5,
                        fontSize: 13,
                        "&:hover": { borderColor: 'primary.main', bgcolor: alpha(designConfig.colors.primary.main, 0.02) }
                    }}
                >
                    Explore All Transactions
                </Button> */}
            </Box>
        </Card>
    );
}

