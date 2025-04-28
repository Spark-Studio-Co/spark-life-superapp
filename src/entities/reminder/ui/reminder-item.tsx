import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reminder } from "../model/types";

interface ReminderItemProps {
  reminder: Reminder;
}

export const ReminderItem = ({ reminder }: ReminderItemProps) => {
  return (
    <div
      className={cn(
        "p-4",
        reminder.isAlert ? "bg-red-50" : "border-b border-gray-100"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {reminder.icon}
          <div>
            <h3
              className={cn(
                "font-medium",
                reminder.isAlert ? "text-red-700" : ""
              )}
            >
              {reminder.title}
            </h3>
            <p
              className={cn(
                "text-xs",
                reminder.isAlert ? "text-red-600" : "text-gray-500"
              )}
            >
              {reminder.description}
            </p>
          </div>
        </div>
        {!reminder.isAlert && (
          <Button variant="outline" size="sm" className="h-8">
            Отметить
          </Button>
        )}
      </div>
    </div>
  );
};
