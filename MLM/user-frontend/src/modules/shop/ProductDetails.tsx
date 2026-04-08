import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
    useMediaQuery,
    CircularProgress,
    Rating,
    Stack,
    Grid,
    Divider,
    useTheme as useMuiTheme,
    ButtonBase
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import designConfig from "../../config/designConfig";
import { useProductDetails, useAddToCart } from "../../hooks/useEcommerce";
import PageHeader from "../../components/common/PageHeader";
import { parseSpecifications } from "../../utils/specificationParser";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ProductDetails = () => {
    const { id } = useParams();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

    const { data: productData, isLoading } = useProductDetails(Number(id));
    const product = productData?.data;

    const { mutate: addToCart, isPending: isAdding } = useAddToCart();
    const [activeImage, setActiveImage] = useState<string>("");

    useEffect(() => {
        if (product) {
            window.scrollTo(0, 0);
            setActiveImage(product.productmainimage);
        }
    }, [product]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return <Box sx={{ p: 4, textAlign: 'center' }}>Product not found</Box>;
    }

    const handleAddToCart = () => {
        addToCart({ productId: product.id, quantity: 1 });
    };

    const discount = Math.round(((product.mrp_amount - product.dp_amount) / product.mrp_amount) * 100);
    const savings = product.mrp_amount - product.dp_amount;
    const bvPoints = Math.floor(product.dp_amount / 10);

    return (
        <Box sx={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#f8f9fa",
            pb: isMobile ? 12 : 2, // Reduced pb since we have sticky bar mt: auto
            overflowX: "hidden"
        }}>
            {/* Standard Page Header */}
            <PageHeader title={product.productName} />

            {/* Profile Header (Hero Section) */}

            <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
                <Grid container spacing={4}>
                    {/* Left Side: Product Image */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2} sx={{ position: "sticky", top: 100 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 4,
                                    bgcolor: "#fff",
                                    border: "1px solid #eee",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: { xs: 300, md: 450 },
                                    overflow: "hidden"
                                }}
                            >
                                <Box
                                    component="img"
                                    src={activeImage}
                                    alt={product.productName}
                                    sx={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                        transition: "all 0.3s ease-in-out"
                                    }}
                                />
                            </Paper>

                            {/* Thumbnail Gallery */}
                            {(product.productOtherimage || product.productmainimage) && (
                                <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", py: 1, px: 0.5, "&::-webkit-scrollbar": { display: "none" } }}>
                                    {[product.productmainimage, ...(product.productOtherimage ? product.productOtherimage.split(',').map((img: string) => img.trim()).filter(Boolean) : [])].map((img, idx) => (
                                        <ButtonBase
                                            key={idx}
                                            onClick={() => setActiveImage(img)}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 3,
                                                overflow: "hidden",
                                                border: `2px solid ${activeImage === img ? designConfig.colors.primary.main : "#eee"}`,
                                                transition: "all 0.2s",
                                                flexShrink: 0,
                                                "&:hover": { borderColor: designConfig.colors.primary.main, opacity: 0.8 }
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={img}
                                                sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.5 }}
                                            />
                                        </ButtonBase>
                                    ))}
                                </Stack>
                            )}
                        </Stack>
                    </Grid>

                    {/* Right Side: Product Details */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {/* Title & Price Card */}
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: "#fff", border: "1px solid #eee" }}>
                                <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: "#1e293b", lineHeight: 1.2 }}>
                                    {product.productName}
                                </Typography>

                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Rating
                                            value={product.reviews?.length > 0 ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / product.reviews.length : 0}
                                            precision={0.5}
                                            readOnly
                                            size="medium" // Made larger
                                        />
                                        <Typography variant="h6" fontWeight={900} color="#0f172a">
                                            {product.reviews?.length > 0 ? (product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / product.reviews.length).toFixed(1) : "0"}
                                        </Typography>
                                    </Stack>
                                    <Divider orientation="vertical" flexItem sx={{ height: 15, alignSelf: 'center' }} />
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        color={designConfig.colors.primary.main}
                                        sx={{
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            '&:hover': { color: designConfig.colors.primary.dark }
                                        }}
                                        onClick={() => {
                                            document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        {product.reviews?.length || 0} customer reviews
                                    </Typography>
                                </Stack>

                                <Box sx={{ mb: 2 }}>
                                    <Stack direction="row" spacing={2} alignItems="baseline">
                                        <Typography variant="h3" fontWeight={800} color={designConfig.colors.primary.main}>
                                            ₹{product.dp_amount}
                                        </Typography>
                                        <Typography variant="h5" sx={{ textDecoration: 'line-through', color: '#94a3b8' }}>
                                            ₹{product.mrp_amount}
                                        </Typography>
                                    </Stack>

                                    {/* Savings Label */}
                                    <Box
                                        sx={{
                                            mt: 1.5,
                                            display: "inline-block",
                                            bgcolor: "#e8f5e9",
                                            color: "#2e7d32",
                                            px: 1.5,
                                            py: 0.6,
                                            borderRadius: 1.5,
                                            fontSize: "0.875rem",
                                            fontWeight: 700
                                        }}
                                    >
                                        You save ₹{savings} ({discount}%)
                                    </Box>
                                </Box>

                                <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8 }}>
                                    {product.description}
                                </Typography>
                            </Paper>

                            {/* Specifications */}
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: "#fff", border: "1px solid #eee" }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#1e293b" }}>
                                    Specifications
                                </Typography>
                                {product.specifaction ? (
                                    <Grid container spacing={2}>
                                        {parseSpecifications(product.specifaction).map((spec: { key: string; value: string }, idx: number) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: '#f8fafc',
                                                    border: '1px solid #f1f5f9'
                                                }}>
                                                    <CheckCircleIcon sx={{ fontSize: 18, color: designConfig.colors.primary.main }} />
                                                    <Box>
                                                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                            {spec.key}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={600} color="#334155">
                                                            {spec.value}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">N/A</Typography>
                                )}
                            </Paper>

                            {/* Reviews Section */}
                            <Paper id="reviews-section" elevation={0} sx={{ p: 4, borderRadius: 5, bgcolor: "#fff", border: "1px solid #eee", scrollMarginTop: '100px' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                                    <Typography variant="h6" fontWeight={900} sx={{ color: "#0f172a", letterSpacing: '-0.02em' }}>
                                        Verified Customer Reviews
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h5" fontWeight={900}>{product.reviews?.length > 0 ? (product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / product.reviews.length).toFixed(1) : "0"}</Typography>
                                        <Rating value={product.reviews?.length > 0 ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / product.reviews.length : 0} precision={0.5} readOnly size="small" />
                                    </Box>
                                </Stack>
                                {product.reviews?.length > 0 ? (
                                    <Stack spacing={3}>
                                        {product.reviews.map((review: any) => (
                                            <Box key={review.id} sx={{ pb: 3, borderBottom: "1px solid #f1f5f9", "&:last-child": { borderBottom: 0, pb: 0 } }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                    <Typography fontWeight={700} color="#334155">
                                                        {review.user.firstName} {review.user.lastName}
                                                    </Typography>
                                                    <Rating value={review.rating} readOnly size="small" />
                                                </Stack>
                                                <Typography variant="body2" sx={{ color: "#475569", mb: 2, lineHeight: 1.6, fontWeight: 500 }}>
                                                    {review.comment}
                                                </Typography>
                                                {review.images && (
                                                    <Stack direction="row" spacing={1}>
                                                        {review.images.split(',').map((img: string, idx: number) => (
                                                            <Box
                                                                key={idx}
                                                                component="img"
                                                                src={img}
                                                                sx={{ width: 70, height: 70, borderRadius: 2, objectFit: 'cover', border: "1px solid #e2e8f0" }}
                                                            />
                                                        ))}
                                                    </Stack>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Box sx={{ textAlign: "center", py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No reviews yet. Be the first to review this premium product!
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Sticky Actions Bar */}
            <Box sx={{
                position: 'sticky',
                bottom: 0,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: "blur(8px)",
                px: 2,
                py: 2.5,
                boxShadow: '0 -10px 25px rgba(0,0,0,0.05)',
                borderTop: '1px solid #f1f5f9',
                zIndex: 1100,
                mt: 'auto' // Push to bottom if content is short
            }}>
                <Container maxWidth="lg">
                    <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
                        {!isMobile && (
                            <Box>
                                <Typography variant="h5" fontWeight={800} color={designConfig.colors.primary.main}>
                                    ₹{product.dp_amount}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    MRP: ₹{product.mrp_amount}
                                </Typography>
                            </Box>
                        )}
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            sx={{
                                px: { xs: 4, md: 8 },
                                py: 1.8,
                                borderRadius: 3,
                                fontWeight: 800,
                                textTransform: "none",
                                fontSize: "1.1rem",
                                bgcolor: designConfig.colors.primary.main,
                                boxShadow: `0 8px 20px ${designConfig.colors.primary.main}40`,
                                "&:hover": {
                                    bgcolor: designConfig.colors.primary.dark,
                                    transform: "translateY(-2px)"
                                },
                                transition: "all 0.2s",
                                width: isMobile ? "100%" : "auto",
                                minWidth: { md: 300 }
                            }}
                        >
                            {isAdding ? <CircularProgress size={24} color="inherit" /> : 'Add to Shopping Cart'}
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default ProductDetails;
