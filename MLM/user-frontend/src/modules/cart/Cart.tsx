import {
    Box,
    Typography,
    IconButton,
    Button,
    Container,
    useTheme,
    useMediaQuery,
    Stack,
    Dialog,
    DialogContent,
    CircularProgress,
    Grid
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ShoppingBag } from "lucide-react";
import designConfig from "../../config/designConfig";
import { useCart, useUpdateCart, useRemoveFromCart, useConfig } from "../../hooks/useEcommerce";

const Cart = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const { data: cartData, isLoading: isCartLoading } = useCart();
    const { data: configData, isLoading: isConfigLoading } = useConfig();

    const items = cartData?.data || [];
    const config = configData?.data;
    const deliveryCharge = Number(config?.deliveryCharge || 0);

    const { mutate: updateCart } = useUpdateCart();
    const { mutate: removeFromCart } = useRemoveFromCart();

    const subtotal = items.reduce((acc: number, item: any) => acc + item.product.dp_amount * item.quantity, 0);
    const total = subtotal + deliveryCharge;
    const totalBV = items.reduce((acc: number, item: any) => acc + Math.floor(item.product.dp_amount / 10) * item.quantity, 0);

    const isLoading = isCartLoading || isConfigLoading;

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleIncrease = (item: any) => {
        updateCart({ productId: item.productId, quantity: item.quantity + 1 });
    };

    const handleDecrease = (item: any) => {
        if (item.quantity > 1) {
            updateCart({ productId: item.productId, quantity: item.quantity - 1 });
        }
    };

    const handleRemove = (id: number) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            removeFromCart(deleteId);
            setDeleteId(null);
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 15, textAlign: 'center' }}>
                <Box
                    sx={{
                        width: 250,
                        height: 250,
                        mb: 6,
                        mx: "auto",
                        position: 'relative'
                    }}
                >
                    <Box
                        component="img"
                        src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                        sx={{
                            width: "100%",
                            height: "100%",
                            opacity: 0.1,
                            filter: 'grayscale(1)',
                            animation: 'pulse 3s infinite ease-in-out',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)', opacity: 0.1 },
                                '50%': { transform: 'scale(1.05)', opacity: 0.15 },
                                '100%': { transform: 'scale(1)', opacity: 0.1 }
                            }
                        }}
                    />
                    <ShoppingBag size={100} style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: designConfig.colors.primary.main,
                        opacity: 0.2
                    }} />
                </Box>
                <Typography variant="h3" fontWeight={900} gutterBottom sx={{ color: designConfig.colors.text.primary, letterSpacing: "-0.03em" }}>
                    Your cart is feeling light
                </Typography>
                <Typography variant="body1" sx={{ color: designConfig.colors.text.secondary, mb: 6, maxWidth: 500, mx: "auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
                    There's nothing here yet. Explore our latest collections and find your premium favorites to start your journey with us.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/category-products")}
                    sx={{
                        py: 2,
                        px: 6,
                        borderRadius: 4,
                        fontWeight: 800,
                        textTransform: "none",
                        fontSize: "1.2rem",
                        boxShadow: `0 10px 25px ${designConfig.colors.primary.main}40`,
                        "&:hover": { transform: 'translateY(-3px)' }
                    }}
                >
                    Explore Shop
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fbfcfd", pb: isMobile ? 12 : 8, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {/* 1. Header Area - Serif Elegant */}
            <Box sx={{ pt: 10, pb: 4, px: { xs: 2, md: 4 } }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#1a1a1a",
                            fontFamily: 'serif',
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            fontWeight: 400,
                            letterSpacing: "-0.02em",
                            mb: 1
                        }}
                    >
                        Shopping Bag
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={6}>
                    {/* Left Column: Items List */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack
                            spacing={4}
                            sx={{
                                maxHeight: { md: "calc(100vh - 280px)" },
                                overflowY: { md: "auto" },
                                pr: { md: 2 },
                                "&::-webkit-scrollbar": { width: "4px" },
                                "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                                "&::-webkit-scrollbar-thumb": { bgcolor: "#eee", borderRadius: "10px" }
                            }}
                        >
                            {items.map((item: any) => {
                                const bvPointsPerItem = Math.floor(item.product.dp_amount / 10);
                                return (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            gap: 0,
                                            borderTop: "1px solid #eee",
                                            pt: 4,
                                            position: "relative"
                                        }}
                                    >
                                        {/* Image Box - Light Gray Background */}
                                        <Box sx={{
                                            width: { xs: "100%", sm: 220 },
                                            height: 220,
                                            bgcolor: "#f2f2f2",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            p: 3,
                                            borderRadius: "2px"
                                        }}>
                                            <img
                                                src={item.product.productmainimage}
                                                alt={item.product.productName}
                                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                            />
                                        </Box>

                                        {/* Content Box */}
                                        <Box sx={{ flex: 1, pl: { xs: 0, sm: 4 }, pt: { xs: 2, sm: 0 } }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                                                <Typography variant="h5" sx={{ fontFamily: 'serif', fontWeight: 600, color: designConfig.colors.primary.main }}>
                                                    {item.product.productName}
                                                </Typography>
                                                <IconButton
                                                    onClick={() => handleRemove(item.productId)}
                                                    sx={{ color: "#94a3b8", "&:hover": { color: designConfig.colors.error.main, bgcolor: designConfig.colors.error.background } }}
                                                >
                                                    <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </Box>

                                            <Typography variant="subtitle1" sx={{ color: designConfig.colors.secondary.main, fontWeight: 700, fontSize: "0.9rem", mb: 2 }}>
                                                {bvPointsPerItem * item.quantity} BV POINTS
                                            </Typography>

                                            <Box sx={{
                                                border: `1px solid ${designConfig.colors.background.border}`,
                                                display: "inline-block",
                                                px: 1.5, py: 0.5,
                                                fontSize: "0.7rem",
                                                fontWeight: 800,
                                                color: "#64748b",
                                                letterSpacing: "0.1em",
                                                borderRadius: "4px",
                                                mb: 4
                                            }}>
                                                PREMIUM QUALITY GUARANTEE
                                            </Box>

                                            {/* 3-Column Sub-grid for Price/Qty/Total */}
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 4 }}>
                                                    <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, display: "block", mb: 1 }}>UNIT PRICE</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: designConfig.colors.primary.main, fontSize: "1.1rem" }}>₹{item.product.dp_amount.toLocaleString()}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 4 }}>
                                                    <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, display: "block", mb: 1, textAlign: 'center' }}>QUANTITY</Typography>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center', gap: 1 }}>
                                                        <IconButton size="small" onClick={() => handleDecrease(item)} sx={{ color: "#94a3b8", bgcolor: "#f8fafc" }}><KeyboardArrowDownIcon /></IconButton>
                                                        <Typography sx={{ fontWeight: 700, minWidth: 20, textAlign: 'center', color: designConfig.colors.text.primary }}>{item.quantity}</Typography>
                                                        <IconButton size="small" onClick={() => handleIncrease(item)} sx={{ color: "#94a3b8", bgcolor: "#f8fafc" }}><KeyboardArrowUpIcon /></IconButton>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{ xs: 4 }}>
                                                    <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, display: "block", mb: 1, textAlign: 'right' }}>SUBTOTAL</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem", textAlign: 'right' }}>₹{(item.product.dp_amount * item.quantity).toLocaleString()}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                );
                            })}

                            {/* Luxury Rewards Banner */}
                            <Box sx={{
                                bgcolor: designConfig.colors.background.paper,
                                p: 4,
                                mt: 6,
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                border: `1px solid ${designConfig.colors.background.border}`,
                                borderRadius: 4
                            }}>
                                <Box sx={{ color: designConfig.colors.primary.main }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.5-6.2 4.5 2.3-7.3-6.1-4.5h7.6z" />
                                    </svg>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.05em", color: designConfig.colors.primary.dark, mb: 0.5 }}>MEMBER REWARDS</Typography>
                                    <Typography sx={{ color: designConfig.colors.text.secondary, fontSize: "0.85rem" }}>This order qualifies for a curated gift selection at checkout.</Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Right Column: Order Summary */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{
                            p: 6,
                            bgcolor: "white",
                            border: `1px solid ${designConfig.colors.background.border}`,
                            borderRadius: 6,
                            boxShadow: "0 20px 50px rgba(13, 71, 161, 0.05)",
                            position: "sticky",
                            top: 100,
                            height: "fit-content"
                        }}>
                            <Typography variant="h5" sx={{ fontFamily: 'serif', color: designConfig.colors.text.primary, mb: 6, fontSize: "1.8rem", fontWeight: 700 }}>
                                Order Summary
                            </Typography>

                            <Stack spacing={2.5} sx={{ mb: 6 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography sx={{ color: "#64748b", fontWeight: 500 }}>Bag Subtotal</Typography>
                                    <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>₹{subtotal.toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography sx={{ color: "#64748b", fontWeight: 500 }}>Shipping & Delivery</Typography>
                                    <Typography sx={{ color: deliveryCharge > 0 ? "#1e293b" : designConfig.colors.success.main, fontWeight: 800, fontSize: deliveryCharge > 0 ? "0.9rem" : "0.75rem", letterSpacing: "0.05em" }}>
                                        {deliveryCharge > 0 ? `₹${deliveryCharge.toLocaleString()}` : "FREE"}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    pt: 2.5,
                                    mt: 1,
                                    borderTop: `1px dashed ${designConfig.colors.background.border}`
                                }}>
                                    <Typography sx={{ color: designConfig.colors.primary.main, fontWeight: 700 }}>Total Benefits</Typography>
                                    <Typography sx={{ color: designConfig.colors.primary.main, fontWeight: 900 }}>{totalBV} BV POINTS</Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ mb: 6 }}>
                                <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", mb: 1, textTransform: "uppercase" }}>ESTIMATE TOTAL</Typography>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    <Typography variant="h3" sx={{ color: designConfig.colors.primary.main, fontFamily: 'serif', fontWeight: 800 }}>
                                        ₹{total.toLocaleString()}
                                    </Typography>
                                    <Typography sx={{ color: "#94a3b8", fontSize: "0.65rem", pb: 1 }}>Inc. all taxes</Typography>
                                </Box>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => navigate("/checkout")}
                                sx={{
                                    bgcolor: designConfig.colors.primary.main,
                                    color: "#fff",
                                    py: 2.2,
                                    borderRadius: 4,
                                    fontWeight: 800,
                                    fontSize: "1rem",
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                    mb: 4,
                                    boxShadow: `0 12px 24px ${designConfig.colors.primary.main}40`,
                                    "&:hover": {
                                        bgcolor: designConfig.colors.primary.dark,
                                        transform: "translateY(-2px)",
                                        boxShadow: `0 15px 30px ${designConfig.colors.primary.main}50`
                                    },
                                    transition: "all 0.3s ease"
                                }}
                            >
                                Secure Checkout
                            </Button>

                            {/* <Stack spacing={2}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Box sx={{ color: "#64748b" }}><Lock size={14} /></Box>
                                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>SSL SECURED TRANSACTION</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Box sx={{ color: "#64748b" }}><CreditCard size={14} /></Box>
                                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>PAY SECURELY WITH VERIFIED GATEWAYS</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Box sx={{ color: designConfig.colors.primary.main }}><ShieldCheck size={14} /></Box>
                                    <Typography variant="caption" sx={{ color: designConfig.colors.primary.main, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>VERIFIED SECURITY</Typography>
                                </Box>
                            </Stack> */}
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Remove Confirmation Dialog - Re-styled for luxury */}
            <Dialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                PaperProps={{
                    sx: { borderRadius: 6, p: 4, maxWidth: 450, boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }
                }}
            >
                <DialogContent>
                    <Box textAlign="center">
                        <Typography variant="h5" sx={{ fontFamily: 'serif', mb: 2, fontWeight: 700, color: designConfig.colors.primary.main }}>Remove Item</Typography>
                        <Typography sx={{ color: "#64748b", fontSize: "0.95rem", mb: 4 }}>
                            Are you sure you want to remove this premium product from your shopping bag?
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                fullWidth
                                onClick={() => setDeleteId(null)}
                                sx={{ borderRadius: 3, border: "1px solid #e2e8f0", color: "#64748b", py: 1.5, fontWeight: 700 }}
                            >
                                Keep in Bag
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleConfirmDelete}
                                sx={{ bgcolor: designConfig.colors.error.main, color: "#fff", borderRadius: 3, py: 1.5, fontWeight: 700, "&:hover": { bgcolor: designConfig.colors.error.dark } }}
                            >
                                Yes, Remove
                            </Button>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Cart;
