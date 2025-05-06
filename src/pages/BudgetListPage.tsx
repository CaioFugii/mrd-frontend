import { useEffect, useState } from "react";
import api from "../services/api";

interface Budget {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  createdAt: string;
}

export default function BudgetListPage() {
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
          budgets?.map((budget) => (
            <li key={budget.id}>
              {budget.customerName} - R$ {budget.total} -{" "}
              {new Date(budget.createdAt).toLocaleDateString()}
            </li>
          ))}
      </ul>
    </div>
  );
}
