"use client";
import { Button } from "@/components/ui/button";
import pageToAudio from "@/lib/actions/pageToAudio";
import textToStory from "@/lib/actions/textToStory";

export default function Testing() {
  return (
    <>
      <Button
        onClick={async () => {
          const story = await textToStory(
            "A Pippi Longstocking story about a treasure in space.",
            3
          );
          console.log("story", story);

          // for (const page of story.pages.slice(0, 1)) {
          //   const img64 = await pageToImage(story, page);
          // }

          for (const page of story.pages.slice(0, 1)) {
            const voice64 = await pageToAudio(page);
            console.log("voice64", voice64);
          }
        }}
      >
        test
      </Button>
    </>
  );
}
