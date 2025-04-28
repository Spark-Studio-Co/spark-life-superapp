import { Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MedicationCardProps {
  data: Array<{
    date: string;
    adherence: number;
  }>;
}

export const MedicationCard = ({ data }: MedicationCardProps) => {
  // Calculate average adherence
  const avgAdherence = Math.round(
    data.reduce((sum, item) => sum + item.adherence, 0) / data.length
  );

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Pill className="h-5 w-5 text-purple-500" />
          Прием лекарств
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Соблюдение режима"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="adherence"
                fill="#a78bfa"
                radius={[4, 4, 0, 0]}
                name="Соблюдение режима"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Соблюдение режима приема лекарств:{" "}
          <span className="font-medium">{avgAdherence}%</span>
        </div>
      </CardContent>
    </Card>
  );
};
