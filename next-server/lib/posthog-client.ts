import { OpenAI } from '@posthog/ai'
import { PostHog } from 'posthog-node'

const phClient = new PostHog(
  process.env.POSTHOG_API_KEY!,
  { host: process.env.POSTHOG_HOST || 'https://eu.i.posthog.com' }
)

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  posthog: phClient,
})

// Ensure cleanup on app termination
process.on('beforeExit', async () => {
  await phClient.shutdown()
})
