import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RequireAuth from "../components/RequireAuth";
import RegisterSellerPage from "../pages/RegisterSellerPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ProductListPage from "../pages/ProductListPage";
import ProductFormPage from "../pages/ProductFormPage";
import BudgetListPage from "../pages/BudgetListPage";
import BudgetFormPage from "../pages/BudgetFormPage";
import BudgetDetailPage from "../pages/BudgetDetailPage";
import ApproveRejectPage from "../pages/ApproveRejectPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas protegidas */}
        <Route element={<RequireAuth />}>
          <Route path="/register" element={<RegisterSellerPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />

          <Route path="/budgets" element={<BudgetListPage />} />
          <Route path="/budgets/new" element={<BudgetFormPage />} />
          <Route path="/budgets/:id" element={<BudgetDetailPage />} />
          <Route path="/budgets/:id/approve" element={<ApproveRejectPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
