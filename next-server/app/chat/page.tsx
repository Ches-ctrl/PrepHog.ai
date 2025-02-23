'use client';

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Thread } from "@/components/assistant-ui/thread";

export default function ChatPage() {
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="fixed inset-y-20 inset-x-2 grid grid-cols-[240px_1fr] bg-background">
        <ThreadList />
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
};
