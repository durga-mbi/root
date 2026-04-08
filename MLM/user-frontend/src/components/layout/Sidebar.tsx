import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import designConfig, { alpha } from '../../config/designConfig';


// Icons (MUI)
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import RedeemIcon from "@mui/icons-material/Redeem";
import InboxIcon from "@mui/icons-material/Inbox";
import ReceiptIcon from "@mui/icons-material/Receipt";

import { useReceivedShares } from "../../hooks/plan/useReceivedShares";
import { useCart } from "../../hooks/useEcommerce";
import { Badge } from "@mui/material";

const Sidebar = () => {
  const location = useLocation();
  const { data: cartData } = useCart();
  const { data: receivedShares } = useReceivedShares();

  const cartItemCount = cartData?.data?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  const receivedCount = receivedShares?.length || 0;

  const menuItems = [
    { name: "Home", path: "/home", icon: <HomeIcon /> },
    { name: "Kyc", path: "/kyc", icon: <VerifiedUserIcon /> },
    { name: "Buy Plans", path: "/plan", icon: <ShoppingCartIcon /> },
    { name: "My Plans", path: "/my-plans", icon: <RedeemIcon /> },
    ...(receivedCount > 0 ? [{
      name: "Received Plans",
      path: "/received-plans",
      icon: (
        <Badge badgeContent={receivedCount} color="error" overlap="circular">
          <InboxIcon />
        </Badge>
      )
    }] : []),
    { name: "My Wallets", path: "/my-wallet", icon: <AccountBalanceWalletIcon /> },
    { name: "Income History", path: "/income-history", icon: <AccountBalanceWalletIcon /> },
    { name: "Payout History", path: "/payouts", icon: <ReceiptIcon /> },
    { name: "Genealogy", path: "/genealogy", icon: <AccountTreeIcon /> },
    { name: "Invite & Earn", path: "/invite-earn", icon: <ShareIcon /> },
    { name: "Profile", path: "/profile", icon: <PersonIcon /> },
    { name: "Category Products", path: "/category-products", icon: <CategoryIcon /> },
    {
      name: "Cart",
      path: "/cart",
      icon: (
        <Badge badgeContent={cartItemCount} color="error" overlap="circular">
          <ShoppingCartIcon />
        </Badge>
      )
    },
    { name: "My Orders", path: "/orders", icon: <ReceiptIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo Removed - Moved to Global Topbar */}

      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.name}
              component={Link}
              to={item.path}
              sx={{
                mx: 1,
                mt: 1,
                borderRadius: designConfig.borderRadius.md,
                background: active ? designConfig.colors.gradients.primary : "transparent",
                color: active ? designConfig.colors.primary.contrastText : designConfig.colors.text.primary,
                boxShadow: active ? `0 4px 15px ${alpha(designConfig.colors.primary.main, 0.4)}` : "none",
                transition: designConfig.transitions.default,
                position: 'relative',
                overflow: 'hidden',
                "&::before": active ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '3px',
                  height: '100%',
                  background: 'rgba(255,255,255,0.8)',
                  boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                  borderRadius: '0 2px 2px 0'
                } : {},
                "&:hover": {
                  background: active
                    ? designConfig.colors.gradients.primary
                    : alpha(designConfig.colors.primary.main, 0.05),
                  transform: active ? 'none' : 'translateX(4px)'
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "inherit" : designConfig.colors.primary.main,
                  minWidth: 36,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: 240 },
        flexShrink: { md: 0 },
        display: { xs: "none", md: "block" } // Hide completely on mobile
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            background: designConfig.colors.surfaces.light,
            borderRight: `1px solid ${designConfig.colors.border}`,
            height: "100vh",
            position: "static"
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;