import jwt from "jsonwebtoken";
import { useState } from "react";
import Login from "./Login";
import { ProductsAdmin } from "./ProductsAdmin";

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string>("");

  const handleLogin = (token: string) => {
    setToken(token);
    setAuthenticated(true);
  };

  if (!authenticated) {
    return (
      <div>
        <Login onLogin={handleLogin} />
      </div>
    );
  } else {
    const decodedToken = jwt.decode(token);

    return (
      <div>
        <ProductsAdmin />
      </div>
    );
  }
}
