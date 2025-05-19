import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { BsPencilSquare } from "react-icons/bs";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { formatToBRL } from "../utils/formatToBRL";
import PaginationComponent from "../components/Pagintation";

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
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [debouncedFilter, setDebouncedFilter] = useState(filter);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 1000); // espera 2sec após o último caractere

    return () => clearTimeout(timeout); // limpa se digitar novamente antes do tempo
  }, [filter]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products", {
          params: {
            search: debouncedFilter.trim() || undefined,
            page,
            limit,
          },
        });
        setProducts(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [debouncedFilter, page, limit]);

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="table-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          margin: "20px 0px",
        }}
      >
        <h2>Produtos</h2>
      </div>
      <div className="filters d-flex gap-3 align-items-end mb-3">
        <Form.Group controlId="filter">
          <Form.Label>Filtro:</Form.Label>
          <Form.Control
            type="text"
            value={filter}
            placeholder="Nome do produto"
            onChange={(e) => setFilter(e.target.value)}
          />
        </Form.Group>
      </div>

      <Table className="styled-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Status</th>
            {isSuperUser && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name} </td>
              <td>{product.description}</td>
              <td>{formatToBRL(product.price)}</td>
              <td>{product.enabled ? "Ativo" : "Inativo"}</td>
              {isSuperUser && (
                <td>
                  <button
                    className="button-edit"
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                  >
                    <BsPencilSquare />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      {!loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {products.length === 0 && <p>Nenhum produto encontrado.</p>}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "end" }}>
        <PaginationComponent
          limit={limit}
          page={page}
          setPage={setPage}
          total={total}
        />
      </div>
    </div>
  );
}
