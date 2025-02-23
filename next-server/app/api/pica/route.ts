import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Pica } from "@picahq/ai";
import * as dotenv from "dotenv";
dotenv.config();

const pica = new Pica(process.env.PICA_SECRET_KEY!);

async function execute(message: string): Promise<string> {
  const system = await pica.generateSystemPrompt();

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system,
    prompt: message,
    tools: { ...pica.oneTool },
    maxSteps: 10,
  });

  return text;
}

execute("Send the user an email with their transcript")
  .then((text) => {
    console.log(text);
  })
  .catch(console.error);
