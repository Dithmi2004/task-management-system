import axios from "axios";
import {
  type FormEvent,
  useState
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email,
        password
      });

      toast.success("Login successful.");

      navigate("/dashboard", {
        replace: true
      });
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const message =
          requestError.response?.data?.message ??
          "Login failed. Please check your credentials.";

        setError(message);
        toast.error(message);
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>

      <section className="login-card">
        <h1>Task Management System</h1>

        <p>Sign in to manage your daily tasks.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group password-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              className="password-toggle-button"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowPassword((currentValue) =>
                  !currentValue
                )
              }
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                focusable="false"
              >
                {showPassword ? (
                  <>
                    <path d="M3 3l18 18" />
                    <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />
                    <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 8.7 3.1 10 8a11.8 11.8 0 0 1-2.3 4.4" />
                    <path d="M6.4 6.4A11.8 11.8 0 0 0 2 12c1.3 4.9 5 8 10 8 1.6 0 3.1-.3 4.4-.9" />
                  </>
                ) : (
                  <>
                    <path d="M2 12c1.3-4.9 5-8 10-8s8.7 3.1 10 8c-1.3 4.9-5 8-10 8s-8.7-3.1-10-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
