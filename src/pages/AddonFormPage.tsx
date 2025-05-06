import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function AddonFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isEditing) {
      api
        .get(`/addons/${id}`)
        .then((res) => {
          const addon = res.data;
          setName(addon.name);
          setPrice(Number(addon.price));
          setDescription(addon.description);
        })
        .catch(() => setMessage("Erro ao carregar adicional."));
    }
  }, [id, isEditing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name,
      price,
      description,
    };

    try {
      if (isEditing) {
        await api.patch(`/addons/${id}`, payload);
        setMessage("Adicional atualizado com sucesso!");
      } else {
        await api.post("/addons", payload);
        setMessage("Adicional criado com sucesso!");
      }

      setTimeout(() => navigate("/addons"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao salvar adicional.");
    }
  }

  return (
    <div>
      <h1>{isEditing ? "Editar Adicional" : "Criar Adicional"}</h1>

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
          <label>Descrição:</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit">Salvar</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
