import type {Metadata} from "next";
import "./globals.css";
import Link from "next/link";
import {ElevenLabsLogo, GithubLogo} from "@/components/logos";
import Script from 'next/script';
import { PostHogSnippet } from "@/components/analytics/posthog-snippet";

export const metadata: Metadata = {
    title: "ConvAI",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={"h-full w-full"}>
        <body className={`antialiased w-full h-full lex flex-col`}>
            <PostHogSnippet />
            <div className="flex flex-col flex-grow w-full items-center justify-center sm:px-4">
                <nav
                    className={
                        "sm:fixed w-full top-0 left-0 grid grid-cols-2 py-4 px-8"
                    }
                >
                    <div className={"flex"}>
                      <h1 className="text-xl font-bold">PrepHog</h1>
                    </div>

                    <div className={"flex gap-4 justify-end"}>
                        <Link
                            href="https://github.com/ches-ctrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={"py-0.5"}
                            aria-label="View source on GitHub"
                        >
                            <GithubLogo
                                className={"w-5 h-5 hover:text-gray-500 text-[#24292f]"}
                            />
                        </Link>
                    </div>
                </nav>
                {children}
                <elevenlabs-convai agent-id="hVEfTWDCmB4yzOtC2Hx5"></elevenlabs-convai>
                <Script
                    src="https://elevenlabs.io/convai-widget/index.js"
                    strategy="afterInteractive"
                />
            </div>
        </body>
        </html>
    );
}
