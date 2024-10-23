"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Mock data for the story
const storyPages = [
  {
    text: "Once upon a time, in a lush green forest, there lived a curious little rabbit named Hoppy.",
    imageUrl: "/placeholder.svg?height=300&width=400"
  },
  {
    text: "Hoppy loved to explore the forest and make new friends with all the woodland creatures.",
    imageUrl: "/placeholder.svg?height=300&width=400"
  },
  {
    text: "One day, Hoppy discovered a magical clearing filled with glowing flowers of every color.",
    imageUrl: "/placeholder.svg?height=300&width=400"
  },
  {
    text: "The flowers whispered secrets of the forest, teaching Hoppy about the importance of friendship and bravery.",
    imageUrl: "/placeholder.svg?height=300&width=400"
  },
  {
    text: "From that day on, Hoppy shared the flowers' wisdom with all his forest friends, making the woodland a happier place for everyone.",
    imageUrl: "/placeholder.svg?height=300&width=400"
  }
]

export function StoryDisplayComponent() {
  const [currentPage, setCurrentPage] = useState(0)

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, storyPages.length - 1))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="aspect-w-4 aspect-h-3 mb-4">
            <img
              src={storyPages[currentPage].imageUrl}
              alt={`Story illustration ${currentPage + 1}`}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          <p className="text-lg text-center mb-4">{storyPages[currentPage].text}</p>
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
  )
}