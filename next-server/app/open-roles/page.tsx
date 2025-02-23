import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const ROLES = [
  {
    title: 'Product Engineer',
    description: 'Build and improve PostHog\'s core product features across our product analytics, session recording etc..',
    link: 'https://posthog.com/careers/product-engineer',
  },
  {
    title: 'Technical Account Executive',
    description: 'Drive multi-product adoption and help customers succeed with PostHog\'s suite of product analytics tools.',
    link: 'https://posthog.com/careers/technical-account-executive',
  },
  {
    title: 'ClickHouse Engineer',
    description: 'Manage and optimize PostHog\'s ClickHouse infrastructure, improving query performance and scalability.',
    link: 'https://posthog.com/careers/clickhouse-engineer',
  },
  {
    title: 'Speculative Application',
    description: 'Don\'t see a role that fits? Send us a speculative application and let us know how you could contribute to PostHog.',
    link: 'https://posthog.com/careers/speculative-application',
  }
];

export default function OpenRolesPage() {
  return (
    <div className="min-h-screen flex flex-col p-8 pt-36">
      <main className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Open Roles at PostHog</h1>
          <p className="text-xl text-gray-600">
            Join the team building the future of product analytics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {ROLES.map((role) => (
            <Link
              key={role.title}
              href={role.link}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-[1.02]"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center text-primary">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
