# Josef's Picture Book

> [!NOTE]  
> This project is intended to allow children who can't read/write (~5 years old) to create picture books by simply recording a story idea. Try it: https://josefs-picture-book.brandstetter.io

## Inspiration

I've asked my 5-year-old son what he would like the computer to do for him (he uses ChatGPT quite a lot at home).  
He said: "I want the computer to create a picture book and read it to me."

Since I really enjoy all of the new AI tools, I spent a couple of evenings creating this project for him.

## AI Tools Used

- [v0](https://v0.dev/chat): I used v0 for most of the UI. I even used the shadcn CLI to add components.
- [Cursor](https://www.cursor.com/): I used Cursor mostly for the same things I've used GitHub Copilot for, primarily to fix some CSS and to scaffold functions.
- [Whisper](https://platform.openai.com/docs/guides/speech-to-text): Whisper is a great resource to transcribe text. What's awesome is it can deal with many languages (we speak English, German, and Arabic at home).
- [GPT-4o](https://platform.openai.com/docs/guides/text-generation): I used GPT-4o to generate a main story and to generate DALL-E prompts for the individual pages. I really love the [structured output](https://platform.openai.com/docs/guides/structured-outputs) (hint: use Zod to stay type-safe all the way).
- [DALL-E](https://platform.openai.com/docs/guides/images): I used DALL-E to generate the images. Sadly, it doesn't have a way to keep the characters consistent. I might use some other GenAI tool in the future.

## Getting Started

1. Copy the `.env.example` file and name it `.env.local`.
2. Install packages: `npm i`.
3. Start the server: `npm run dev`.
