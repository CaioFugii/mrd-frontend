import { useState } from "react";
import api from "../services/api";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0px",
        }}
      >
        <h2>Cadastro de vendedor</h2>
      </div>
      <div className="container-align">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nome e Sobrenome"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="phone"
              placeholder="(xx)xxxx-xxxx"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit">Cadastrar</Button>
        </Form>

        {/* <form onSubmit={handleSubmit}>
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
      </form> */}
      </div>
      {message && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0px",
          }}
        >
          <Alert variant={"success"}>{message}</Alert>
        </div>
      )}
    </div>
  );
}
