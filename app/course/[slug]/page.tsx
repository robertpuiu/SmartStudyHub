import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ModuleList from "@/components/course-modules/ModuleList";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UploaderToggle } from "@/components/crafted-components/upload/uploader";
import MaterialsList from "@/components/crafted-components/materials/materials-list";
import ShowCreateModuleForm from "@/components/course-modules/ShowCreateModuleForm";
import LLMchat from "@/components/llm-chat/llm-chat";

export default async function CoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const username = session?.user?.name || session?.user?.email || "Guest";
  if (!session) redirect("/sign-in");
  const course = await prisma.course.findUnique({
    where: { slug },
  });

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h2 className="text-2xl font-semibold mb-4">Course Not Found</h2>
        <Link href="/course">
          <Button variant="outline">Back to Courses</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto w-5/6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">{course.title}</CardTitle>
          <CardDescription className="mb-4">
            Created on {course.createdAt.toLocaleDateString()}
            <p> {course.description ?? "No description provided."}</p>
          </CardDescription>
          {role === "PROFESSOR" && (
            <div className="flex justify-around">
              <UploaderToggle
                courseId={course.id}
                attachedToId={course.id}
                ownerId={course.ownerId}
                attachedToType="Course"
              />
              <ShowCreateModuleForm courseId={course.id} />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <MaterialsList attachedToType="Course" attachedToId={course.id} />
          <ModuleList courseId={course.id} />
          <LLMchat
            courseId={course.id}
            contextType="course"
            contextId={course.id}
            username={username}
          />
          {/* <Chat /> */}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/course">
            <Button variant="outline">← Back to Courses</Button>
          </Link>
          <div className="space-x-2">
            <Link href={`/course/${slug}/edit`}>
              <Button variant="secondary">Edit Course</Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
