"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { MicOff, Shield, Activity } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";

interface ParticipantVideoProps {
  participant: any;
  isLocal: boolean;
}

export default function ParticipantVideo({
  participant,
  isLocal,
}: ParticipantVideoProps) {
  const micRef = useRef<HTMLAudioElement>(null);

  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isActiveSpeaker,
    displayName,
    enableMic,
    disableMic,
    enableWebcam,
    disableWebcam,
  } = useParticipant(participant.id);

  const [isDoctor, setIsDoctor] = useState(false);

  // Create video stream from webcam track
  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null;
  }, [webcamStream, webcamOn]);

  // Handle audio stream
  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) => console.error("Audio element play failed", error));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  useEffect(() => {
    // Check if the participant is a doctor based on their display name
    setIsDoctor(displayName?.toLowerCase().includes("dr") || false);
  }, [displayName]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Hidden audio element for participant's microphone */}
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />

      {videoStream ? (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          width="100%"
          height="100%"
          onError={(err) => {
            console.log("ReactPlayer error:", err);
          }}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-black/90">
          <Avatar className="h-24 w-24 text-3xl">
            <div className="flex h-full w-full items-center justify-center bg-primary/20 text-primary">
              {displayName
                ? displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "?"}
            </div>
          </Avatar>
          <p className="mt-3 text-center text-base font-medium text-white">
            {displayName || "Unknown"}
          </p>
        </div>
      )}

      {/* Participant info overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`border-white/20 bg-black/50 backdrop-blur-md ${
              isDoctor ? "text-primary" : "text-white/80"
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

          {isActiveSpeaker && (
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 text-primary backdrop-blur-md"
            >
              Speaking
            </Badge>
          )}

          {isLocal && (
            <Badge
              variant="outline"
              className="border-white/20 bg-black/50 text-white/80 backdrop-blur-md"
            >
              You
            </Badge>
          )}
        </div>

        {!micOn && (
          <Badge
            variant="outline"
            className="border-red-500/20 bg-black/50 text-red-500 backdrop-blur-md"
          >
            <MicOff className="mr-1 h-3 w-3" />
            Muted
          </Badge>
        )}
      </div>
    </div>
  );
}
