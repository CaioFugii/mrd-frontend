import AppRoutes from "./routes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavbarComponent from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function AppContent() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated && <NavbarComponent />}
      <AppRoutes />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
