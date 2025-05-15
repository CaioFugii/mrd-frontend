import { useEffect, useState } from "react";
import api from "../services/api";
import Button from "react-bootstrap/Button";
import { MdDeleteOutline } from "react-icons/md";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

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
  onChange: (updated: { quantity: number; addons: SelectedAddon[] }) => void;
  onRemove: () => void;
}

export default function BudgetItemEditor({
  productId,
  addons,
  onChange,
  onRemove,
}: Props) {
  const [productName, setProductName] = useState("");
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
        console.error("Erro ao carregar produto/adicionais:", err);
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
          <strong>{productName}</strong> - R$ {price}
        </p>
        <Button onClick={onRemove}>
          <MdDeleteOutline />
        </Button>
      </div>

      <p>Adicionais</p>
      {availableAddons.map((addon) => {
        const selected = addons.find((a) => a.id === addon.id);
        return (
          <div key={addon.id}>
            <span></span>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm">
                {" "}
                {addon.name} (R$ {addon.price})
              </InputGroup.Text>
              <Form.Control
                aria-describedby="inputGroup-sizing-sm"
                type="number"
                min={0}
                value={selected?.quantity || 0}
                onChange={(e) => updateAddon(addon.id, Number(e.target.value))}
              />
            </InputGroup>
          </div>
        );
      })}
    </div>
  );
}
