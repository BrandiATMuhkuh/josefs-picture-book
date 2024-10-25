import { z } from "zod";

export type Paragraph = {
  index: number;
  text: string;
  image_description: string;
  imageBase64: string;
  audioBase64: string;
};

export const Character = z.object({
  name: z.string({ description: "The charactres name" }),
  appearance: z.string({
    description:
      "A detailed description of how the character looks. (This is used as a prompt for image generation)",
  }),
});

export const Page = z.object(
  {
    pageNumber: z.number({ description: "The number of the page" }),
    text: z.string({ description: "The text of this page" }),
    img: z.string({
      description: "A genAI prompt that describes the scene of this page",
    }),
  },
  {
    description:
      "One page of the picture book. Each page comes with a text and a corresponding image",
  }
);

export const PictureBook = z.object({
  language: z.string({ description: "Language used in the story" }),
  title: z.string({ description: "The title of the story" }),
  authors: z.array(z.string()),
  abstract: z.string(),
  keywords: z.array(z.string()),
  characters: z.array(Character),
  style: z.string({
    description:
      "A genAI prompt that describes in detail how the style of the images generated shoudl be like. ",
  }),
  pages: z.array(Page),
});
