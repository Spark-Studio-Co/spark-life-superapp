"use client";

import { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Activity,
  ArrowLeft,
  Clipboard,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/entities/user/hooks/use-user";
import ParticipantVideo from "../participant-view/participant-view";

interface MeetingRoomProps {
  meetingId: string;
  participantName: string;
  authToken: string;
}

function MeetingView({ participantName }: { participantName: string }) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"call" | "chat" | "health">(
    "call"
  );

  const [showControls, setShowControls] = useState(true);

  // Get user data from the hook
  const { user, isLoading: isUserLoading, getInitials } = useUser();

  // Get meeting methods and state
  const meeting = useMeeting();
  const {
    participants,
    localParticipant,
    leave,
    toggleMic,
    enableWebcam,
    disableWebcam,
  } = meeting;

  // Local participant state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isWebcamOn, setIsWebcamOn] = useState(true);

  useEffect(() => {
    if (activeView === "call") {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [activeView, showControls]);

  const handleScreenTap = () => {
    if (activeView === "call") {
      setShowControls(true);
    }
  };

  const handleLeaveMeeting = () => {
    leave();
    navigate("/");
  };

  const handleToggleMic = () => {
    toggleMic();
    setIsMicOn(!isMicOn);
  };

  const handleToggleWebcam = () => {
    if (isWebcamOn) {
      disableWebcam();
    } else {
      enableWebcam();
    }
    setIsWebcamOn(!isWebcamOn);
  };

  // Convert participants map to array
  const participantsArr = [...participants.values()];

  // Determine if the user is a doctor based on their role
  const isDoctor = user?.role === "doctor";

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Main content based on active view */}
      <div
        className="relative flex flex-1 flex-col overflow-hidden"
        onClick={handleScreenTap}
      >
        {/* Call View */}
        {activeView === "call" && (
          <>
            {/* Floating header - only visible when controls are shown */}
            {showControls && (
              <div className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 text-white"
                      onClick={() => navigate("/")}
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                      <h1 className="text-lg font-semibold text-white">
                        Health Consultation
                      </h1>
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className="border-white/30 bg-black/30 text-white"
                        >
                          {localParticipant?.id?.substring(0, 8) ||
                            "Loading..."}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              localParticipant?.id || ""
                            );
                          }}
                          className="ml-1 h-6 w-6 p-0 text-white"
                        >
                          <Clipboard className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {isUserLoading ? (
                      <Skeleton className="h-10 w-10 rounded-full" />
                    ) : (
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className={`mr-2 border-white/30 bg-black/30 text-white ${
                            isDoctor ? "text-primary" : "text-white"
                          }`}
                        >
                          {isDoctor ? (
                            <>
                              <Shield className="mr-1 h-3 w-3" />
                              Doctor
                            </>
                          ) : (
                            <>
                              <Activity className="mr-1 h-3 w-3" />
                              Patient
                            </>
                          )}
                        </Badge>
                        <Avatar className="h-10 w-10">
                          <div className="flex h-full w-full items-center justify-center bg-primary/20 text-primary">
                            {getInitials()}
                          </div>
                        </Avatar>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-1 flex-col bg-black">
              {participantsArr.length > 0 ? (
                <div className="grid h-full grid-cols-1 gap-1 p-0">
                  {participantsArr.map((participant) => (
                    <ParticipantVideo
                      key={participant.id}
                      participant={participant}
                      isLocal={participant.id === localParticipant?.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-white/70">
                    Waiting for participants to join...
                  </p>
                </div>
              )}
            </div>
            {showControls && (
              <div className="absolute bottom-20 left-0 right-0 z-10 flex justify-center">
                <div className="flex items-center space-x-4 rounded-full bg-black/50 px-6 py-3 backdrop-blur-md">
                  <Button
                    onClick={handleToggleMic}
                    variant="ghost"
                    size="icon"
                    className={`h-12 w-12 rounded-full ${
                      !isMicOn ? "bg-red-500/20 text-red-500" : "text-white"
                    }`}
                  >
                    {isMicOn ? (
                      <Mic className="h-6 w-6" />
                    ) : (
                      <MicOff className="h-6 w-6" />
                    )}
                  </Button>

                  <Button
                    onClick={handleToggleWebcam}
                    variant="ghost"
                    size="icon"
                    className={`h-12 w-12 rounded-full ${
                      !isWebcamOn ? "bg-red-500/20 text-red-500" : "text-white"
                    }`}
                  >
                    {isWebcamOn ? (
                      <Video className="h-6 w-6" />
                    ) : (
                      <VideoOff className="h-6 w-6" />
                    )}
                  </Button>

                  <Button
                    onClick={handleLeaveMeeting}
                    variant="destructive"
                    size="icon"
                    className="h-14 w-14 rounded-full"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>
                  <Button
                    onClick={() => setActiveView("chat")}
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full text-white"
                  >
                    <MessageSquare className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="border-t bg-card">
        <Tabs
          value={activeView}
          onValueChange={(value) =>
            setActiveView(value as "call" | "chat" | "health")
          }
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="call" className="py-3">
              <div className="flex flex-col items-center">
                <Video className="mb-1 h-5 w-5" />
                <span className="text-xs">Call</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

export default function MeetingRoom({
  meetingId,
  participantName,
}: MeetingRoomProps) {
  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        debugMode: true,
        name: participantName,
      }}
      token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJmNjMwZmVmYi1lZTJlLTQzOGMtYmQwMi1kNzM4ZTI2NTU4MWUiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NjIwODM1NCwiZXhwIjoxNzQ2Mjk0NzU0fQ.uB_J3j0iCnV54JB-Ja4dYTDpZzGuRLLHPaeAogL8gg8"
      joinWithoutUserInteraction={true}
    >
      <MeetingView participantName={participantName} />
    </MeetingProvider>
  );
}
