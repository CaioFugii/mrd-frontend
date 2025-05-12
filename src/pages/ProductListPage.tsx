import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { BsPencilSquare } from "react-icons/bs";

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
    <div className="table-container">
      <h1 style={{ color: "#282f52", marginBottom: "2rem" }}>Produtos</h1>

      {products.length === 0 && <p>Nenhum orçamento encontrado.</p>}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name} </td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.enabled ? "Ativo" : "Inativo"}</td>
              <td>
                {" "}
                {isSuperUser && (
                  <>
                    <button
                      className="button-edit"
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                    >
                      <BsPencilSquare />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
