import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/db";

export type FeedProps = {
  courseId: string;
  moduleId?: string;
};

export default async function Feed({ courseId, moduleId }: FeedProps) {
  const whereClause = moduleId ? { courseId, moduleId } : { courseId };

  const convos = await prisma.lLMConversation.findMany({
    where: whereClause,
    include: { student: true },
    orderBy: { createdAt: "desc" },
  });

  if (convos.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500 my-6">
        Nu există întrebări în feed.
      </p>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2 my-6">
      <h2 className="text-lg font-semibold mb-4"> LLM Questions Feed</h2>
      {convos.map((c) => (
        <AccordionItem key={c.id} value={c.id} className="border rounded-lg">
          <AccordionTrigger className="flex justify-between items-center px-4 py-2">
            <div className="flex-1 text-left space-y-1">
              <p className="text-sm text-gray-600">
                {c.student?.name ?? "Student"} •{" "}
                {formatDistanceToNow(c.createdAt, { addSuffix: true })}
              </p>
              <p className="font-medium">{c.questionText}</p>
            </div>
            <div className="ml-4">
              {c.validated ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : c.hasFeedback ? (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              ) : (
                <Clock className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </AccordionTrigger>

          <AccordionContent className="bg-gray-50 px-4 py-3">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Răspuns LLM:</h4>
                <p className="whitespace-pre-wrap text-gray-800">
                  {c.answerText}
                </p>
              </div>
              {c.hasFeedback && c.feedbackText && (
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h4 className="text-sm font-semibold text-yellow-800">
                    Comentariu Profesor:
                  </h4>
                  <p className="whitespace-pre-wrap text-yellow-900">
                    {c.feedbackText}
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
