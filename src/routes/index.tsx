import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RequireAuth from "../components/RequireAuth";
import RegisterSellerPage from "../pages/RegisterSellerPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ProductListPage from "../pages/ProductListPage";
import AddonFormPage from "../pages/AddonFormPage";
import AddonListPage from "../pages/AddonListPage";
import ApproveRejectPage from "../pages/ApproveRejectPage";
import BudgetDetailPage from "../pages/BudgetDetailPage";
import BudgetFormPage from "../pages/BudgetFormPage";
import BudgetListPage from "../pages/BudgetListPage";
import ProductFormPage from "../pages/ProductFormPage";
import RequireRole from "../components/RequireRole";

// ...imports das páginas...

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* rotas protegidas */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRole="SUPER_USER" />}>
          <Route path="/register" element={<RegisterSellerPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/addons/new" element={<AddonFormPage />} />
          <Route path="/addons/:id/edit" element={<AddonFormPage />} />
          <Route path="/teste/:id/approve" element={<ApproveRejectPage />} />
        </Route>

        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/addons" element={<AddonListPage />} />
        <Route path="/budgets" element={<BudgetListPage />} />
        <Route path="/budgets/new" element={<BudgetFormPage />} />
        <Route path="/budgets/:id" element={<BudgetDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
