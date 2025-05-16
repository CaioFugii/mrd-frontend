import { useEffect, useState } from "react";
import api from "../services/api";
import BudgetItemEditor from "../components/BudgetItemEditor";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { formatToBRL } from "../utils/formatToBRL";
import { formatPhone } from "../utils/formatPhone";

interface ProductAddon {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  addons: ProductAddon[];
}

interface SelectedAddon {
  id: string;
  quantity: number;
}

interface SelectedItem {
  productId: string;
  addons: SelectedAddon[];
}

export default function BudgetFormPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [message, setMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products?limit=100");
        setProducts(res.data.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setMessage("Erro ao buscar produtos");
      }
    }

    fetchProducts();
  }, []);

  function addProduct(productId: string) {
    if (items.find((item) => item.productId === productId)) return;

    setItems([...items, { productId, addons: [] }]);
  }

  async function handleSubmit() {
    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        discountPercent,
        items: items.map((item) => ({
          productId: item.productId,
          addons: item.addons.map((addon) => ({
            id: addon.id,
            quantity: addon.quantity,
          })),
        })),
      };

      await api.post("/budgets", payload);
      setMessage("Orçamento criado com sucesso!");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setDiscountPercent(0);
      setItems([]);
    } catch (err) {
      console.error("Erro ao criar orçamento:", err);
      setMessage("Erro ao criar orçamento");
    }
  }

  return (
    <div style={{ display: "block" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          margin: "20px 0px",
        }}
      >
        <h2>Orçamento</h2>
        <Button variant="primary" onClick={() => navigate("/budgets")}>
          <IoReturnUpBackOutline /> Voltar para lista
        </Button>
      </div>
      <div className="container-align">
        <Form>
          <Form.Group className="mb-3" controlId="customerName">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={customerName}
              placeholder="Nome e sobrenome"
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={customerEmail}
              placeholder="name@example.com"
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerPhone">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="phone"
              value={customerPhone}
              placeholder="(xx)xxxx-xxxx"
              maxLength={15}
              onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="discountPercent">
            <Form.Label>Desconto (%)</Form.Label>
            <Form.Control
              type="text"
              value={discountPercent}
              placeholder="0"
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                const value = Number(onlyDigits);
                if (value >= 0 && value <= 100) {
                  setDiscountPercent(value);
                } else if (onlyDigits === "") {
                  setDiscountPercent(0);
                }
              }}
            />
          </Form.Group>

          <Card>
            <Card.Header>Produtos Disponíveis</Card.Header>
            <Card.Body className="scrollable-card-body">
              <Card.Text>
                {products.map((product) => (
                  <ListGroup key={product.id} as="ol">
                    <ListGroup.Item variant="light">
                      <>
                        <Button
                          style={{ marginRight: "10px" }}
                          variant="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            addProduct(product.id);
                          }}
                        >
                          <MdOutlineFileDownloadDone />
                        </Button>
                        {product.name} - {formatToBRL(product.price)}
                      </>
                    </ListGroup.Item>
                  </ListGroup>
                ))}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Itens Selecionados</Card.Header>
            <Card.Body>
              <Card.Text>
                {items.map((item, index) => (
                  <BudgetItemEditor
                    key={item.productId}
                    productId={item.productId}
                    addons={item.addons}
                    onChange={(updated) => {
                      const updatedItems = [...items];
                      updatedItems[index] = {
                        ...updatedItems[index],
                        ...updated,
                      };
                      setItems(updatedItems);
                    }}
                    onRemove={() => {
                      setItems(items.filter((_, i) => i !== index));
                    }}
                    onError={(errorMessage) => setMessage(errorMessage)}
                  />
                ))}
              </Card.Text>
            </Card.Body>
          </Card>
          <Button onClick={handleSubmit}>Salvar Orçamento</Button>
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
