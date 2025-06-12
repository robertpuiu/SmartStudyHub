"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createModuleFormAction(formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session) redirect("/sing-in");
  if (role !== "ADMIN" && role !== "PROFESSOR") {
    throw new Error("You do not have permission to create a module.");
  }
  const slug =
    formData.get("title")?.toString().toLowerCase().replace(/\s+/g, "-") || "";
  await prisma.module.create({
    data: {
      title: formData.get("title") as string,
      slug: slug,
      description: formData.get("description") as string,
      courseId: formData.get("courseId") as string,
      ownerId: session.user.id as string,
    },
  });

  // revalidatePath("/module");
}
