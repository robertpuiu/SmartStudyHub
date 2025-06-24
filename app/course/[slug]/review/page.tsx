import ReviewClient from "@/components/llm-chat/review-client";
import { prisma } from "@/lib/db";

export default async function ReviewPage() {
  //   const session = await getServerSession(authOptions);
  //   if (!session || session.user.role !== "PROFESSOR") {
  //     return <p>Acces interzis.</p>;
  //   }

  const convos = await prisma.lLMConversation.findMany({
    where: { validated: false },
    include: { student: true, course: true },
    orderBy: { createdAt: "desc" },
  });

  return <ReviewClient convos={convos} />;
}
