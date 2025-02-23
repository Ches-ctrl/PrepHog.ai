'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PhonePage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('https://fdf8-5-148-87-204.ngrok-free.app/outbound-call', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    prompt: "You are Hogbert, a friendly hedgehog interviewer from PostHog. You are conducting a practice interview with the candidate. Be friendly and professional, and help them practice their interview skills.",
                    first_message: "Hi there! I'm Hogbert from PostHog. Thank you for choosing to practice your interview with me today. Shall we begin with you telling me a bit about yourself?",
                    number: phoneNumber
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to initiate call');
            }

            setSuccess(true);
        } catch {
            setError('Failed to initiate call. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-8 pt-36">
            <main className="max-w-2xl mx-auto text-center">
                <Image
                    src="/hogbert-interviews.png"
                    alt="Hogbert - Your interview practice companion"
                    width={200}
                    height={200}
                    className="mx-auto mb-8 rounded-2xl"
                    priority
                />
                <h1 className="text-4xl font-bold mb-3">Phone Interview Practice</h1>
                <p className="text-xl mb-8 text-gray-600">
                    Enter your phone number below and Hogbert will give you a call
                </p>

                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="mb-6">
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+1234567890"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Please enter your phone number in international format (e.g., +1234567890)
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg transition-colors ${
                            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Initiating call...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                Start Interview
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
                            Call initiated! You should receive a call shortly.
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
}
