import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  alpha,
  Divider,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { 
  ShoppingBag, 
  Upload, 
  QrCode, 
  CreditCard, 
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { usePlan } from "../../hooks/plan/useGetAllplans";
import { usePurchasePlan } from "../../hooks/plan/usePurchasePlan";
import { usePurchasesByUser } from "../../hooks/plan/usePurchasesByUser";
import { PlanCard } from "./components/PlanCard";
import type { Plan } from "./components/PlanCard";

type PurchaseType = "FIRST_PURCHASE" | "REPURCHASE" | "SHARE_PURCHASE" | "";

const STEPS = ["Setup", "Payment"];

export default function PlanPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const { data: plans = [], isLoading, isError, error } = usePlan();
  const { mutate: purchasePlan, isPending } = usePurchasePlan();
  const { data: purchaseData } = usePurchasesByUser();

  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentType, setPaymentType] = useState("");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("");
  const [proofUrl, setProofUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Memoize active plan logic
  const activePlanNames = useMemo(() => {
    const purchases = (purchaseData as any)?.data?.purchases || purchaseData?.purchases || [];
    return new Set(purchases.filter((p: any) => p.status === "APPROVED").map((p: any) => p.planName));
  }, [purchaseData]);

  const hasPurchasedBefore = activePlanNames.size > 0;
  const showPurchaseTypeDropdown = (purchaseData as any)?.data?.purchaseFlow?.showPurchaseTypeDropdown ?? false;

  const handleOpen = (plan: Plan) => {
    setSelectedPlan(plan);
    setOpen(true);
    setActiveStep(0);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlan(null);
    setPaymentType("");
    setPurchaseType("");
    setProofUrl("");
    setActiveStep(0);
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "frontendfileupload");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dhuddbzui/image/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      setProofUrl(result.secure_url);
      toast.success("Payment proof uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedPlan) return;

    purchasePlan(
      {
        BV: selectedPlan.BV,
        dp_amount: selectedPlan.dp_amount,
        plan_amount: selectedPlan.price,
        payment_mode: paymentType,
        payment_proof_uri: proofUrl,
        purchase_type: showPurchaseTypeDropdown ? purchaseType : "FIRST_PURCHASE",
        plan_id: selectedPlan.id,
      },
      {
        onSuccess: () => {
          toast.success("Plan Purchased Successfully");
          handleClose();
        },
      }
    );
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!paymentType || (showPurchaseTypeDropdown && !purchaseType)) {
        toast.error("Please complete all fields");
        return;
      }
      setActiveStep(1);
    }
  };

  const handleBack = () => setActiveStep(0);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography color="error" variant="h6" fontWeight={700}>
          Oops! Something went wrong
        </Typography>
        <Typography color="text.secondary">{(error as Error).message}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header Section */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={4}
        mb={8}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <Typography variant="overline" fontWeight={800} sx={{ color: "#6366f1", letterSpacing: "0.1em" }}>
              AVAILABLE PACKAGES
            </Typography>
          </Stack>
          <Typography variant="h3" fontWeight={900} sx={{ color: "#0f172a", letterSpacing: "-0.02em" }}>
            Unlock Your Earnings
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, fontWeight: 500, maxWidth: "500px" }}>
            Choose a plan that fits your goals. Start small or go big for maximum benefits and daily rewards.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={4} alignItems="stretch">
        {plans.map((plan: Plan, index: number) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={plan.id}>
            <PlanCard
              plan={plan as any}
              isActive={activePlanNames.has(plan.planName)}
              onBuy={handleOpen}
              isPopular={index === 1} // Mark second plan as popular for visual balance
            />
          </Grid>
        ))}
      </Grid>

      {/* Purchase Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 5,
            backgroundImage: "none",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)"
          }
        }}
      >
        <DialogTitle sx={{ p: 0 }} component="div">
          <Box sx={{ p: 3, px: { xs: 3, md: 5 }, bgcolor: "#fff", borderBottom: "1px solid #f1f5f9" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: "flex" }}>
                  <ShoppingBag size={22} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>Checkout</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>Plan Activation Process</Typography>
                </Box>
              </Stack>
              <Stepper 
                activeStep={activeStep} 
                sx={{ 
                  width: isMobile ? "100px" : "220px",
                  '& .MuiStepConnector-line': { borderTopWidth: 2 }
                }}
              >
                {STEPS.map((label) => (
                  <Step key={label} padding={0}>
                    <StepLabel 
                      StepIconProps={{ 
                        sx: { 
                          width: 24, height: 24,
                          '&.Mui-active': { color: 'primary.main' },
                          '&.Mui-completed': { color: 'success.main' }
                        } 
                      }}
                    >
                      {!isMobile && <Typography variant="caption" fontWeight={700} sx={{ mt: 0.5 }}>{label}</Typography>}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Stack>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflowY: "auto", minHeight: { md: 450 } }}>
          {selectedPlan && (
            <Grid container sx={{ minHeight: "100%" }}>
              {/* Left Column: Plan Summary (Always visible) */}
              <Grid item xs={12} md={4.8} sx={{ p: { xs: 3, md: 5 }, bgcolor: "#f8fafc", borderRight: { md: "1px solid #f1f5f9" } }}>
                <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ letterSpacing: "0.05em", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                  <FileText size={16} /> ORDER SUMMARY
                </Typography>
                
                <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: "#fff", borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                  <Typography variant="caption" fontWeight={800} color="primary" sx={{ mb: 0.5, display: "block", letterSpacing: 1 }}>PLAN DETAILS</Typography>
                  <Typography variant="h5" fontWeight={900} sx={{ color: "#0f172a" }}>{selectedPlan.planName}</Typography>
                  
                  <Divider sx={{ my: 2.5, borderStyle: "dashed", borderColor: "#cbd5e1" }} />
                  
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Retail Price</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color: "#334155" }}>₹{selectedPlan.price}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Point Value</Typography>
                      <Typography variant="body2" fontWeight={800} color="secondary.main">{selectedPlan.BV} BV</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" sx={{ pt: 1 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#0f172a" }}>Amount Payable</Typography>
                      <Typography variant="h6" fontWeight={900} color="primary">₹{selectedPlan.price}</Typography>
                    </Stack>
                  </Stack>
                </Paper>

                {/* <Box sx={{ p: 2.5, borderRadius: 4, bgcolor: alpha("#6366f1", 0.06), border: "1px solid", borderColor: alpha("#6366f1", 0.12) }}>
                  <Stack direction="row" spacing={1.5}>
                    <AlertCircle size={18} color="#6366f1" style={{ flexShrink: 0, marginTop: 2 }} />
                    <Typography variant="caption" color="#475569" sx={{ lineHeight: 1.5, fontWeight: 500 }}>
                      Verify transaction details before submission. Approvals take 2-4 hours.
                    </Typography>
                  </Stack>
                </Box> */}
              </Grid>

              {/* Right Column: Interaction Area */}
              <Grid item xs={12} md={7.2} sx={{ p: { xs: 4, md: 5 } }}>
                {activeStep === 0 ? (
                  <Stack spacing={4} sx={{ height: "100%", justifyContent: "center", alignItems: "center", textAlign: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight={800} sx={{ color: "#0f172a", mb: 1 }}>1. Configure Purchase</Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Define the purchase scope and payment method</Typography>
                    </Box>

                    <Stack spacing={3} sx={{ width: '100%', maxWidth: 420 }}>
                      {showPurchaseTypeDropdown && (
                        <FormControl fullWidth>
                          <InputLabel>Purchase Purpose</InputLabel>
                          <Select
                            value={purchaseType}
                            label="Purchase Purpose"
                            onChange={(e: any) => setPurchaseType(e.target.value as PurchaseType)}
                            sx={{ borderRadius: 3, bgcolor: "#fff", '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}
                          >
                            <MenuItem value="REPURCHASE" sx={{ py: 1.5 }}>
                              <Stack textAlign="left">
                                <Typography variant="body2" fontWeight={700}>Re-Purchase</Typography>
                                <Typography variant="caption" color="text.secondary">Upgrade your current position</Typography>
                              </Stack>
                            </MenuItem>
                            <MenuItem value="SHARE_PURCHASE" sx={{ py: 1.5 }}>
                              <Stack textAlign="left">
                                <Typography variant="body2" fontWeight={700}>Share-Purchase</Typography>
                                <Typography variant="caption" color="text.secondary">Assign this plan to a direct downline</Typography>
                              </Stack>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}

                      {!showPurchaseTypeDropdown && (
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.05), border: "1px solid", borderColor: alpha(theme.palette.success.main, 0.15), display: "flex", gap: 2, alignItems: "center", justifyContent: 'center' }}>
                          <CheckCircle2 size={22} color={theme.palette.success.main} />
                          <Typography variant="body2" fontWeight={700} color="success.dark">
                            New Member Activation Package
                          </Typography>
                        </Paper>
                      )}

                      <FormControl fullWidth>
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                          value={paymentType}
                          label="Payment Method"
                          onChange={(e: any) => setPaymentType(e.target.value)}
                          sx={{ borderRadius: 3, bgcolor: "#fff", '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}
                        >
                          <MenuItem value="UPI" sx={{ py: 1.5 }}>
                            <Stack direction="row" spacing={2} alignItems="center" textAlign="left">
                              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "#f1f5f9", display: "flex", color: "#64748b" }}>
                                <QrCode size={18} />
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={700}>Instant UPI Transfer</Typography>
                                <Typography variant="caption" color="text.secondary">GPay, PhonePe, or Any UPI App</Typography>
                              </Box>
                            </Stack>
                          </MenuItem>
                          <MenuItem value="Bank" sx={{ py: 1.5 }}>
                            <Stack direction="row" spacing={2} alignItems="center" textAlign="left">
                              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "#f1f5f9", display: "flex", color: "#64748b" }}>
                                <CreditCard size={18} />
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={700}>Manual Bank Deposit</Typography>
                                <Typography variant="caption" color="text.secondary">IMPS, NEFT, or RTGS Transfer</Typography>
                              </Box>
                            </Stack>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack spacing={4} sx={{ height: "100%", justifyContent: "center", alignItems: "center", textAlign: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight={800} sx={{ color: "#0f172a", mb: 1 }}>2. Submit Payment Proof</Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Scan the QR below and upload your success receipt</Typography>
                    </Box>

                    <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
                      <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 4, border: "1px solid #e2e8f0", textAlign: "center", boxShadow: "0 10px 20px -5px rgba(0,0,0,0.05)", width: 'fit-content' }}>
                        <Box
                          component="img"
                          src="https://static.vecteezy.com/system/resources/previews/017/441/744/original/qr-code-icon-qr-code-sample-for-smartphone-scanning-isolated-illustration-vector.jpg"
                          sx={{ width: 110, height: 110, borderRadius: 2, mb: 1 }}
                        />
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: 1, display: 'block' }}>SCAN TO PAY</Typography>
                      </Box>
                      
                      <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 360 }}>
                        <Button
                          component="label"
                          variant="outlined"
                          fullWidth
                          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <Upload size={20} />}
                          sx={{
                            py: 2,
                            borderRadius: 4,
                            borderStyle: "dashed",
                            fontWeight: 800,
                            borderWidth: 2,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            borderColor: proofUrl ? "success.main" : "primary.main",
                            color: proofUrl ? "success.main" : "primary.main",
                            bgcolor: proofUrl ? alpha(theme.palette.success.main, 0.04) : "transparent",
                            "&:hover": { borderWidth: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderColor: 'primary.main' }
                          }}
                        >
                          {uploading ? "Processing..." : proofUrl ? "Change Receipt" : "Upload Proof"}
                          <input hidden type="file" onChange={handleProofUpload} />
                        </Button>

                        {proofUrl && (
                          <Paper elevation={0} sx={{ p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.06), borderRadius: 3, border: "1px solid", borderColor: alpha(theme.palette.success.main, 0.12), display: "flex", alignItems: "center", gap: 2, justifyContent: 'center' }}>
                            <Box 
                              component="img" 
                              src={proofUrl} 
                              sx={{ width: 44, height: 44, borderRadius: 2, objectFit: "cover", border: "2px solid #fff", boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                            />
                            <Box textAlign="left">
                              <Typography variant="subtitle2" fontWeight={800} color="success.dark" sx={{ lineHeight: 1 }}>Verified</Typography>
                              <Typography variant="caption" color="success.dark" fontWeight={600}>Receipt attached</Typography>
                            </Box>
                          </Paper>
                        )}
                      </Stack>
                    </Stack>

                    <Box sx={{ p: 2, bgcolor: "#fffbeb", borderRadius: 3, border: "1px solid #fef3c7", maxWidth: 420 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                        <Typography variant="caption" color="#92400e" sx={{ fontWeight: 600 }}>
                          Ensure Transaction ID is visible in the screenshot.
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, px: { xs: 3, md: 5 }, bgcolor: "#fff", justifyContent: "space-between" }}>
          <Button 
            onClick={activeStep === 0 ? handleClose : handleBack} 
            startIcon={activeStep === 1 ? <ArrowLeft size={20} /> : null}
            sx={{ color: "text.secondary", fontWeight: 800, px: 3, borderRadius: 2 }}
          >
            {activeStep === 0 ? "Cancel" : "Go Back"}
          </Button>
          
          <Button
            variant="contained"
            onClick={activeStep === 0 ? handleNext : handleConfirm}
            disabled={
              (activeStep === 0 && (!paymentType || (showPurchaseTypeDropdown && !purchaseType))) ||
              (activeStep === 1 && (!proofUrl || isPending))
            }
            endIcon={activeStep === 0 ? <ChevronRight size={20} /> : <CheckCircle2 size={20} />}
            sx={{
              py: 1.5,
              px: activeStep === 0 ? 5 : 7,
              borderRadius: 3,
              fontWeight: 900,
              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.35)",
              textTransform: "none",
              fontSize: "1rem",
              transition: 'all 0.2s',
              '&:hover': { boxShadow: "0 12px 20px -3px rgba(99, 102, 241, 0.45)", transform: 'translateY(-1px)' }
            }}
          >
            {activeStep === 0 ? "Continue" : isPending ? "Activating..." : "Complete Purchase"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
  