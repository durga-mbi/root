import {
    Box,
    Typography,
    Container,
    Stack,
    Paper,
    Divider,
    IconButton,
    CircularProgress,
    Rating,
    TextField,
    Button
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import { useOrderDetails } from "../../hooks/useEcommerce";
import { addReviewApi } from "../../api/ecommerce.api";
import { toast } from "sonner";
import designConfig from "../../config/designConfig";
import { useState } from "react";

// Custom Timeline Component
const TimelineItem = ({ log, isLast, color, index, isCurrent }: any) => {
    const getIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <ShoppingBagIcon sx={{ fontSize: 20 }} />;
            case 'PROCESSING': return <AutorenewIcon sx={{ fontSize: 20 }} />;
            case 'PACKAGING': return <InfoIcon sx={{ fontSize: 20 }} />;
            case 'SHIPPING': return <LocalShippingIcon sx={{ fontSize: 20 }} />;
            case 'READY_FOR_DELIVERY': return <LocalShippingIcon sx={{ fontSize: 20 }} />;
            case 'DELIVERED': return <CheckCircleIcon sx={{ fontSize: 20 }} />;
            case 'CANCELLED': return <CancelIcon sx={{ fontSize: 20 }} />;
            default: return <InfoIcon sx={{ fontSize: 20 }} />;
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 3, position: 'relative' }}>
            {/* Left Line & Dot */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: isCurrent ? color : '#f1f5f9',
                    color: isCurrent ? 'white' : color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    boxShadow: isCurrent ? `0 0 20px ${color}40` : 'none',
                    border: `2px solid ${isCurrent ? color : color}40`,
                    transition: 'all 0.3s ease'
                }}>
                    {getIcon(log.status)}
                </Box>
                {!isLast && (
                    <Box sx={{
                        width: 2,
                        flexGrow: 1,
                        bgcolor: '#e2e8f0',
                        my: 1,
                        borderRadius: 1,
                        backgroundImage: isCurrent ? `linear-gradient(to bottom, ${color}, #e2e8f0)` : 'none'
                    }} />
                )}
            </Box>

            {/* Content */}
            <Box sx={{ pb: isLast ? 0 : 5, pt: 1, flex: 1 }}>
                <Stack spacing={0.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={index === 0 ? 900 : 700} sx={{
                            color: isCurrent ? '#0f172a' : '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            fontSize: '0.95rem'
                        }}>
                            {log.status}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700 }}>
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, mb: 1, display: 'block' }}>
                        {new Date(log.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Typography>
                    {log.message && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: isCurrent ? `${color}05` : "#f8fafc",
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: isCurrent ? `${color}20` : "#f1f5f9",
                                mt: 1
                            }}
                        >
                            <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, lineHeight: 1.6 }}>
                                {log.message}
                            </Typography>
                        </Paper>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

const ReviewForm = ({ productId }: { productId: number }) => {
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const handleAddReview = async () => {
        try {
            setIsSubmittingReview(true);
            await addReviewApi({
                productId,
                rating: reviewRating,
                comment: reviewComment
            });
            toast.success("Review submitted successfully");
            setReviewComment("");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="caption" fontWeight={700} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rate this product</Typography>
            <Stack direction="row" spacing={2} alignItems="center" mt={1.5}>
                <Rating
                    value={reviewRating}
                    onChange={(_, val) => setReviewRating(val || 5)}
                />
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Share your experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    sx={{ bgcolor: 'white' }}
                />
                <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddReview}
                    disabled={isSubmittingReview}
                    sx={{ px: 3, fontWeight: 700 }}
                >
                    Post
                </Button>
            </Stack>
        </Box>
    );
};

const OrderTracking = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: orderData, isLoading } = useOrderDetails(Number(id));
    const order = orderData?.data;

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!order) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5">Order not found</Typography>
                <Button onClick={() => navigate('/orders')} sx={{ mt: 2 }}>Back to Orders</Button>
            </Container>
        );
    }

    const timelineLogs = order.orderStatusLogs || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return '#64748b';
            case 'PROCESSING': return designConfig.colors.warning.main;
            case 'PACKAGING': return '#7c3aed'; // Purple
            case 'SHIPPING': return designConfig.colors.primary.main;
            case 'READY_FOR_DELIVERY': return '#0891b2'; // Cyan
            case 'DELIVERED': return designConfig.colors.success.main;
            case 'CANCELLED': return designConfig.colors.error.main;
            default: return '#64748b';
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: 10 }}>
            {/* Header */}
            <Box sx={{ bgcolor: "white", borderBottom: '1px solid #f1f5f9', pt: 6, pb: 4, px: { xs: 2, md: 4 } }}>
                <Container maxWidth="md">
                    <Stack direction="row" alignItems="center" spacing={3}>
                        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "#f1f5f9", "&:hover": { bgcolor: "#e2e8f0" } }}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="caption" sx={{ color: designConfig.colors.primary.main, fontWeight: 800, letterSpacing: "0.1em" }}>
                                ORDER #{order.id}
                            </Typography>
                            <Typography variant="h4" fontWeight={900} sx={{ color: "#0f172a", letterSpacing: "-0.04em" }}>
                                Track Order
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Stack spacing={4}>
                    {/* Custom Timeline */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 5,
                            borderRadius: 6,
                            border: "1px solid #f1f5f9",
                            bgcolor: "white",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.02)"
                        }}
                    >
                        <Typography variant="h6" fontWeight={900} sx={{ color: "#0f172a", mb: 5, letterSpacing: '-0.02em' }}>
                            Delivery Experience Timeline
                        </Typography>

                        <Box sx={{ px: { xs: 0, sm: 2 } }}>
                            {timelineLogs.slice().reverse().map((log: any, index: number) => {
                                const isCurrent = index === 0;
                                const isLast = index === timelineLogs.length - 1;
                                return (
                                    <TimelineItem
                                        key={index}
                                        log={log}
                                        index={index}
                                        isLast={isLast}
                                        isCurrent={isCurrent}
                                        color={getStatusColor(log.status)}
                                    />
                                );
                            })}
                        </Box>
                    </Paper>

                    {/* Order Details & Items */}
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: "1px solid #f1f5f9" }}>
                        <Typography variant="h6" fontWeight={800} sx={{ color: "#1e293b", mb: 3 }}>Order Items</Typography>
                        <Stack spacing={3} divider={<Divider />}>
                            {order.items?.map((item: any) => (
                                <Box key={item.id}>
                                    <Stack direction="row" spacing={3} alignItems="center">
                                        <Box sx={{ width: 80, height: 80, bgcolor: '#f1f5f9', p: 1.5, borderRadius: 4, flexShrink: 0 }}>
                                            <img src={item.product?.productmainimage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </Box>
                                        <Box flex={1}>
                                            <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#334155" }}>
                                                {item.product?.productName || 'Product Unavailable'}
                                            </Typography>
                                            <Stack direction="row" spacing={2} mt={0.5}>
                                                <Typography variant="body2" color="#64748b" fontWeight={600}>Qty: {item.quantity}</Typography>
                                                <Typography variant="body2" color="#64748b" fontWeight={600}>₹{item.price?.toLocaleString() || 0}</Typography>
                                            </Stack>
                                        </Box>
                                        <Typography variant="subtitle1" fontWeight={900} sx={{ color: "#0f172a" }}>
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </Typography>
                                    </Stack>

                                    {/* Item Review Section - Only if delivered */}
                                    {order.orderStatus === 'DELIVERED' && (
                                        <ReviewForm productId={item.productId} />
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Paper>

                    {/* Summary */}
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: "1px solid #f1f5f9", bgcolor: "white" }}>
                        <Typography variant="h6" fontWeight={800} sx={{ color: "#1e293b", mb: 3 }}>Payment Details</Typography>
                        <Stack spacing={2}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography sx={{ color: "#64748b", fontWeight: 600 }}>Order Amount</Typography>
                                <Typography fontWeight={700} sx={{ color: "#1e293b" }}>₹{Number(order.totalDpAmount || 0).toLocaleString()}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography sx={{ color: "#64748b", fontWeight: 600 }}>Shipping & Handling</Typography>
                                <Typography fontWeight={700} sx={{ color: Number(order.shippingAmount || 0) === 0 ? '#22c55e' : '#1e293b' }}>
                                    {Number(order.shippingAmount || 0) === 0 ? 'FREE' : `₹${Number(order.shippingAmount).toLocaleString()}`}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" fontWeight={900}>Total Paid</Typography>
                                <Typography variant="h6" fontWeight={900} color="primary">₹{(Number(order.totalDpAmount || 0) + Number(order.shippingAmount || 0)).toLocaleString()}</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
};

export default OrderTracking;
