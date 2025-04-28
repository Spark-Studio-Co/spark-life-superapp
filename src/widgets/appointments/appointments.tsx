import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Appointments = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Appointments</h1>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upcoming</h2>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Dr. Emily Chen</CardTitle>
          <CardDescription>General Checkup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Tomorrow, May 15, 2023</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>10:00 AM - 10:30 AM</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Spark Health Clinic, 123 Medical Ave.</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <span>(555) 123-4567</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Reschedule
          </Button>
          <Button variant="destructive" className="flex-1">
            Cancel
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Dr. Michael Johnson</CardTitle>
          <CardDescription>Dental Cleaning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>June 2, 2023</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>2:00 PM - 3:00 PM</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Bright Smile Dental, 456 Health St.</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <span>(555) 987-6543</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Reschedule
          </Button>
          <Button variant="destructive" className="flex-1">
            Cancel
          </Button>
        </CardFooter>
      </Card>

      <h2 className="text-lg font-semibold mt-8">Past Appointments</h2>

      <Card className="opacity-70">
        <CardHeader className="pb-2">
          <CardTitle>Dr. Emily Chen</CardTitle>
          <CardDescription>Annual Physical</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>April 10, 2023</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>9:00 AM - 10:00 AM</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            View Summary
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
