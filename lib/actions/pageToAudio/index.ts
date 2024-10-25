"use server";
import openai from "@/lib/clientAi";
import { Page } from "@/lib/types";
import { z } from "zod";

export default async function pageToAudio(page: z.infer<typeof Page>) {
  const aac = await openai.audio.speech.create({
    model: "tts-1",
    voice: "shimmer",
    input: page.text,
    response_format: "mp3",
  });

  const audioBase64 = Buffer.from(await aac.arrayBuffer()).toString("base64");

  return audioBase64;
}
