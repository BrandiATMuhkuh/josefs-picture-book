"use client";
import { StoryDisplayComponent } from "@/components/story-display";
import { VoiceRecorderComponent } from "@/components/voice-recorder";
import { PictureBook } from "@/lib/types";
import { useState } from "react";

// import debugStory from "@/components/debugStory";
import { z } from "zod";

export default function Home() {
  const [pictureBook, setPictureBook] = useState<z.infer<typeof PictureBook>>();
  console.log("pictureBook", pictureBook);
  if (pictureBook) {
    return <StoryDisplayComponent paragraphs={pictureBook} />;
  }
  return <VoiceRecorderComponent onPictureBook={setPictureBook} />;
}
