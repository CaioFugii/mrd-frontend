import { useEffect, useState } from "react";
import { Modal, Button, Card, Form, InputGroup } from "react-bootstrap";
import api from "../services/api";
import { formatToBRL } from "../utils/formatToBRL";

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
}

interface SelectedAddon {
  id: string;
  quantity: number;
}

interface SelectedItem {
  productId: string;
  addons: SelectedAddon[];
}

interface AddProductModalProps {
  show: boolean;
  onClose: () => void;
  products: Product[];
  items: SelectedItem[];
  onAddProduct: (productId: string, addons: SelectedAddon[]) => void;
}

export default function AddProductModal({
  show,
  onClose,
  products,
  items,
  onAddProduct,
}: AddProductModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [availableAddons, setAvailableAddons] = useState<ProductAddon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [addonSearch, setAddonSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const availableProducts = products.filter(
    (p) => !items.some((item) => item.productId === p.id)
  );

  useEffect(() => {
    async function fetchAddons(productId: string) {
      setLoading(true);
      try {
        const res = await api.get(`/products/${productId}/addons`);
        const enabledAddons = res.data?.filter((a: ProductAddon) => a.enabled);
        setAvailableAddons(enabledAddons || []);
        setSelectedAddons([]);
      } catch (err) {
        console.error("Erro ao buscar adicionais:", err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedProduct) {
      fetchAddons(selectedProduct.id);
    }
  }, [selectedProduct]);

  function updateAddon(addonId: string, quantity: number) {
    const updated = [...selectedAddons];
    const existing = updated.find((a) => a.id === addonId);

    if (quantity === 0) {
      setSelectedAddons(updated.filter((a) => a.id !== addonId));
      return;
    }

    if (existing) {
      existing.quantity = quantity;
    } else {
      updated.push({ id: addonId, quantity });
    }

    setSelectedAddons(updated);
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Selecionar Produto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!selectedProduct ? (
          <>
            {availableProducts.length === 0 && (
              <p>Nenhum produto disponível.</p>
            )}
            <Card
              style={{ marginBottom: "1rem" }}
              className="scrollable-card-body"
            >
              {availableProducts.map((product) => (
                <Card.Body
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Card.Title>{product.name}</Card.Title>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "space-between",
                    }}
                  >
                    <Card.Subtitle className="mb-2 text-muted">
                      {formatToBRL(product.price)}
                    </Card.Subtitle>
                    <Button
                      style={{ marginLeft: "10px" }}
                      onClick={() => setSelectedProduct(product)}
                    >
                      Selecionar
                    </Button>
                  </div>
                </Card.Body>
              ))}
            </Card>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h5>
                {selectedProduct.name} - {formatToBRL(selectedProduct.price)}
              </h5>
              <Button onClick={() => setSelectedProduct(null)}>
                Voltar à lista
              </Button>
            </div>
            <div>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Buscar adicional..."
                value={addonSearch}
                onChange={(e) => setAddonSearch(e.target.value)}
                className="mb-3"
                style={{ width: "100%" }}
              />
            </div>

            <Card>
              <Card.Body className="scrollable-card-body">
                {loading ? (
                  <div className="spinner" />
                ) : (
                  availableAddons
                    .filter((addon) =>
                      addon.name
                        .toLowerCase()
                        .includes(addonSearch.toLowerCase())
                    )
                    .map((addon) => {
                      const selected = selectedAddons.find(
                        (a) => a.id === addon.id
                      );
                      return (
                        <div key={addon.id}>
                          <InputGroup size="sm" className="mb-3">
                            <InputGroup.Text>
                              {addon.name} ({formatToBRL(addon.price)})
                            </InputGroup.Text>
                            <Form.Control
                              type="text"
                              inputMode="numeric"
                              value={selected?.quantity || 0}
                              onChange={(e) => {
                                const onlyDigits = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                const value = Number(onlyDigits);
                                updateAddon(addon.id, isNaN(value) ? 0 : value);
                              }}
                            />
                          </InputGroup>
                        </div>
                      );
                    })
                )}
              </Card.Body>
            </Card>

            <div className="mt-3 d-flex justify-content-end">
              <Button
                variant="success"
                onClick={() => {
                  onAddProduct(selectedProduct.id, selectedAddons);
                  setSelectedProduct(null);
                  onClose();
                }}
              >
                Adicionar este produto
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
