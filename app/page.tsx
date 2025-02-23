import Link from 'next/link'

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <main className="max-w-2xl text-center">
                <h1 className="text-4xl font-bold mb-6">Welcome to VoiceAI</h1>
                <p className="text-xl mb-8 text-gray-600">
                    Experience natural conversations with AI using your voice
                </p>
                <Link
                    href="/voice"
                    className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Try Voice Chat
                </Link>
            </main>
        </div>
    );
}
