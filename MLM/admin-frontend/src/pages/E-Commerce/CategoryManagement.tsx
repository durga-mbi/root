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
  TableRow,
  TextField,
  Typography,
  TablePagination,
  CircularProgress,
} from "@mui/material";

import React, { useState } from "react";

// Hooks
import { useCreateCategory } from "../../hooks/Category/useCreateCategory";
import { useDeleteCategory } from "../../hooks/Category/useDeleteCategory";
import { useGetCategories } from "../../hooks/Category/useGetCategories";
import { useUpdateCategory } from "../../hooks/Category/useUpdateCategory";

import { uploadToCloudinary } from "../../utils/upload";

interface Category {
  id: number;
  name: string;
  Description: string;
  image: string;
  status: "ACTIVE" | "INACTIVE";
}

interface CategoryForm {
  name: string;
  description: string;
  status: "Active" | "Pending";
  imageFile: File | null;
  imagePreview: string;
}

// const uploadToCloudinary = async (file: File) => {
//   const data = new FormData();
//   data.append("file", file);
//   data.append("upload_preset", "frontendfileupload");

//   const res = await fetch(
//     "https://api.cloudinary.com/v1_1/dhuddbzui/image/upload",
//     {
//       method: "POST",
//       body: data,
//     }
//   );

//   if (!res.ok) throw new Error("Upload failed");

//   const result = await res.json();
//   return result.secure_url;
// };

const CategoryManagement: React.FC = () => {
  // ✅ pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiPage = page + 1;
  const apiLimit = rowsPerPage;

  const { data, isLoading, isFetching } = useGetCategories(apiPage, apiLimit);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const [category, setCategory] = useState<CategoryForm>({
    name: "",
    description: "",
    status: "Active",
    imageFile: null,
    imagePreview: "",
  });

  const categories = data?.data?.data || [];
  const total = data?.data?.total || 0; // or your actual field name

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCategory((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const addCategory = async () => {
    if (!category.name || !category.imageFile) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(category.imageFile);

      createMutation.mutate({
        name: category.name,
        Description: category.description,
        image: imageUrl,
      });

      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const updateCategory = async () => {
    if (editingId === null) return;

    try {
      setUploading(true);

      let imageUrl = category.imagePreview;
      if (category.imageFile) {
        imageUrl = await uploadToCloudinary(category.imageFile);
      }

      updateMutation.mutate({
        id: editingId,
        payload: {
          name: category.name,
          Description: category.description,
          image: imageUrl,
          status:
            category.status === "Active" ? "ACTIVE" : "INACTIVE",
        },
      });

      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const deleteCategory = (id: number) => {
    deleteMutation.mutate(id);
  };

  const editCategory = (cat: Category) => {
    setEditingId(cat.id);
    setCategory({
      name: cat.name,
      description: cat.Description,
      status: cat.status === "ACTIVE" ? "Active" : "Pending",
      imageFile: null,
      imagePreview: cat.image,
    });
    setOpenDialog(true);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setCategory({
      name: "",
      description: "",
      status: "Active",
      imageFile: null,
      imagePreview: "",
    });
    setEditingId(null);
    setOpenDialog(false);
  };

  /* MUI pagination handlers */
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (e: any) => {
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
        Category Management
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
              Categories
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
              Add Category
            </Button>
          </Box>

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
                <TableCell align="left">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      No categories found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat: Category, index: number) => (
                  <TableRow
                    key={cat.id}
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
                      <Avatar
                        src={cat.image}
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
                        {cat.name}
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
                        {cat.Description}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color={
                          cat.status === "ACTIVE"
                            ? "success.main"
                            : "warning.main"
                        }
                      >
                        {cat.status}
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
                          onClick={() => editCategory(cat)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteCategory(cat.id)}
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
        </CardContent>
      </Card>

      {/* DIALOG */}
      <Dialog
        open={openDialog}
        onClose={resetForm}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingId ? "Edit Category" : "Add Category"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Avatar
              src={category.imagePreview}
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

            <TextField
              fullWidth
              label="Name"
              value={category.name}
              onChange={(e) =>
                setCategory({
                  ...category,
                  name: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={category.description}
              onChange={(e) =>
                setCategory({
                  ...category,
                  description: e.target.value,
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
            onClick={editingId ? updateCategory : addCategory}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
            }}
          >
            {uploading ? "Uploading..." : editingId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;