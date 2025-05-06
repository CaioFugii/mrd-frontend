import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  allowedRole: string;
}

export default function RequireRole({ allowedRole }: Props) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated || role === null) {
    return <p>Verificando permissões...</p>;
  }

  if (role !== allowedRole) {
    return <Navigate to="/budgets" replace />;
  }

  return <Outlet />;
}
