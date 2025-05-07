import { useEffect, useState } from "react";
import api from "../services/api";
import BudgetItemEditor from "../components/BudgetItemEditor";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Criar Orçamento</h1>
      <button onClick={() => navigate("/budgets")}>← Voltar para lista</button>

      <h2>Dados do Cliente</h2>
      <div>
        <label>Nome:</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Telefone:</label>
        <input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
      </div>
      <div>
        <label>Desconto (%):</label>
        <input
          type="number"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(Number(e.target.value))}
        />
      </div>

      <h2>Produtos Disponíveis</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - R$ {product.price}
            <button onClick={() => addProduct(product.id)}>Adicionar</button>
          </li>
        ))}
      </ul>

      <h2>Itens Selecionados</h2>
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
      <button onClick={handleSubmit}>Salvar Orçamento</button>
    </div>
  );
}
