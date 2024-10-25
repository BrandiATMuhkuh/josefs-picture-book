"use client";
import { Button } from "@/components/ui/button";
import pageToImage from "@/lib/actions/pageToImage";
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

          for (const page of story.pages.slice(0, 1)) {
            const img = await pageToImage(story, page);
            console.log("img", img);
          }
        }}
      >
        test
      </Button>
    </>
  );
}
