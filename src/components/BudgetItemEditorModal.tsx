import { useEffect, useState } from "react";
import { Modal, Button, Card, Form, InputGroup } from "react-bootstrap";
import api from "../services/api";
import { formatToBRL } from "../utils/formatToBRL";

interface ProductAddon {
  id: string;
  name: string;
  price: string;
  enabled: boolean;
}

interface SelectedAddon {
  id: string;
  quantity: number;
  addonNameSnapshot?: string;
  addonPriceSnapshot?: string;
}

interface SelectedItem {
  id?: string;
  productId: string;
  productNameSnapshot?: string;
  productPriceSnapshot?: string;
  totalPrice?: string;
  addons: SelectedAddon[];
}

interface Props {
  show: boolean;
  budgetId: string | undefined;
  onClose: () => void;
  item: SelectedItem;
  onUpdate: (updated: SelectedItem) => void;
}

export default function BudgetItemEditorModal({
  show,
  budgetId,
  onClose,
  item,
  onUpdate,
}: Props) {
  const [addonsDraft, setAddonsDraft] = useState<SelectedAddon[]>(
    item.addons ?? []
  );

  const [productName, setProductName] = useState(
    item.productNameSnapshot || ""
  );
  const [productPrice, setProductPrice] = useState(
    item.productPriceSnapshot || ""
  );
  const [availableAddons, setAvailableAddons] = useState<ProductAddon[]>([]);
  const [addonSearch, setAddonSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const productRes = await api.get(`/products/${item.productId}`);
        setProductName(productRes.data.name);
        setProductPrice(productRes.data.price);

        const addonsRes = await api.get(`/products/${item.productId}/addons`);
        const enabled = addonsRes.data?.filter((a: ProductAddon) => a.enabled);
        setAvailableAddons(enabled || []);
      } catch (err) {
        console.error("Erro ao carregar produto/adicionais:", err);
        setError("Erro ao carregar dados do produto.");
      } finally {
        setLoading(false);
      }
    }

    if (item?.productId) {
      fetchData();
    }
  }, [item]);

  useEffect(() => {
    const sourceAddons = item?.addons ?? [];
    setAddonsDraft(JSON.parse(JSON.stringify(sourceAddons)));
  }, [item]);

  function updateAddon(addon: ProductAddon, quantity: number) {
    const updated = [...addonsDraft];
    const existing = updated.find((a) => a.id === addon.id);

    if (quantity === 0) {
      setAddonsDraft(updated.filter((a) => a.id !== addon.id));
      return;
    }

    if (existing) {
      existing.quantity = quantity;
    } else {
      updated.push({
        id: addon.id,
        quantity,
        addonNameSnapshot: addon.name,
        addonPriceSnapshot: addon.price,
      });
    }

    setAddonsDraft(updated);
  }

  async function handleConfirm() {
    if (budgetId) {
      try {
        await api.put(`/budgets/${budgetId}/addons`, {
          budgetItemId: item.id,
          productId: item.productId,
          addons: addonsDraft?.map((addon) => ({
            id: addon.id,
            quantity: addon.quantity,
          })),
        });
      } catch (error) {
        console.error("Erro ao editar o produto:", error);
        setError("Erro ao editar o produto");
      }
    }
    onUpdate({
      ...item,
      productNameSnapshot: productName,
      productPriceSnapshot: productPrice,
      addons: addonsDraft,
    });
    onClose();
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Produto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            <div className="mb-3">
              <strong>{productName}</strong> - {formatToBRL(productPrice)}
            </div>

            <Form.Control
              size="sm"
              type="text"
              placeholder="Buscar adicional..."
              value={addonSearch}
              onChange={(e) => setAddonSearch(e.target.value)}
              className="mb-3"
              style={{ width: "100%" }}
            />

            <Card>
              <Card.Body className="scrollable-card-body">
                {availableAddons
                  .filter((addon) =>
                    addon.name.toLowerCase().includes(addonSearch.toLowerCase())
                  )
                  .map((addon) => {
                    const selected = addonsDraft.find((a) => a.id === addon.id);
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
                              updateAddon(addon, isNaN(value) ? 0 : value);
                            }}
                          />
                        </InputGroup>
                      </div>
                    );
                  })}
              </Card.Body>
            </Card>
            {error && <div className="text-danger mt-2">{error}</div>}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleConfirm}>
          Salvar alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
