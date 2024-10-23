"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import storyPages from "./mockdata";

export function StoryDisplayComponent() {
  const [currentPage, setCurrentPage] = useState(0);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, storyPages.length - 1));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
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
          <div className="flex justify-between items-center">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              variant="outline"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {currentPage + 1} of {storyPages.length}
            </span>
            <Button
              onClick={goToNextPage}
              disabled={currentPage === storyPages.length - 1}
              variant="outline"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
