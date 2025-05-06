import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout, role } = useAuth();
  const isSuperUser = role === "SUPER_USER";

  return (
    <nav style={{ borderBottom: "1px solid #ccc", padding: "1rem" }}>
      <Link to="/budgets">Orçamentos</Link> |{" "}
      <Link to="/budgets/new">Novo Orçamento</Link> |{" "}
      <Link to="/products">Produtos</Link> |{" "}
      <Link to="/addons">Adicionais</Link> |{" "}
      {isSuperUser && (
        <>
          <Link to="/register">Novo Vendedor</Link> |{" "}
          <Link to="/products/new">Novo Produto</Link> |{" "}
          <Link to="/addons/new">Novo Adicional</Link> |{" "}
        </>
      )}
      <Link to="/change-password">Trocar Senha</Link> |{" "}
      <button onClick={logout}>Sair</button>
    </nav>
  );
}
