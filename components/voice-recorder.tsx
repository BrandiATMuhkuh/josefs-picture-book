"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import pageToAudio from "@/lib/actions/pageToAudio";
import pageToImage from "@/lib/actions/pageToImage";
import speechToText from "@/lib/actions/speechToText";
import textToStory from "@/lib/actions/textToStory";
import { PictureBook } from "@/lib/types";
import { Loader2, Mic, Square } from "lucide-react";
import { useRef, useState } from "react";
import { z } from "zod";
export const maxDuration = 60; // This function can run for a maximum of 5 seconds

type props = {
  onPictureBook: (pictureBook: z.infer<typeof PictureBook>) => void;
};

export function VoiceRecorderComponent({ onPictureBook }: props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
    mediaRecorderRef.current.start();

    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      mediaRecorderRef.current = null; // Clear the media stream reference
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob: Blob) => {
    setIsProcessing(true);

    // TTS
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    const text = await speechToText(formData);

    // make request to backend with mock data for now
    const storyBook = await textToStory(text, 3);
    console.log("story", storyBook);

    const pictureBook = PictureBook.parse(storyBook);

    const ps: Promise<string>[] = [];
    const ps3: Promise<string>[] = [];
    for (const page of pictureBook.pages) {
      console.log("start the loop");
      ps.push(pageToImage(storyBook, page));
      console.log("create image", page.pageNumber);
      ps3.push(pageToAudio(page));
      console.log("create image", page.pageNumber);
    }

    const images64 = await Promise.all(ps);
    const audio64 = await Promise.all(ps3);

    for (let i = 0; i < pictureBook.pages.length; i = i + 1) {
      pictureBook.pages[i].image64 = images64[i];
      pictureBook.pages[i].audio64 = audio64[i];
    }

    onPictureBook(pictureBook);

    setIsProcessing(false);
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
          {/* <form action={handleAudioUpload}>
            <Button disabled={isProcessing}>Create Story</Button>  0
          </form> */}
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
