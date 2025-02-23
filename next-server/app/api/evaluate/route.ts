import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log('=== Evaluate endpoint called ===');

  try {
    const body = await req.json();
    console.log('Request body:', body);
    const { question, answer } = body;

    if (!question || !answer) {
      console.error('Missing question or answer');
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    console.log('Generating feedback for:', { question, answer });
    try {
      const { text } = await generateText({
        model: openai("gpt-4"),
        system: "You are an expert interview coach for PostHog. Evaluate the following Q&A pair from a job interview practice session. Provide concise, actionable feedback focusing on: 1) Content quality 2) Delivery effectiveness 3) Areas for improvement. Keep the feedback brief and constructive.",
        prompt: `Question: ${question}\nAnswer: ${answer}`,
        maxSteps: 1,
      });

      console.log('Generated feedback:', text);

      if (!text || typeof text !== 'string') {
        console.error('Invalid feedback generated:', text);
        return NextResponse.json({ error: "Invalid feedback generated" }, { status: 500 });
      }

      const response = { feedback: text };
      console.log('Sending response:', response);
      return NextResponse.json(response);
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in evaluate endpoint:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to evaluate response"
    }, { status: 500 });
  }
}
