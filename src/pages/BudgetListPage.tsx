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
  approved: boolean;
  rejected: boolean;
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
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "#282f52", marginBottom: "2rem" }}>Orçamentos</h1>

      {budgets.length === 0 && <p>Nenhum orçamento encontrado.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {budgets.map((budget) => (
          <li
            key={budget.id}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>{budget.customerName}</strong> – R$ {budget.total}
            </p>
            <p style={{ color: "#555", marginBottom: "1rem" }}>
              Criado em: {new Date(budget.createdAt).toLocaleDateString()}
            </p>

            <button
              onClick={() => navigate(`/budgets/${budget.id}`)}
              style={{
                backgroundColor: "#5791b2",
                color: "#ffffff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Visualizar
            </button>

            {budget.requiresApproval &&
              isSuperUser &&
              !budget.approved &&
              !budget.rejected && (
                <button
                  onClick={() => navigate(`/budgets/${budget.id}/approve`)}
                  style={{
                    backgroundColor: "#282f52",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginLeft: "0.75rem",
                  }}
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
