export function formatToBRL(input: string | number): string {
  let value: number;

  if (typeof input === "string") {
    const cleaned = input.replace(/[^\d,.-]/g, "").replace(",", ".");
    value = parseFloat(cleaned);
  } else {
    value = input;
  }

  if (isNaN(value)) return "Valor inválido";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
