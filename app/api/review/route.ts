import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const POST = auth(async (req) => {
  //   if (req?.auth?.user.role !== "PROFESSOR") {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  console.log("Authenticated user:", req?.auth?.user);
  const { conversationId, validated, feedbackText } = await req.json();

  const update = await prisma.lLMConversation.update({
    where: { id: conversationId },
    data: {
      validated,
      feedbackText: feedbackText || null,
      hasFeedback: Boolean(feedbackText),
      professorId: req?.auth?.user?.id || null,
    },
  });

  return Response.json({ success: true, updated: update });
});
