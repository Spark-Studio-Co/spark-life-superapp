"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Activity,
  ArrowLeft,
  MoreVertical,
  Clipboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ParticipantVideo from "@/entities/chat/ui/participant-video";
import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ChatMessage from "@/entities/chat/ui/chat-message";
import { useNavigate } from "react-router-dom";

interface MeetingRoomProps {
  meetingId: string;
  participantName: string;
  authToken: string;
}

// Mock messages for demonstration
const mockMessages = [
  {
    id: "1",
    sender: "Dr. Sarah Johnson",
    content: "How are you feeling today?",
    time: "10:01 AM",
  },
  {
    id: "2",
    sender: "John Smith",
    content:
      "Much better than yesterday, the new medication seems to be working.",
    time: "10:02 AM",
  },
  {
    id: "3",
    sender: "Dr. Sarah Johnson",
    content: "That's great to hear! Any side effects?",
    time: "10:03 AM",
  },
  {
    id: "4",
    sender: "John Smith",
    content:
      "Just a bit of drowsiness in the morning, but it wears off quickly.",
    time: "10:04 AM",
  },
];

function MeetingView({ participantName }: { participantName: string }) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"call" | "chat" | "health">(
    "call"
  );
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);

  const { participants, localParticipant, leave, toggleMic, toggleWebcam } =
    useMeeting();

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now().toString(),
        sender: participantName,
        content: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
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
    toggleWebcam();
    setIsWebcamOn(!isWebcamOn);
  };

  const participantsArr = [...participants.values()];

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
                  <Button variant="ghost" size="icon" className="text-white">
                    <MoreVertical className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            )}

            {/* Video grid */}
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

        {/* Chat View */}
        {activeView === "chat" && (
          <div className="flex h-full flex-col">
            <div className="flex items-center border-b bg-card px-4 py-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("call")}
                className="mr-2 p-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold">Chat</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isOwnMessage={message.sender === participantName}
                  />
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border border-input bg-background px-4 py-3 text-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 rotate-90"
                  >
                    <path d="m5 12 14-9v18L5 12z" />
                  </svg>
                </Button>
              </form>
            </div>
          </div>
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
            <TabsTrigger value="chat" className="py-3">
              <div className="flex flex-col items-center">
                <MessageSquare className="mb-1 h-5 w-5" />
                <span className="text-xs">Chat</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="health" className="py-3">
              <div className="flex flex-col items-center">
                <Activity className="mb-1 h-5 w-5" />
                <span className="text-xs">Health</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-xl p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle>Chat</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(80vh-60px-70px)] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sender === participantName}
                />
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-input bg-background px-4 py-3 text-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="h-12 w-12 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 rotate-90"
                >
                  <path d="m5 12 14-9v18L5 12z" />
                </svg>
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={isHealthOpen} onOpenChange={setIsHealthOpen}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-xl p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle>Health Data</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function MeetingRoom({
  meetingId,
  participantName,
  authToken,
}: MeetingRoomProps) {
  const apiKey = "YOUR_VIDEOSDK_API_KEY"; // Replace with your actual API key

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        debugMode: true,
        webcamEnabled: true,
        name: participantName,
      }}
      token={authToken}
      //   reinitiateOnConfigChange={true}
      joinWithoutUserInteraction={true}
    >
      <MeetingView participantName={participantName} />
    </MeetingProvider>
  );
}
