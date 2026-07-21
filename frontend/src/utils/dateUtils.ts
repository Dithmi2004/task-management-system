export function getDateOnly(dateValue: string): string {
  return dateValue.includes("T")
    ? dateValue.split("T")[0]
    : dateValue;
}

export function getTodayDate(): string {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;

  return new Date(today.getTime() - timezoneOffset)
    .toISOString()
    .split("T")[0];
}

export function formatDisplayDate(dateValue: string): string {
  const dateOnly = getDateOnly(dateValue);
  const date = new Date(`${dateOnly}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateOnly;
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}
