import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import { formatToBRL } from "../utils/formatToBRL";

interface Budget {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seller: { name: string };
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
  const [onlyPendingApproval, setOnlyPendingApproval] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [debouncedCustomerName, setDebouncedCustomerName] =
    useState(customerName);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedCustomerName(customerName);
    }, 1000); // espera 2sec após o último caractere

    return () => clearTimeout(timeout); // limpa se digitar novamente antes do tempo
  }, [customerName]);

  useEffect(() => {
    async function fetchBudgets() {
      setLoading(true);
      try {
        const response = await api.get("/budgets", {
          params: {
            onlyPendingApproval: onlyPendingApproval || undefined,
            customerName: debouncedCustomerName.trim() || undefined,
            page,
            limit,
          },
        });
        setBudgets(response.data.data);

        setTotal(response.data.total);
      } catch (error) {
        console.error("Erro ao buscar orçamentos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBudgets();
  }, [onlyPendingApproval, debouncedCustomerName, page, limit]);

  const renderPagination = () => {
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);

    if (end - start + 1 < maxVisible) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisible - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    // Botão anterior
    pages.push(
      <Pagination.Prev
        key="prev"
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 1}
      />
    );

    // Primeira página + ellipsis
    if (start > 1) {
      pages.push(
        <Pagination.Item key={1} onClick={() => setPage(1)}>
          1
        </Pagination.Item>
      );
      if (start > 2)
        pages.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }

    // Números centrais
    for (let i = start; i <= end; i++) {
      pages.push(
        <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
          {i}
        </Pagination.Item>
      );
    }

    // Última página + ellipsis
    if (end < totalPages) {
      if (end < totalPages - 1)
        pages.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      pages.push(
        <Pagination.Item key={totalPages} onClick={() => setPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    // Botão próximo
    pages.push(
      <Pagination.Next
        key="next"
        onClick={() => setPage((p) => p + 1)}
        disabled={page === totalPages}
      />
    );

    return (
      <Pagination className="justify-content-center mt-4">{pages}</Pagination>
    );
  };

  const getBudgetStatus = (budget: Budget) => {
    if (budget.approved) return "Aprovado";
    if (budget.requiresApproval && !budget.approved && !budget.rejected) {
      return "Pendente de aprovação";
    }
    if (budget.rejected && !budget.approved) return "Reprovado";
  };

  return (
    <div className="table-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          margin: "20px 0px",
        }}
      >
        <h2>Orçamentos</h2>
      </div>

      <div className="filters d-flex gap-3 align-items-end mb-3">
        <Form.Group controlId="filterName">
          <Form.Label>Filtrar por nome</Form.Label>
          <Form.Control
            type="text"
            value={customerName}
            placeholder="Nome do cliente"
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="filterPending">
          <Form.Check
            type="checkbox"
            label="Apenas pendentes de aprovação"
            checked={onlyPendingApproval}
            onChange={(e) => setOnlyPendingApproval(e.target.checked)}
          />
        </Form.Group>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: "200px",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <Table className="styled-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Valor</th>
                <th>Data Criação</th>
                <th>Vendedor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.id}>
                  <td>{budget.customerName}</td>
                  <td>{budget.customerEmail}</td>
                  <td>{budget.customerPhone}</td>
                  <td>{formatToBRL(budget.total)}</td>
                  <td>
                    Criado em:{" "}
                    {new Date(budget.createdAt).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </td>
                  <td>{budget.seller.name}</td>
                  <td>{getBudgetStatus(budget)}</td>
                  <td className="d-flex gap-2">
                    <Button onClick={() => navigate(`/budgets/${budget.id}`)}>
                      Visualizar
                    </Button>
                    {budget.requiresApproval &&
                      isSuperUser &&
                      !budget.approved &&
                      !budget.rejected && (
                        <Button
                          id="btn-cancel"
                          onClick={() =>
                            navigate(`/budgets/${budget.id}/approve`)
                          }
                        >
                          Aprovar / Rejeitar
                        </Button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      {!loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {budgets.length === 0 && <p>Nenhum orçamento encontrado.</p>}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "end" }}>
        {renderPagination()}
      </div>
    </div>
  );
}
