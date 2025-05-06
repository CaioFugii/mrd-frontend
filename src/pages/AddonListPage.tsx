import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

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
    <div>
      <h1>Adicionais Cadastrados</h1>

      <ul>
        {addons.length &&
          addons.map((addon) => (
            <li key={addon.id} style={{ marginBottom: "1rem" }}>
              <p>
                <strong>{addon.name}</strong> - R$ {addon.price}
                <br />
                Status: {addon.enabled ? "Ativo" : "Inativo"}
              </p>
              {isSuperUser && (
                <>
                  <button onClick={() => navigate(`/addons/${addon.id}/edit`)}>
                    Editar
                  </button>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
