import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Button,
    Container,
    Stack,
    Radio,
    Dialog,
    DialogContent,
    TextField,
    Slide,
    CircularProgress
} from "@mui/material";
import type { TransitionProps } from '@mui/material/transitions';
import React, { useState, useEffect, forwardRef } from "react";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AddIcon from '@mui/icons-material/Add';
import designConfig from "../../config/designConfig";
import PageHeader from "../../components/common/PageHeader";
import { useAddresses, useAddAddress } from "../../hooks/useEcommerce";
import { toast } from "sonner";

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddressSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { data: addressesData, isLoading } = useAddresses();
    const addresses = addressesData?.data || [];

    const { mutate: addAddress, isPending: isAdding } = useAddAddress();

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    // Auto-open logic from state
    useEffect(() => {
        if (location.state?.openAdd) {
            setOpenDialog(true);
        }
    }, [location.state]);

    useEffect(() => {
        if (addresses.length > 0 && !selectedId) {
            const def = addresses.find((a: any) => a.isDefault);
            setSelectedId(def ? def.id : addresses[0].id);
        }
    }, [addresses, selectedId]);

    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        addressLine: '',
        city: '',
        pincode: '',
        state: '',
        type: 'Home'
    });

    const handleApply = () => {
        if (selectedId) {
            const selected = addresses.find((addr: any) => addr.id === selectedId);
            navigate('/checkout', { state: { selectedAddress: selected } });
        }
    };

    const handleSaveNewAddress = () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.addressLine || !newAddress.pincode) {
            toast.error("Please fill in all required fields");
            return;
        }

        addAddress(newAddress, {
            onSuccess: (res) => {
                setSelectedId(res.data.id);
                setOpenDialog(false);
                setNewAddress({
                    name: '',
                    phone: '',
                    addressLine: '',
                    city: '',
                    pincode: '',
                    state: '',
                    type: 'Home'
                });
            }
        });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: 16 }}>
            <PageHeader title="Shipping Address" />

            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: "#1e293b", mb: 3, letterSpacing: "-0.02em" }}>
                    Select a Delivery Address
                </Typography>

                {addresses.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 6,
                            textAlign: "center",
                            borderRadius: 6,
                            border: "2px dashed #e2e8f0",
                            bgcolor: "white"
                        }}
                    >
                        <Box sx={{ mb: 3, color: "#94a3b8" }}>
                            <LocationOnOutlinedIcon sx={{ fontSize: 60 }} />
                        </Box>
                        <Typography variant="h5" fontWeight={900} sx={{ color: "#334155", mb: 1 }}>
                            No Addresses Yet
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748b", mb: 4 }}>
                            Add your first shipping address to continue with your premium order.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenDialog(true)}
                            sx={{ px: 4, py: 1.8, borderRadius: 4, fontWeight: 900, textTransform: "none" }}
                        >
                            Add Your First Address
                        </Button>
                    </Paper>
                ) : (
                    <Stack spacing={2.5}>
                        {addresses.map((addr: any) => {
                            const isSelected = selectedId === addr.id;
                            return (
                                <Paper
                                    key={addr.id}
                                    elevation={0}
                                    onClick={() => setSelectedId(addr.id)}
                                    sx={{
                                        p: 3,
                                        borderRadius: 5,
                                        border: "2px solid",
                                        borderColor: isSelected ? designConfig.colors.primary.main : '#f1f5f9',
                                        bgcolor: isSelected ? `${designConfig.colors.primary.main}05` : "white",
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: 'pointer',
                                        transition: "all 0.2s ease",
                                        position: "relative",
                                        "&:hover": { borderColor: isSelected ? designConfig.colors.primary.main : "#cbd5e1" }
                                    }}
                                >
                                    <Box sx={{ mr: 3, color: isSelected ? 'primary.main' : '#94a3b8' }}>
                                        <LocationOnOutlinedIcon />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
                                            <Typography variant="subtitle1" fontWeight={900} sx={{ color: "#1e293b" }}>
                                                {addr.name}
                                            </Typography>
                                            <Box sx={{ px: 1, py: 0.2, bgcolor: "#f1f5f9", borderRadius: 1.5 }}>
                                                <Typography variant="caption" fontWeight={800} sx={{ color: "#64748b", textTransform: "uppercase" }}>
                                                    {addr.type}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500, lineHeight: 1.6 }}>
                                            {addr.addressLine}, {addr.city}<br />
                                            {addr.state} - {addr.pincode}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={700} sx={{ color: "#475569", mt: 1 }}>
                                            Phone: {addr.phone}
                                        </Typography>
                                    </Box>
                                    <Radio
                                        checked={isSelected}
                                        sx={{
                                            color: "#e2e8f0",
                                            "&.Mui-checked": { color: designConfig.colors.primary.main }
                                        }}
                                    />
                                </Paper>
                            );
                        })}

                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<AddIcon />}
                            onClick={() => setOpenDialog(true)}
                            sx={{
                                mt: 2,
                                py: 2,
                                borderRadius: 4,
                                borderStyle: "dashed",
                                borderWidth: 2,
                                fontWeight: 800,
                                textTransform: "none",
                                "&:hover": { borderWidth: 2, bgcolor: "#f1f5f9" }
                            }}
                        >
                            Add New Address
                        </Button>
                    </Stack>
                )}
            </Container>

            <Box sx={{
                position: 'fixed',
                bottom: 0,
                left: { xs: 0, md: 240 },
                right: 0,
                p: { xs: 2, md: 3 },
                bgcolor: 'white',
                borderTop: '1px solid #f1f5f9',
                boxShadow: "0 -10px 40px rgba(0,0,0,0.04)",
                zIndex: 10
            }}>
                <Container maxWidth="md">
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleApply}
                        disabled={!selectedId}
                        sx={{
                            py: 2.2,
                            borderRadius: 4,
                            fontWeight: 900,
                            fontSize: "1.1rem",
                            textTransform: "none",
                            boxShadow: `0 10px 25px ${designConfig.colors.primary.main}40`
                        }}
                    >
                        Set as Delivery Address
                    </Button>
                </Container>
            </Box>

            {/* Add Address Dialog - Premium Re-design */}
            <Dialog
                fullWidth
                maxWidth="sm"
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                TransitionComponent={Transition}
                PaperProps={{
                    sx: { borderRadius: 6, p: 2, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }
                }}
            >
                <DialogContent>
                    <Typography variant="h5" fontWeight={1000} sx={{ color: "#0f172a", mb: 4, letterSpacing: "-0.04em" }}>
                        Add Shipping Address
                    </Typography>
                    <Stack spacing={3}>
                        <TextField
                            label="Recipient Name"
                            fullWidth
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                        <TextField
                            label="Phone Number"
                            fullWidth
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                        <TextField
                            label="Complete Address"
                            multiline
                            rows={3}
                            fullWidth
                            value={newAddress.addressLine}
                            onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="City"
                                fullWidth
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                            />
                            <TextField
                                label="Pincode"
                                fullWidth
                                value={newAddress.pincode}
                                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                            />
                        </Stack>
                        <TextField
                            label="State"
                            fullWidth
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleSaveNewAddress}
                            disabled={isAdding}
                            sx={{ py: 2, mt: 2, borderRadius: 4, fontWeight: 900, textTransform: "none" }}
                        >
                            {isAdding ? <CircularProgress size={24} color="inherit" /> : 'Save Address'}
                        </Button>
                        <Button
                            variant="text"
                            fullWidth
                            onClick={() => setOpenDialog(false)}
                            sx={{ fontWeight: 800, color: "#64748b", textTransform: "none" }}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default AddressSelection;
