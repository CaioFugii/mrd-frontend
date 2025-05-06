import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

interface Budget {
  id: string;
  customerName: string;
  total: number;
  discountPercent: number;
  createdAt: string;
}

export default function ApproveRejectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await api.get(`/budgets/${id}`);
        setBudget(res.data);
      } catch (err) {
        console.error("Erro ao buscar orçamento:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBudget();
  }, [id]);

  async function handleApprove() {
    try {
      await api.patch(`/budgets/${id}/approve`);
      alert("Orçamento aprovado com sucesso!");
      navigate("/budgets");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Erro ao aprovar orçamento.");
    }
  }

  async function handleReject() {
    try {
      if (!reason.trim()) {
        alert("Informe o motivo da rejeição.");
        return;
      }
      await api.patch(`/budgets/${id}/reject`, { reason });
      alert("Orçamento rejeitado com sucesso!");
      navigate("/budgets");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Erro ao rejeitar orçamento.");
    }
  }

  if (loading) return <p>Carregando orçamento...</p>;
  if (!budget) return <p>Orçamento não encontrado.</p>;

  return (
    <div>
      <h1>Aprovar/Rejeitar Orçamento</h1>
      <button onClick={() => navigate("/budgets")}>← Voltar para lista</button>
      <p>
        <strong>Cliente:</strong> {budget.customerName}
      </p>
      <p>
        <strong>Total:</strong> R$ {budget.total}
      </p>
      <p>
        <strong>Desconto:</strong> {budget.discountPercent}%
      </p>
      <p>
        <strong>Data:</strong> {new Date(budget.createdAt).toLocaleDateString()}
      </p>

      <button onClick={handleApprove}>Aprovar</button>

      <div style={{ marginTop: "1rem" }}>
        <label>Motivo da Rejeição:</label>
        <br />
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          cols={40}
        />
        <br />
        <button onClick={handleReject}>Rejeitar</button>
      </div>
    </div>
  );
}
