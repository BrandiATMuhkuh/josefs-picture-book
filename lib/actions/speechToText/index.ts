"use server";
import openai from "@/lib/clientAi";

export default async function speechToText(formData: FormData) {
  "use server";

  const audioBlob = formData.get("file") as File;

  if (audioBlob.type !== "audio/wav") {
    throw new Error("Invalid file format. Please upload a WAV file.");
  }

  // Lets convert the audio to it's text form
  const transcription = await openai.audio.transcriptions.create({
    file: audioBlob,
    model: "whisper-1",
  });

  return transcription.text;
}
