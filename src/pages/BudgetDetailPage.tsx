import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import api from "../services/api";
import autoTable from "jspdf-autotable";

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
  approved: boolean;
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

  if (loading) return <div className="spinner"></div>;
  if (!budget) return <p>Orçamento não encontrado.</p>;

  function handleExportPDF() {
    if (!budget) return;

    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("Orçamento", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Cliente: ${budget.customerName}`, 10, y);
    y += 6;
    doc.text(`Email: ${budget.customerEmail}`, 10, y);
    y += 6;
    doc.text(`Telefone: ${budget.customerPhone}`, 10, y);
    y += 6;
    doc.text(`Data: ${new Date(budget.createdAt).toLocaleDateString()}`, 10, y);
    y += 6;
    doc.text(`Desconto: ${budget.discountPercent}%`, 10, y);
    y += 6;
    doc.text(`Total: R$ ${budget.total}`, 10, y);
    y += 10;

    const rows: string[][] = [];

    budget.items.forEach((item, index) => {
      rows.push([
        `${index + 1}. ${item.productNameSnapshot}`,
        `R$ ${item.productPriceSnapshot}`,
        `R$ ${item.totalPrice}`,
      ]);

      item.addons?.forEach((addon) => {
        rows.push([
          `     ${addon.quantity}x ${addon.addonNameSnapshot}`,
          `R$ ${addon.addonPriceSnapshot}`,
          `R$ ${addon.totalPrice}`,
        ]);
      });
    });

    autoTable(doc, {
      head: [["Produto", "Unitário", "Total"]],
      body: rows,
      startY: y,
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [40, 47, 82], // #282f52
        textColor: 255,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`orcamento-${budget.customerName}.pdf`);
  }

  return (
    <div>
      <h1>Detalhes do Orçamento</h1>
      <button onClick={() => navigate("/budgets")}>← Voltar para lista</button>

      {budget.approved && (
        <>
          <button onClick={handleExportPDF}>📄 Exportar PDF</button>
        </>
      )}

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
