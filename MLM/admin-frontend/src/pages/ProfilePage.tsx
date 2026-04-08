import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import EditProfileInfo from "../components/profile/EditProfileInfo";
import { useGetAdmin } from "../hooks/Admin/useGetAdmin";
import { useUpdateAdmin } from "../hooks/Admin/useUpdateAdmin";

const ProfilePage: React.FC = () => {
  const [openProfileEdit, setOpenProfileEdit] = useState(false);

  // Fetch admin data
  const { data: adminData, isLoading } = useGetAdmin();
  const admin = adminData?.Admin;

  // Update mutation
  const { mutate: updateAdmin, isPending } = useUpdateAdmin();

  // Handle update
  const handleUpdateProfile = (updatedData: any) => {
    if (!admin?.id) return;

    updateAdmin(
      {
        id: admin.id,
        payload: updatedData,
      },
      {
        onSuccess: () => {
          setOpenProfileEdit(false);
        },
        onError: (err: any) => {
          console.error(err.message);
        },
      }
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      {/* PAGE TITLE */}
      <Typography fontSize={18} fontWeight={600} mb={2} color="#26619A">
        Profile
      </Typography>

      {/* USER CARD */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={admin ? `https://i.pravatar.cc/100?u=${admin.id}` : ""}
            alt={admin ? `${admin.firstName} ${admin.lastName}` : "Admin"}
            sx={{ width: 56, height: 56 }}
          />

          <Box>
            {isLoading ? (
              <CircularProgress size={16} />
            ) : (
              <>
                <Typography fontWeight={600}>
                  {admin
                    ? `${admin.firstName} ${admin.lastName}`
                    : "Admin User"}
                </Typography>

                <Typography fontSize={13} color="text.secondary">
                  {admin?.adminType || "Admin"}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      {/* PERSONAL INFORMATION */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography fontSize={18} fontWeight={600} color="#26619A">
            Personal Information
          </Typography>

          <Button
            size="small"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setOpenProfileEdit(true)}
          >
            Edit
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          {/* LEFT SIDE */}
          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <Typography fontSize={12} color="#26619A">
                First Name
              </Typography>
              <Typography fontWeight={500}>
                {admin?.firstName || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={12} color="#26619A">
                Email Address
              </Typography>
              <Typography fontWeight={500}>
                {admin?.email || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={12} color="#26619A">
                Role
              </Typography>
              <Typography fontWeight={500}>
                {admin?.adminType || "-"}
              </Typography>
            </Box>
          </Box>

          {/* RIGHT SIDE */}
          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <Typography fontSize={12} color="#26619A">
                Last Name
              </Typography>
              <Typography fontWeight={500}>
                {admin?.lastName || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={12} color="#26619A">
                Phone
              </Typography>
              <Typography fontWeight={500}>
                {admin?.mobile || "-"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* EDIT MODAL */}
      <EditProfileInfo
        open={openProfileEdit}
        onClose={() => setOpenProfileEdit(false)}
        onSave={handleUpdateProfile}
        loading={isPending}
        admin={admin} // pass current data (important)
      />
    </Box>
  );
};

export default ProfilePage;