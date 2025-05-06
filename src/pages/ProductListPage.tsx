import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Product {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
  description: string;
}

export default function ProductListPage() {
  const { role } = useAuth();
  const isSuperUser = role === "SUPER_USER";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products");
        setProducts(res.data.data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Produtos</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id} style={{ marginBottom: "1rem" }}>
            <p>
              <strong>{product.name}</strong> - R$ {product.price}
            </p>
            <p>
              <strong>{product.description}</strong>
            </p>
            <p>Status: {product.enabled ? "Ativo" : "Inativo"}</p>
            {isSuperUser && (
              <>
                <button
                  onClick={() => navigate(`/products/${product.id}/edit`)}
                >
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
