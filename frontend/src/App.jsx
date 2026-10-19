import { registerUser, loginUser } from "./auth";
import { useCallback, useState } from "react";
import "./App.css";
import Dashboard from "./dashboard";

export default function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("access_token")
  );
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    setToken(null);
    setError("");
    setMessage("");
  }, []);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser(email, password);

        setMode("login");
        setPassword("");
        setMessage(
          "Account created successfully. You can now sign in."
        );
      } else {
        await loginUser(email, password);

        setToken(localStorage.getItem("access_token"));
        setPassword("");
        // Temporary success screen until we build
        // the authenticated dashboard.
        setMessage("Login successful. Authentication is working.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");

      if (err.status === 409 && isRegister) {
        setError("This email is already registered. Please sign in.");
      }

      if (err.status === 401 && !isRegister) {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (token) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <div className="brand-icon">T</div>
          <span>TaskFlow</span>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">
            {isRegister ? "GET STARTED" : "WELCOME BACK"}
          </p>

          <h1>
            {isRegister
              ? "Create your account"
              : "Sign in to your account"}
          </h1>

          <p className="subtitle">
            {isRegister
              ? "Create an account to organize your work."
              : "Enter your details to continue."}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={!isRegister ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={isRegister ? "active" : ""}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="notice error" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className="notice success" role="status">
              {message}
            </div>
          )}

          <button className="submit-button" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="switch-text">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            className="text-button"
            onClick={() =>
              switchMode(isRegister ? "login" : "register")
            }
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>

        <p className="footer-text">
          Your workspace, one task at a time.
        </p>
      </section>
    </main>
  );
}
