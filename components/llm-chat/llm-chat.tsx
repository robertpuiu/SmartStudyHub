"use client";

import { useRef, useEffect } from "react";
import { useChat } from "ai/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SingleStreamingQAProps {
  courseId: string;
  contextType: string;
  contextId: string;
  username: string;
}

export default function SingleStreamingQA({
  courseId,
  contextType,
  contextId,
}: SingleStreamingQAProps) {
  // useChat handles streaming internally
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: { courseId, contextType, contextId },
    });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when answer appears
  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Get only the assistant's answer (single)
  const assistantMessage = messages.find((m) => m.role === "assistant");

  return (
    <Card className="w-full max-w-4xl mx-auto flex flex-col space-y-4">
      <CardHeader>
        <CardTitle>{`Ask about this ${contextType}...`}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Type question here..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading || !!assistantMessage}
          />
          <Button type="submit" disabled={isLoading || !!assistantMessage}>
            {isLoading ? "Loading…" : "Send"}
          </Button>
        </form>

        {assistantMessage && (
          <div className="flex items-start space-x-2 mt-4">
            <Avatar>
              <AvatarImage src="/logo.png" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <ScrollArea
              ref={scrollRef}
              className=" p-2 bg-gray-100 rounded flex-1"
            >
              <p className="whitespace-pre-wrap text-gray-800">
                {assistantMessage.content}
              </p>
            </ScrollArea>
          </div>
        )}
      </CardContent>

      <CardFooter className="text-sm text-gray-500">
        {assistantMessage
          ? "Răspuns generat. Reîncarcă pagina pentru o nouă întrebare."
          : " "}
      </CardFooter>
    </Card>
  );
}
