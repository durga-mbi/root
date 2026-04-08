import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Paper,
    Tab,
    Tabs,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import designConfig from "../../../config/designConfig";
import { getUserUplineApi, getUserDirectsApi } from "../../../api/profile.api";

interface UserInfo {
    id: number;
    memberId: string;
    firstName: string;
    lastName: string;
    mobile?: string;
    status: string;
    createdAt?: string;
}

interface HierarchyData {
    user: any;
    referralChain: UserInfo[];
}

export const HierarchyDetails = ({ renderMenu }: { renderMenu: () => React.ReactNode }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [uplineData, setUplineData] = useState<HierarchyData | null>(null);
    const [directsData, setDirectsData] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const fetchUpline = async () => {
        setLoading(true);
        try {
            const res = await getUserUplineApi();
            setUplineData(res.data);
        } catch (error) {
            console.error("Failed to fetch upline:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDirects = async () => {
        setLoading(true);
        try {
            const res = await getUserDirectsApi();
            setDirectsData(res.data);
        } catch (error) {
            console.error("Failed to fetch directs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 1) fetchUpline();
        if (activeTab === 2) fetchDirects();
    }, [activeTab]);

    const MemberCard = ({ title, member, color }: { title: string; member?: UserInfo | null; color: string }) => (
        <Card sx={{ borderRadius: "16px", mb: 2, border: `1px solid ${color}30`, boxShadow: "none", bgcolor: `${color}05` }}>
            <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                <Typography variant="caption" fontWeight={700} color={color} sx={{ textTransform: "uppercase", mb: 1, display: "block" }}>
                    {title}
                </Typography>
                {member ? (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: color, width: 40, height: 40, fontSize: "1rem", fontWeight: 700 }}>
                            {member.firstName?.[0]?.toUpperCase()}
                            {member.lastName?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="body1" fontWeight={700}>
                                {member.firstName} {member.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                {member.memberId}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        Not set
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Paper sx={{ borderRadius: "24px", overflow: "hidden", p: 0, boxShadow: designConfig.shadows.md }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                    bgcolor: "white",
                    borderBottom: "1px solid #eee",
                    "& .MuiTab-root": { fontWeight: 700, py: 2 },
                    "& .Mui-selected": { color: designConfig.colors.primary.main },
                    "& .MuiTabs-indicator": { bgcolor: designConfig.colors.primary.main, height: 3 },
                }}
            >
                <Tab label="Menu" />
                <Tab label="Upline" />
                <Tab label="Childs" />
            </Tabs>

            <Box sx={{ p: 3 }}>
                {activeTab === 0 && renderMenu()}

                {activeTab === 1 && (
                    <Box>
                        {loading ? (
                            <Box display="flex" justifyContent="center" py={4}><CircularProgress size={30} /></Box>
                        ) : (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <MemberCard title="Sponsor" member={uplineData?.user?.sponsor} color="#4caf50" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <MemberCard title="Parent (Placement)" member={uplineData?.user?.parent} color="#2196f3" />
                                    </Grid>
                                </Grid>

                                <Typography variant="subtitle2" fontWeight={800} sx={{ mt: 3, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                    Referral Chain
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                
                                {uplineData?.referralChain && uplineData.referralChain.length > 0 ? (
                                    <Box sx={{ position: 'relative', pl: 3 }}>
                                        {uplineData.referralChain.map((u, idx) => (
                                            <Box key={u.id} sx={{ mb: 2, position: 'relative' }}>
                                                <Box sx={{ 
                                                    position: 'absolute', left: -24, top: 12, bottom: -28, 
                                                    width: 2, bgcolor: idx === uplineData.referralChain.length - 1 ? 'transparent' : '#eee' 
                                                }} />
                                                <Box sx={{ 
                                                    position: 'absolute', left: -28, top: 8, 
                                                    width: 10, height: 10, borderRadius: '50%', bgcolor: designConfig.colors.primary.main 
                                                }} />
                                                <Typography variant="body2" fontWeight={700}>{u.firstName} {u.lastName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{u.memberId}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Root Member</Typography>
                                )}
                            </>
                        )}
                    </Box>
                )}

                {activeTab === 2 && (
                    <Box>
                        {loading ? (
                            <Box display="flex" justifyContent="center" py={4}><CircularProgress size={30} /></Box>
                        ) : (
                            <>
                                <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5 }}>Binary Children</Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                                    <Box sx={{ flex: 1, p: 2, bgcolor: '#f8fbff', borderRadius: '16px', textAlign: 'center', border: '1px dashed #d1e3ff' }}>
                                        <Typography variant="caption" fontWeight={700} color="primary" sx={{ display: 'block', mb: 1 }}>LEFT CHILD</Typography>
                                        <Typography variant="body1" fontWeight={800}>{uplineData?.user?.leftChild ? `${uplineData.user.leftChild.firstName} ${uplineData.user.leftChild.lastName}` : 'Empty'}</Typography>
                                    </Box>
                                    <Box sx={{ flex: 1, p: 2, bgcolor: '#f8fbff', borderRadius: '16px', textAlign: 'center', border: '1px dashed #d1e3ff' }}>
                                        <Typography variant="caption" fontWeight={700} color="primary" sx={{ display: 'block', mb: 1 }}>RIGHT CHILD</Typography>
                                        <Typography variant="body1" fontWeight={800}>{uplineData?.user?.rightChild ? `${uplineData.user.rightChild.firstName} ${uplineData.user.rightChild.lastName}` : 'Empty'}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={800}>Direct Downline List</Typography>
                                    <Chip label={`${directsData.length} Directs`} size="small" color="primary" sx={{ fontWeight: 800 }} />
                                </Box>

                                <Box sx={{ overflowX: 'auto' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>Member</TableCell>
                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>Joined</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {directsData.length > 0 ? directsData.map((child) => (
                                                <TableRow key={child.id}>
                                                    <TableCell sx={{ py: 1.5 }}>
                                                        <Typography variant="body2" fontWeight={700}>{child.firstName} {child.lastName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{child.memberId}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={child.status} 
                                                            size="small" 
                                                            sx={{ 
                                                                height: 20, fontSize: '0.65rem', fontWeight: 800,
                                                                bgcolor: child.status === 'ACTIVE' ? '#e8f5e9' : '#fff3e0',
                                                                color: child.status === 'ACTIVE' ? '#2e7d32' : '#ef6c00'
                                                            }} 
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" fontWeight={600}>
                                                            {child.createdAt ? new Date(child.createdAt).toLocaleDateString() : '-'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                                                        No direct children found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </>
                        )}
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

// Internal Grid helper since Grid v2 requires import or special handling in some versions
const Grid = ({ children, container, item, spacing, xs, sm }: any) => (
    <Box sx={{ 
        display: container ? 'flex' : 'block', 
        flexWrap: 'wrap',
        margin: container ? `-${(spacing || 0) * 4}px` : 0,
        flexBasis: item ? `${(xs / 12) * 100}%` : 'auto',
        maxWidth: item ? `${(xs / 12) * 100}%` : 'none',
        flexGrow: item ? 0 : 1,
        padding: item ? `${(spacing || 2) * 4}px` : 0,
        ...(sm && { '@media (min-width: 600px)': { flexBasis: `${(sm / 12) * 100}%`, maxWidth: `${(sm / 12) * 100}%` } })
    }}>
        {children}
    </Box>
);
