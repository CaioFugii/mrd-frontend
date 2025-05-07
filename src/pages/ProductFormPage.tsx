import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

interface Addon {
  id: string;
  name: string;
}

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = !!id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [addons, setAddons] = useState<Addon[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchAddons() {
      try {
        const res = await api.get("/addons");
        setAddons(res.data.data);
      } catch (err) {
        console.error("Erro ao buscar addons:", err);
      }
    }

    fetchAddons();

    if (isEditing) {
      api
        .get(`/products/${id}`)
        .then((res) => {
          const p = res.data;
          setName(p.name);
          setDescription(p.description || "");
          setPrice(Number(p.price));
          setSelectedAddonIds(p.addons?.map((a: Addon) => a.id) || []);
        })
        .catch(() => {
          setMessage("Erro ao carregar produto.");
        });
    }
  }, [id, isEditing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name,
      description,
      price,
      addonIds: selectedAddonIds,
    };

    try {
      if (isEditing) {
        await api.patch(`/products/${id}`, payload);
        setMessage("Produto atualizado com sucesso!");
      } else {
        await api.post("/products", payload);
        setMessage("Produto criado com sucesso!");
      }

      setTimeout(() => navigate("/products"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao salvar produto.");
    }
  }

  return (
    <div>
      <h1>{isEditing ? "Editar Produto" : "Criar Produto"}</h1>
      <button onClick={() => navigate("/products")}>← Voltar para lista</button>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Preço (R$):</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <h4>Adicionais disponíveis</h4>
          {addons.length &&
            addons?.map((addon) => (
              <label key={addon.id} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={selectedAddonIds.includes(addon.id)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...selectedAddonIds, addon.id]
                      : selectedAddonIds.filter((id) => id !== addon.id);
                    setSelectedAddonIds(updated);
                  }}
                />
                {addon.name}
              </label>
            ))}
        </div>

        <button type="submit">Salvar</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
