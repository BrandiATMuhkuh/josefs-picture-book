"use server";
import openai from "@/lib/clientAi";
import { Page, StoryBook } from "@/lib/types";
import { z } from "zod";

export default async function pageToImage(
  pictureBook: z.infer<typeof StoryBook>,
  page: z.infer<typeof Page>
) {
  const prompt = `
This is a prompt to generate one picture of a picture book. 
The prompt will include all possible characters and their detailed description (This does not mean each character must show up on the generated picture). A detailed description of the world. And the description of the screne

- World Style: ${pictureBook.style}
- Charactres: ${JSON.stringify(pictureBook.characters, null, 2)}

- Scene: ${page.imagePrompt}

Extra style info: The audiance is 6 years old. Keep drawing simple. Like a Comic!
    `;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    style: "vivid",
    response_format: "b64_json",
  });

  const ret = { prompt, resp: response.data[0].b64_json ?? "" };
  console.log("ret", ret);

  return response.data[0].b64_json!;
}
