import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store";
import { useNavigate, Navigate } from "react-router-dom";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((s: RootState) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in, redirect to home immediately
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "240px",
        margin: "4rem auto",
        fontSize: "0.8rem",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login</h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: "100%", padding: "4px", marginBottom: "8px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: "100%", padding: "4px", marginBottom: "8px" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{ width: "100%", padding: "6px" }}
      >
        {status === "loading" ? "Logging in…" : "Login"}
      </button>
    </form>
  );
};

export default Login;
