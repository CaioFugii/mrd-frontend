import { useParams } from "react-router-dom";

export default function ProductFormPage() {
  const { id } = useParams();

  return <h1>{id ? `Editar Produto ${id}` : "Criar Produto"}</h1>;
}
