"use client";
import { Button } from "@/components/ui/button";
import pageToAudio from "@/lib/actions/pageToAudio";
import pageToImage from "@/lib/actions/pageToImage";
import textToStory from "@/lib/actions/textToStory";
import { PictureBook } from "@/lib/types";

export default function Testing() {
  return (
    <>
      <Button
        onClick={async () => {
          const storyBook = await textToStory(
            "A Pippi Longstocking story about a treasure in space.",
            3
          );
          console.log("story", storyBook);

          // for (const page of story.pages.slice(0, 1)) {
          //   const img64 = await pageToImage(story, page);
          // }

          // for (const page of storyBook.pages.slice(0, 1)) {
          //   const voice64 = await pageToAudio(page);
          //   console.log("voice64", voice64);
          // }

          const pictureBook = PictureBook.parse(storyBook);

          const [images64, audio64] = await Promise.all([
            Promise.all(
              pictureBook.pages.map((page) => pageToImage(storyBook, page))
            ),

            Promise.all(pictureBook.pages.map((page) => pageToAudio(page))),
          ]);

          for (let i = 0; i < pictureBook.pages.length; i = i + 1) {
            pictureBook.pages[i].image64 = images64[i];
            pictureBook.pages[i].audio64 = audio64[i];
          }

          console.log("pictureBook", pictureBook);
        }}
      >
        test
      </Button>
    </>
  );
}
