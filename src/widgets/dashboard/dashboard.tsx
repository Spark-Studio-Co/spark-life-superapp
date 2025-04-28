import { Activity, Calendar, Heart, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthMetrics } from "@/widgets/health-metrics";
import { Appointments } from "@/widgets/appointments";
import { Profile } from "@/widgets/profile";

export const Dashboard = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-primary px-4 pt-6 pb-14">
        <h1 className="text-2xl font-bold text-primary-foreground">
          Hello, Sarah
        </h1>
        <p className="text-primary-foreground/80">
          Your health journey looks great today
        </p>
      </div>

      <div className="px-4 -mt-10">
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-destructive" />
              Daily Health Score
            </CardTitle>
            <CardDescription>
              Your health is 15% better than yesterday
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Score</span>
              <span className="text-sm font-bold">82/100</span>
            </div>
            <Progress value={82} className="h-2 bg-muted" />

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Activity</span>
                </div>
                <span className="text-xl font-bold">7,234</span>
                <span className="text-xs text-muted-foreground">
                  steps today
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Heart Rate</span>
                </div>
                <span className="text-xl font-bold">72</span>
                <span className="text-xs text-muted-foreground">
                  bpm average
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="home" className="mt-6">
        <TabsList className="hidden">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="px-4 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Dr. Emily Chen</h3>
                    <p className="text-sm text-muted-foreground">
                      General Checkup
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Tomorrow</p>
                    <p className="text-sm text-muted-foreground">10:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Health Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <img
                  src="/health-metrics-comparison.png"
                  alt="Health metrics chart"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metrics">
          <HealthMetrics />
        </TabsContent>
        <TabsContent value="appointments">
          <Appointments />
        </TabsContent>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
      </Tabs>
    </div>
  );
};
