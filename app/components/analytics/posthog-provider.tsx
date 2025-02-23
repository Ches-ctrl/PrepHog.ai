'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export function PostHogProvider() {
  useEffect(() => {
    // Initialize PostHog
    posthog.init('phc_OzoEBK0CxcLxYpFlVNi4Bh78pao7J111Oh0pTNowkFW', {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
    })
  }, [])

  return null
}
