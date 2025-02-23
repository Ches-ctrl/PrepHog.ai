import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export default function RolePage({ params }: { params: { role: string } }) {
  const roleName = params.role;
  const markdownPath = path.join(process.cwd(), 'public', 'posthog-jobs', `${roleName}.md`);

  // Check if file exists
  if (!fs.existsSync(markdownPath)) {
    notFound();
  }

  // Read and parse markdown content
  const content = fs.readFileSync(markdownPath, 'utf8');
  const htmlContent = marked(content);

  return (
    <div className="min-h-screen flex flex-col p-8 pt-36">
      <main className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <Link
            href="/open-roles"
            className="text-primary hover:text-primary-dark inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to all roles
          </Link>
        </div>

        <article className="prose prose-primary max-w-none">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </article>

        <div className="mt-12 text-center">
          <a
            href={`https://posthog.com/careers/${roleName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg transition-colors"
          >
            Apply on PostHog
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </div>
      </main>
    </div>
  );
}
