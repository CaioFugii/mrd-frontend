/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../services/api";
import BudgetItemEditor from "../components/BudgetItemEditor";
import { useNavigate, useParams } from "react-router-dom";
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
  id: string;
  productId: string;
  addons: SelectedAddon[];
}

export default function BudgetFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [message, setMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [commissionPercent, setCommissionPercent] = useState(0);
  const [issueInvoice, setIssueInvoice] = useState(true);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products");
        setProducts(res.data.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setMessage("Erro ao buscar produtos");
      }
    }

    async function fetchBudgetToEdit() {
      if (!id) return;
      try {
        const res = await api.get(`/budgets/${id}`);
        const budgetContent = res.data;

        setCustomerName(budgetContent.customerName);
        setCustomerEmail(budgetContent.customerEmail || "");
        setCustomerPhone(budgetContent.customerPhone);
        setDiscountPercent(budgetContent.discountPercent || 0);
        setIssueInvoice(budgetContent.issueInvoice);
        setItems(
          budgetContent.items.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            addons: item.addons.map((addon: any) => ({
              id: addon.addonId,
              quantity: addon.quantity,
            })),
          }))
        );

        setDisable(budgetContent.status === "VENDIDO");
      } catch (error) {
        console.error("Erro ao carregar orçamento:", error);
        setMessage("Erro ao carregar orçamento.");
      }
    }

    fetchProducts();
    if (isEditing) {
      fetchBudgetToEdit();
    }
  }, [id, isEditing]);

  function addProduct(productId: string) {
    if (items.find((item) => item.productId === productId)) return;

    setItems([
      ...items,
      {
        productId,
        addons: [],
      },
    ] as any);
  }

  async function handleSubmit() {
    try {
      const detailsPayload = {
        customerName,
        customerEmail: customerEmail || null,
        customerPhone,
        discountPercent,
        commissionPercent,
        issueInvoice,
      };

      const itemsPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          addons: item.addons.map((addon) => ({
            id: addon.id,
            quantity: addon.quantity,
          })),
        })),
      };

      if (isEditing) {
        await api.put(`/budgets/${id}/details`, detailsPayload);
        // await api.put(`/budgets/${id}/items`, itemsPayload);
        setMessage("Orçamento atualizado com sucesso!");
      } else {
        await api.post("/budgets", {
          ...detailsPayload,
          ...itemsPayload,
        });
        setMessage("Orçamento criado com sucesso!");
      }

      if (!isEditing) {
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setDiscountPercent(0);
        setCommissionPercent(0);
        setIssueInvoice(true);
        setItems([]);
      }

      // Redirecionar após sucesso (opcional)
      setTimeout(() => navigate("/budgets"), 1000);
    } catch (err) {
      console.error("Erro ao salvar orçamento:", err);
      setMessage("Erro ao salvar orçamento");
    }
  }

  async function handleDelete(index: number, budgetItemId: string) {
    if (isEditing) {
      await api.delete(`/budgets/${id}/items/${budgetItemId}`);
      setItems(items.filter((_, i) => i !== index));
      setMessage("Item removido do orçamento com sucesso!");
    } else {
      setItems(items.filter((_, i) => i !== index));
      setMessage("Item removido do orçamento com sucesso!");
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
        <h2>{isEditing ? "Editar Orçamento" : "Novo Orçamento"}</h2>
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
              disabled={disable}
              value={customerName}
              required={true}
              placeholder="Nome e sobrenome"
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              disabled={disable}
              value={customerEmail}
              placeholder="name@example.com"
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerPhone">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="phone"
              disabled={disable}
              value={customerPhone}
              placeholder="(xx)xxxx-xxxx"
              required={true}
              maxLength={15}
              onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="discountPercent">
            <Form.Label>Desconto (%)</Form.Label>
            <Form.Control
              type="number"
              disabled={disable}
              value={discountPercent}
              placeholder="0.0"
              min={0}
              max={100}
              step={0.1}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value >= 0 && value <= 100) {
                  setDiscountPercent(value);
                } else if (e.target.value === "") {
                  setDiscountPercent(0);
                }
              }}
            />
          </Form.Group>
          <Form.Group controlId="commissionPercent">
            <Form.Label>Comissão (%)</Form.Label>
            <Form.Control
              type="number"
              value={commissionPercent}
              disabled={disable}
              placeholder="0.0"
              min={0}
              max={3}
              step={0.1}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value >= 0 && value <= 3) {
                  setCommissionPercent(value);
                } else if (e.target.value === "") {
                  setCommissionPercent(0);
                }
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="enableFeature">
            <Form.Check
              id="custom-switch"
              type="switch"
              disabled={disable}
              label="Com emissão de Nota Fiscal"
              checked={issueInvoice}
              onChange={(e) => setIssueInvoice(e.target.checked)}
              style={{ paddingTop: "10px" }}
            />
          </Form.Group>

          <Card>
            <Card.Header>Produtos Disponíveis</Card.Header>
            <Card.Body className="scrollable-card-body">
              <Card.Text>
                {products.map((product) => (
                  <ListGroup key={product.id} as="ol">
                    <ListGroup.Item variant="light">
                      {!disable && (
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
                      )}
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
                    disable={disable}
                    onChange={(updated) => {
                      const updatedItems = [...items];
                      updatedItems[index] = {
                        ...updatedItems[index],
                        ...updated,
                      };
                      setItems(updatedItems);
                    }}
                    onRemove={async () => {
                      await handleDelete(index, item.id);
                    }}
                    onError={(errorMessage) => setMessage(errorMessage)}
                  />
                ))}
              </Card.Text>
            </Card.Body>
          </Card>
          {!disable && (
            <>
              <Button onClick={handleSubmit}>
                {isEditing ? "Atualizar Orçamento" : "Salvar Orçamento"}
              </Button>
            </>
          )}
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

// todo: Ao adicionar um item na atualizacao, nao esta adicionando.
// todo: Criar nova funcionalidade de atualizar quantidade de ADDONS
