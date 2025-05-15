import { useEffect, useState } from "react";
import api from "../services/api";
import BudgetItemEditor from "../components/BudgetItemEditor";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { IoReturnUpBackOutline } from "react-icons/io5";

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

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      const res = await api.get("/products"); // ajuste se sua rota for diferente
      setProducts(res.data.data);
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
      alert("Orçamento criado com sucesso!");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setDiscountPercent(0);
      setItems([]);
    } catch (err) {
      console.error("Erro ao criar orçamento:", err);
      alert("Erro ao criar orçamento");
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
              placeholder="Nome e sobrenome"
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerPhone">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="phone"
              placeholder="(xx)xxxx-xxxx"
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="discountPercent">
            <Form.Label>Desconto (%)</Form.Label>
            <Form.Control
              type="text"
              placeholder="0"
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
            />
          </Form.Group>

          <Card>
            <Card.Header>Produtos Disponíveis</Card.Header>
            <Card.Body>
              <Card.Text>
                {products.map((product) => (
                  <ListGroup key={product.id} as="ol">
                    <ListGroup.Item variant="light">
                      <div>
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
                        {product.name} - R$ {product.price}
                      </div>
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
                  />
                ))}
              </Card.Text>
            </Card.Body>
          </Card>
          <Button onClick={handleSubmit}>Salvar Orçamento</Button>
        </Form>
      </div>
    </div>
  );
}
