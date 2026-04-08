import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Button,
    Rating,
    TextField,
    InputAdornment,
    Stack
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import designConfig from '../../config/designConfig';
import { useProducts, useAddToCart } from "../../hooks/useEcommerce";
import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";

const CategoryProducts = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("categoryId");

    const [searchTerm, setSearchTerm] = useState("");

    const { data: productsData, isLoading } = useProducts({
        categoryId: categoryId ? Number(categoryId) : undefined
    });

    const { mutate: addToCart, isPending } = useAddToCart();

    const products = (productsData?.data || []).filter((product: any) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddToCart = (e: React.MouseEvent, productId: number) => {
        e.stopPropagation();
        addToCart({ productId, quantity: 1 });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: designConfig.colors.background.light, minHeight: "100vh", pb: 10 }}>
            {/* Standard Page Header */}
            <PageHeader title="Products" />

            {/* Profile Header (Hero Section) */}

            <Box sx={{ mt: 3, px: { xs: 2, md: 4 } }}>
                {/* --- Toolbar --- */}
                <Box
                    sx={{
                        bgcolor: "#f0f2f5",
                        borderRadius: 2,
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 3,
                        border: "1px solid #e0e4e9"
                    }}
                >
                    <Typography variant="body1" fontWeight={500} color="#4b5563">
                        {products.length} products found
                    </Typography>

                    <TextField
                        size="small"
                        placeholder="Search Products"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            bgcolor: "#fff",
                            borderRadius: 1,
                            width: { xs: "150px", sm: "250px" },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: 20, color: "#9ca3af" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* --- Product Grid --- */}
                {products.length === 0 ? (
                    <Box textAlign="center" mt={10}>
                        <Typography variant="h6" color="text.secondary">
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {products.map((product: any) => {
                            const discount = Math.round(((product.mrp_amount - product.dp_amount) / product.mrp_amount) * 100);
                            const savings = product.mrp_amount - product.dp_amount;
                            const bvPoints = Math.floor(product.dp_amount / 10);

                            return (
                                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                    <Card
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        sx={{
                                            borderRadius: 3,
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            cursor: "pointer",
                                            overflow: "hidden",
                                            transition: "transform 0.2s",
                                            "&:hover": { transform: "translateY(-4px)" }
                                        }}
                                    >
                                        {/* Image wrapper with BV Badge */}
                                        <Box sx={{ position: "relative", p: 1 }}>
                                            {/* BV Badge (Shield Style) */}
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 15,
                                                    left: 15,
                                                    zIndex: 2,
                                                    bgcolor: "#fff",
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                    borderRadius: "50% 50% 50% 10%",
                                                    width: 45,
                                                    height: 45,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: `2px solid ${designConfig.colors.primary.main}`,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, lineHeight: 1, color: "#1e3a8a" }}>
                                                    {bvPoints}
                                                </Typography>
                                                <Typography sx={{ fontSize: "0.55rem", fontWeight: 700, color: "#1e3a8a" }}>
                                                    BV
                                                </Typography>
                                            </Box>

                                            <CardMedia
                                                component="img"
                                                image={product.productmainimage}
                                                alt={product.productName}
                                                sx={{
                                                    height: 200,
                                                    borderRadius: 2,
                                                    objectFit: "cover"
                                                }}
                                            />
                                        </Box>

                                        <CardContent sx={{ p: 2, flexGrow: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1e293b", mb: 0.5 }}>
                                                {product.productName}
                                            </Typography>

                                            <Stack direction="row" spacing={1} alignItems="baseline" mb={0.5}>
                                                <Typography variant="h6" fontWeight={800} color={designConfig.colors.primary.main}>
                                                    ₹{product.dp_amount}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                                                    ₹{product.mrp_amount}
                                                </Typography>
                                            </Stack>

                                            {/* Savings Badge */}
                                            <Box
                                                sx={{
                                                    display: "inline-block",
                                                    bgcolor: "#e8f5e9",
                                                    color: "#2e7d32",
                                                    px: 1,
                                                    py: 0.4,
                                                    borderRadius: 1,
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    mb: 1.5
                                                }}
                                            >
                                                You save ₹{savings} ({discount}%)
                                            </Box>

                                            <Stack direction="row" alignItems="center" spacing={0.5} mb={2}>
                                                {(() => {
                                                    const reviews = product.reviews || [];
                                                    const rating = reviews.length > 0
                                                        ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
                                                        : 0;
                                                    return (
                                                        <>
                                                            <Rating value={rating} precision={0.5} readOnly size="small" />
                                                            <Typography variant="body2" fontWeight={600} color="#334155">
                                                                {rating > 0 ? rating.toFixed(1) : "0"} ({reviews.length})
                                                            </Typography>
                                                        </>
                                                    );
                                                })()}
                                            </Stack>

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<ShoppingCartIcon />}
                                                onClick={(e) => handleAddToCart(e, product.id)}
                                                disabled={isPending}
                                                sx={{
                                                    py: 1.2,
                                                    borderRadius: 2,
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                    bgcolor: designConfig.colors.primary.main,
                                                    "&:hover": { bgcolor: designConfig.colors.primary.dark }
                                                }}
                                            >
                                                Add to Cart
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default CategoryProducts;
