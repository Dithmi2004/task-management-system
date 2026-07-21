import axios from "axios";

export function getRequestErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      fallbackMessage
    );
  }

  return fallbackMessage;
}
