"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import {
  Bell,
  Clock,
  Plus,
  ChevronRight,
  Pill,
  AlertCircle,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Reminder } from "@/entities/reminder/model/types";

interface RemindersWidgetProps {
  reminders: Reminder[];
}

export const RemindersWidget = ({ reminders }: RemindersWidgetProps) => {
  const [completedReminders, setCompletedReminders] = useState<string[]>([]);
  const [swipingId, setSwipingId] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setCompletedReminders((prev) =>
      prev.includes(id)
        ? prev.filter((reminderId) => reminderId !== id)
        : [...prev, id]
    );
  };

  const isCompleted = (id: string) => completedReminders.includes(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-medium text-gray-800">Напоминания</h2>
        </div>
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-600 border-gray-200 rounded-full px-2.5 py-0.5"
        >
          {reminders.length}
        </Badge>
      </div>

      <Card className="border-none rounded-xl overflow-hidden shadow-sm bg-white">
        <CardContent className="p-0">
          <AnimatePresence>
            {reminders.map((reminder, index) => (
              <SwipeableReminderItem
                key={reminder.id}
                reminder={reminder}
                index={index}
                isCompleted={isCompleted(reminder.id)}
                toggleComplete={toggleComplete}
                swipingId={swipingId}
                setSwipingId={setSwipingId}
              />
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-center gap-3">
        <Button
          variant="outline"
          asChild
          className="flex-1 text-sm font-normal text-gray-700 border-gray-200 bg-white hover:bg-gray-50 rounded-lg py-5"
        >
          <Link
            to="/reminders"
            className="flex items-center justify-center gap-1"
          >
            Все напоминания
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Button>

        <Button
          variant="default"
          asChild
          className="flex-1 text-sm font-normal bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-5"
        >
          <Link
            to="/reminders/new"
            className="flex items-center justify-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Добавить
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

interface SwipeableReminderItemProps {
  reminder: Reminder;
  index: number;
  isCompleted: boolean;
  toggleComplete: (id: string) => void;
  swipingId: string | null;
  setSwipingId: (id: string | null) => void;
}

const SwipeableReminderItem = ({
  reminder,
  index,
  isCompleted,
  toggleComplete,
  swipingId,
  setSwipingId,
}: SwipeableReminderItemProps) => {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    [
      isCompleted ? "rgb(243, 244, 246)" : "rgb(254, 242, 242)",
      "rgb(255, 255, 255)",
      "rgb(240, 253, 244)",
    ]
  );

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.x) > 100) {
      toggleComplete(reminder.id);
    }
    setSwipingId(null);
  };

  const getBgColor = () => {
    if (isCompleted) return "bg-gray-50";
    if (reminder.isAlert) return "bg-red-50";
    return "bg-white";
  };

  return (
    <motion.div
      style={{ background }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ delay: 0.03 * index }}
      className="relative overflow-hidden"
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setSwipingId(reminder.id)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn(
          "p-4 border-b border-gray-100 last:border-b-0",
          swipingId === reminder.id ? "z-10" : "z-0",
          getBgColor()
        )}
      >
        <div className="flex items-start gap-3">
          <motion.button
            onClick={() => toggleComplete(reminder.id)}
            className={cn(
              "mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              isCompleted
                ? "bg-gray-100 text-gray-500"
                : reminder.isAlert
                ? "bg-red-100 text-red-500"
                : "bg-blue-100 text-blue-500"
            )}
            whileTap={{ scale: 0.9 }}
          >
            {isCompleted ? (
              <Check className="h-4 w-4" />
            ) : reminder.isAlert ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Pill className="h-4 w-4" />
            )}
          </motion.button>

          <div className="flex-1">
            <h4
              className={cn(
                "font-medium text-base",
                isCompleted && "line-through text-gray-400",
                reminder.isAlert && "text-red-700"
              )}
            >
              {reminder.isAlert ? "Пропущенный приём" : reminder.title}
            </h4>
            <p
              className={cn(
                "text-sm mt-1",
                isCompleted ? "text-gray-400" : "text-gray-500"
              )}
            >
              {reminder.isAlert
                ? `Вчера вы пропустили приём ${reminder.title}`
                : `Следующий приём через ${reminder.time}`}
            </p>
            <div className="flex items-center justify-between mt-2">
              <p
                className={cn(
                  "text-xs flex items-center gap-1",
                  isCompleted
                    ? "text-gray-400"
                    : reminder.isAlert
                    ? "text-red-500"
                    : "text-blue-500"
                )}
              >
                <Clock className="h-3 w-3" />
                {reminder.isAlert ? "вчера" : reminder.time}
              </p>

              {reminder.isAlert && !isCompleted && (
                <Badge className="text-xs bg-red-50 border-red-100 text-red-600 px-2 py-0.5 rounded-md">
                  Важно
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
