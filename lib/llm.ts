import { textOfPDFMaterials } from "@/lib/s3Client";
import { openai } from "@ai-sdk/openai";
import { CognitiveFocus } from "@prisma/client";
import { generateText, streamText } from "ai";
import { prisma } from "./db";

const model = openai("gpt-4o-mini");

export async function getCognitiveTag(
  question: string
): Promise<CognitiveFocus> {
  const { text } = await generateText({
    model,
    prompt: `You are a cognitive tagger. Given the question, return the most relevant cognitive tag from the following list: [Definition, Concrete Example, Conceptual Reasoning, Edge Cases, Comparison, Other]. Return just 1 word, the tag. Question: "${question}"`,
  });

  const raw = text
    .trim()
    .replace(/\s+/g, "_") // spații → underscore
    .replace(/[^A-Z_]/gi, "") // filtrează caractere nea-z
    .toUpperCase();

  if (!Object.values(CognitiveFocus).includes(raw as CognitiveFocus)) {
    throw new Error(`Invalid cognitive tag: "${text.trim()}"`);
  }

  return raw as CognitiveFocus;
}
async function gatherContextText(contextId: string): Promise<string> {
  const materials = await prisma.material.findMany({
    where: { attachedToId: contextId },
    orderBy: { createdAt: "desc" },
  });

  const pdfs = materials.filter((m) => m.type === "application/pdf");
  const pdfTexts = await textOfPDFMaterials(
    pdfs.map((m) => ({ fileKey: m.fileKey! }))
  );

  const links = materials
    .filter((m) => m.type === "link")
    .map((m) => `Refer to: ${m.url}`);

  return [...pdfTexts, ...links].join("\n\n---\n\n");
}

export interface ConversationParams {
  userQuestion: string;
  courseId: string;
  contextType: "course" | "module";
  contextId: string;
  studentId: string;
}

export async function initiateLLMConversation(params: ConversationParams) {
  const { userQuestion, courseId, contextType, contextId, studentId } = params;

  const tag = await getCognitiveTag(userQuestion);

  const convo = await prisma.lLMConversation.create({
    data: {
      studentId,
      questionText: userQuestion,
      courseId,
      moduleId: contextType === "module" ? contextId : null,
      contextlocation: contextType,
      tag,
    },
  });

  const allContext = await gatherContextText(contextId);

  const result = streamText({
    model,
    system: "You are a helpful assistant. Use only the provided materials.",
    prompt: `${userQuestion}\n\nMaterials:\n${allContext}`,
    temperature: 0.2,
  });

  (async () => {
    let fullAnswer = "";
    for await (const part of result.textStream) {
      fullAnswer += part;
    }
    await prisma.lLMConversation.update({
      where: { id: convo.id },
      data: { answerText: fullAnswer },
    });
  })();

  return result;
}
