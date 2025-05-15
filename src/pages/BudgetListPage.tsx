import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

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

  if (loading) return <div className="spinner"></div>;

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
        {budgets.length === 0 && <p>Nenhum orçamento encontrado.</p>}
      </div>

      <Table className="styled-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Valor</th>
            <th>Data Criação</th>
            <th>Vendedor</th>
            <th>Visualizar</th>
            <th>Autorização</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget.id}>
              <td>{budget.customerName}</td>
              <td>{budget.customerEmail}</td>
              <td>{budget.customerPhone}</td>
              <td>{budget.total}</td>

              <td>
                {" "}
                Criado em: {new Date(budget.createdAt).toLocaleDateString()}
              </td>
              <td>{budget.seller.name}</td>

              <td>
                <Button onClick={() => navigate(`/budgets/${budget.id}`)}>
                  Visualizar
                </Button>
              </td>

              {budget.requiresApproval &&
              isSuperUser &&
              !budget.approved &&
              !budget.rejected ? (
                <td>
                  {" "}
                  <Button
                    onClick={() => navigate(`/budgets/${budget.id}/approve`)}
                  >
                    Aprovar / Rejeitar
                  </Button>
                </td>
              ) : (
                <td>Finalizado</td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

    // <div className="table-container">
    //   <h1 style={{ color: "#282f52", marginBottom: "2rem" }}>Orçamentos</h1>

    //   {budgets.length === 0 && <p>Nenhum orçamento encontrado.</p>}
    //   <table className="styled-table">
    //     <thead>
    //       <tr>
    //         <th>Nome</th>
    //         <th>Email</th>
    //         <th>Telefone</th>
    //         <th>Valor</th>
    //         <th>Data Criação</th>
    //         <th>Vendedor</th>
    //         <th>Ações</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {budgets.map((budget) => (
    //         <tr key={budget.id}>
    //           <td>{budget.customerName}</td>
    //           <td>{budget.customerEmail}</td>
    //           <td>{budget.customerPhone}</td>
    //           <td>{budget.total}</td>

    //           <td>
    //             {" "}
    //             Criado em: {new Date(budget.createdAt).toLocaleDateString()}
    //           </td>
    //           <td>{budget.seller.name}</td>

    //           <td>
    //             <div style={{ display: "flex" }}>
    //               <button
    //                 onClick={() => navigate(`/budgets/${budget.id}`)}
    //                 className="button-table"
    //               >
    //                 Visualizar
    //               </button>
    //               {budget.requiresApproval &&
    //                 isSuperUser &&
    //                 !budget.approved &&
    //                 !budget.rejected && (
    //                   <button
    //                     onClick={() =>
    //                       navigate(`/budgets/${budget.id}/approve`)
    //                     }
    //                     className="button-approve"
    //                   >
    //                     Aprovar / Rejeitar
    //                   </button>
    //                 )}
    //             </div>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
  );
}
