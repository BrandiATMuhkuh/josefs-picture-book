"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import storyPages from "./mockdata";

export function StoryDisplayComponent() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(
      "data:audio/wav;base64," + storyPages[currentPage].audioBase64
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
    if (currentPage < storyPages.length - 1) {
      goToNextPage();
    } else {
      setIsAutoPlaying(false);
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, storyPages.length - 1));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="aspect-w-4 aspect-h-3 mb-4">
            <img
              src={storyPages[currentPage].imageBase64}
              alt={`Story illustration ${currentPage + 1}`}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          <p className="text-lg text-center mb-4">
            {storyPages[currentPage].text}
          </p>
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPage === 0 || isAutoPlaying}
              variant="outline"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {currentPage + 1} of {storyPages.length}
            </span>
            <Button
              onClick={goToNextPage}
              disabled={currentPage === storyPages.length - 1 || isAutoPlaying}
              variant="outline"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Switch
              id="auto-play"
              checked={isAutoPlaying}
              onCheckedChange={toggleAutoPlay}
            />
            <label
              htmlFor="auto-play"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Auto-play
            </label>
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
        </CardContent>
      </Card>
    </div>
  );
}
