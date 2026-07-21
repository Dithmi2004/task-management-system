import { useState } from "react";

interface PasswordInputProps {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function PasswordInput({
  id,
  value,
  placeholder,
  onChange
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);

  return (
    <div className="form-group password-field">
      <label htmlFor={id}>Password</label>

      <input
        id={id}
        type={isPasswordVisible ? "text" : "password"}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required
      />

      <button
        type="button"
        className="password-toggle-button"
        aria-label={
          isPasswordVisible
            ? "Hide password"
            : "Show password"
        }
        onClick={() =>
          setIsPasswordVisible((currentValue) =>
            !currentValue
          )
        }
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          focusable="false"
        >
          {isPasswordVisible ? (
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
  );
}
