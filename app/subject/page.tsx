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

export default async function SubjectPage() {
  const role = await getRole();
  const subjects = await prisma.subject.findMany();

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Subjects</h1>
        {role === "PROFESSOR" || role === "ADMIN" ? (
          <Button variant="secondary" asChild>
            <Link href="/subject/create">Create Subject</Link>
          </Button>
        ) : null}
      </header>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{subject.name}</CardTitle>
              <CardDescription>
                {subject.description ?? "No description."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Created: {subject.createdAt.toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="link" asChild>
                <Link href={`/subject/${subject.slug}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
