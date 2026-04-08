import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import React, { useState } from "react";

import { useCreateBrand } from "../../hooks/Brand/useCreateBrand";
import { useDeleteBrand } from "../../hooks/Brand/useDeleteBrand";
import { useGetBrands } from "../../hooks/Brand/useGetBrands";
import { useUpdateBrand } from "../../hooks/Brand/useUpdateBrand";
import { useGetSubCategories } from "../../hooks/Subcategory/useGetSubCategories";

import { uploadToCloudinary } from "../../utils/upload";

interface Brand {
    id: number;
    subcategoryId: number;
    brandname: string;
    image: string;
    status: "ACTIVE" | "INACTIVE";
    subcategory?: {
        name: string;
    };
}

interface BrandForm {
    subcategoryId: number | string;
    brandname: string;
    status: "Active" | "Pending";
    imageFile: File | null;
    imagePreview: string;
}

// const uploadToCloudinary = async (file: File) => {
//     const data = new FormData();
//     data.append("file", file);
//     data.append("upload_preset", "frontendfileupload");

//     const res = await fetch(
//         "https://api.cloudinary.com/v1_1/dhuddbzui/image/upload",
//         {
//             method: "POST",
//             body: data,
//         }
//     );

//     if (!res.ok) throw new Error("Upload failed");

//     const result = await res.json();
//     return result.secure_url;
// };

const BrandManagement: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const apiPage = page + 1;
    const apiLimit = rowsPerPage;

    const { data, isLoading, isFetching } = useGetBrands(apiPage, apiLimit);
    const { data: subcategoriesData } = useGetSubCategories(1, 100);
    const subcategories = subcategoriesData?.data || [];

    const createMutation = useCreateBrand();
    const updateMutation = useUpdateBrand();
    const deleteMutation = useDeleteBrand();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);

    const [brand, setBrand] = useState<BrandForm>({
        subcategoryId: "",
        brandname: "",
        status: "Active",
        imageFile: null,
        imagePreview: "",
    });

    // ✅ Correct path: data.data is the brands array, data.total is the total count
    const brands = data?.data || [];
    const total = data?.total || 0;

    // if (data) console.log("Brand API response:", data); // optional debug

    /* ================= IMAGE ================= */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setBrand((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: URL.createObjectURL(file),
        }));
    };

    /* ================= CREATE ================= */
    const addBrand = async () => {
        if (!brand.brandname || !brand.imageFile || !brand.subcategoryId)
            return;

        try {
            setUploading(true);
            const imageUrl = await uploadToCloudinary(brand.imageFile);

            createMutation.mutate({
                subcategoryId: Number(brand.subcategoryId),
                brandname: brand.brandname,
                image: imageUrl,
            });

            resetForm();
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    /* ================= UPDATE ================= */
    const updateBrand = async () => {
        if (editingId === null) return;

        try {
            setUploading(true);

            let imageUrl = brand.imagePreview;
            if (brand.imageFile) {
                imageUrl = await uploadToCloudinary(brand.imageFile);
            }

            updateMutation.mutate({
                id: editingId,
                payload: {
                    subcategoryId: Number(brand.subcategoryId),
                    brandname: brand.brandname,
                    image: imageUrl,
                    status: brand.status === "Active" ? "ACTIVE" : "INACTIVE",
                },
            });

            resetForm();
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    /* ================= DELETE ================= */
    const deleteBrand = (id: number) => {
        deleteMutation.mutate(id);
    };

    /* ================= EDIT ================= */
    const editBrand = (item: Brand) => {
        setEditingId(item.id);
        setBrand({
            subcategoryId: item.subcategoryId,
            brandname: item.brandname,
            status: item.status === "ACTIVE" ? "Active" : "Pending",
            imageFile: null,
            imagePreview: item.image,
        });
        setOpenDialog(true);
    };

    /* ================= RESET ================= */
    const resetForm = () => {
        setBrand({
            subcategoryId: "",
            brandname: "",
            status: "Active",
            imageFile: null,
            imagePreview: "",
        });
        setEditingId(null);
        setOpenDialog(false);
    };

    /* ================= PAGINATION ================= */
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    if (isLoading) {
        return (
            <Box p={3} textAlign="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h5" fontWeight={600} mb={2}>
                Brand Management
            </Typography>

            <Card
                elevation={2}
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            borderBottom: "1px solid #eaeaea",
                            bgcolor: "#f9fafb",
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight={500}>
                            Brands
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenDialog(true)}
                            sx={{
                                borderRadius: 1.5,
                                textTransform: "none",
                                px: 2,
                                py: 1,
                                fontWeight: 500,
                            }}
                        >
                            Add Brand
                        </Button>
                    </Box>

                    {/* Table */}
                    <Table size="small">
                        <TableHead>
                            <TableRow
                                sx={{
                                    bgcolor: "grey.50",
                                    "& .MuiTableCell-head": {
                                        fontWeight: 600,
                                        fontSize: 13,
                                        color: "text.secondary",
                                        textTransform: "uppercase",
                                    },
                                }}
                            >
                                <TableCell align="center" width={60}>
                                    SL
                                </TableCell>
                                <TableCell align="left">Image</TableCell>
                                <TableCell align="left">Brand Name</TableCell>
                                <TableCell align="left">Subcategory ID</TableCell>
                                <TableCell align="left">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {brands.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography color="text.secondary">
                                            No brands found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                brands.map((item: Brand, index: number) => (
                                    <TableRow
                                        key={item.id}
                                        hover
                                        sx={{
                                            "&:hover": { bgcolor: "action.hover" },
                                        }}
                                    >
                                        <TableCell align="center" sx={{ fontSize: 13 }}>
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>

                                        <TableCell>
                                            <Avatar
                                                src={item.image}
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                <ImageIcon fontSize="small" />
                                            </Avatar>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>
                                                {item.brandname}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2" color="text.primary">
                                                {item.subcategory?.name || item.subcategoryId}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                color={
                                                    item.status === "ACTIVE"
                                                        ? "success.main"
                                                        : "warning.main"
                                                }
                                            >
                                                {item.status}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    gap: 0.5,
                                                }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => editBrand(item)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => deleteBrand(item.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 20, 50]}
                        sx={{
                            "& .MuiToolbar-root": { minHeight: "40px" },
                        }}
                    />
                </CardContent>
            </Card>

            {/* Dialog */}
            <Dialog
                open={openDialog}
                onClose={resetForm}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": { borderRadius: 2 },
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingId ? "Edit Brand" : "Add Brand"}
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <Avatar
                            src={brand.imagePreview}
                            sx={{
                                width: 80,
                                height: 80,
                                border: "1px solid #ddd",
                            }}
                        >
                            <ImageIcon />
                        </Avatar>

                        <Button
                            component="label"
                            fullWidth
                            sx={{
                                borderRadius: 1.5,
                                textTransform: "none",
                                borderColor: "text.secondary",
                            }}
                        >
                            Upload Image
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>

                        {/* ✅ subcategoryId as number input */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="subcategory-select-label">Select Subcategory</InputLabel>
                            <Select
                                labelId="subcategory-select-label"
                                label="Select Subcategory"
                                value={brand.subcategoryId}
                                onChange={(e) =>
                                    setBrand({ ...brand, subcategoryId: e.target.value as string })
                                }
                            >
                                {subcategories.map((sub: any) => (
                                    <MenuItem key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Brand Name"
                            value={brand.brandname}
                            onChange={(e) =>
                                setBrand({
                                    ...brand,
                                    brandname: e.target.value,
                                })
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={resetForm} color="inherit" variant="outlined">
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        disabled={uploading || isFetching}
                        onClick={editingId ? updateBrand : addBrand}
                        sx={{ borderRadius: 1.5, textTransform: "none" }}
                    >
                        {uploading ? "Uploading..." : editingId ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BrandManagement;