export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, ""); // Remove tudo que não for número

  if (cleaned.length <= 10) {
    // Formato: (99) 9999-9999
    return cleaned.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }

  // Formato: (99) 99999-9999
  return cleaned.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}
