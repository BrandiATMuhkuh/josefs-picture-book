"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function VoiceRecorderComponent() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          audioChunksRef.current = [];
          handleAudioUpload(audioBlob);
        };
      })
      .catch((err) => console.error("Error accessing microphone:", err));
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = (audioBlob: Blob) => {
    setIsProcessing(true);
    // Here you would typically upload the audio file to your server
    // and trigger the AI story generation process
    console.log("Audio recorded, ready for upload and processing");
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to story display or show success message
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Tell Your Story</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-4">
          {isRecording
            ? "Recording your story..."
            : "Click to start recording your story idea"}
        </p>
        <div className="flex justify-center">
          {isRecording ? (
            <Button onClick={stopRecording} variant="destructive">
              <Square className="mr-2 h-4 w-4" /> Stop Recording
            </Button>
          ) : (
            <Button onClick={startRecording} disabled={isProcessing}>
              <Mic className="mr-2 h-4 w-4" /> Start Recording
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isProcessing && (
          <div className="flex items-center justify-center w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing your story...
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
