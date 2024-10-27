"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image"; // Import the Next.js Image component
import { useEffect, useRef, useState } from "react";

import { PictureBook } from "@/lib/types";
import { z } from "zod";

export function StoryDisplayComponent({
  paragraphs,
}: {
  paragraphs: z.infer<typeof PictureBook>;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(
      "data:audio/wav;base64," + paragraphs.pages[currentPage].audio64
    );
    audioRef.current.addEventListener("ended", handleAudioEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, [currentPage]);

  useEffect(() => {
    if (isAutoPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isAutoPlaying, currentPage]);

  const handleAudioEnded = () => {
    if (currentPage < paragraphs.pages.length - 1) {
      goToNextPage();
    } else {
      setIsAutoPlaying(false);
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, paragraphs.pages.length - 1));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{paragraphs.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative w-full aspect-auto sm:aspect-[10/8]">
            {" "}
            <Image
              src={`data:image/png;base64,${paragraphs.pages[currentPage].image64}`}
              alt={`Story illustration ${currentPage + 1}`}
              className="rounded-lg object-cover w-full h-full"
              width={300}
              height={300}
            />
          </div>
          <p className="text-base md:text-lg text-left mb-4 mt-4">
            {paragraphs.pages[currentPage].text}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center mb-4">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 0 || isAutoPlaying}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center space-x-2">
            <Button
              onClick={toggleAutoPlay}
              variant="outline"
              size="icon"
              className="ml-2"
              aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
            >
              {isAutoPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={goToNextPage}
            disabled={
              currentPage === paragraphs.pages.length - 1 || isAutoPlaying
            }
            variant="outline"
          >
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
