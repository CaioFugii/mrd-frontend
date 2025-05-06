import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Budget {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  createdAt: string;
  requiresApproval: boolean;
}

export default function BudgetListPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const isSuperUser = role === "SUPER_USER";
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudgets() {
      try {
        const response = await api.get("/budgets");
        setBudgets(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar orçamentos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBudgets();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Orçamentos</h1>
      <ul>
        {budgets.length &&
          budgets.map((budget) => (
            <li key={budget.id} style={{ marginBottom: "1rem" }}>
              <p>
                <strong>{budget.customerName}</strong> - R$ {budget.total}
                <br />
                Criado em: {new Date(budget.createdAt).toLocaleDateString()}
              </p>

              <button onClick={() => navigate(`/budgets/${budget.id}`)}>
                Visualizar
              </button>

              {budget.requiresApproval && isSuperUser && (
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={() => navigate(`/budgets/${budget.id}/approve`)}
                >
                  Aprovar / Rejeitar
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
