import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Button from "react-bootstrap/Button";
import { IoReturnUpBackOutline } from "react-icons/io5";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";

interface Addon {
  id: string;
  name: string;
  enabled: boolean;
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
        const res = await api.get("/addons?limit=100");
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
        await api.put(`/products/${id}`, payload);
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          margin: "20px 0px",
        }}
      >
        <h2>{isEditing ? "Editar Produto" : "Criar Produto"}</h2>
        <Button variant="primary" onClick={() => navigate("/products")}>
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

          <div>
            <h4>Adicionais disponíveis</h4>
            {addons.some((addon) => !addon.enabled) && (
              <small style={{ color: "red" }}>
                * Itens em vermelho se encontram desabilitados no momento.
              </small>
            )}

            <Card>
              <Card.Body className="scrollable-card-body">
                <Card.Text>
                  {addons.length &&
                    addons?.map((addon) => (
                      <InputGroup
                        key={addon.id}
                        className="scrollable-card-body"
                      >
                        <InputGroup.Checkbox
                          checked={selectedAddonIds.includes(addon.id)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...selectedAddonIds, addon.id]
                              : selectedAddonIds.filter(
                                  (id) => id !== addon.id
                                );
                            setSelectedAddonIds(updated);
                          }}
                        />
                        <InputGroup.Text
                          id="inputGroup-sizing-sm"
                          style={{ color: addon.enabled ? "black" : "red" }}
                        >
                          {addon.name}
                        </InputGroup.Text>
                      </InputGroup>
                    ))}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
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
