"use client";

import assets from "@/app/images/assets.webp";
import beingdone from "@/app/images/beingdone.webp";
import recodingImage from "@/app/images/recoding.webp";
import storytelling from "@/app/images/storytelling.webp";
import transcribing from "@/app/images/transcribing.webp";
import Image from "next/image"; // Import the Next.js Image component

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import speechToText from "@/lib/actions/speechToText";
import storyToPictureBook from "@/lib/actions/storyToPictureBook";
import textToStory from "@/lib/actions/textToStory";
import { PictureBook } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2, Mic, Square } from "lucide-react";
import { useRef, useState } from "react";
import { z } from "zod";
export const maxDuration = 60; // This function can run for a maximum of 5 seconds

type props = {
  onPictureBook: (pictureBook: z.infer<typeof PictureBook>) => void;
};

export function VoiceRecorderComponent({ onPictureBook }: props) {
  // const [isRecording, setIsRecording] = useState(false);
  const [state, setState] = useState<
    "WAITING" | "RECORDING" | "TRANSCRIBING" | "STORY" | "ASSETS" | "DONE"
  >("WAITING");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  let imgSrc = recodingImage;
  if (state === "WAITING") imgSrc = recodingImage;
  if (state === "RECORDING") imgSrc = recodingImage;
  if (state === "TRANSCRIBING") imgSrc = transcribing;
  if (state === "STORY") imgSrc = storytelling;
  if (state === "ASSETS") imgSrc = assets;
  if (state === "DONE") imgSrc = beingdone;

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

    // make sure people can only recording for 10 seconds
    setTimeout(() => {
      if (mediaRecorderRef.current?.state === "recording") {
        stopRecording();
      }
    }, 10000);

    setState("RECORDING");
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      mediaRecorderRef.current = null; // Clear the media stream reference
    }
  };

  const handleAudioUpload = async (audioBlob: Blob) => {
    setState("TRANSCRIBING");

    // TTS
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    const text = await speechToText(formData);
    console.log("Transcribed Text", text);
    setState("STORY");
    // make request to backend with mock data for now
    const storyBook = await textToStory(text, 5);
    console.log("story", storyBook);

    setState("ASSETS");
    const pictureBook = await storyToPictureBook(PictureBook.parse(storyBook));
    setState("DONE");
    onPictureBook(pictureBook);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
      <Card className="w-full max-w-2xl mx-auto border-4 border-dashed border-purple-400 bg-white rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Tell Me Your Magical Story! ✨
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="relative aspect-w-4 aspect-h-3 mb-6">
            <div className="absolute -inset-4">
              <div className="w-full h-full rotate-2 bg-yellow-200 rounded-2xl" />
            </div>
            <div className="absolute -inset-4">
              <div className="w-full h-full -rotate-2 bg-blue-200 rounded-2xl" />
            </div>
            <Image
              src={imgSrc}
              alt="A child recording"
              className={cn(
                "relative rounded-2xl object-cover w-full h-full border-4 border-white shadow-xl",
                state !== "WAITING"
                  ? "animate-bounce"
                  : "transform hover:rotate-2 transition-transform duration-300"
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="pb-8">
          <div className="flex items-center justify-center w-full">
            {state === "WAITING" && (
              <Button
                onClick={startRecording}
                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-all  animate-pulse"
              >
                <Mic className="mr-3 h-6 w-6" /> Let&apos;s Record Your Story!
                🎤
              </Button>
            )}
            {state === "RECORDING" && (
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 rounded-full px-8 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200 animate-bounce"
              >
                <Square className="mr-3 h-6 w-6" /> All Done? Stop Recording! 🎯
              </Button>
            )}
            {state === "TRANSCRIBING" && (
              <Button
                disabled
                className="bg-gradient-to-r from-blue-400 to-teal-500 rounded-full px-8 py-6 text-lg font-bold"
              >
                <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Writing Down
                Your Story... ✍️
              </Button>
            )}
            {state === "STORY" && (
              <Button
                disabled
                className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full px-8 py-6 text-lg font-bold"
              >
                <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Making Story
                Magic! 🪄
              </Button>
            )}
            {state === "ASSETS" && (
              <Button
                disabled
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-8 py-6 text-lg font-bold"
              >
                <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Drawing
                Pictures! 🎨
              </Button>
            )}
            {state === "DONE" && (
              <Button className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-full px-8 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
                Hooray! All Done! 🎉
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
