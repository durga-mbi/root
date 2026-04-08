import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HubIcon from "@mui/icons-material/Hub";
import PersonIcon from "@mui/icons-material/Person";
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
import { getDownlineApi } from "../../../api/user.api";
import designConfig, { alpha } from "../../../config/designConfig";

export default function RecentMembers() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await getDownlineApi();
                setMembers(res.data || []);
            } catch (err) {
                console.error("Failed to fetch downline", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
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
                        <HubIcon sx={{ color: 'secondary.main', fontSize: 24 }} />
                        Network Pulse
                    </Typography>
                    <Chip
                        label="Live Feed"
                        size="small"
                        sx={{ fontWeight: 800, fontSize: 10, bgcolor: alpha(designConfig.colors.secondary.main, 0.08), color: 'secondary.main' }}
                    />
                </Box>

                {members.length === 0 ? (
                    <Box sx={{
                        py: 8, textAlign: 'center',
                        bgcolor: alpha(designConfig.colors.background.default, 0.5),
                        borderRadius: '20px',
                        border: `1px dashed ${designConfig.colors.background.border}`
                    }}>
                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 800 }}>
                            The pulse is quiet.
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1, fontWeight: 600 }}>
                            New team members will light up this feed.
                        </Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {members.slice(0, 5).map((item, index) => (
                            <Box key={item.id || index}>
                                <ListItem sx={{ px: 0, py: 2 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{
                                            width: 48, height: 48,
                                            bgcolor: item.legPosition === 'LEFT' ? alpha(designConfig.colors.primary.main, 0.08) : alpha(designConfig.colors.secondary.main, 0.08),
                                            color: item.legPosition === 'LEFT' ? 'primary.main' : 'secondary.main',
                                            border: `2px solid ${item.legPosition === 'LEFT' ? alpha(designConfig.colors.primary.main, 0.2) : alpha(designConfig.colors.secondary.main, 0.2)}`,
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                                            fontWeight: 900,
                                            fontSize: '1rem'
                                        }}>
                                            {item.firstName?.[0]}{item.lastName?.[0] || <PersonIcon fontSize="small" />}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 900, color: 'text.primary', fontSize: 16 }}>
                                                {item.firstName} {item.lastName}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                ID: {item.memberId} <Box component="span" sx={{ opacity: 0.3 }}>•</Box> {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </Typography>
                                        }
                                    />
                                    <Box>
                                        <Chip
                                            label={item.legPosition || "DIRECT"}
                                            size="small"
                                            sx={{
                                                fontSize: '0.65rem',
                                                fontWeight: 900,
                                                height: 22,
                                                bgcolor: item.legPosition === 'LEFT' ? 'primary.main' : 'secondary.main',
                                                color: '#fff',
                                                borderRadius: '6px',
                                                boxShadow: `0 4px 8px ${alpha(item.legPosition === 'LEFT' ? designConfig.colors.primary.main : designConfig.colors.secondary.main, 0.2)}`
                                            }}
                                        />
                                    </Box>
                                </ListItem>
                                {index < Math.min(members.length - 1, 4) && (
                                    <Divider variant="inset" sx={{ ml: '72px', borderStyle: 'dashed', opacity: 0.5 }} />
                                )}
                            </Box>
                        ))}
                    </List>
                )}
            </CardContent>
            <Box sx={{ p: '12px 24px 24px' }}>
                <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    endIcon={<ArrowForwardIosIcon sx={{ fontSize: '12px !important' }} />}
                    href="/genealogy"
                    sx={{
                        fontWeight: 800,
                        textTransform: 'none',
                        color: 'text.primary',
                        borderColor: designConfig.colors.background.border,
                        borderRadius: '14px',
                        py: 1.5,
                        fontSize: 13,
                        "&:hover": { borderColor: 'secondary.main', bgcolor: alpha(designConfig.colors.secondary.main, 0.02) }
                    }}
                >
                    View Dynamic Network
                </Button>
            </Box>
        </Card>
    );
}

