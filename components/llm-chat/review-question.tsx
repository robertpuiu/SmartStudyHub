"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { LLMConversation } from "@prisma/client";

interface Props {
  convo: LLMConversation & {
    student: { name: string | null };
    course: { title: string };
  };
}

export default function ReviewItem({ convo }: Props) {
  const [validated, setValidated] = useState(convo.validated);
  const [feedbackText, setFeedbackText] = useState(convo.feedbackText || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: convo.id,
        validated,
        feedbackText: feedbackText.trim() || null,
      }),
    });
    setSaving(false);
  };

  return (
    <div className="border rounded p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            Student: {convo.student.name ?? "—"}
          </p>
          <p className="text-sm text-gray-600">Curs: {convo.course.title}</p>
          <p className="text-xs text-blue-600 font-medium">
            Tag: {convo.tag.replace("_", " ")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id={`val-${convo.id}`}
            type="checkbox"
            checked={validated}
            onChange={(e) => setValidated(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor={`val-${convo.id}`} className="text-sm">
            Validat
          </label>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="font-semibold">Întrebare:</p>
        <p className="whitespace-pre-wrap">{convo.questionText}</p>

        <p className="font-semibold mt-2">Răspuns LLM:</p>
        <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
          {convo.answerText}
        </pre>

        <textarea
          className="w-full border rounded p-2 mt-2"
          rows={3}
          placeholder="Comentariu / corectură..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />

        <Button onClick={handleSave} disabled={saving} className="mt-2">
          {saving ? "Se salvează..." : "Salvează Feedback"}
        </Button>
      </div>
    </div>
  );
}
