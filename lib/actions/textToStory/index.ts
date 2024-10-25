"use server";
import openai from "@/lib/clientAi";
import { PictureBook } from "@/lib/types";

import { zodResponseFormat } from "openai/helpers/zod";

export default async function textToStory(
  text: string,
  nrOfParagraphs: number
) {
  console.log("start: textToStory");
  // at this point we ask the AI to genrate a story for us, and prompts for the images
  const response = await openai.beta.chat.completions.parse({
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
- Create about ${nrOfParagraphs} paragraph
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
            text: text,
          },
        ],
      },
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: zodResponseFormat(PictureBook, "picture_book_paragraphs"),
  });

  const storyBook = response.choices[0].message.parsed!;

  return storyBook;
}
