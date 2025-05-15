import { useAuth } from "../context/AuthContext";
import { RxExit } from "react-icons/rx";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

export default function Navbar() {
  const { logout, role } = useAuth();
  const isSuperUser = role === "SUPER_USER";

  return (
    <Nav variant="underline" className="nav-bar">
      <Nav.Item>
        <Nav.Link href="/budgets">Orçamentos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/budgets/new">Novo Orçamento</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/products">Produtos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/addons">Adicionais</Nav.Link>
      </Nav.Item>

      {isSuperUser && (
        <>
          <Nav.Item>
            <Nav.Link href="/register">Novo Vendedor</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link href="/products/new">Novo Produto</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link href="/addons/new">Novo Adicional</Nav.Link>
          </Nav.Item>
        </>
      )}

      <Nav.Item>
        <Nav.Link href="/change-password">Trocar Senha</Nav.Link>
      </Nav.Item>
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
    </Nav>
  );
}
