import { cn } from "@/lib/utils";
import { HealthMetric } from "../types/types";

interface HealthMetricCardProps {
  metric: HealthMetric;
}

export const HealthMetricCard = ({ metric }: HealthMetricCardProps) => {
  const Icon = metric.icon;

  return (
    <div className="rounded-xl border p-4 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", metric.bgColor)}>
          <Icon className={cn("h-5 w-5", metric.color)} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
          <p className="text-lg font-semibold">{metric.value}</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full",
              metric.color.replace("text-", "bg-")
            )}
            style={{ width: `${metric.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
