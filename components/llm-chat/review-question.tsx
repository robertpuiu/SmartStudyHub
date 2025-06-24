"use client";

import { useState } from "react";
import type { LLMConversation } from "@prisma/client";

interface Props {
  convo: LLMConversation & {
    student: { name: string | null };
    course: { title: string };
  };
}

export default function ReviewItem({ convo }: Props) {
  const [validated, setValidated] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
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
    // opțional: refetch sau elimină din listă
  };

  return (
    <div className="border rounded p-4 mb-4 shadow-sm">
      <p className="text-gray-600 text-sm">
        Student: {convo.student.name || "—"} | Curs: {convo.course.title}
      </p>
      <p className="mt-2">
        <span className="font-semibold">Întrebare:</span> {convo.questionText}
      </p>
      <pre className="mt-2 bg-gray-50 p-3 rounded whitespace-pre-wrap">
        {convo.answerText}
      </pre>

      <div className="mt-4 space-y-2">
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Comentariu / corectură..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={validated}
            onChange={(e) => setValidated(e.target.checked)}
          />
          <span>Marchează ca Validat</span>
        </label>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Salvez..." : "Salvează Feedback"}
        </button>
      </div>
    </div>
  );
}
