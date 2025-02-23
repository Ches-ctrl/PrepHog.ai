import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
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

export async function POST(req: Request) {
  const { conversationId } = await req.json();
  console.log('Received request to send transcript for conversation:', conversationId);

  if (!conversationId) {
    console.error('No conversation ID provided');
    return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
  }

  try {
    // Fetch transcript from ElevenLabs
    console.log('Fetching transcript from ElevenLabs...');
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/${conversationId}/transcript`,
      {
        headers: {
          "xi-api-key": process.env.XI_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to fetch transcript:', error);
      throw new Error(`Failed to fetch transcript: ${error}`);
    }

    const transcript = await response.json();
    console.log('Successfully fetched transcript');

    // Send email using Pica
    console.log('Preparing to send email via Pica...');
    const emailPrompt = `Send an email to charles.cheesman1@gmail.com with the following transcript from their conversation:\n\n${JSON.stringify(transcript, null, 2)}`;

    await execute(emailPrompt);
    console.log('Email sent successfully via Pica');

    return NextResponse.json({ success: true, message: "Transcript email sent successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to process transcript";
    console.error("Error processing transcript request:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
