import { Add, Delete, Edit } from "@mui/icons-material";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    TablePagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useState } from "react";

import { useCreateSubCategory } from "../../hooks/Subcategory/useCreateSubCategory";
import { useDeleteSubCategory } from "../../hooks/Subcategory/useDeleteSubCategory";
import { useGetSubCategories } from "../../hooks/Subcategory/useGetSubCategories";
import { useUpdateSubCategory } from "../../hooks/Subcategory/useUpdateSubCategory";
import { useGetCategories } from "../../hooks/Category/useGetCategories";

import { uploadToCloudinary } from "../../utils/upload";
import { toast } from "sonner";

const SubcategoryManagement = () => {
    // ✅ pagination state
    const [page, setPage] = useState(0);        // 0‑based for MUI
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // adjust API’s page param (it’s 1‑based)
    const apiPage = page + 1;
    const apiLimit = rowsPerPage;

    const { data, isLoading, isFetching } = useGetSubCategories(
        apiPage,
        apiLimit
    );

    const createMutation = useCreateSubCategory();
    const updateMutation = useUpdateSubCategory();
    const deleteMutation = useDeleteSubCategory();

    const { data: categoriesData } = useGetCategories(1, 100);
    const categories = categoriesData?.data?.data || [];

    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        Description: "",
        image: "",
        categoryId: "",
    });

    const subcategories = data?.data || [];
    const total = data?.total || 0;

    const handleOpen = (item?: any) => {
        if (item) {
            setEditData(item);
            setForm({
                name: item.name,
                Description: item.Description,
                image: item.image,
                categoryId: item.category?.id || "",
            });
        } else {
            setEditData(null);
            setForm({
                name: "",
                Description: "",
                image: "",
                categoryId: "",
            });
        }
        setOpen(true);
    };

    const handleSubmit = () => {
        if (editData) {
            updateMutation.mutate({
                id: editData.id,
                payload: {
                    ...form,
                    categoryId: Number(form.categoryId),
                },
            });
        } else {
            createMutation.mutate({
                ...form,
                categoryId: Number(form.categoryId),
            });
        }
        setOpen(false);
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
        toast.success("Subcategory deleted successfully", {
            style: { color: "#4caf50" },
        });
    };

    const handleImageUpload = async (file: File) => {
        try {
            setUploading(true);
            const url = await uploadToCloudinary(file);
            setForm((prev) => ({
                ...prev,
                image: url,
            }));
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    // MUI pagination handlers
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: any) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ p: 3, background: "#f4f6f9", minHeight: "100vh" }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h5" fontWeight={600} color="text.primary">
                    Subcategory Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                    sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                        px: 2,
                        py: 1,
                        fontWeight: 500,
                    }}
                >
                    Add Subcategory
                </Button>
            </Box>

            {/* Card wrapper */}
            <Paper
                elevation={2}
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                }}
            >
                {/* Table header */}
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
                        Subcategories
                    </Typography>
                </Box>

                {/* Table */}
                {isLoading ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <>
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
                                    <TableCell align="left">Name</TableCell>
                                    <TableCell align="left" sx={{ maxWidth: 200 }}>
                                        Description
                                    </TableCell>
                                    <TableCell align="left">Category</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {subcategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            <Typography color="text.secondary">
                                                No subcategories found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subcategories.map((item: any, index: number) => (
                                        <TableRow
                                            key={item.id}
                                            hover
                                            sx={{
                                                "&:hover": {
                                                    bgcolor: "action.hover",
                                                },
                                            }}
                                        >
                                            <TableCell align="center" sx={{ fontSize: 13 }}>
                                                {page * rowsPerPage + index + 1}
                                            </TableCell>

                                            <TableCell>
                                                <Box
                                                    component="img"
                                                    src={item.image}
                                                    alt=""
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: 10,
                                                        objectFit: "cover",
                                                        border: "1px solid #ddd",
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {item.name}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {item.Description}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography variant="body2" color="text.primary">
                                                    {item.category?.name || "-"}
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
                                                        onClick={() => handleOpen(item)}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>

                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Delete fontSize="small" />
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
                                "& .MuiToolbar-root": {
                                    minHeight: "40px",
                                },
                            }}
                        />
                    </>
                )}
            </Paper>

            {/* Modal – same as before */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: 2,
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editData ? "Update Subcategory" : "Create Subcategory"}
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="category-select-label">Select Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                label="Select Category"
                                value={form.categoryId}
                                onChange={(e) =>
                                    setForm({ ...form, categoryId: e.target.value as string })
                                }
                            >
                                {categories.map((cat: any) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Name"
                            margin="normal"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            margin="normal"
                            value={form.Description}
                            onChange={(e) =>
                                setForm({ ...form, Description: e.target.value })
                            }
                            InputLabelProps={{ shrink: true }}
                        />

                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={
                                    <Box
                                        component="span"
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: "50%",
                                            border: "1px dashed currentColor",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        +
                                    </Box>
                                }
                            >
                                Upload Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            handleImageUpload(e.target.files[0]);
                                        }
                                    }}
                                />
                            </Button>

                            {uploading && (
                                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Uploading...
                                    </Typography>
                                    <CircularProgress size={16} sx={{ ml: 1 }} />
                                </Box>
                            )}

                            {form.image && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block", mb: 0.5 }}
                                    >
                                        Image preview
                                    </Typography>
                                    <Box
                                        component="img"
                                        src={form.image}
                                        alt="preview"
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 1,
                                            objectFit: "cover",
                                            border: "1px solid #ddd",
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setOpen(false)}
                        color="inherit"
                        variant="outlined"
                        sx={{ borderRadius: 1.5, textTransform: "none" }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={
                            createMutation.isPending ||
                            updateMutation.isPending ||
                            uploading ||
                            isFetching
                        }
                        sx={{ borderRadius: 1.5, textTransform: "none" }}
                    >
                        {editData ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SubcategoryManagement;