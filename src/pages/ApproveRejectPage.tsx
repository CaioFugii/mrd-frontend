import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "react-bootstrap/Button";
import { IoReturnUpBackOutline } from "react-icons/io5";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

import { formatToBRL } from "../utils/formatToBRL";

interface Budget {
  id: string;
  customerName: string;
  total: number;
  discountPercent: number;
  createdAt: string;
  seller: {
    name: string;
  };
}

export default function ApproveRejectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await api.get(`/budgets/${id}`);
        setBudget(res.data);
      } catch (err) {
        console.error("Erro ao buscar orçamento:", err);
        setMessage("Erro ao buscar orçamento");
      } finally {
        setLoading(false);
      }
    }

    fetchBudget();
  }, [id]);

  async function handleApprove() {
    try {
      await api.patch(`/budgets/${id}/approve`);
      setMessage("Orçamento aprovado com sucesso!");
      navigate("/budgets");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("Erro ao aprovar orçamento.");
    }
  }

  async function handleReject() {
    try {
      if (!reason.trim()) {
        setMessage("Informe o motivo da rejeição.");
        return;
      }
      await api.patch(`/budgets/${id}/reject`, { reason });
      setMessage("Orçamento rejeitado com sucesso!");

      setTimeout(() => navigate("/budgets"), 1000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("Erro ao rejeitar orçamento.");
    }
  }

  if (loading) return <div className="spinner"></div>;
  if (!budget) return <p>Orçamento não encontrado.</p>;

  return (
    <div style={{ display: "block" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          margin: "20px 0px",
        }}
      >
        <h2>Aprovar Orçamentos</h2>
        <Button variant="primary" onClick={() => navigate("/budgets")}>
          <IoReturnUpBackOutline /> Voltar para lista
        </Button>
      </div>

      <div className="container-align">
        <Card>
          <Card.Header>Orçamento</Card.Header>
          <Card.Body>
            <Card.Text>
              <p>
                <strong>Cliente:</strong> {budget.customerName}
              </p>
              <p>
                <strong>Total:</strong> {formatToBRL(budget.total)}
              </p>
              <p>
                <strong>Desconto:</strong> {budget.discountPercent}%
              </p>
              <p>
                <strong>Vendedor:</strong> {budget.seller.name}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(budget.createdAt).toLocaleDateString()}
              </p>
              <Button onClick={handleApprove}>Aprovar</Button>
            </Card.Text>
            <Form>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Motivo da Rejeição:</Form.Label>
                <Form.Control
                  as="textarea"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  cols={40}
                />
              </Form.Group>

              <Button onClick={handleReject}>Rejeitar</Button>
            </Form>
          </Card.Body>
        </Card>
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
    </div>
  );
}
