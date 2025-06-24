import { initiateLLMConversation } from "@/lib/llm";
import { auth } from "@/lib/auth";

export const maxDuration = 30;

export const POST = auth(async (req) => {
  if (!req?.auth) {
    return new Response("Not authenticated", { status: 401 });
  }
  const body = await req.json();
  // console.log("Authenticated user:", req.auth.user);
  console.log("Received body:", body);

  const { courseId, contextType, contextId, messages } = body;
  const studentId = req.auth.user.id;
  const userQuestion = messages[0].content as string;

  const llmStream = await initiateLLMConversation({
    userQuestion,
    courseId,
    contextType,
    contextId,
    studentId,
  });

  return llmStream.toDataStreamResponse();
});
