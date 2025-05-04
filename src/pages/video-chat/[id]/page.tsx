"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import MeetingRoom from "@/widgets/meeting-room/meeting-room";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Interface for appointment data from localStorage
interface Appointment {
  id: string;
  clinicName: string;
  clinicAddress: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export default function VideoChat() {
  const [meetingId, setMeetingId] = useState("o2ny-p68a-1c02");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user name from localStorage on component mount
  useEffect(() => {
    // Try to get the user's name from localStorage
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        const appointments = JSON.parse(savedAppointments) as Appointment[];
        // Find the current appointment by ID if available
        if (id) {
          const currentAppointment = appointments.find(app => app.id === id);
          if (currentAppointment) {
            setName(currentAppointment.name);
          }
        }
      } catch (e) {
        console.error('Error parsing appointments from localStorage:', e);
      }
    }
  }, [id]);

  // Handle call ending and update appointment status
  const handleCallEnd = () => {
    setCallEnded(true);

    // Update the appointment status in localStorage
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments && id) {
      try {
        const appointments = JSON.parse(savedAppointments) as Appointment[];
        const updatedAppointments = appointments.map(app => {
          if (app.id === id) {
            // Create a past date (yesterday) to move this to past appointments
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            return {
              ...app,
              // Set the date to yesterday to make it appear in past appointments
              date: yesterday.toISOString().split('T')[0],
              status: 'completed' as any
            };
          }
          return app;
        });

        // Save updated appointments back to localStorage
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

        toast({
          title: "Звонок завершен",
          description: "Запись перемещена в раздел прошедших приемов",
        });

        // Navigate back to appointments page after a short delay
        setTimeout(() => {
          navigate('/appointments');
        }, 2000);
      } catch (e) {
        console.error('Error updating appointment status:', e);
      }
    }
  };

  const createMeeting = async () => {
    try {
      setIsLoading(true);

      const mockToken =
        "mock_auth_token_" + Math.random().toString(36).substring(2, 12);
      setAuthToken(mockToken);
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating meeting:", error);
      setIsLoading(false);
    }
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createMeeting().then(() => {
        setJoined(true);
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {!joined ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-center bg-primary p-4 text-primary-foreground">
            <Heart className="mr-2 h-6 w-6" />
            <h1 className="text-xl font-bold">Spark Meet</h1>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-center text-2xl font-bold">
                Это ваш код: o2ny-p68a-1c02
              </h2>
            </div>
            <form onSubmit={handleJoinMeeting} className="w-full space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Ваше имя
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Smith"
                  className="h-12 rounded-xl text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="meetingId" className="text-sm font-medium">
                  ID
                </label>
                <Input
                  id="meetingId"
                  type="text"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  className="h-12 rounded-xl text-base"
                  required
                />
              </div>

              <Button
                type="submit"
                className="mt-4 h-14 w-full rounded-xl text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Создать встречу..." : "Присоединиться"}
              </Button>
            </form>
          </div>
        </div>
      ) : callEnded ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-center text-2xl font-bold">Звонок завершен</h2>
            <p className="mt-2 text-gray-500">Запись перемещена в раздел прошедших приемов</p>
          </div>
          <Button
            onClick={() => navigate('/appointments')}
            className="mt-4 h-14 w-full max-w-md rounded-xl text-base font-semibold"
          >
            Вернуться к записям
          </Button>
        </div>
      ) : (
        <div className="relative">
          <MeetingRoom
            meetingId={meetingId}
            participantName={name}
            authToken={authToken}
          />
        </div>
      )}
    </main>
  );
}
