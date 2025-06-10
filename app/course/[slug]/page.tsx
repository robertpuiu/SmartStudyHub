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
import CreateModuleForm from "@/components/course-modules/CreateModule";
import ModuleList from "@/components/course-modules/ModuleList";

export default async function CoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

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
          <CardDescription>
            Created on {course.createdAt.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">
            {course.description ?? "No description provided."}
          </p>

          <CreateModuleForm courseId={course.id}/>
          <ModuleList courseId={course.id} />
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