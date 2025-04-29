//@ts-nocheck

"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";
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
  Loader2,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  isAlert: boolean;
  isCompleted: boolean;
  type: string;
}

interface RemindersWidgetProps {
  reminders: Reminder[];
  isLoading?: boolean;
  onCompleteReminder?: (id: string) => void;
  onDeleteReminder?: (id: string) => void;
}

export function RemindersWidget({
  reminders,
  isLoading = false,
  onCompleteReminder,
  onDeleteReminder,
}: RemindersWidgetProps) {
  const [completedReminders, setCompletedReminders] = useState<string[]>([]);
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const handleComplete = async (id: string) => {
    // Update local state immediately for better UX
    setCompletedReminders((prev) =>
      prev.includes(id)
        ? prev.filter((reminderId) => reminderId !== id)
        : [...prev, id]
    );

    // Call the callback if provided
    if (onCompleteReminder) {
      await onCompleteReminder(id);
    }
  };

  const handleDelete = async (id: string) => {
    if (onDeleteReminder) {
      // Mark as deleting for animation
      setDeletingIds((prev) => [...prev, id]);

      // Wait a moment for the animation to start
      setTimeout(async () => {
        await onDeleteReminder(id);

        // Remove from deleting state after the animation completes
        setDeletingIds((prev) => prev.filter((itemId) => itemId !== id));
      }, 300);
    }
  };

  const isCompleted = (reminder: Reminder) => {
    return reminder.isCompleted || completedReminders.includes(reminder.id);
  };

  const isDeleting = (id: string) => {
    return deletingIds.includes(id);
  };

  // Limit reminders to 3
  const limitedReminders = reminders.slice(0, 3);
  const hasMoreReminders = reminders.length > 3;

  if (isLoading) {
    return (
      <Card className="border-none rounded-xl overflow-hidden shadow-sm bg-white">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500">Загрузка напоминаний...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
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
          {limitedReminders.length > 0 ? (
            <AnimatePresence>
              {limitedReminders.map((reminder, index) => (
                <SwipeableReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  index={index}
                  isCompleted={isCompleted(reminder)}
                  isDeleting={isDeleting(reminder.id)}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  swipingId={swipingId}
                  setSwipingId={setSwipingId}
                />
              ))}
            </AnimatePresence>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Нет активных напоминаний</p>
            </div>
          )}

          {hasMoreReminders && (
            <div className="p-3 text-center border-t border-gray-100">
              <Link
                to="/reminders"
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Показать еще {reminders.length - 3} напоминаний
              </Link>
            </div>
          )}
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
          className="flex-1 text-sm font-normal bg-blue-500 text-white hover:bg-blue-600 rounded-lg py-5"
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
}

interface SwipeableReminderItemProps {
  reminder: Reminder;
  index: number;
  isCompleted: boolean;
  isDeleting: boolean;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  swipingId: string | null;
  setSwipingId: (id: string | null) => void;
}

const SwipeableReminderItem = ({
  reminder,
  index,
  isCompleted,
  isDeleting,
  onComplete,
  onDelete,
  swipingId,
  setSwipingId,
}: SwipeableReminderItemProps) => {
  const x = useMotionValue(0);

  // Different background colors based on swipe direction
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["rgb(254, 226, 226)", "rgb(255, 255, 255)", "rgb(240, 253, 244)"]
  );

  // Different icons based on swipe direction
  const leftIconOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

  const rightIconOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1]);

  const handleDragEnd = (info: PanInfo) => {
    // Check the direction of the swipe
    if (info.offset.x < -100) {
      // Swiped left - delete
      onDelete(reminder.id);
    } else if (info.offset.x > 100) {
      // Swiped right - complete
      onComplete(reminder.id);
    }

    setSwipingId(null);
  };

  const getBgColor = () => {
    if (isDeleting) return "bg-red-100";
    if (isCompleted) return "bg-gray-50";
    if (reminder.isAlert) return "bg-red-50";
    return "bg-white";
  };

  return (
    <motion.div
      style={{ background }}
      initial={{ opacity: 0, y: 5 }}
      animate={{
        opacity: isDeleting ? 0 : 1,
        y: isDeleting ? -20 : 0,
        height: isDeleting ? 0 : "auto",
      }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        delay: isDeleting ? 0 : 0.03 * index,
        duration: isDeleting ? 0.3 : 0.2,
      }}
      className="relative overflow-hidden"
    >
      {/* Left action indicator (delete) */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{ opacity: leftIconOpacity }}
      >
        <div className="bg-red-100 rounded-full p-2">
          <Trash2 className="h-5 w-5 text-red-500" />
        </div>
      </motion.div>

      {/* Right action indicator (complete) */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{ opacity: rightIconOpacity }}
      >
        <div className="bg-green-100 rounded-full p-2">
          <Check className="h-5 w-5 text-green-500" />
        </div>
      </motion.div>

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
            onClick={() =>
              isCompleted ? onComplete(reminder.id) : onComplete(reminder.id)
            }
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
