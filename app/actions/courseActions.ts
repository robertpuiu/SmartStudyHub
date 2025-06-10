"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCourseFormAction(formData: FormData) {
  // validate permissions

  await prisma.course.create({
    data: {
      title: formData.get("title") as string,
      slug: formData.get("title")?.toString().toLowerCase().replace(/\s+/g, "-") || "",
      description: formData.get("description") as string,
      subjectId: formData.get("subjectId") as string,
    },
  });

  revalidatePath("/course");
}