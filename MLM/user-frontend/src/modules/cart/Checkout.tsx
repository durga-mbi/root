import {
    Box,
    Typography,
    Paper,
    Button,
    Container,
    Stack,
    IconButton,
    CircularProgress
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import designConfig from "../../config/designConfig";
import { useCart, usePlaceOrder, useAddresses, useConfig } from "../../hooks/useEcommerce";
import { useWallet } from "../../hooks/wallet/getWallet";
import { toast } from "sonner";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { data: cartData, isLoading: isCartLoading } = useCart();
    const items = cartData?.data || [];

    const { data: wallet, isLoading: isWalletLoading } = useWallet();

    const { mutate: placeOrder, isPending: isPlacing } = usePlaceOrder();

    const { data: configData, isLoading: isConfigLoading } = useConfig();
    const config = configData?.data;

    const { data: addressesData } = useAddresses();
    const addresses = addressesData?.data || [];
    const [selectedAddress, setSelectedAddress] = useState<any>(location.state?.selectedAddress || null);

    // Auto-select address logic
    useEffect(() => {
        if (!selectedAddress && addresses.length > 0) {
            const defaultAddr = addresses.find((a: any) => a.isDefault);
            setSelectedAddress(defaultAddr || addresses[0]);
        }
    }, [addresses, selectedAddress]);

    const subtotal = items.reduce((acc: number, item: any) => acc + item.product.dp_amount * item.quantity, 0);
    const totalBV = items.reduce((acc: number, item: any) => acc + Math.floor(item.product.dp_amount / 10) * item.quantity, 0);

    const deliveryCharge = Number(config?.deliveryCharge || 0);
    const totalAmount = subtotal + deliveryCharge;

    const walletBalance = Number(wallet?.balance_dp_amount || 0);
    const hasSufficientBalance = walletBalance >= totalAmount;

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        if (!hasSufficientBalance) {
            toast.error("Insufficient wallet balance");
            return;
        }

        const orderData = {
            items: items.map((i: any) => ({
                productId: i.productId,
                quantity: i.quantity
            })),
            paymentMethod: "DP_WALLET",
            address: {
                name: selectedAddress.name,
                phone: selectedAddress.phone,
                addressLine: selectedAddress.addressLine,
                city: selectedAddress.city,
                state: selectedAddress.state,
                pincode: selectedAddress.pincode,
                country: "India"
            }
        };

        placeOrder(orderData, {
            onSuccess: (res) => {
                console.log("Order placement response:", res);
                toast.success("Order placed successfully using DP Wallet");
                navigate("/order-success", { state: { order: res.data } });
            }
        });
    };

    if (isCartLoading || isWalletLoading || isConfigLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: 12 }}>
            <Box sx={{
                bgcolor: "white",
                borderBottom: '1px solid #f1f5f9',
                pt: 6,
                pb: 4,
                px: { xs: 2, md: 4 }
            }}>
                <Container maxWidth="md">
                    <Stack direction="row" alignItems="center" spacing={3}>
                        <IconButton
                            onClick={() => navigate(-1)}
                            sx={{ bgcolor: "#f1f5f9", "&:hover": { bgcolor: "#e2e8f0" } }}
                        >
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" fontWeight={900} sx={{ color: "#0f172a", letterSpacing: "-0.04em" }}>
                                Checkout
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                                Finalize your premium order
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Stack spacing={4}>
                    {/* Delivery Address */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 5,
                            border: "1px solid #f1f5f9",
                            bgcolor: "white",
                            transition: "all 0.3s ease",
                            "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight={800} sx={{ color: "#1e293b" }}>
                                Secure Delivery Address
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => navigate("/address-selection")}
                                sx={{ fontWeight: 700, textTransform: "none", borderRadius: 2 }}
                            >
                                Change Address
                            </Button>
                        </Stack>

                        {selectedAddress ? (
                            <Box display="flex" gap={3} sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 3, border: "1px solid #f1f5f9" }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    bgcolor: "white",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                                }}>
                                    <LocationOnIcon color="primary" />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#334155" }}>
                                        {selectedAddress.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5, lineHeight: 1.6 }}>
                                        {selectedAddress.addressLine}, {selectedAddress.city}<br />
                                        {selectedAddress.state} - {selectedAddress.pincode}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={700} sx={{ color: "#475569", mt: 1 }}>
                                        Phone: {selectedAddress.phone}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate("/address-selection", { state: { openAdd: true } })}
                                sx={{
                                    py: 2,
                                    borderRadius: 3,
                                    borderStyle: "dashed",
                                    borderWidth: 2,
                                    fontWeight: 700,
                                    textTransform: "none"
                                }}
                            >
                                + Add or Select Delivery Address
                            </Button>
                        )}
                    </Paper>

                    {/* Order Items Summary */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 5,
                            border: "1px solid #f1f5f9",
                            bgcolor: "white"
                        }}
                    >
                        <Typography variant="h6" fontWeight={800} sx={{ color: "#1e293b", mb: 3 }}>
                            Review Items ({items.length})
                        </Typography>
                        <Stack spacing={2.5}>
                            {items.map((item: any) => (
                                <Stack key={item.id} direction="row" spacing={3} alignItems="center" sx={{ pb: 2, borderBottom: "1px solid #f8fafc", "&:last-child": { borderBottom: 0, pb: 0 } }}>
                                    <Box sx={{ width: 64, height: 64, bgcolor: '#f1f5f9', p: 1, borderRadius: 3, flexShrink: 0 }}>
                                        <img src={item.product.productmainimage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </Box>
                                    <Box flex={1}>
                                        <Typography variant="body1" fontWeight={800} sx={{ color: "#334155" }}>
                                            {item.product.productName}
                                        </Typography>
                                        <Typography variant="body2" color="#94a3b8" fontWeight={600}>
                                            Quantity: {item.quantity}
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={900} sx={{ color: "#0f172a" }}>
                                        ₹{(item.product.dp_amount * item.quantity).toLocaleString()}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Paper>

                    {/* Payment Method - DP Wallet (MLM Specialized) */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 5,
                            border: '2px solid',
                            borderColor: hasSufficientBalance ? designConfig.colors.primary.main : '#ef4444',
                            bgcolor: hasSufficientBalance ? "#f0fdf4" : "#fef2f2",
                            position: "relative",
                            overflow: "hidden"
                        }}
                    >
                        <Box sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            width: 60,
                            height: 60,
                            bgcolor: hasSufficientBalance ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <AccountBalanceWalletIcon sx={{ color: hasSufficientBalance ? "#16a34a" : "#ef4444", opacity: 0.2, fontSize: 40 }} />
                        </Box>
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Box sx={{
                                width: 56,
                                height: 56,
                                bgcolor: "white",
                                borderRadius: 3,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
                            }}>
                                <AccountBalanceWalletIcon sx={{ color: hasSufficientBalance ? designConfig.colors.primary.main : '#ef4444', fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight={900} sx={{ color: hasSufficientBalance ? "#166534" : "#991b1b" }}>
                                    Secure Wallet Payment
                                </Typography>
                                <Typography variant="body2" sx={{ color: hasSufficientBalance ? "#15803d" : "#ef4444", mt: 0.3, fontWeight: 700 }}>
                                    Balance: ₹{walletBalance.toLocaleString()}
                                </Typography>
                                {!hasSufficientBalance && (
                                    <Typography variant="caption" sx={{ color: "#ef4444", fontWeight: 800, mt: 0.5, display: 'block' }}>
                                        Insufficient funds. Please top up your wallet.
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Price Final Details */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 5,
                            borderRadius: 6,
                            border: "1px solid #f1f5f9",
                            bgcolor: "white",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.04)"
                        }}
                    >
                        <Typography variant="h6" fontWeight={900} sx={{ color: "#0f172a", mb: 4 }}>
                            Price Breakdown
                        </Typography>
                        <Stack spacing={3}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography sx={{ color: "#64748b", fontWeight: 600 }}>Total DP Value</Typography>
                                <Typography fontWeight={800} sx={{ color: "#1e293b" }}>₹{subtotal.toLocaleString()}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography sx={{ color: "#64748b", fontWeight: 600 }}>Security & Delivery</Typography>
                                <Typography fontWeight={800} color={deliveryCharge === 0 ? '#22c55e' : '#1e293b'}>
                                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                </Typography>
                            </Box>

                            <Box sx={{
                                p: 2,
                                bgcolor: "#f8fafc",
                                borderRadius: 3,
                                border: "1px solid #f1f5f9",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 700 }}>BV Points Accumulated</Typography>
                                <Typography variant="subtitle1" fontWeight={900} color="primary">{totalBV}</Typography>
                            </Box>

                            <Box sx={{ pt: 3, borderTop: "2px dashed #f1f5f9" }} display="flex" justifyContent="space-between" alignItems="baseline">
                                <Typography variant="h5" fontWeight={900} color="#0f172a">Grant Total</Typography>
                                <Typography variant="h4" fontWeight={1000} color={designConfig.colors.primary.main}>
                                    ₹{totalAmount.toLocaleString()}
                                </Typography>
                            </Box>
                        </Stack>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handlePlaceOrder}
                            disabled={isPlacing || !selectedAddress || !hasSufficientBalance}
                            endIcon={!isPlacing && hasSufficientBalance && <ArrowForwardIcon />}
                            sx={{
                                mt: 6,
                                py: 2.2,
                                borderRadius: 4,
                                fontWeight: 900,
                                fontSize: "1.15rem",
                                textTransform: "none",
                                bgcolor: hasSufficientBalance ? designConfig.colors.primary.main : '#94a3b8',
                                boxShadow: hasSufficientBalance ? `0 12px 30px ${designConfig.colors.primary.main}50` : 'none',
                                "&:hover": {
                                    boxShadow: hasSufficientBalance ? `0 15px 35px ${designConfig.colors.primary.main}60` : 'none',
                                    transform: hasSufficientBalance ? "translateY(-2px)" : "none",
                                    bgcolor: hasSufficientBalance ? designConfig.colors.primary.dark : '#94a3b8',
                                },
                                transition: "all 0.3s ease"
                            }}
                        >
                            {isPlacing ? <CircularProgress size={28} color="inherit" /> :
                                !hasSufficientBalance ? "Insufficient Balance" :
                                    `Confirm & Pay ₹${totalAmount.toLocaleString()}`}
                        </Button>

                        <Typography variant="caption" align="center" display="block" sx={{ mt: 3, color: "#94a3b8", fontWeight: 600 }}>
                            By clicking confirm, you agree to our premium service terms
                        </Typography>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
};

export default Checkout;
