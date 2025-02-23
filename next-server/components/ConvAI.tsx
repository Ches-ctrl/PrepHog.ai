"use client"

import {Button} from "@/components/ui/button";
import * as React from "react";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Conversation} from "@11labs/client";
import {cn} from "@/lib/utils";
import { FeedbackModal } from "./FeedbackModal";
import posthog from 'posthog-js'
import Image from 'next/image'

// Initialize PostHog client
if (typeof window !== 'undefined') {
    posthog.init('phc_OzoEBK0CxcLxYpFlVNi4Bh78pao7J111Oh0pTNowkFW', {
        api_host: 'https://eu.i.posthog.com'
    })
}

async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({audio: true})
        return true
    } catch {
        console.error('Microphone permission denied')
        return false
    }
}

async function getSignedUrl(): Promise<string> {
    const response = await fetch('/api/signed-url')
    if (!response.ok) {
        throw Error('Failed to get signed url')
    }
    const data = await response.json()
    return data.signedUrl
}

interface ConversationMessage {
    message: string | { message: string };
    source?: string;
}

export function ConvAI() {
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState<string>("")
    const [feedback, setFeedback] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isTestMode, setIsTestMode] = useState(false)
    const [conversationId, setConversationId] = useState<string | null>(null)

    async function evaluateQA(question: string, answer: string) {
        console.log('Evaluating Q&A:', { question, answer });
        setError(null);
        try {
            const response = await fetch('/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, answer }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to evaluate response');
            }

            if (!data.feedback) {
                throw new Error('No feedback received from server');
            }

            console.log('Received feedback:', data.feedback);
            setFeedback(data.feedback);
        } catch (error) {
            console.error('Error evaluating:', error);
            setError(error instanceof Error ? error.message : 'Failed to evaluate response');
            setFeedback(null);
        }
    }

    async function startConversation() {
        const hasPermission = await requestMicrophonePermission()
        if (!hasPermission) {
            alert("No permission")
            return;
        }
        const signedUrl = await getSignedUrl()
        const conversation = await Conversation.startSession({
            signedUrl: signedUrl,
            onConnect: () => {
                console.log('Connected to conversation');
                setIsConnected(true)
                setIsSpeaking(true)

                // Track conversation start
                posthog.capture('$ai_generation', {
                    $ai_provider: 'elevenlabs',
                    $ai_model: 'convai',
                    $ai_trace_id: Date.now().toString(),
                    conversation_started: true
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from conversation');
                setIsConnected(false)
                setIsSpeaking(false)
                setFeedback(null)
                setConversationId(null)

                // Track conversation end
                posthog.capture('$ai_generation', {
                    $ai_provider: 'elevenlabs',
                    $ai_model: 'convai',
                    conversation_ended: true
                });
            },
            onError: (error) => {
                console.log('Conversation error:', error)
                alert('An error occurred during the conversation')
            },
            onModeChange: ({mode}) => {
                console.log('Mode changed:', mode);
                setIsSpeaking(mode === 'speaking')
            },
            onMessage: (msg: ConversationMessage) => {
                console.log('Received message:', msg);
                const messageContent = typeof msg.message === 'string' ? msg.message : msg.message.message;
                const source = (msg.source || '').toLowerCase();
                console.log('Processing message:', { content: messageContent, source, currentQuestion });

                // Track each message with PostHog
                posthog.capture('$ai_generation', {
                    $ai_provider: 'elevenlabs',
                    $ai_model: 'convai',
                    $ai_input: source === 'user' ? messageContent : undefined,
                    $ai_output_choices: source === 'assistant' || source === 'ai' ? [{ content: messageContent }] : undefined,
                    message_source: source,
                    conversation_id: conversationId
                });

                // Handle system messages
                if (source === 'system') {
                    console.log('Processing system message:', messageContent);
                    try {
                        // Try parsing as JSON first
                        const data = JSON.parse(messageContent);
                        console.log('Parsed system message:', data);
                        if (data.conversation_id) {
                            console.log('Found conversation_id in JSON:', data.conversation_id);
                            setConversationId(data.conversation_id);
                        } else if (data.metadata?.conversation_id) {
                            console.log('Found conversation_id in metadata:', data.metadata.conversation_id);
                            setConversationId(data.metadata.conversation_id);
                        }
                    } catch {
                        // If not JSON, try looking for conversation ID in the string
                        console.log('Failed to parse as JSON, checking string content');
                        const match = messageContent.match(/conversation[_-]id["\s:]+([^"}\s]+)/i);
                        if (match) {
                            console.log('Found conversation_id in string:', match[1]);
                            setConversationId(match[1]);
                        } else {
                            console.log('No conversation ID found in system message');
                        }
                    }
                }
                // Handle AI messages (both 'ai' and 'assistant' sources)
                else if (source === 'ai' || source === 'assistant') {
                    // Immediately set the question without regex matching
                    const question = messageContent.replace(/['"]/g, '').trim();
                    console.log('Setting question from AI:', { question });
                    setCurrentQuestion(question);
                    // Clear previous feedback when new question is received
                    setFeedback(null);
                }
                // Handle user messages
                else if (source === 'user') {
                    console.log('Processing user message:', { hasCurrentQuestion: !!currentQuestion });
                    const answer = messageContent.trim().replace(/^"/, '').replace(/"$/, '');
                    if (answer && currentQuestion) {
                        console.log('Sending for evaluation:', { question: currentQuestion, answer });
                        evaluateQA(currentQuestion, answer).then(() => {
                            console.log('Evaluation complete, feedback state:', { feedback, error });
                        }).catch(err => {
                            console.error('Evaluation failed:', err);
                            setError('Failed to evaluate response');
                        });
                    } else {
                        console.log('Skipping evaluation - no answer or no current question:', {
                            hasAnswer: !!answer,
                            hasQuestion: !!currentQuestion
                        });
                    }
                } else {
                    console.log('Unknown message source:', source);
                }
            },
        })
        setConversation(conversation)
    }

    async function endConversation() {
        if (!conversation) {
            return
        }
        await conversation.endSession()

        // Send transcript email
        if (conversationId) {
            try {
                console.log('Sending transcript email for conversation:', conversationId);
                const response = await fetch('/api/transcript', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ conversationId }),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error('Failed to send transcript email:', data.error);
                    alert('Failed to send transcript email. Please try again later.');
                } else {
                    console.log('Transcript email sent successfully');
                    alert('Transcript has been sent to your email!');
                }
            } catch (error) {
                console.error('Error sending transcript:', error);
                alert('Failed to send transcript email. Please try again later.');
            }
        } else {
            console.warn('No conversation ID available for sending transcript');
        }

        setConversation(null)
        setFeedback(null)
        setCurrentQuestion("")
        setConversationId(null)
    }

    return (
        <div className={"flex justify-center items-center gap-x-4"}>
            <Card className={'rounded-3xl min-w-[300px]'}>
                <CardContent>
                    <CardHeader>
                        <CardTitle className={'text-center'}>
                            {isConnected ? (
                                isSpeaking ? `Agent is speaking` : 'Agent is listening'
                            ) : (
                                'Disconnected'
                            )}
                        </CardTitle>
                    </CardHeader>
                    <div className={'flex flex-col gap-y-4 text-center'}>
                        <div className={cn('relative w-48 h-48 mx-auto my-8',
                            isSpeaking ? 'animate-[bounce_2s_ease-in-out_infinite]' : (conversation && 'animate-pulse'))}>
                            <Image
                                src="/hogbert-engineers.png"
                                alt="Hedgehog assistant"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        <Button
                            variant={'outline'}
                            className={'rounded-full'}
                            size={"lg"}
                            disabled={conversation !== null && isConnected}
                            onClick={startConversation}
                        >
                            Start conversation
                        </Button>
                        <Button
                            variant={'outline'}
                            className={'rounded-full'}
                            size={"lg"}
                            disabled={conversation === null && !isConnected}
                            onClick={endConversation}
                        >
                            End conversation
                        </Button>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="space-y-2 border-t pt-4 mt-4">
                                <Button
                                    variant={'outline'}
                                    className={'rounded-full'}
                                    size={"sm"}
                                    onClick={() => setIsTestMode(!isTestMode)}
                                >
                                    {isTestMode ? 'Exit Test Mode' : 'Enter Test Mode'}
                                </Button>

                                {isTestMode && (
                                    <>
                                        <Button
                                            variant={'outline'}
                                            className={'rounded-full'}
                                            size={"sm"}
                                            onClick={() => {
                                                setCurrentQuestion("What is your experience with React?");
                                                setFeedback("Great response! You effectively highlighted your experience with React and specifically mentioned important aspects like state management and performance optimization. Consider also mentioning a specific project or challenge you overcame.");
                                                setError(null);
                                            }}
                                        >
                                            Test Success Feedback
                                        </Button>
                                        <Button
                                            variant={'outline'}
                                            className={'rounded-full'}
                                            size={"sm"}
                                            onClick={() => {
                                                setCurrentQuestion("What is your experience with React?");
                                                setFeedback(null);
                                                setError("Failed to generate feedback");
                                            }}
                                        >
                                            Test Error State
                                        </Button>
                                        <Button
                                            variant={'outline'}
                                            className={'rounded-full'}
                                            size={"sm"}
                                            onClick={() => evaluateQA(
                                                "What is your experience with React?",
                                                "I have 3 years of experience building React applications, including complex state management with Redux and performance optimization."
                                            )}
                                        >
                                            Test Live API
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <FeedbackModal
                feedback={feedback}
                isVisible={isConnected || isTestMode || !!feedback || !!error}
                currentQuestion={currentQuestion}
                error={error}
            />
        </div>
    )
}
