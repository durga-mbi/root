import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";

interface EditProfileInfoProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  loading?: boolean;
  admin?: any;
}

const EditProfileInfo: React.FC<EditProfileInfoProps> = ({
  open,
  onClose,
  onSave,
  loading,
  admin,
}) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    adminType: "",
  });

  // ✅ Prefill when modal opens
  useEffect(() => {
    if (admin) {
      setForm({
        firstName: admin.firstName || "",
        lastName: admin.lastName || "",
        email: admin.email || "",
        mobile: admin.mobile || "",
        adminType: admin.adminType || "",
      });
    }
  }, [admin]);

  // ✅ Handle change
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Submit
  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Personal Information</DialogTitle>

      <Divider />

      <DialogContent>
        <Box mt={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            {/* First Name */}
            <Box>
              <Typography fontSize={12} color="text.secondary">
                First Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.firstName}
                onChange={(e) =>
                  handleChange("firstName", e.target.value)
                }
              />
            </Box>

            {/* Last Name */}
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Last Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.lastName}
                onChange={(e) =>
                  handleChange("lastName", e.target.value)
                }
              />
            </Box>

            {/* Email */}
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Email Address
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
              />
            </Box>

            {/* Phone */}
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Phone
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.mobile}
                onChange={(e) =>
                  handleChange("mobile", e.target.value)
                }
              />
            </Box>

            {/* Role / Bio */}
            <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
              <Typography fontSize={12} color="text.secondary">
                Role
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.adminType}
                onChange={(e) =>
                  handleChange("adminType", e.target.value)
                }
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileInfo;