import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [visible, setVisible] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      const token = response.data.access_token;
      login(token);
      navigate("/budgets");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setError("Credenciais inválidas");
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-login-container">
        <div
          style={{
            display: "flex",
            marginBottom: "1rem",
            justifyContent: "center",
          }}
        >
          <img
            className=".container-img"
            src="https://mrdcontainers.com.br/wp-content/uploads/2022/06/logo.png"
            alt=""
          />
        </div>

        <div style={{ maxWidth: "100%" }}>
          <div className="form-input-container">
            <label className="text-login">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="user@email.com"
            />
          </div>

          <div className="form-input-container">
            <label className="text-login">Senha:</label>
            <input
              type={visible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <span
              onClick={() => setVisible((v) => !v)}
              style={{
                position: "absolute",
                top: "56.7%",
                right: "48.75rem",
                transform: "translateY(37%)",
                cursor: "pointer",
                fontSize: "1rem",
                color: "#5791b2",
                userSelect: "none",
              }}
            >
              {visible ? "🙈" : "👁️"}
            </span>
          </div>

          {error && <p className="error-message ">{error}</p>}
          <div className="container-button-login">
            <button type="submit" className="button">
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
