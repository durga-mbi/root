// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import DateWiseUserIncome from "./components/IncomeComponent/DateWiseUserIncome";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PayoutHistoryByDate from "./components/PayoutComponent/PayoutHistoryByDate";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import BrandManagement from "./pages/E-Commerce/BrandManagement";
import CategoryManagement from "./pages/E-Commerce/CategoryManagement";
import ProductManagement from "./pages/E-Commerce/ProductManagement";
import SubcategoryManagement from "./pages/E-Commerce/SubCategoryMangement";
import Allincome from "./pages/Income/Allincome";
import All from "./pages/Kyc/All";
import Approved from "./pages/Kyc/Approved";
import Pending from "./pages/Kyc/Pending";
import Rejected from "./pages/Kyc/Rejected";
import LoginPage from "./pages/LoginPage";
import PackagesPage from "./pages/PackagesPage";
import AllPayout from "./pages/Payout/AllPayout";
import PlanApprovals from "./pages/PlanApprovals";
import ProfilePage from "./pages/ProfilePage";
import Rewards from "./pages/Rewards/Rewards";
import IncomeComission from "./pages/Setting-Config/IncomeComission";
import MailManagement from "./pages/Setting-Config/MailManagement";
import RoyalityComission from "./pages/Setting-Config/RoyalityComission";
import UserConfig from "./pages/Setting-Config/UserConfig";
import UsersPage from "./pages/UsersPage";
import OrdersManagement from "./pages/E-Commerce/OrdersManagement";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Default redirect to dashboard */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admins" element={<AdminPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/packages-plans" element={<PackagesPage />} />
              <Route path="/packages-plans/approvals" element={<PlanApprovals />} />

              {/* config */}
              <Route path="/settings/user-config" element={<UserConfig />} />
              <Route path="/settings/income-commissions" element={<IncomeComission />} />
              <Route path="/settings/royalty-commissions" element={<RoyalityComission />} />
              <Route path="/settings/smtp" element={<MailManagement />} />

              {/* kyc */}
              <Route path="/kyc-setting/pending" element={<Pending />} />
              <Route path="/kyc-setting/rejected" element={<Rejected />} />
              <Route path="/kyc-setting/approved" element={<Approved />} />
              <Route path="/kyc-setting/all" element={<All />} />

              {/* income */}
              <Route path="/income" element={<Allincome />} />
              <Route path="/date-wise-income/:id" element={<DateWiseUserIncome />} />

              {/* payout */}
              <Route path="/payout" element={<AllPayout />} />
              <Route path="/admin/payout/history/:id" element={<PayoutHistoryByDate />} />

              {/* rewards */}
              <Route path="/rewards" element={<Rewards />} />

              {/* ecommerce */}
              <Route path="/e-commerce/category" element={<CategoryManagement />} />
              <Route path="/e-commerce/products" element={<ProductManagement />} />
              <Route path="/e-commerce/sub-category" element={<SubcategoryManagement />} />
              <Route path="/e-commerce/brands" element={<BrandManagement />} />
              {/* <Route path="/settings/sku-config" element={<SkuConfig />} / */}
              <Route path="/e-commerce/orders" element={<OrdersManagement />} />

              {/* <Route path="/e-commerce/orders" element={<OrdersManagement />} /> */}
            </Route>
          </Route>

          {/* Catch all - 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </>
  );
}

export default App;
