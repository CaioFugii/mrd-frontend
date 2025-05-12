import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { BsPencilSquare } from "react-icons/bs";

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

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="table-container">
      <h1 style={{ color: "#282f52", marginBottom: "2rem" }}>Cadastrados</h1>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {addons.map((addon) => (
            <tr key={addon.id}>
              <td>{addon.name} </td>
              <td>{addon.description}</td>
              <td>{addon.price}</td>
              <td>{addon.enabled ? "Ativo" : "Inativo"}</td>
              <td>
                {" "}
                {isSuperUser && (
                  <>
                    <button
                      className="button-edit"
                      onClick={() => navigate(`/products/${addon.id}/edit`)}
                    >
                      <BsPencilSquare />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
