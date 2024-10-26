"use client";
import m from "@/components/mockTwo";
import { StoryDisplayComponent } from "@/components/story-display";
import { VoiceRecorderComponent } from "@/components/voice-recorder";
import { PictureBook } from "@/lib/types";
import { useState } from "react";

import { z } from "zod";

export default function Home() {
  const [pictureBook, setPictureBook] =
    useState<z.infer<typeof PictureBook>>(m);
  console.log("pictureBook", pictureBook);
  if (!pictureBook) {
    return <StoryDisplayComponent paragraphs={pictureBook} />;
  }
  return <VoiceRecorderComponent onPictureBook={setPictureBook} />;
}
