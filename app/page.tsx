"use client";
import { StoryDisplayComponent } from "@/components/story-display";
import { VoiceRecorderComponent } from "@/components/voice-recorder";
import { Paragraph } from "@/lib/types";
import { useState } from "react";

import mockTwo from "@/components/mockTwo";

export default function Home() {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  if (mockTwo) {
    return <StoryDisplayComponent paragraphs={mockTwo} />;
  }
  return <VoiceRecorderComponent onParagraphs={setParagraphs} />;
}
