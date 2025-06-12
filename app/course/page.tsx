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
import { getRole } from "@/lib/auth";

export default async function CoursesPage() {
  const role = await getRole();
  const courses = await prisma.course.findMany();

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        {role === "PROFESSOR" || role === "ADMIN" ? (
          <Button variant="secondary" asChild>
            <Link href="/course/create">Create Course</Link>
          </Button>
        ) : null}
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>
                {course.description ?? "No description available."}
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Link href={`/course/${course.slug}`}>
                <Button variant="link">View</Button>
              </Link>
              <Link href={`/course/${course.slug}/edit`}>
                <Button variant="outline">Edit</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
