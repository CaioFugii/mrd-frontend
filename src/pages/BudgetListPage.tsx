import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { formatToBRL } from "../utils/formatToBRL";
import PaginationComponent from "../components/Pagintation";
// import { BsPencilSquare } from "react-icons/bs";

interface Budget {
  id: string;
  sequentialNumber: number;
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
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState(filter);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 1000); // espera 2sec após o último caractere

    return () => clearTimeout(timeout); // limpa se digitar novamente antes do tempo
  }, [filter]);

  useEffect(() => {
    async function fetchBudgets() {
      setLoading(true);
      try {
        const response = await api.get("/budgets", {
          params: {
            onlyPendingApproval: onlyPendingApproval || undefined,
            search: debouncedFilter.trim() || undefined,
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
  }, [onlyPendingApproval, debouncedFilter, page, limit]);

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
        <Form.Group controlId="filter">
          <Form.Label>Filtro:</Form.Label>
          <Form.Control
            type="text"
            value={filter}
            placeholder="Nome do cliente / Nr. Orçamento"
            onChange={(e) => setFilter(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="filterPending">
          <Form.Check
            type="checkbox"
            label="Pendentes de aprovação"
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
                <th>Nr. Orçamento</th>
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
                  <td>{budget.sequentialNumber}</td>
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
                    {/* <button
                      className="button-edit"
                      onClick={() => navigate(`/budgets/${budget.id}/edit`)}
                    >
                      <BsPencilSquare />
                    </button> */}
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
        <PaginationComponent
          limit={limit}
          page={page}
          setPage={setPage}
          total={total}
        />
      </div>
    </div>
  );
}
