import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getPendingPlanPurchasesApi, approvePlanPurchaseApi, rejectPlanPurchaseApi } from "../api/planPurchase.api";
import { toast } from "sonner";

interface PendingPurchase {
  id: number;
  purchase_type: string;
  BV: number;
  plan_amount: number;
  status: string;
  payment_mode: string;
  payment_proof_uri?: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    mobile: string;
    memberId: string;
  };
  plan: {
    planName: string;
  };
}

const PlanApprovals: React.FC = () => {
  const [purchases, setPurchases] = useState<PendingPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [selectedProof, setSelectedProof] = useState<PendingPurchase | null>(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingPlanPurchasesApi();
      setPurchases(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setApprovingId(id);
      await approvePlanPurchaseApi(id);
      toast.success("Purchase approved successfully and BV distributed");
      setPurchases((prev) => prev.filter((p) => p.id !== id));
      if (selectedProof?.id === id) setSelectedProof(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to approve purchase");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setRejectingId(id);
      await rejectPlanPurchaseApi(id);
      toast.success("Purchase rejected successfully");
      setPurchases((prev) => prev.filter((p) => p.id !== id));
      if (selectedProof?.id === id) setSelectedProof(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to reject purchase");
    } finally {
      setRejectingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Plan Purchase Approvals
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {purchases.length === 0 ? (
        <Alert severity="info">No pending plan purchases found.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", border: "1px solid #e0e7ff" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Member ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>User Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Plan Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>BV</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Proof</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.user.memberId}</TableCell>
                  <TableCell>{`${p.user.firstName} ${p.user.lastName}`}</TableCell>
                  <TableCell>{p.plan.planName}</TableCell>
                  <TableCell>
                    <Chip label={p.purchase_type} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{p.BV}</TableCell>
                  <TableCell>₹{p.plan_amount}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => setSelectedProof(p)}
                      disabled={!p.payment_proof_uri}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleApprove(p.id)}
                        disabled={approvingId === p.id || rejectingId === p.id}
                        sx={{ borderRadius: 2, px: 2 }}
                      >
                        {approvingId === p.id ? <CircularProgress size={20} /> : "Approve"}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleReject(p.id)}
                        disabled={approvingId === p.id || rejectingId === p.id}
                        sx={{ borderRadius: 2, px: 2 }}
                      >
                        {rejectingId === p.id ? <CircularProgress size={20} /> : "Reject"}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Payment Proof Modal */}
      <Dialog 
        open={!!selectedProof} 
        onClose={() => setSelectedProof(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Payment Verification</DialogTitle>
        <DialogContent dividers>
          {selectedProof && (
            <Box>
              <Box mb={2} display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary">CUSTOMER</Typography>
                  <Typography variant="body1" fontWeight={700}>{selectedProof.user.firstName} {selectedProof.user.lastName}</Typography>
                  <Typography variant="body2">{selectedProof.user.memberId}</Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">AMOUNT</Typography>
                  <Typography variant="h6" fontWeight={800} color="primary">₹{selectedProof.plan_amount}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom fontWeight={700}>Payment Proof Screenshot</Typography>
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 350, 
                  bgcolor: '#f1f5f9', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0'
                }}
              >
                {selectedProof.payment_proof_uri ? (
                  <img 
                    src={selectedProof.payment_proof_uri} 
                    alt="Payment Proof" 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  />
                ) : (
                  <Typography color="text.secondary">No proof uploaded</Typography>
                )}
              </Box>

              <Box mt={3} p={2} bgcolor="#fffbeb" borderRadius={2} border="1px solid #fef3c7">
                <Typography variant="caption" color="warning.dark" fontWeight={700}>VERIFICATION TIPS</Typography>
                <Typography variant="body2" color="warning.dark">
                  • Check transaction reference in screenshot<br/>
                  • Match amount with plan cost (₹{selectedProof.plan_amount})<br/>
                  • Verify user member ID: {selectedProof.user.memberId}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedProof(null)} color="inherit">Close</Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => selectedProof && handleReject(selectedProof.id)}
            disabled={approvingId === selectedProof?.id || rejectingId === selectedProof?.id}
          >
            {rejectingId === selectedProof?.id ? <CircularProgress size={20} /> : "Reject"}
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => selectedProof && handleApprove(selectedProof.id)}
            disabled={approvingId === selectedProof?.id || rejectingId === selectedProof?.id}
          >
            {approvingId === selectedProof?.id ? <CircularProgress size={20} /> : "Approve Now"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanApprovals;
