import {
  type FormEvent,
  useState
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordInput from "../components/PasswordInput";
import ThemeToggle from "../components/ThemeToggle";
import { authMessages } from "../constants/messages";
import { useAuth } from "../context/AuthContext";
import { getRequestErrorMessage } from "../utils/errorUtils";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      toast.success(authMessages.loginSuccess);

      navigate("/dashboard", {
        replace: true
      });
    } catch (requestError) {
      const message = getRequestErrorMessage(
        requestError,
        authMessages.loginFailed
      );

      setError(message);
      toast.error(message);
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

          <PasswordInput
            id="password"
            value={password}
            placeholder="Enter your password"
            onChange={setPassword}
          />

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
