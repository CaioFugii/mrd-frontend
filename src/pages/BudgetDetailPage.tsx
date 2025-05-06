import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

interface Addon {
  addonNameSnapshot: string;
  addonPriceSnapshot: number;
  quantity: number;
  totalPrice: number;
}

interface Item {
  productNameSnapshot: string;
  productPriceSnapshot: number;
  totalPrice: number;
  addons: Addon[];
}

interface Budget {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  discountPercent: number;
  total: number;
  createdAt: string;
  items: Item[];
}

export default function BudgetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const response = await api.get(`/budgets/${id}`);
        setBudget(response.data);
      } catch (err) {
        console.error("Erro ao buscar orçamento:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBudget();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!budget) return <p>Orçamento não encontrado.</p>;

  return (
    <div>
      <h1>Detalhes do Orçamento</h1>
      <button onClick={() => navigate("/budgets")}>← Voltar para lista</button>
      <p>
        <strong>Cliente:</strong> {budget.customerName}
      </p>
      <p>
        <strong>Email:</strong> {budget.customerEmail}
      </p>
      <p>
        <strong>Telefone:</strong> {budget.customerPhone}
      </p>
      <p>
        <strong>Data:</strong> {new Date(budget.createdAt).toLocaleDateString()}
      </p>
      <p>
        <strong>Desconto:</strong> {budget.discountPercent}%
      </p>
      <p>
        <strong>Total:</strong> R$ {budget.total}
      </p>

      <h2>Itens</h2>
      {budget.items.map((item, index) => (
        <div key={index}>
          <p>
            {item.productNameSnapshot} - R$ {item.productPriceSnapshot} (Total:
            R$ {item.totalPrice})
          </p>
          {item.addons?.length > 0 && (
            <ul>
              {item.addons.map((addon, i) => (
                <li key={i}>
                  {addon.quantity} x {addon.addonNameSnapshot} - R${" "}
                  {addon.totalPrice}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
