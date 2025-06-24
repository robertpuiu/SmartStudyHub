import ReviewItem from "@/components/llm-chat/review-question";
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

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-semibold mb-4">Revizuire Răspunsuri LLM</h1>
      {convos.length === 0 ? (
        <p>Nu există răspunsuri de revizuit.</p>
      ) : (
        convos.map((c) => <ReviewItem key={c.id} convo={c} />)
      )}
    </div>
  );
}
