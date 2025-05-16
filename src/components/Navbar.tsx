import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RxExit } from "react-icons/rx";
import Button from "react-bootstrap/Button";

export default function Navbar() {
  const { logout, role } = useAuth();
  const isSuperUser = role === "SUPER_USER";

  return (
    <nav className="nav-bar">
      <Link className="link-navbar" to="/budgets">
        Orçamentos
      </Link>
      <Link className="link-navbar" to="/budgets/new">
        Novo Orçamento
      </Link>
      <Link className="link-navbar" to="/products">
        Produtos
      </Link>
      <Link className="link-navbar" to="/addons">
        Adicionais
      </Link>

      {isSuperUser && (
        <>
          <Link className="link-navbar" to="/register">
            Novo Vendedor
          </Link>
          <Link className="link-navbar" to="/products/new">
            Novo Produto
          </Link>
          <Link className="link-navbar" to="/addons/new">
            Novo Adicional
          </Link>
        </>
      )}

      <Link className="link-navbar" to="/change-password">
        Trocar Senha
      </Link>

      <Button
        onClick={logout}
        style={{
          background: "none",
          border: "none",
          color: "#FFFFFF",
          cursor: "pointer",
          fontSize: "1rem",
          marginLeft: "auto",
        }}
      >
        <RxExit />
      </Button>
    </nav>
  );
}
