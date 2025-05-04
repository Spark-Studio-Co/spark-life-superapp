"use client";
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
  Clipboard,
  Shield,
  LogOut,
  FileAudio,
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
import { useToast } from "@/components/ui/use-toast";
import {
  audioRecorder,
  RecordingOptions,
} from "@/entities/audio/audio-recorder";

interface MeetingRoomProps {
  meetingId: string;
  participantName: string;
  authToken: string;
}

function MeetingView() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"call" | "chat" | "health">(
    "call"
  );
  const [showControls, setShowControls] = useState(true);
  const { user, isLoading: isUserLoading, getInitials } = useUser();
  const {
    participants,
    localParticipant,
    leave,
    toggleMic,
    enableWebcam,
    disableWebcam,
  } = useMeeting();
  const { toast } = useToast();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isWebcamOn, setIsWebcamOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);

  // Используем useRef для хранения ID пользователей
  const patientIdRef = useRef<number>(0);
  const doctorIdRef = useRef<number>(0);

  useEffect(() => {
    // Устанавливаем ID пользователей из данных пользователя
    if (user) {
      if (user.role === "doctor") {
        doctorIdRef.current = user.id;
      } else {
        patientIdRef.current = user.id;
      }
    }
  }, [user]);

  useEffect(() => {
    if (activeView === "call") {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [activeView, showControls]);

  // Автоматически начинаем запись при входе в комнату
  useEffect(() => {
    if (localParticipant && !isRecording) {
      startRecording();
    }

    // Останавливаем запись при выходе из компонента
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [localParticipant]);

  const startRecording = async () => {
    try {
      await audioRecorder.startRecording();
      setIsRecording(true);
      toast({
        title: "Запись начата",
        description: "Запись разговора началась автоматически",
      });
    } catch (error) {
      console.error("Ошибка при начале записи:", error);
      toast({
        title: "Ошибка записи",
        description: "Не удалось начать запись разговора",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    try {
      if (!isRecording) return;

      const options: RecordingOptions = {
        patientId: 1,
        doctorId: 4,
      };

      const text = await audioRecorder.stopRecording(options);
      setIsRecording(false);

      if (text) {
        setTranscription(text);
        toast({
          title: "Транскрипция получена",
          description: "Запись разговора успешно обработана",
        });
      }
    } catch (error) {
      console.error("Ошибка при остановке записи:", error);
      setIsRecording(false);
      toast({
        title: "Ошибка транскрипции",
        description: "Не удалось обработать запись разговора",
        variant: "destructive",
      });
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleScreenTap = () => {
    if (activeView === "call") {
      setShowControls(true);
    }
  };

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

  const handleLeaveMeeting = async () => {
    // Останавливаем запись перед выходом из встречи
    if (isRecording) {
      await stopRecording();
    }

    // Получаем ID встречи из URL
    const pathParts = window.location.pathname.split('/');
    const appointmentId = pathParts[pathParts.length - 1];

    // Обновляем статус записи в localStorage
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments && appointmentId) {
      try {
        const appointments = JSON.parse(savedAppointments) as Appointment[];
        const updatedAppointments = appointments.map(app => {
          if (app.id === appointmentId) {
            // Создаем прошедшую дату (вчера), чтобы переместить в прошедшие записи
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            return {
              ...app,
              // Устанавливаем дату на вчера, чтобы она появилась в прошедших записях
              date: yesterday.toISOString().split('T')[0],
              status: 'completed' as any
            };
          }
          return app;
        });

        // Сохраняем обновленные записи в localStorage
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

        toast({
          title: "Звонок завершен",
          description: "Запись перемещена в раздел прошедших приемов",
        });
      } catch (e) {
        console.error('Error updating appointment status:', e);
      }
    }

    leave();
    navigate("/appointments");
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

  const participantsArr = [...participants.values()];

  const isDoctor = user?.role === "doctor";

  return (
    <div className="flex h-screen flex-col bg-background">
      <div
        className="relative flex flex-1 flex-col overflow-hidden"
        onClick={handleScreenTap}
      >
        {activeView === "call" && (
          <>
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
                        Медицинская Консультация
                      </h1>
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className="border-white/30 bg-black/30 text-white"
                        >
                          {localParticipant?.id?.substring(0, 8) ||
                            "Загрузка..."}
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
                          className={`mr-2 border-white/30 bg-black/30 text-white ${isDoctor ? "text-primary" : "text-white"
                            }`}
                        >
                          {isDoctor ? (
                            <>
                              <Shield className="mr-1 h-3 w-3" />
                              Врач
                            </>
                          ) : (
                            <>
                              <Activity className="mr-1 h-3 w-3" />
                              Пациент
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
                    Ожидание подключения участников...
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
                    className={`h-12 w-12 rounded-full ${!isMicOn ? "bg-red-500/20 text-red-500" : "text-white"
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
                    className={`h-12 w-12 rounded-full ${!isWebcamOn ? "bg-red-500/20 text-red-500" : "text-white"
                      }`}
                  >
                    {isWebcamOn ? (
                      <Video className="h-6 w-6" />
                    ) : (
                      <VideoOff className="h-6 w-6" />
                    )}
                  </Button>

                  <Button
                    onClick={toggleRecording}
                    variant="ghost"
                    size="icon"
                    className={`h-12 w-12 rounded-full ${isRecording
                        ? "bg-green-500/20 text-green-500"
                        : "text-white"
                      }`}
                  >
                    <FileAudio className="h-6 w-6" />
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

            {/* Индикатор записи */}
            {isRecording && (
              <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 rounded-full bg-black/50 px-3 py-1 text-white">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                <span className="text-xs">Запись</span>
              </div>
            )}
          </>
        )}
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
        debugMode: false,
        name: participantName,
      }}
      joinWithoutUserInteraction={true}
      token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJmNjMwZmVmYi1lZTJlLTQzOGMtYmQwMi1kNzM4ZTI2NTU4MWUiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NjM4MDM0NCwiZXhwIjoxNzQ2NDY2NzQ0fQ.Dhd1ZWYXL2a8JSYB16OCgWnWCtwbU_EO7dzlLXIhl90"
    >
      <MeetingView participantName={participantName} />
    </MeetingProvider>
  );
}
