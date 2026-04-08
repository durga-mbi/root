import { Avatar, Box, Button, Chip, Divider, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import type { Agent, AgentTab } from "./types";

// BV Hooks
import { useLastMonthTeamBV } from "../../hooks/Bv/useLastMonthTeamBV";
import { useSelfBV } from "../../hooks/Bv/useSelfBV";
import { useTotalFirstPurchaseBV } from "../../hooks/Bv/useTotalFirstPurchaseBV";
import { useTotalRepurchaseBV } from "../../hooks/Bv/useTotalRepurchaseBV";
import { useUserTotalBV } from "../../hooks/Bv/useUserTotalBV";
import { getUserDirectsApi, getUserUplineApi } from "../../api/adminConfig.api";

interface Props {
  agent: Agent;
  onClose: () => void;
}

const BLUE = "#26619A"; 

const AgentDetailsPage: React.FC<Props> = ({
  agent,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<AgentTab>("overview");
  const [uplineData, setUplineData] = useState<any>(null);
  const [directsData, setDirectsData] = useState<any[]>([]);
  const [loadingHierarchy, setLoadingHierarchy] = useState(false);

  // BV Queries
  const { data: totalBVData, isLoading: totalBVLoading } = useUserTotalBV(agent.id);
  const { data: selfBVData, isLoading: selfBVLoading } = useSelfBV(agent.id);
  const { data: firstPurchaseBVData, isLoading: firstPurchaseLoading } = useTotalFirstPurchaseBV(agent.id);
  const { data: repurchaseBVData, isLoading: repurchaseLoading } = useTotalRepurchaseBV(agent.id);
  const { data: lastMonthTeamBVData, isLoading: lastMonthLoading } = useLastMonthTeamBV(agent.id);

  useEffect(() => {
    if (activeTab === "upline") {
      setLoadingHierarchy(true);
      getUserUplineApi(agent.id)
        .then(data => setUplineData(data))
        .catch(err => console.error("Error fetching upline:", err))
        .finally(() => setLoadingHierarchy(false));
    } else if (activeTab === "childs") {
      setLoadingHierarchy(true);
      getUserDirectsApi(agent.id)
        .then(data => setDirectsData(data))
        .catch(err => console.error("Error fetching directs:", err))
        .finally(() => setLoadingHierarchy(false));
    }
  }, [activeTab, agent.id]);

  const handleTabClick = (tab: AgentTab) => {
    setActiveTab(tab);
  };

  // Helper to extract BV values safely
  const getBVValue = (apiData: any, leftKey: string, rightKey: string, defaultValue = "0/0") => {
    if (!apiData?.success || !apiData?.data) return defaultValue;
    
    if (typeof apiData.data === 'number') {
      return apiData.data.toLocaleString();
    }
    
    const left = apiData.data[leftKey] || 0;
    const right = apiData.data[rightKey] || 0;
    return `${left.toLocaleString()}/${right.toLocaleString()}`;
  };

  const getSingleBVValue = (apiData: any, defaultValue = "0") => {
    if (!apiData?.success || !apiData?.data) return defaultValue;
    return (apiData.data as number).toLocaleString();
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: "90%",
        maxWidth: "1100px",
        maxHeight: "92vh",
        borderRadius: "12px",
        overflow: "hidden",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        background: "#F9FAFC",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          "::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
        }}
      >
        {/* HEADER */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar src={agent.avatar} sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography fontWeight={700}>{agent.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {agent.code} • Joined {new Date(agent.joiningDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {/* TABS */}
        <Paper sx={{ p: 1, mb: 3, borderRadius: "12px", background: "#F9FAFC" }}>
          <Box sx={{ display: "flex", width: "100%", gap: 1 }}>
            {(
              ["overview", "upline", "childs"] as AgentTab[]
            ).map((tab) => (
              <Button
                key={tab}
                onClick={() => handleTabClick(tab)}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  textTransform: "none",
                  fontWeight: 500,
                  color: activeTab === tab ? "#fff" : "#000",
                  bgcolor: activeTab === tab ? BLUE : "transparent",
                  "&:hover": {
                    bgcolor: activeTab === tab ? BLUE : "rgba(0,0,0,0.05)",
                  },
                  py: 0.6,
                  minHeight: "38px",
                  fontSize: "14px",
                  textAlign: "center",
                  borderRadius: "8px"
                }}
              >
                {tab === "overview"
                  ? "Overview"
                  : tab === "upline"
                  ? "Upline"
                  : "Childs"}
              </Button>
            ))}
          </Box>
        </Paper>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <Box>
            {/* TOP BV STATS */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              {[
                {
                  title: "Total BV (L/R)",
                  value: totalBVLoading ? "—" : getBVValue(totalBVData, "leftBV", "rightBV"),
                  border: "#9121E0",
                  titleColor: "#9121E0",
                  bg: "#9121E0",
                },
                {
                  title: "Self BV",
                  value: selfBVLoading ? "—" : getSingleBVValue(selfBVData),
                  border: "#70BF45",
                  titleColor: "#70BF45",
                  bg: "#70BF45",
                },
                {
                  title: "Last Month (L/R)",
                  value: lastMonthLoading ? "—" : getBVValue(lastMonthTeamBVData, "lastMonthLeftBV", "lastMonthRightBV"),
                  border: "#DC7751",
                  titleColor: "#DC7751",
                  bg: "#DC7751",
                },
              ].map((s) => (
                <Box
                  key={s.title}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: "12px",
                    border: `1.5px solid ${s.border}`,
                    textAlign: "center",
                    background: `linear-gradient(135deg, ${s.bg}1A 0%, ${s.bg}33 100%)`,
                  }}
                >
                  <Typography fontSize={22} fontWeight={700} color="#000000">
                    {s.value}
                  </Typography>
                  <Typography
                    fontSize={12}
                    fontWeight={600}
                    color={s.titleColor}
                  >
                    {s.title}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* BV BREAKDOWN */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", background: "#F9FAFC" }}>
              <Typography fontWeight={700} mb={3} sx={{ fontSize: "18px", color: BLUE }}>
                BV Breakdown (Left/Right)
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2 }}>
                {[
                  {
                    title: "First Purchase",
                    value: firstPurchaseLoading 
                      ? "—" 
                      : getBVValue(firstPurchaseBVData, "totalFirstPurchaseLeftBV", "totalFirstPurchaseRightBV"),
                    border: "#3D42DF",
                    titleColor: "#3D42DF",
                    bg: "#3D42DF",
                  },
                  {
                    title: "Repurchase",
                    value: repurchaseLoading 
                      ? "—" 
                      : getBVValue(repurchaseBVData, "totalRepurchaseLeftBV", "totalRepurchaseRightBV"),
                    border: "#FF6B6B",
                    titleColor: "#FF6B6B",
                    bg: "#FF6B6B",
                  },
                ].map((s) => (
                  <Box
                    key={s.title}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: "12px",
                      border: `1.5px solid ${s.border}`,
                      textAlign: "center",
                      background: `linear-gradient(135deg, ${s.bg}1A 0%, ${s.bg}33 100%)`,
                    }}
                  >
                    <Typography fontSize={22} fontWeight={700} color="#000000">
                      {s.value}
                    </Typography>
                    <Typography
                      fontSize={12}
                      fontWeight={600}
                      color={s.titleColor}
                    >
                      {s.title}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        )}

        {/* UPLINE TAB */}
        {activeTab === "upline" && (
          <Box p={2}>
            {loadingHierarchy ? (
              <Typography>Loading upline data...</Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Immediate Upline Details */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1, p: 3, border: "1px solid #E0E0E0", borderRadius: "12px" }}>
                    <Typography variant="overline" color="text.secondary">Sponsor</Typography>
                    {uplineData?.details?.sponsor ? (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="h6" fontWeight={700}>{uplineData.details.sponsor.firstName} {uplineData.details.sponsor.lastName}</Typography>
                        <Typography color="text.secondary">ID: {uplineData.details.sponsor.memberId}</Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ mt: 1 }}>ROOT USER</Typography>
                    )}
                  </Box>
                  <Box sx={{ flex: 1, p: 3, border: "1px solid #E0E0E0", borderRadius: "12px" }}>
                    <Typography variant="overline" color="text.secondary">Parent</Typography>
                    {uplineData?.details?.parent ? (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="h6" fontWeight={700}>{uplineData.details.parent.firstName} {uplineData.details.parent.lastName}</Typography>
                        <Typography color="text.secondary">ID: {uplineData.details.parent.memberId}</Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ mt: 1 }}>ROOT USER</Typography>
                    )}
                  </Box>
                </Box>

                {/* Referral Chain */}
                <Box>
                  <Typography fontWeight={700} mb={2} color={BLUE}>Referral Chain (Bottom to Top)</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {uplineData?.upline?.length > 0 ? (
                      [...uplineData.upline].reverse().map((user: any, idx: number) => (
                        <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            width: 32, height: 32, borderRadius: '50%', 
                            bgcolor: BLUE, color: 'white', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700 
                          }}>
                            {idx + 1}
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{user.firstName} {user.lastName}</Typography>
                            <Typography variant="caption" color="text.secondary">{user.memberId}</Typography>
                          </Box>
                          {idx < uplineData.upline.length - 1 && <Box sx={{ ml: -1, color: '#E0E0E0' }}>→</Box>}
                        </Box>
                      ))
                    ) : (
                      <Typography color="text.secondary">No upline chain found.</Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* CHILDS TAB */}
        {activeTab === "childs" && (
          <Box p={2}>
            {loadingHierarchy ? (
              <Typography>Loading directs data...</Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {/* Immediate Binary Childs */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1, p: 3, border: "1px solid #E0E0E0", borderRadius: "12px", textAlign: 'center' }}>
                    <Typography variant="overline" color={BLUE} fontWeight={700}>Left Child</Typography>
                    <Divider sx={{ my: 1.5 }} />
                    {uplineData?.details?.leftChild ? (
                      <Box>
                        <Typography fontWeight={700}>{uplineData.details.leftChild.firstName} {uplineData.details.leftChild.lastName}</Typography>
                        <Typography variant="body2" color="text.secondary">{uplineData.details.leftChild.memberId}</Typography>
                      </Box>
                    ) : (
                      <Typography color="text.secondary" fontStyle="italic">Empty</Typography>
                    )}
                  </Box>
                  <Box sx={{ flex: 1, p: 3, border: "1px solid #E0E0E0", borderRadius: "12px", textAlign: 'center' }}>
                   <Typography variant="overline" color={BLUE} fontWeight={700}>Right Child</Typography>
                   <Divider sx={{ my: 1.5 }} />
                    {uplineData?.details?.rightChild ? (
                      <Box>
                        <Typography fontWeight={700}>{uplineData.details.rightChild.firstName} {uplineData.details.rightChild.lastName}</Typography>
                        <Typography variant="body2" color="text.secondary">{uplineData.details.rightChild.memberId}</Typography>
                      </Box>
                    ) : (
                      <Typography color="text.secondary" fontStyle="italic">Empty</Typography>
                    )}
                  </Box>
                </Box>

                {/* Direct Children Table */}
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography fontWeight={700} color={BLUE}>Direct Downline List</Typography>
                    <Chip label={`${directsData?.length || 0} Directs`} color="primary" size="small" />
                  </Box>
                  
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                        <TableCell fontWeight={600}>Member ID</TableCell>
                        <TableCell fontWeight={600}>Name</TableCell>
                        <TableCell fontWeight={600}>Mobile</TableCell>
                        <TableCell fontWeight={600}>Status</TableCell>
                        <TableCell fontWeight={600}>Join Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {directsData?.length > 0 ? directsData.map((child: any) => (
                        <TableRow key={child.id} hover>
                          <TableCell>{child.memberId}</TableCell>
                          <TableCell>{child.firstName} {child.lastName}</TableCell>
                          <TableCell>{child.mobile || "—"}</TableCell>
                          <TableCell>
                            <Chip 
                              label={child.status} 
                              size="small" 
                              sx={{ 
                                height: 20, fontSize: 10,
                                bgcolor: child.status === 'ACTIVE' ? '#E8F5E9' : '#FFEBEE',
                                color: child.status === 'ACTIVE' ? '#2E7D32' : '#C62828'
                              }} 
                            />
                          </TableCell>
                          <TableCell>{new Date(child.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No direct children found.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #A3AED0",
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            background: "#A3AED0",
            color: "white",
            px: 3,
            textTransform: "none",
            fontSize: "13px",
            "&:hover": { background: "#CACFE1" },
          }}
        >
          Close
        </Button>
      </Box>
    </Paper>
  );
};

export default AgentDetailsPage;
