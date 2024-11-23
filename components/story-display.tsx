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
      <Card className="w-full max-w-2xl mx-auto border-4 border-dashed border-purple-400 bg-white rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            {paragraphs.title} ✨
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
              src={`data:image/png;base64,${paragraphs.pages[currentPage].image64}`}
              alt={`Story illustration ${currentPage + 1}`}
              className="relative rounded-2xl object-cover w-full h-full border-4 border-white shadow-xl transform hover:rotate-2 transition-transform duration-300"
              width={300}
              height={300}
            />
          </div>
          <p className="text-xl text-center mb-4 mt-8 px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-inner border-2 border-purple-100 font-medium text-gray-700">
            {paragraphs.pages[currentPage].text}
          </p>
        </CardContent>
        <CardFooter className="pb-8 flex justify-between items-center px-8">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 0 || isAutoPlaying}
            className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white rounded-full px-6 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            onClick={toggleAutoPlay}
            className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {isAutoPlaying ? (
              <>
                <Pause className="mr-2 h-6 w-6" /> Pause Story 🎵
              </>
            ) : (
              <>
                <Play className="mr-2 h-6 w-6" /> Read to Me! 🎵
              </>
            )}
          </Button>

          <Button
            onClick={goToNextPage}
            disabled={
              currentPage === paragraphs.pages.length - 1 || isAutoPlaying
            }
            className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white rounded-full px-6 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
