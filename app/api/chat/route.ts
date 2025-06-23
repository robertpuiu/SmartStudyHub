/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/db";
import { textOfPDFMaterials } from "@/lib/s3Client";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

//const model = openai("gpt-4o-mini");

const fetchMaterials = async (attachedToId: string) => {
  return prisma.material.findMany({
    where: {
      attachedToId: attachedToId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export async function POST(req: Request) {
  const body = await req.json();
  const { courseId, contextType, contextId } = body;
  const message = body.messages[0].content;

  const materials = await fetchMaterials(contextId);
  const pdfMaterials = materials.filter((m) => m.type === "application/pdf");
  const linkMaterials = materials.filter((m) => m.type === "link");

  const pdfTexts = await textOfPDFMaterials(
    pdfMaterials.map((material) => ({ fileKey: material.fileKey }))
  );

  const systemIntro = {
    role: "system" as const,
    content:
      "You are a helpful assistant. Use only the materials provided below to answer the user’s question.",
  };

  // Map each PDF text into a system message
  const pdfMessages = pdfTexts.map((text) => ({
    role: "system" as const,
    content: text,
  }));

  const allPdfText = pdfTexts.join("\n\n---\n\n");

  // If you want to pass links directly rather than crawling them:
  // const linkMessages = linkMaterials.map((m) => ({
  //   role: "system" as const,
  //   content: `Refer to: ${m.url}`,
  // }));

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system:
      "You are a helpful assistant. Use only the materials provided below to answer the user’s question.",
    prompt: message + "\n\nmaterials: " + allPdfText,
    temperature: 0.2,
  });

  (async () => {
    for await (const textPart of result.textStream) {
      console.log(textPart);
    }
    console.log("Stream complet.");
  })();

  // 5. Return the streaming response
  return result.toDataStreamResponse();
}
