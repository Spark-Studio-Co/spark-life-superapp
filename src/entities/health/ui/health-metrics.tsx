import { Activity, Droplet, Heart, Moon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const HealthMetrics = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Health Metrics</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-destructive" />
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72 bpm</div>
            <CardDescription>Normal range</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,234</div>
            <CardDescription>Goal: 10,000</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplet className="h-4 w-4 text-blue-500" />
              Hydration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2L</div>
            <CardDescription>Goal: 2.5L</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="h-4 w-4 text-orange-500" />
              Sleep
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7h 20m</div>
            <CardDescription>Good quality</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <img
              src="/blue-weekly-activity.png"
              alt="Weekly activity chart"
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Insights</CardTitle>
          <CardDescription>Personalized recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Improve cardiovascular health</h3>
              <p className="text-sm text-muted-foreground">
                Try to include 30 minutes of moderate exercise daily to
                strengthen your heart.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center mt-1">
              <Moon className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium">Optimize sleep schedule</h3>
              <p className="text-sm text-muted-foreground">
                Going to bed 30 minutes earlier could improve your sleep
                quality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
