interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
}

export default function SummaryCard({
  title,
  value,
  description
}: SummaryCardProps) {
  return (
    <article className="summary-card">
      <p className="summary-card-title">{title}</p>

      <h2>{value}</h2>

      <p className="summary-card-description">
        {description}
      </p>
    </article>
  );
}
