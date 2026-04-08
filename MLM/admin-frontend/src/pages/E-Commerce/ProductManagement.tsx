import {
  Avatar,
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
  InputLabel,
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
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useCallback, useMemo, useState } from "react";

import { toast } from "sonner";
import { useCreateProduct } from "../../hooks/Product/useCreateProduct";
import { useDeleteProduct } from "../../hooks/Product/useDeleteProduct";
import { useGetProducts } from "../../hooks/Product/useGetProducts";
import { useUpdateProduct } from "../../hooks/Product/useUpdateProduct";
import { useGetCategories } from "../../hooks/Category/useGetCategories";
import { useGetSubCategories } from "../../hooks/Subcategory/useGetSubCategories";
import { useGetBrands } from "../../hooks/Brand/useGetBrands";

/* ================= CLOUDINARY UPLOAD HELPER ================= */
export const uploadToCloudinary = async (file: File) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "frontendfileupload");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dhuddbzui/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const result = await res.json();
  return result.secure_url;
};

/* ================= TYPES ================= */
interface Product {
  id: number;
  productName: string;
  categoryId: number;
  subcategoryId: number;
  brandId: number;
  HSNcode: string;
  dp_amount: number;
  mrp_amount: number;
  tax: number;
  description: string;
  specifaction: string;
  productmainimage: string;
  productOtherimage: string;
  status: "ACTIVE" | "INACTIVE";
  category?: { name: string };
  subcategory?: { name: string };
  brand?: { brandname: string };
}

export default function ProductManagement() {
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [mainImageUrl, setMainImageUrl] = useState<string>("");
  const [otherImageUrl, setOtherImageUrl] = useState<string>("");

  // Form state
  const [form, setForm] = useState<any>({
    productName: "",
    categoryId: 1,
    subcategoryId: 1,
    brandId: 1,
    HSNcode: "",
    dp_amount: "",
    mrp_amount: "",
    tax: "",
    description: "",
    specifaction: "",
    productmainimage: "",
    productOtherimage: "",
    status: "ACTIVE",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ================= REACT QUERY HOOKS ================= */
  const { data: productsData, isLoading, error } = useGetProducts(1, 100);

  const { data: categoriesData } = useGetCategories(1, 100);
  const categories = categoriesData?.data?.data || [];

  const { data: subcategoriesData } = useGetSubCategories(1, 100);
  const subcategories = subcategoriesData?.data || [];

  const { data: brandsData } = useGetBrands(1, 100);
  const brands = brandsData?.data || [];

  const products: Product[] = productsData?.result?.data || [];

  // Paginated slice
  const paginatedProducts = useMemo(() => {
    const from = page * rowsPerPage;
    const to = from + rowsPerPage;
    return products.slice(from, to);
  }, [products, page, rowsPerPage]);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  /* ================= FORM HANDLERS ================= */
  const handleInputChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleUploadMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImageUrl(URL.createObjectURL(file));

    try {
      const url = await uploadToCloudinary(file);
      handleInputChange("productmainimage", url);
    } catch (err) {
      console.error("Upload main image failed:", err);
      toast.success("Main image upload failed");
    }
  };

  const handleUploadOtherImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOtherImageUrl(URL.createObjectURL(file));

    try {
      const url = await uploadToCloudinary(file);
      handleInputChange("productOtherimage", url);
    } catch (err) {
      console.error("Upload other image failed:", err);
      toast.success("Other image upload failed");
    }
  };

  /* ================= SAVE PRODUCT ================= */
  const saveProduct = async () => {
    const payload = {
      productName: form.productName,
      categoryId: parseInt(form.categoryId, 10),
      subcategoryId: parseInt(form.subcategoryId, 10),
      brandId: parseInt(form.brandId, 10),
      HSNcode: form.HSNcode,
      dp_amount: parseFloat(form.dp_amount),
      mrp_amount: parseFloat(form.mrp_amount),
      tax: parseFloat(form.tax),
      description: form.description,
      specifaction: form.specifaction,
      productmainimage: form.productmainimage,
      productOtherimage: form.productOtherimage,
      status: form.status,
    };

    if (editingId) {
      await updateProductMutation.mutateAsync({ id: editingId, payload });
    } else {
      await createProductMutation.mutateAsync(payload);
    }

    resetForm();
  };

  /* ================= CRUD OPERATIONS ================= */
  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setForm({
      productName: product.productName,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      brandId: product.brandId,
      HSNcode: product.HSNcode,
      dp_amount: product.dp_amount.toString(),
      mrp_amount: product.mrp_amount.toString(),
      tax: product.tax.toString(),
      description: product.description,
      specifaction: product.specifaction,
      productmainimage: product.productmainimage,
      productOtherimage: product.productOtherimage,
      status: product.status,
    });
    setMainImageUrl(product.productmainimage);
    setOtherImageUrl(product.productOtherimage || "");
    setOpenForm(true);
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setOpenView(true);
  };

  const deleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  const resetForm = () => {
    setForm({
      productName: "",
      categoryId: 1,
      subcategoryId: 1,
      brandId: 1,
      HSNcode: "",
      dp_amount: "",
      mrp_amount: "",
      tax: "",
      description: "",
      specifaction: "",
      productmainimage: "",
      productOtherimage: "",
      status: "ACTIVE",
    });
    setMainImageUrl("");
    setOtherImageUrl("");
    setEditingId(null);
    setOpenForm(false);
  };

  /* ================= PAGINATION HANDLERS ================= */
  const handleChangePage = useCallback(
    (_: any, newPage: number) => {
      setPage(newPage);
    },
    []
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    },
    []
  );

  /* ================= UI ================= */
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Product Management
      </Typography>

      {error && (
        toast.error(error.message)
      )}

      {/* ================= TABLE ================= */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Products ({products.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
              disabled={createProductMutation.isPending}
            >
              Add Product
            </Button>
          </Stack>

          {isLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              sx={{
                display: { xs: "block", sm: "table" },
                overflowX: "auto",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>SKU/HSN</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Subcategory</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Brand</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Stack alignItems="start" spacing={1}>
                          <Avatar
                            src={product.productmainimage}
                            variant="rounded"
                            sx={{ width: 48, height: 48 }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/api/placeholder/48/48";
                            }}
                          />
                          <Typography fontSize={13} fontWeight={500} noWrap>
                            {product.productName}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{product.HSNcode}</TableCell>
                      <TableCell>₹{product.mrp_amount.toLocaleString()}</TableCell>
                      <TableCell>{product.category?.name || product.categoryId}</TableCell>
                      <TableCell>{product.subcategory?.name || product.subcategoryId}</TableCell>
                      <TableCell>{product.brand?.brandname || product.brandId}</TableCell>
                      <TableCell>
                        <Chip
                          label={product.status}
                          color={product.status === "ACTIVE" ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => viewProduct(product)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => editProduct(product)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* ================= ADD/EDIT PRODUCT FORM ================= */}
      <Dialog
        open={openForm}
        onClose={resetForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Product Name *"
              fullWidth
              value={form.productName}
              onChange={(e) => handleInputChange("productName", e.target.value)}
              required
            />

            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.categoryId}
                  label="Category"
                  onChange={(e) => handleInputChange("categoryId", e.target.value)}
                >
                  {categories.map((cat: any) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={form.subcategoryId}
                  label="Subcategory"
                  onChange={(e) => handleInputChange("subcategoryId", e.target.value)}
                >
                  {subcategories.map((sub: any) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={form.brandId}
                  label="Brand"
                  onChange={(e) => handleInputChange("brandId", e.target.value)}
                >
                  {brands.map((b: any) => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.brandname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="HSN Code"
              fullWidth
              value={form.HSNcode}
              onChange={(e) => handleInputChange("HSNcode", e.target.value)}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="DP Amount *"
                type="number"
                fullWidth
                value={form.dp_amount}
                onChange={(e) => handleInputChange("dp_amount", e.target.value)}
              />
              <TextField
                label="MRP Amount *"
                type="number"
                fullWidth
                value={form.mrp_amount}
                onChange={(e) => handleInputChange("mrp_amount", e.target.value)}
              />
              <TextField
                label="Tax (%)"
                type="number"
                fullWidth
                value={form.tax}
                onChange={(e) => handleInputChange("tax", e.target.value)}
                inputProps={{ step: 0.1 }}
              />
            </Stack>

            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />

            <TextField
              label="Specification"
              multiline
              rows={2}
              fullWidth
              value={form.specifaction}
              onChange={(e) => handleInputChange("specifaction", e.target.value)}
              placeholder="Enter patterns like 'Processor: A17 Pro' or 'RAM - 8GB' (one per line)"
              helperText="Format: Key: Value (one per line)"
            />

            {/* Image Uploads */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {/* Main Image */}
              <Box flex={1}>
                <Typography variant="body2" mb={0.5}>
                  Main Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadMainImage}
                />
                {mainImageUrl && (
                  <Avatar
                    src={mainImageUrl}
                    variant="rounded"
                    sx={{ width: 80, height: 80, mt: 1 }}
                  />
                )}
              </Box>

              {/* Other Image */}
              <Box flex={1}>
                <Typography variant="body2" mb={0.5}>
                  Other Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadOtherImage}
                />
                {otherImageUrl && (
                  <Avatar
                    src={otherImageUrl}
                    variant="rounded"
                    sx={{ width: 80, height: 80, mt: 1 }}
                  />
                )}
              </Box>
            </Stack>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button
            variant="contained"
            onClick={saveProduct}
            disabled={
              createProductMutation.isPending ||
              updateProductMutation.isPending ||
              !form.productName ||
              !form.dp_amount ||
              !form.mrp_amount
            }
          >
            {createProductMutation.isPending || updateProductMutation.isPending ? (
              <CircularProgress size={20} />
            ) : editingId ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= VIEW PRODUCT DIALOG ================= */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Stack spacing={2} mt={2}>
              <Stack direction="row" spacing={2}>
                <Avatar
                  src={selectedProduct.productmainimage}
                  variant="rounded"
                  sx={{ width: 100, height: 100 }}
                />
                <Box>
                  <Typography variant="h6">{selectedProduct.productName}</Typography>
                  <Chip
                    label={selectedProduct.status}
                    color="success"
                    size="small"
                  />
                </Box>
              </Stack>

              <Stack spacing={1}>
                <Typography>
                  <strong>HSN Code:</strong> {selectedProduct.HSNcode}
                </Typography>
                <Typography>
                  <strong>DP:</strong> ₹{selectedProduct.dp_amount.toLocaleString()}
                </Typography>
                <Typography>
                  <strong>MRP:</strong> ₹{selectedProduct.mrp_amount.toLocaleString()}
                </Typography>
                <Typography>
                  <strong>Tax:</strong> {selectedProduct.tax}%
                </Typography>
                <Typography>
                  <strong>Category:</strong> {selectedProduct.category?.name || selectedProduct.categoryId}
                </Typography>
                <Typography>
                  <strong>Subcategory:</strong> {selectedProduct.subcategory?.name || selectedProduct.subcategoryId}
                </Typography>
                <Typography>
                  <strong>Brand:</strong> {selectedProduct.brand?.brandname || selectedProduct.brandId}
                </Typography>
                <Typography>
                  <strong>Description:</strong> {selectedProduct.description}
                </Typography>
                <Typography>
                  <strong>Specification:</strong> {selectedProduct.specifaction}
                </Typography>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}