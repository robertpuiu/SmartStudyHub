import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getRole } from "@/lib/auth";
import { UploaderToggle } from "../crafted-components/upload/uploader";
import MaterialsList from "../crafted-components/materials/materials-list";
import Feed from "../llm-chat/feed";
import SingleStreamingQA from "../llm-chat/llm-chat";

export default async function ModuleListAccordion({
  courseId,
}: {
  courseId: string;
}) {
  const role = await getRole();
  const modules = await prisma.module.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" },
  });

  if (modules.length === 0) {
    return (
      <Card className="max-w-lg mx-auto mt-6">
        <CardHeader>
          <CardTitle>No Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            No modules found for this course.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto mt-6 shadow-md">
      <CardHeader>
        <CardTitle>Modules</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {modules.map((mod, idx) => (
            <AccordionItem key={mod.id} value={`module-${mod.id}`}>
              <AccordionTrigger>
                {idx + 1}. {mod.title}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                {role === "PROFESSOR" && (
                  <UploaderToggle
                    courseId={courseId}
                    attachedToId={mod.id}
                    ownerId={mod.ownerId}
                    attachedToType="Module"
                  />
                )}
                <p className="whitespace-pre-line">{mod.description}</p>
                <div className="flex justify-end space-x-2">
                  <Link href={`/module/${mod.id}`}>
                    <Button variant="link">View</Button>
                  </Link>
                  <Link href={`/module/${mod.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                </div>
                <MaterialsList attachedToType="Module" attachedToId={mod.id} />
                <SingleStreamingQA
                  courseId={courseId}
                  contextType="module"
                  contextId={mod.id}
                />
                <Feed courseId={courseId} moduleId={mod.id} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
