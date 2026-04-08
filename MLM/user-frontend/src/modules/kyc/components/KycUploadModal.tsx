import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { X, UploadCloud, AlertCircle } from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { KycPayload, KycApiError } from "../../../api/kyc.api";

interface KycUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: KycPayload) => void;
  isSubmitting: boolean;
}

const EMPTY_KYC_FORM: KycPayload = {
  panNo: "",
  panImageUrl: "",
  aadharNo: "",
  aadharImgUrl: "",
  bankName: "",
  accountNo: "",
  ifscCode: "",
  branchName: "",
  bankProofImgUrl: "",
};

const FIELD_LABELS: Record<keyof KycPayload, string> = {
  panNo: "PAN Number",
  panImageUrl: "PAN Image",
  aadharNo: "Aadhaar Number",
  aadharImgUrl: "Aadhaar Image",
  bankName: "Bank Name",
  accountNo: "Account Number",
  ifscCode: "IFSC Code",
  branchName: "Branch Name",
  bankProofImgUrl: "Bank Proof",
};

export const KycUploadModal: React.FC<KycUploadModalProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<KycPayload>(EMPTY_KYC_FORM);
  const [uploading, setUploading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof KycPayload, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const uploadToCloudinary = async (file: File, field: keyof KycPayload) => {
    setUploading(field);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "frontendfileupload");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dhuddbzui/image/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();
      setFormData((prev) => ({ ...prev, [field]: result.secure_url }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      toast.success(`${FIELD_LABELS[field]} uploaded`);
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = () => {
    // Basic validation
    const newErrors: Partial<Record<keyof KycPayload, string>> = {};
    Object.keys(formData).forEach((key) => {
      const k = key as keyof KycPayload;
      if (!formData[k]) {
        newErrors[k] = `${FIELD_LABELS[k]} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all required fields and upload all documents");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }} component="div">
        <Box>
          <Typography variant="h6" fontWeight={800}>Submit KYC Documents</Typography>
          <Typography variant="caption" color="text.secondary">Provide clear images for faster verification</Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, pt: 1 }}>
        <Box sx={{ mb: 4, p: 2, bgcolor: "#f8fafc", borderRadius: 3, border: "1px solid #e2e8f0", display: "flex", gap: 2 }}>
          <AlertCircle size={20} color="#64748b" />
          <Typography variant="body2" color="text.secondary">
            Ensure that all details on the documents are legible. Handwritten or blurry images will be rejected.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Identity Section */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" fontWeight={700} color="primary" gutterBottom>Identity Information</Typography>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
             <Typography variant="caption" fontWeight={700} color="text.secondary">PAN Number</Typography>
             <TextField
                fullWidth size="small" name="panNo" value={formData.panNo}
                onChange={handleInputChange} placeholder="Enter PAN Number"
                error={Boolean(errors.panNo)} helperText={errors.panNo} sx={{ mt: 0.5 }}
             />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
             <Typography variant="caption" fontWeight={700} color="text.secondary">Upload PAN Card</Typography>
             <Button
                component="label" variant="outlined" fullWidth startIcon={<UploadCloud size={18} />}
                disabled={!!uploading} sx={{ mt: 0.5, py: 1, borderRadius: 2, borderStyle: "dashed" }}
             >
                {uploading === "panImageUrl" ? "Uploading..." : formData.panImageUrl ? "Change Image" : "Select Image"}
                <input hidden type="file" accept="image/*" onChange={(e) => e.target.files && uploadToCloudinary(e.target.files[0], "panImageUrl")} />
             </Button>
             {formData.panImageUrl && <Typography variant="caption" color="success.main" display="block">✓ Uploaded</Typography>}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
             <Typography variant="caption" fontWeight={700} color="text.secondary">Aadhaar Number</Typography>
             <TextField
                fullWidth size="small" name="aadharNo" value={formData.aadharNo}
                onChange={handleInputChange} placeholder="Enter 12-digit Aadhaar Number"
                error={Boolean(errors.aadharNo)} helperText={errors.aadharNo} sx={{ mt: 0.5 }}
             />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
             <Typography variant="caption" fontWeight={700} color="text.secondary">Upload Aadhaar Card</Typography>
             <Button
                component="label" variant="outlined" fullWidth startIcon={<UploadCloud size={18} />}
                disabled={!!uploading} sx={{ mt: 0.5, py: 1, borderRadius: 2, borderStyle: "dashed" }}
             >
                {uploading === "aadharImgUrl" ? "Uploading..." : formData.aadharImgUrl ? "Change Image" : "Select Image"}
                <input hidden type="file" accept="image/*" onChange={(e) => e.target.files && uploadToCloudinary(e.target.files[0], "aadharImgUrl")} />
             </Button>
             {formData.aadharImgUrl && <Typography variant="caption" color="success.main" display="block">✓ Uploaded</Typography>}
          </Grid>

          <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
            <Divider />
          </Grid>

          {/* Bank Section */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" fontWeight={700} color="primary" gutterBottom>Banking Information</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
             <Typography variant="caption" fontWeight={700} color="text.secondary">Bank Name</Typography>
             <TextField
                fullWidth size="small" name="bankName" value={formData.bankName}
                onChange={handleInputChange} placeholder="Enter Bank Name"
                error={Boolean(errors.bankName)} helperText={errors.bankName} sx={{ mt: 0.5 }}
             />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
             <Typography variant="caption" fontWeight={700} color="text.secondary">Account Number</Typography>
             <TextField
                fullWidth size="small" name="accountNo" value={formData.accountNo}
                onChange={handleInputChange} placeholder="Enter Bank Account Number"
                error={Boolean(errors.accountNo)} helperText={errors.accountNo} sx={{ mt: 0.5 }}
             />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
             <Typography variant="caption" fontWeight={700} color="text.secondary">IFSC Code</Typography>
             <TextField
                fullWidth size="small" name="ifscCode" value={formData.ifscCode}
                onChange={handleInputChange} placeholder="Enter IFSC Code"
                error={Boolean(errors.ifscCode)} helperText={errors.ifscCode} sx={{ mt: 0.5 }}
             />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
             <Typography variant="caption" fontWeight={700} color="text.secondary">Branch Name</Typography>
             <TextField
                fullWidth size="small" name="branchName" value={formData.branchName}
                onChange={handleInputChange} placeholder="Enter Branch Name"
                error={Boolean(errors.branchName)} helperText={errors.branchName} sx={{ mt: 0.5 }}
             />
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
             <Typography variant="caption" fontWeight={700} color="text.secondary">Upload Bank Proof (Cheque/Passbook)</Typography>
             <Button
                component="label" variant="outlined" fullWidth startIcon={<UploadCloud size={18} />}
                disabled={!!uploading} sx={{ mt: 0.5, py: 1, borderRadius: 2, borderStyle: "dashed" }}
             >
                {uploading === "bankProofImgUrl" ? "Uploading..." : formData.bankProofImgUrl ? "Change Image" : "Select Image"}
                <input hidden type="file" accept="image/*" onChange={(e) => e.target.files && uploadToCloudinary(e.target.files[0], "bankProofImgUrl")} />
             </Button>
             {formData.bankProofImgUrl && <Typography variant="caption" color="success.main" display="block">✓ Uploaded</Typography>}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 1 }}>
        <Button onClick={onClose} variant="text" sx={{ borderRadius: 2, px: 3, color: "text.secondary", fontWeight: 600 }}>Cancel</Button>
        <Button
          onClick={handleSubmit} variant="contained" disabled={isSubmitting || !!uploading}
          sx={{ borderRadius: 2, px: 4, fontWeight: 700, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}
        >
          {isSubmitting ? "Submitting..." : "Submit Documents"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
