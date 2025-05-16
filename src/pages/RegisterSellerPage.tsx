import { useEffect, useState } from "react";
import api from "../services/api";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { formatPhone } from "../utils/formatPhone";
import Table from "react-bootstrap/esm/Table";
import { BsPencilSquare } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  enabled: boolean;
}

export default function RegisterSellerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [editingSellerId, setEditingSellerId] = useState<string | null>(null);
  const [pendingSellerId, setPendingSellerId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingSellerId) {
        await api.put(`/auth/update-seller/${editingSellerId}`, {
          name,
          email,
          phone,
        });

        setSellers((prev) =>
          prev.map((seller) =>
            seller.id === editingSellerId
              ? { ...seller, name, email, phone }
              : seller
          )
        );

        setMessage("Vendedor atualizado com sucesso!");
      } else {
        await api.post("/auth/register", {
          name,
          email,
          phone,
        });

        setMessage("Vendedor cadastrado com sucesso!");
        setName("");
        setEmail("");
        setPhone("");
        await fetchSellers();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setMessage("Erro ao cadastrar vendedor.");
    } finally {
      setTimeout(() => setMessage(""), 5000);
    }
  }

  useEffect(() => {
    fetchSellers();
  }, []);

  async function fetchSellers() {
    try {
      const response = await api.get("/auth/sellers");
      setSellers(response.data);
    } catch (err) {
      console.error("Erro ao buscar vendedores", err);
    }
  }

  async function handleDisable(id: string) {
    try {
      await api.put(`/auth/disable/${id}`);
      updateSellerStatus(id, false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Erro ao desabilitar vendedor.");
    }
  }

  async function handleEnable(id: string) {
    try {
      await api.put(`/auth/enable/${id}`);
      updateSellerStatus(id, true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Erro ao habilitar vendedor.");
    }
  }

  async function handleResetPassword() {
    if (!pendingSellerId) return;

    try {
      await api.put(`/auth/reset-password/${pendingSellerId}`);
      setMessage("Senha redefinida com sucesso.");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Erro ao redefinir senha do vendedor.");
      setMessage("Erro ao redefinir senha.");
    } finally {
      setShowConfirmModal(false);
      setPendingSellerId(null);
      setTimeout(() => setMessage(""), 5000);
    }
  }

  const updateSellerStatus = (id: string, enabled: boolean) => {
    setSellers((prev) =>
      prev.map((seller) => (seller.id === id ? { ...seller, enabled } : seller))
    );
  };

  const startEdit = (seller: Seller) => {
    setName(seller.name);
    setEmail(seller.email);
    setPhone(seller.phone);
    setEditingSellerId(seller.id);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0px",
        }}
      >
        <h2>Cadastro de vendedor</h2>
      </div>
      <div className="container-align">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Nome e Sobrenome"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={editingSellerId ? true : false}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="phone"
              placeholder="(xx) xxxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              maxLength={15}
              required
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button type="submit">
              {editingSellerId ? "Salvar alterações" : "Cadastrar"}
            </Button>

            {editingSellerId && (
              <Button
                id="btn-cancel"
                onClick={() => {
                  setName("");
                  setEmail("");
                  setPhone("");
                  setEditingSellerId(null);
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </Form>
      </div>
      {message && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0px",
          }}
        >
          <Alert variant={message.includes("sucesso") ? "success" : "danger"}>
            {message}
          </Alert>
        </div>
      )}

      <div style={{ margin: "40px 20px" }}>
        <Table className="styled-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id}>
                <td>{seller.name}</td>
                <td>{seller.email}</td>
                <td>{formatPhone(seller.phone)}</td>
                <td>{seller.enabled ? "Ativo" : "Inativo"}</td>
                <td className="d-flex gap-2">
                  <Button variant="secondary" onClick={() => startEdit(seller)}>
                    <BsPencilSquare />
                  </Button>
                  {!seller.enabled ? (
                    <Button
                      variant="success"
                      onClick={() => handleEnable(seller.id)}
                    >
                      Habilitar
                    </Button>
                  ) : (
                    <Button
                      id="btn-cancel"
                      onClick={() => handleDisable(seller.id)}
                    >
                      Desabilitar
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setPendingSellerId(seller.id);
                      setShowConfirmModal(true);
                    }}
                  >
                    Redefinir senha
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmar redefinição</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza de que deseja redefinir a senha deste vendedor?
          </Modal.Body>
          <Modal.Footer>
            <Button id="btn-cancel" onClick={() => setShowConfirmModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => handleResetPassword()}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
