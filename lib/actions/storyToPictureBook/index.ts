"use server";
import { PictureBook, StoryBook } from "@/lib/types";
import { z } from "zod";
import pageToAudio from "../pageToAudio";
import pageToImage from "../pageToImage";
export default async function storyToPictureBook(
  storyBook: z.infer<typeof StoryBook>
) {
  const pictureBook = PictureBook.parse(storyBook);

  const ps: Promise<string>[] = [];
  const ps3: Promise<string>[] = [];
  for (const page of pictureBook.pages) {
    console.log("start the loop");
    ps.push(pageToImage(storyBook, page));
    console.log("create image", page.pageNumber);
    ps3.push(pageToAudio(page));
    console.log("create image", page.pageNumber);
  }

  const images64 = await Promise.all(ps);
  const audio64 = await Promise.all(ps3);

  for (let i = 0; i < pictureBook.pages.length; i = i + 1) {
    pictureBook.pages[i].image64 = images64[i];
    pictureBook.pages[i].audio64 = audio64[i];
  }

  return pictureBook;
}
