import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGetAdmin } from "../../hooks/Admin/useGetAdmin"; // <-- import your hook
import { useLogout } from "../../hooks/Auth/useLogout";

const Topbar = () => {
  const [langMenu, setLangMenu] = useState<null | HTMLElement>(null);
  const [userMenu, setUserMenu] = useState<null | HTMLElement>(null);
  const { mutate: logoutMutate } = useLogout();
  const navigate = useNavigate();

  // fetch admin
  const { data: adminData, isLoading } = useGetAdmin();

  const handleLogout = () => {
    logoutMutate({}, {
      onSuccess: () => {
        setUserMenu(null);
        toast.success("Logout Successful");
        navigate("/login");
      },
      onError: (error: any) => {
        toast.error("Logout error: " + error.message);
        console.error("Logout error:", error.message);
      },
    });
  };

  const initials = `${adminData?.Admin.firstName?.[0] ?? ""}${adminData?.Admin.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#333",
        borderBottom: "1px solid #e6e8ec",
        px: 2,
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ flexGrow: 1 }} />

        <Menu
          anchorEl={langMenu}
          open={Boolean(langMenu)}
          onClose={() => setLangMenu(null)}
        >
          <MenuItem onClick={() => setLangMenu(null)}>English</MenuItem>
          <MenuItem onClick={() => setLangMenu(null)}>Hindi</MenuItem>
        </Menu>

        {/* USER PROFILE */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={(e) => setUserMenu(e.currentTarget)}
        >
          <Avatar
            alt="Profile"
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#1976d2",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {isLoading ? "" : initials}
          </Avatar>
          <Box sx={{ ml: 1 }}>
            {isLoading ? (
              <CircularProgress size={16} />
            ) : (
              <Typography sx={{ fontWeight: 600 }}>
                {adminData?.Admin.firstName || "Admin User"} {adminData?.Admin.lastName}
              </Typography>
            )}
            <Typography sx={{ fontSize: 12, color: "#7a7f85" }}>{adminData?.Admin.adminType}</Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ ml: 1 }} />
        </Box>

        <Menu
          anchorEl={userMenu}
          open={Boolean(userMenu)}
          onClose={() => setUserMenu(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem component={Link} to="/profile" onClick={() => setUserMenu(null)}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;