import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Divider,
    Avatar
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState, useCallback } from "react";
import { useGetOrders } from "../../hooks/Order/useGetOrders";
import { useUpdateOrderStatus } from "../../hooks/Order/useUpdateOrderStatus";
import { toast } from "sonner";
import { Package, Truck, CheckCircle, Clock, ShoppingCart, XCircle } from "lucide-react";

export default function OrdersManagement() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [openView, setOpenView] = useState(false);

    const { data: ordersData, isLoading, error } = useGetOrders(page + 1, rowsPerPage);
    const updateStatusMutation = useUpdateOrderStatus();

    // The backend returns { success: true, data: { data: [...], total: ... } }
    const ordersResult = ordersData?.data;
    const orders = ordersResult?.data || [];
    const totalOrders = ordersResult?.total || 0;

    const handleChangePage = useCallback((_: any, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await updateStatusMutation.mutateAsync({ id: orderId, status: newStatus });
        } catch (err) {
            // Error handled by hook
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED": return "success";
            case "CANCELLED": return "error";
            case "SHIPPING": return "info";
            case "CONFIRMED": return "primary";
            case "PACKAGING": return "warning";
            default: return "default";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DELIVERED": return <CheckCircle size={16} />;
            case "CANCELLED": return <XCircle size={16} />;
            case "SHIPPING": return <Truck size={16} />;
            case "PACKAGING": return <Package size={16} />;
            case "PENDING": return <Clock size={16} />;
            case "CONFIRMED": return <ShoppingCart size={16} />;
            default: return null;
        }
    };

    if (error) {
        toast.error("Failed to load orders");
    }

    return (
        <Box p={3}>
            <Typography variant="h5" fontWeight={700} mb={3} color="primary">
                Orders Management
            </Typography>

            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h6" fontWeight={600}>
                            All Orders ({totalOrders})
                        </Typography>
                    </Stack>

                    {isLoading ? (
                        <Box display="flex" justifyContent="center" p={8}>
                            <CircularProgress size={40} thickness={4} />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table size="medium">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                        <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Update Status</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order: any) => (
                                        <TableRow key={order.id} hover>
                                            <TableCell sx={{ fontWeight: 600 }}>#{order.orderNumber}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Unknown"}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">{order.customer?.mobile}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {order.items?.[0]?.productName || "No Items"}
                                                    {order.items?.length > 1 && ` (+${order.items.length - 1})`}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Typography fontWeight={700} color="primary">₹{order.totalPurchaseAmount?.toLocaleString()}</Typography>
                                                <Typography variant="caption" color="text.secondary">{order.totalBv} BV</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(order.orderStatus) as any}
                                                    label={order.orderStatus}
                                                    color={getStatusColor(order.orderStatus) as any}
                                                    size="small"
                                                    sx={{ fontWeight: 700, px: 1 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {(() => {
                                                    const isImmutable = (order: any) => {
                                                        const now = new Date().getTime();
                                                        const fiveMins = 5 * 60 * 1000;
                                                        if (order.orderStatus === "DELIVERED" && order.deliveredAt) {
                                                            return (now - new Date(order.deliveredAt).getTime()) > fiveMins;
                                                        }
                                                        if (order.orderStatus === "CANCELLED" && order.cancelledAt) {
                                                            return (now - new Date(order.cancelledAt).getTime()) > fiveMins;
                                                        }
                                                        return false;
                                                    };

                                                    const locked = isImmutable(order);

                                                    return (
                                                        <FormControl size="small" sx={{ minWidth: 130 }} disabled={locked}>
                                                            <Select
                                                                value={order.orderStatus}
                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    fontSize: '0.875rem',
                                                                    bgcolor: locked ? '#f8fafc' : 'inherit'
                                                                }}
                                                                displayEmpty
                                                            >
                                                                <MenuItem value="PENDING">Pending</MenuItem>
                                                                <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                                                                <MenuItem value="PACKAGING">Packaging</MenuItem>
                                                                <MenuItem value="SHIPPING">Shipping</MenuItem>
                                                                <MenuItem value="DELIVERED">Delivered</MenuItem>
                                                                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                                            </Select>
                                                            {locked && (
                                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '10px', fontWeight: 600 }}>
                                                                    Status Locked
                                                                </Typography>
                                                            )}
                                                        </FormControl>
                                                    );
                                                })()}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setOpenView(true);
                                                    }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {orders.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                <Typography color="text.secondary">No orders found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={totalOrders}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </CardContent>
            </Card>

            {/* View Order Modal */}
            <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>
                    Order Details - #{selectedOrder?.orderNumber}
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {selectedOrder && (
                        <Box mt={2}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} mb={4}>
                                <Box flex={1}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>CUSTOMER INFORMATION</Typography>
                                    <Typography variant="body1" fontWeight={700}>
                                        {selectedOrder.customer ? `${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}` : "Unknown"}
                                    </Typography>
                                    <Typography variant="body2">{selectedOrder.customer?.memberId}</Typography>
                                </Box>
                                <Box flex={1}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>SHIPPING ADDRESS</Typography>
                                    <Typography variant="body2" fontWeight={600}>{selectedOrder.address?.name}</Typography>
                                    <Typography variant="body2">
                                        {selectedOrder.address?.addressLine}, {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
                                    </Typography>
                                    <Typography variant="body2">Phone: {selectedOrder.address?.phone}</Typography>
                                </Box>
                            </Stack>

                            <Divider sx={{ mb: 3 }} />

                            <Typography variant="subtitle2" color="text.secondary" mb={2}>ORDER ITEMS</Typography>
                            <TableContainer sx={{ border: '1px solid #f1f5f9', borderRadius: 2 }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700 }}>Qty</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>BV</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.items?.map((item: any) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar src={item.product?.productmainimage} variant="rounded" sx={{ width: 40, height: 40 }} />
                                                        <Typography variant="body2" fontWeight={600}>{item.productName}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center">{item.quantity}</TableCell>
                                                <TableCell align="right">{item.bv}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700 }}>₹{item.totalPrice?.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box display="flex" justifyContent="flex-end" mt={3}>
                                <Stack spacing={1} width={220}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                                        <Typography variant="body2" fontWeight={700}>₹{selectedOrder.totalPurchaseAmount?.toLocaleString()}</Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Total BV:</Typography>
                                        <Typography variant="body2" fontWeight={700}>{selectedOrder.totalBv}</Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Payment Status:</Typography>
                                        <Typography variant="body2" fontWeight={700} color={selectedOrder.paymentStatus === 'PAID' ? 'success.main' : 'warning.main'}>
                                            {selectedOrder.paymentStatus}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button onClick={() => setOpenView(false)} variant="outlined">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
