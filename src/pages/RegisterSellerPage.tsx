import { useState } from "react";
import api from "../services/api";

export default function RegisterSellerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        phone,
      });

      setMessage("Vendedor cadastrado com sucesso!");
      setName("");
      setEmail("");
      setPhone("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setMessage("Erro ao cadastrar vendedor.");
    }
  }

  return (
    <div>
      <h1>Cadastrar Novo Vendedor</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Telefone:</label>
          <input
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <button type="submit">Cadastrar</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
