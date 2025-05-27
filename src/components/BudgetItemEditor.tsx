import { useEffect, useState } from "react";
import api from "../services/api";
import Button from "react-bootstrap/Button";
import { MdDeleteOutline } from "react-icons/md";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import { formatToBRL } from "../utils/formatToBRL";

interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

interface SelectedAddon {
  id: string;
  quantity: number;
}

interface Props {
  productId: string;
  addons: SelectedAddon[];
  disable: boolean;
  onChange: (updated: { quantity: number; addons: SelectedAddon[] }) => void;
  onRemove: () => void;
  onError: (message: string) => void;
}

export default function BudgetItemEditor({
  productId,
  addons,
  disable,
  onChange,
  onRemove,
  onError,
}: Props) {
  const [productName, setProductName] = useState("");
  const [addonSearch, setAddonSearch] = useState("");
  const [price, setPrice] = useState(0);
  const [availableAddons, setAvailableAddons] = useState<ProductAddon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const productRes = await api.get(`/products/${productId}`);
        setProductName(productRes.data.name);
        setPrice(productRes.data.price);

        const addonsRes = await api.get(`/products/${productId}/addons`);
        const addonsEnables = addonsRes.data?.filter(
          (addon: { enabled: boolean }) => addon.enabled
        );
        setAvailableAddons(addonsEnables);
      } catch (err) {
        console.error("Erro ao carregar produto adicionais:", err);
        onError("Erro ao carregar produto adicionais");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [productId]);

  function updateAddon(addonId: string, quantity: number) {
    const updated = [...addons];
    const existing = updated.find((a) => a.id === addonId);

    if (quantity === 0) {
      onChange({
        quantity,
        addons: updated.filter((a) => a.id !== addonId),
      });
      return;
    }

    if (existing) {
      existing.quantity = quantity;
    } else {
      updated.push({ id: addonId, quantity });
    }

    onChange({ quantity, addons: updated });
  }

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <p>
          <strong>{productName}</strong> - {formatToBRL(price)}
        </p>
        {!disable && (
          <>
            <Button onClick={onRemove}>
              <MdDeleteOutline />
            </Button>
          </>
        )}
      </div>

      <p>Adicionais</p>
      {!disable && (
        <>
          <Form.Control
            size="sm"
            type="text"
            disabled={disable}
            placeholder="Buscar adicional..."
            value={addonSearch}
            onChange={(e) => setAddonSearch(e.target.value)}
            className="mb-3"
          />
        </>
      )}

      <Card>
        <Card.Body className="scrollable-card-body">
          {availableAddons
            .filter((addon) =>
              addon.name.toLowerCase().includes(addonSearch.toLowerCase())
            )
            .map((addon) => {
              const selected = addons.find((a) => a.id === addon.id);
              return (
                <div key={addon.id}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm">
                      {addon.name} ({formatToBRL(addon.price)})
                    </InputGroup.Text>
                    <Form.Control
                      aria-describedby="inputGroup-sizing-sm"
                      inputMode="numeric"
                      disabled={disable}
                      type="text"
                      value={selected?.quantity || 0}
                      onChange={(e) => {
                        const onlyDigits = e.target.value.replace(/\D/g, "");
                        const value = Number(onlyDigits);
                        if (value >= 0) {
                          updateAddon(addon.id, value);
                        } else if (onlyDigits === "") {
                          updateAddon(addon.id, 0);
                        }
                      }}
                    />
                  </InputGroup>
                </div>
              );
            })}
        </Card.Body>
      </Card>
    </div>
  );
}
