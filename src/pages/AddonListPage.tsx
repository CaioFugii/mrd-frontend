import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { BsPencilSquare } from "react-icons/bs";
import Table from "react-bootstrap/Table";
import { formatToBRL } from "../utils/formatToBRL";

interface Addon {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
  description: string;
}

export default function AddonListPage() {
  const { role } = useAuth();
  const isSuperUser = role === "SUPER_USER";
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAddons() {
      try {
        const res = await api.get("/addons");
        setAddons(res.data.data);
      } catch (err) {
        console.error("Erro ao buscar adicionais:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAddons();
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
        <h2>Adicionais</h2>
      </div>

      <Table className="styled-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Status</th>
            {isSuperUser && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {addons.map((addon) => (
            <tr key={addon.id}>
              <td>{addon.name} </td>
              <td>{addon.description}</td>
              <td>{formatToBRL(addon.price)}</td>
              <td>{addon.enabled ? "Ativo" : "Inativo"}</td>
              {isSuperUser && (
                <td>
                  <>
                    <button
                      className="button-edit"
                      onClick={() => navigate(`/addons/${addon.id}/edit`)}
                    >
                      <BsPencilSquare />
                    </button>
                  </>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      {!loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {addons.length === 0 && <p>Nenhum produto adicional encontrado.</p>}
        </div>
      )}
    </div>
  );
}
