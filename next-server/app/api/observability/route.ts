import { OpenAI } from '@posthog/ai'
import { PostHog } from 'posthog-node'
import { NextResponse } from 'next/server'

const phClient = new PostHog(
  'phc_OzoEBK0CxcLxYpFlVNi4Bh78pao7J111Oh0pTNowkFW',
  { host: 'https://eu.i.posthog.com' }
);

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  posthog: phClient,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    // Track that we received a completion request
    console.log('📊 Tracking completion request...')
    await phClient.capture({
      distinctId: 'test-user',
      event: 'completion_requested',
      properties: {
        prompt_length: prompt.length,
        prompt: prompt // Adding prompt for easier verification
      }
    })
    console.log('✅ Tracked completion request')

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    // Track successful completion
    console.log('📊 Tracking successful completion...')
    await phClient.capture({
      distinctId: 'test-user',
      event: 'completion_succeeded',
      properties: {
        response_length: completion.choices[0].message.content?.length || 0,
        prompt: prompt // Adding prompt for correlation
      }
    })
    console.log('✅ Tracked successful completion')

    return NextResponse.json({ result: completion.choices[0].message.content })
  } catch (error) {
    // Track errors
    console.log('📊 Tracking error...')
    await phClient.capture({
      distinctId: 'test-user',
      event: 'completion_failed',
      properties: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
    console.log('✅ Tracked error')

    return NextResponse.json(
      { error: 'Failed to generate completion' },
      { status: 500 }
    )
  }
}

// Ensure events are flushed when the server shuts down
phClient.shutdown()
