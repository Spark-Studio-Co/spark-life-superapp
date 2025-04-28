"use client";

import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageHeaderProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export const PageHeader = ({ timeRange, setTimeRange }: PageHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 pt-6 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="mr-2 text-white hover:bg-white/20"
          >
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Назад</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Статистика здоровья
            </h1>
            <p className="text-blue-100">Подробный анализ ваших показателей</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Calendar className="h-4 w-4 mr-1" />
                {timeRange === "7d" && "7 дней"}
                {timeRange === "30d" && "30 дней"}
                {timeRange === "90d" && "90 дней"}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange("7d")}>
                7 дней
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("30d")}>
                30 дней
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("90d")}>
                90 дней
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
