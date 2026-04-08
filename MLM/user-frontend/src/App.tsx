// src/App.tsx
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Loading from "./components/common/Loading";
import designConfig from "./config/designConfig";

// Layout
const Layout = lazy(() => import("./components/layout/Layout"));

// Public Routes
const LandingPage = lazy(() => import("./modules/landing/LandingPage"));
const Login = lazy(() => import("./modules/auth/Login"));
const Signup = lazy(() => import("./modules/auth/Signup"));

// Onboarding / Registration Flow
const Welcome = lazy(() => import("./modules/onboarding/Welcome"));
const BasicInfo = lazy(() => import("./modules/onboarding/BasicInfo"));
const KycVerification = lazy(() => import("./modules/onboarding/KycVerification"));
const BankDetails = lazy(() => import("./modules/onboarding/BankDetails"));
const TermsConditions = lazy(() => import("./modules/onboarding/TermsConditions"));
const ChoosePackage = lazy(() => import("./modules/onboarding/ChoosePackage"));
const RegistrationSuccess = lazy(() => import("./modules/onboarding/RegistrationSuccess"));
const MyPlans = lazy(() => import("./modules/plan/MyPlans"));

// Protected Layout - User Pages
const Cart = lazy(() => import("./modules/cart/Cart"));
const Checkout = lazy(() => import("./modules/cart/Checkout"));
const OrderSuccess = lazy(() => import("./modules/cart/OrderSuccess"));
const Payment = lazy(() => import("./modules/cart/Payment"));
const Home = lazy(() => import("./modules/home/Home"));
const Kyc = lazy(() => import("./modules/kyc/Kyc").then(m => ({ default: m.Kyc }))); // Special handling for named export
const ChoosePosition = lazy(() => import("./modules/network/ChoosePosition"));
const Genealogy = lazy(() => import("./modules/network/Genealogy"));
const InvitesReferrals = lazy(() => import("./modules/network/InvitesReferrals"));
const PlaceNewMember = lazy(() => import("./modules/network/PlaceNewMember"));
const Notifications = lazy(() => import("./modules/notifications/Notifications"));
const KycStatusPage = lazy(() => import("./modules/user/KycStatus"));
const PersonalInfoPage = lazy(() => import("./modules/user/PersonalInformation"));
const BankAccountPage = lazy(() => import("./modules/wallet/BankAccountDetails"));
const BvLedger = lazy(() => import("./modules/wallet/BvLedger"));
const Coins = lazy(() => import("./modules/wallet/Coins"));
const Coupons = lazy(() => import("./modules/wallet/Coupons"));
const Dashboard = lazy(() => import("./modules/wallet/Dashboard"));
const Earning = lazy(() => import("./modules/wallet/EarningTab"));
const Payouts = lazy(() => import("./modules/wallet/Payouts"));
const Repurchase = lazy(() => import("./modules/wallet/Repurchase"));
const Order = lazy(() => import("./modules/order/Order"));
const OrderTracking = lazy(() => import("./modules/order/OrderTracking"));
const Plan = lazy(() => import("./modules/plan/plan"));
const ReceivedPlans = lazy(() => import("./modules/plan/ReceivedPlans"));
const IncomeHistory = lazy(() => import("./modules/income/IncomeHistory"));
const Profile = lazy(() => import("./modules/profile/Profile"));
const Category = lazy(() => import("./modules/shop/Category"));
const CategoryProducts = lazy(() => import("./modules/shop/CategoryProducts"));
const ProductDetails = lazy(() => import("./modules/shop/ProductDetails"));
const Contact = lazy(() => import("./modules/support/Contact"));
const Faqs = lazy(() => import("./modules/support/Faqs"));
const AddressSelection = lazy(() => import("./modules/user/AddressSelection"));
const NotFound = lazy(() => import("./components/common/NotFound"));

const theme = createTheme({
  palette: {
    primary: {
      main: designConfig.colors.primary.main,
      light: designConfig.colors.primary.light,
      dark: designConfig.colors.primary.dark,
      contrastText: designConfig.colors.primary.contrastText,
    },
    secondary: {
      main: designConfig.colors.secondary.main,
      light: designConfig.colors.secondary.light,
      dark: designConfig.colors.secondary.dark,
      contrastText: designConfig.colors.secondary.contrastText,
    },
    background: {
      default: designConfig.colors.background.default,
      paper: designConfig.colors.background.paper,
    },
    text: {
      primary: designConfig.colors.text.primary,
      secondary: designConfig.colors.text.secondary,
    },
  },
  typography: {
    fontFamily: designConfig.typography.fontFamily.primary,
    h1: { fontFamily: designConfig.typography.fontFamily.heading },
    h2: { fontFamily: designConfig.typography.fontFamily.heading },
    h3: { fontFamily: designConfig.typography.fontFamily.heading },
    h4: { fontFamily: designConfig.typography.fontFamily.heading },
    h5: { fontFamily: designConfig.typography.fontFamily.heading },
    h6: { fontFamily: designConfig.typography.fontFamily.heading },
    body1: { fontFamily: designConfig.typography.fontFamily.primary },
    body2: { fontFamily: designConfig.typography.fontFamily.primary },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
});

const queryclient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryclient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-right" richColors />
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public Route */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Onboarding / Registration Flow (No Layout) */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/onboarding/basic-info" element={<BasicInfo />} />
              <Route path="/onboarding/kyc" element={<KycVerification />} />
              <Route path="/onboarding/bank" element={<BankDetails />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/choose-package" element={<ChoosePackage />} />
              <Route path="/registration-success" element={<RegistrationSuccess />} />

              {/* Protected Layout - User Pages */}
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/category" element={<Category />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/kyc" element={<Kyc />} />
                <Route path="/plan" element={<Plan />} />
                <Route path="/my-plans" element={<MyPlans />} />
                <Route path="/received-plans" element={<ReceivedPlans />} />
                <Route path="/income-history" element={<IncomeHistory />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-wallet" element={<Dashboard />} />
                <Route path="/my-wallet/coins" element={<Coins />} />
                <Route path="/my-wallet/coupons" element={<Coupons />} />
                <Route path="/my-wallet/earnings" element={<Earning />} />
                <Route path="/my-wallet/repurchase" element={<Repurchase />} />
                <Route path="/genealogy" element={<Genealogy />} />
                <Route path="/place-new-member" element={<PlaceNewMember />} />
                <Route path="/invite-earn" element={<InvitesReferrals />} />
                <Route path="/personal-info" element={<PersonalInfoPage />} />
                <Route path="/kyc-status" element={<KycStatusPage />} />
                <Route path="/bank-account" element={<BankAccountPage />} />
                <Route path="/payouts" element={<Payouts />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/faqs" element={<Faqs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/choose-position" element={<ChoosePosition />} />

                {/* Shopping Flow */}
                <Route path="/category-products" element={<CategoryProducts />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/address-selection" element={<AddressSelection />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/order-tracking/:id" element={<OrderTracking />} />
                <Route path="/bv-ledger" element={<BvLedger />} />
              </Route>
              
              {/* Catch all - 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
