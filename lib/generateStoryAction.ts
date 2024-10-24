"use server";
import OpenAI from "openai";
import { Paragraph } from "./types";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const paragraphCount = 3;

export async function generateStoryAction(formData: FormData) {
  "use server";

  const audioBlob = formData.get("file") as File;

  if (audioBlob.type !== "audio/wav") {
    throw new Error("Invalid file format. Please upload a WAV file.");
  }

  // Lets convert the audio to it's text form
  const transcription = await client.audio.transcriptions.create({
    file: audioBlob,
    model: "whisper-1",
  });

  console.log(transcription.text);

  // at this point we ask the AI to genrate a story for us, and prompts for the images
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: `You are a children story teller and picture book painter.
You will get from the user a story line.

Your job is the following:
- Create a child story
- Create about ${paragraphCount} paragraph
- For each paragraph create a description of how an image for it should look like. This description will be adding into a Generative AI to create comic images.

Please output everything as json`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: transcription.text,
          },
        ],
      },
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "picture_book_paragraphs",
        strict: true,
        schema: {
          type: "object",
          properties: {
            paragraphs: {
              type: "array",
              description:
                "A collection of paragraphs along with their associated images.",
              items: {
                type: "object",
                properties: {
                  index: {
                    type: "number",
                    index: "the index/postion of this paragraph",
                  },
                  text: {
                    type: "string",
                    description: "The text of the paragraph.",
                  },
                  image_description: {
                    type: "string",
                    description:
                      "A description of the image that is connected to the paragraph.",
                  },
                },
                required: ["text", "image_description", "index"],
                additionalProperties: false,
              },
            },
          },
          required: ["paragraphs"],
          additionalProperties: false,
        },
      },
    },
  });

  const paragraphs = JSON.parse(response.choices[0].message.content!) as {
    paragraphs: Paragraph[];
  };

  const images = await Promise.all(
    paragraphs.paragraphs.map((e) =>
      generatePicture(e.index, e.image_description)
    )
  );

  const audios = await Promise.all(
    paragraphs.paragraphs.map((e) => generateAudio(e.index, e.text))
  );

  // apply generate audio and video to object
  for (const paragraph of paragraphs.paragraphs) {
    paragraph.imageBase64 =
      images.find((e) => e.index === paragraph.index)?.imageBase64 ?? "";
    paragraph.audioBase64 =
      audios.find((e) => e.index === paragraph.index)?.audioBase64 ?? "";
  }

  console.log("paragraphs", paragraphs);

  return paragraphs;
}

async function generatePicture(index: number, text: string) {
  const response = await client.images.generate({
    model: "dall-e-3",
    prompt: text,
    n: 1,
    size: "1024x1024",
  });

  return { index, imageBase64: response.data[0].url ?? "" };
}

async function generateAudio(index: number, text: string) {
  const aac = await client.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: text,
    response_format: "mp3",
  });

  const audioBase64 = Buffer.from(await aac.arrayBuffer()).toString("base64");

  return { index, audioBase64 };
}
