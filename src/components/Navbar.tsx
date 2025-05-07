import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout, role } = useAuth();
  const isSuperUser = role === "SUPER_USER";

  const linkStyle: React.CSSProperties = {
    color: "#FFFFFF",
    textDecoration: "none",
    marginRight: "1rem",
  };

  return (
    <nav
      style={{
        backgroundColor: "#282f52",
        padding: "1rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Link
        to="/budgets"
        style={linkStyle}
        onMouseOver={(e) => (e.currentTarget.style.color = "#5791b2")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
      >
        Orçamentos
      </Link>
      <Link
        to="/budgets/new"
        style={linkStyle}
        onMouseOver={(e) => (e.currentTarget.style.color = "#5791b2")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
      >
        Novo Orçamento
      </Link>
      <Link
        to="/products"
        style={linkStyle}
        onMouseOver={(e) => (e.currentTarget.style.color = "#5791b2")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
      >
        Produtos
      </Link>
      <Link
        to="/addons"
        style={linkStyle}
        onMouseOver={(e) => (e.currentTarget.style.color = "#5791b2")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
      >
        Adicionais
      </Link>

      {isSuperUser && (
        <>
          <Link
            to="/register"
            style={linkStyle}
            onMouseOver={(e) => (e.currentTarget.style.color = "#5791b2")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
          >
            Novo Vendedor
          </Link>
          <Link
            to="/products/new"
            style={linkStyle}
            onMouseOver={(e) => (e.currentTarget.style.color = "#5791b2")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
          >
            Novo Produto
          </Link>
          <Link
            to="/addons/new"
            style={linkStyle}
            onMouseOver={(e) => (e.currentTarget.style.color = "#5791b2")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
          >
            Novo Adicional
          </Link>
        </>
      )}

      <Link
        to="/change-password"
        style={linkStyle}
        onMouseOver={(e) => (e.currentTarget.style.color = "#5791b2")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
      >
        Trocar Senha
      </Link>

      <button
        onClick={logout}
        style={{
          background: "none",
          border: "none",
          color: "#FFFFFF",
          cursor: "pointer",
          fontSize: "1rem",
          marginLeft: "auto",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#5791b2")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
      >
        Sair
      </button>
    </nav>
  );
}
