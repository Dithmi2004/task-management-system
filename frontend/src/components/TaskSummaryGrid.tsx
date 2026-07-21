import { taskSummaryCards } from "../constants/taskOptions";
import type { TaskSummary } from "../types/task";
import SummaryCard from "./SummaryCard";

interface TaskSummaryGridProps {
  summary: TaskSummary;
}

export default function TaskSummaryGrid({
  summary
}: TaskSummaryGridProps) {
  return (
    <section className="summary-grid">
      {taskSummaryCards.map((card) => (
        <SummaryCard
          key={card.key}
          title={card.title}
          value={summary[card.key]}
          description={card.description}
        />
      ))}
    </section>
  );
}
