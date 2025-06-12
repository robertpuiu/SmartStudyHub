"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCourseFormAction(formData: FormData) {
  const session = await auth();
  if (!session) redirect("/sign-in");
  const role = session?.user.role;
  if (role !== "PROFESSOR" && role !== "ADMIN")
    throw new Error(
      "Unauthorized action: Only professors or admins can create courses."
    );

  const slug =
    formData.get("title")?.toString().toLowerCase().replace(/\s+/g, "-") || "";
  await prisma.course.create({
    data: {
      title: formData.get("title") as string,
      slug: slug,
      description: formData.get("description") as string,
      subjectId: formData.get("subjectId") as string,
      ownerId: session?.user.id as string,
    },
  });

  revalidatePath("/course");
  redirect(`/course/${slug}`);
}
