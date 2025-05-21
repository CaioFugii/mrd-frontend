import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { formatToBRL } from "../utils/formatToBRL";
import Button from "react-bootstrap/Button";
import { IoReturnUpBackOutline } from "react-icons/io5";
import Card from "react-bootstrap/Card";
import { handleExportPDF } from "../services/build-pdf";

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
  sequentialNumber: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  discountPercent: number;
  total: number;
  issueInvoice: boolean;
  approved: boolean;
  createdAt: string;
  seller: { name: string };
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

  if (loading) return <div className="spinner"></div>;
  if (!budget) return <p>Orçamento não encontrado.</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          margin: "20px 0px",
        }}
      >
        <h2>Detalhes do Orçamento</h2>
        <Button variant="primary" onClick={() => navigate("/budgets")}>
          <IoReturnUpBackOutline /> Voltar para lista
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0px",
        }}
      ></div>
      <div className="container-align">
        <Card>
          <Card.Header>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {" "}
              Orçamento{" "}
              {budget.approved && (
                <Button
                  variant="primary"
                  onClick={() => handleExportPDF(budget)}
                >
                  📄 Exportar PDF
                </Button>
              )}
            </div>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <p>
                <strong>Nr. Orçamento:</strong> {budget.sequentialNumber}
              </p>
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
                <strong>Data:</strong>{" "}
                {new Date(budget.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Desconto:</strong> {budget.discountPercent}%
              </p>

              <p>
                <strong>Com Emissão de Nota:</strong>{" "}
                {budget.issueInvoice ? "SIM" : "NÃO"}
              </p>
              <p>
                <strong>Total:</strong> {formatToBRL(budget.total)}
              </p>
              <p>
                <strong>Itens</strong>
              </p>
              {budget.items.map((item, index) => (
                <div key={index}>
                  <p>
                    {item.productNameSnapshot} -{" "}
                    {formatToBRL(item.productPriceSnapshot)} (Total:
                    {formatToBRL(item.totalPrice)})
                  </p>
                  {item.addons?.length > 0 && (
                    <ul>
                      {item.addons.map((addon, i) => (
                        <li key={i}>
                          {addon.quantity} x {addon.addonNameSnapshot} -{" "}
                          {formatToBRL(addon.totalPrice)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
