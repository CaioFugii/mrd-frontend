import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Button from "react-bootstrap/Button";
import { IoReturnUpBackOutline } from "react-icons/io5";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

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
        await api.put(`/addons/${id}`, payload);
        setMessage("Adicional atualizado com sucesso!");
      } else {
        await api.post("/addons", payload);
        setMessage("Adicional criado com sucesso!");
      }

      setTimeout(() => navigate("/addons"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao salvar adicional.");
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          margin: "20px 0px",
        }}
      >
        <h2>{isEditing ? "Editar Adicional" : "Criar Adicional"}</h2>
        <Button variant="primary" onClick={() => navigate("/addons")}>
          <IoReturnUpBackOutline /> Voltar para lista
        </Button>
      </div>
      <div className="container-align">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Nome do produto"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              value={description}
              type="text"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Preço (R$)</Form.Label>
            <Form.Control
              value={price}
              type="number"
              step="0.01"
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Button type="submit">{isEditing ? "Atualizar" : "Cadastrar"}</Button>
        </Form>
      </div>

      {message && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0px",
          }}
        >
          <Alert variant={message.includes("sucesso") ? "success" : "danger"}>
            {message}
          </Alert>
        </div>
      )}
    </div>
  );
}
