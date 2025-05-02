"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import MeetingRoom from "@/widgets/meeting-room/meeting-room";

export default function VideoChat() {
  const [meetingId, setMeetingId] = useState("");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!meetingId) {
      setMeetingId(Math.random().toString(36).substring(2, 12));
    }
  }, [meetingId]);

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
          {/* App-like header */}
          <div className="flex items-center justify-center bg-primary p-4 text-primary-foreground">
            <Heart className="mr-2 h-6 w-6" />
            <h1 className="text-xl font-bold">HealthMeet</h1>
          </div>

          {/* Join meeting form */}
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-center text-2xl font-bold">
                Join Consultation
              </h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Connect with healthcare professionals in real-time
              </p>
            </div>

            <form onSubmit={handleJoinMeeting} className="w-full space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
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
                  Meeting ID
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
                {isLoading ? "Creating meeting..." : "Join Meeting"}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <MeetingRoom
          meetingId={meetingId}
          participantName={name}
          authToken={authToken}
        />
      )}
    </main>
  );
}
