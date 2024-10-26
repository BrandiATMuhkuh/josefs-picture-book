"use client";

import assets from "@/app/images/assets.webp";
import beingdone from "@/app/images/beingdone.webp";
import recodingImage from "@/app/images/recoding.webp";
import storytelling from "@/app/images/storytelling.webp";
import transcribing from "@/app/images/transcribing.webp";

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

  let imgSrc = recodingImage.src;
  if (state === "WAITING") imgSrc = recodingImage.src;
  if (state === "RECORDING") imgSrc = recodingImage.src;
  if (state === "TRANSCRIBING") imgSrc = transcribing.src;
  if (state === "STORY") imgSrc = storytelling.src;
  if (state === "ASSETS") imgSrc = assets.src;
  if (state === "DONE") imgSrc = beingdone.src;

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
      console.log("timeout");
      if (mediaRecorderRef.current?.state === "recording") {
        stopRecording();
      }
    }, 10000);

    // setIsRecording(true);
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
    const storyBook = await textToStory(text, 3);
    console.log("story", storyBook);

    setState("ASSETS");
    const pictureBook = await storyToPictureBook(PictureBook.parse(storyBook));

    // const pictureBook = PictureBook.parse(storyBook);

    // const ps: Promise<string>[] = [];
    // const ps3: Promise<string>[] = [];
    // for (const page of pictureBook.pages) {
    //   console.log("start the loop");
    //   ps.push(pageToImage(storyBook, page));
    //   console.log("create image", page.pageNumber);
    //   ps3.push(pageToAudio(page));
    //   console.log("create image", page.pageNumber);
    // }

    // const images64 = await Promise.all(ps);
    // const audio64 = await Promise.all(ps3);

    // for (let i = 0; i < pictureBook.pages.length; i = i + 1) {
    //   pictureBook.pages[i].image64 = images64[i];
    //   pictureBook.pages[i].audio64 = audio64[i];
    // }
    setState("DONE");
    onPictureBook(pictureBook);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Tell Your Story</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="aspect-w-4 aspect-h-3 mb-4">
            <img
              src={imgSrc}
              alt={"A child recording"}
              className={cn(
                "rounded-lg object-cover w-full h-full",
                state !== "WAITING" ? "animate-pulse" : undefined
              )}
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-center w-full">
            {state === "WAITING" && (
              <Button onClick={startRecording}>
                <Mic className="mr-2 h-4 w-4" /> Record your story idea
              </Button>
            )}
            {state === "RECORDING" && (
              <Button onClick={stopRecording} variant="destructive">
                <Square className="mr-2 h-4 w-4" /> Stop Recording
              </Button>
            )}
            {state === "TRANSCRIBING" && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transcribing
              </Button>
            )}
            {state === "STORY" && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                Story
              </Button>
            )}
            {state === "ASSETS" && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                Images and Audio
              </Button>
            )}
            {state === "DONE" && <Button>Done</Button>}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
