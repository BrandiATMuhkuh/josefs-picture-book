"use client";
import { StoryDisplayComponent } from "@/components/story-display";
import { VoiceRecorderComponent } from "@/components/voice-recorder";
import { Paragraph } from "@/lib/types";
import { useState } from "react";

export default function Home() {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  if (paragraphs.length) {
    return <StoryDisplayComponent paragraphs={paragraphs} />;
  }
  return <VoiceRecorderComponent onParagraphs={setParagraphs} />;
}
