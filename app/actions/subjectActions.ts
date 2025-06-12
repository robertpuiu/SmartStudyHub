"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSubjectFormAction(formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session) redirect("/signin");
  if (role !== "PROFESSOR" && role !== "ADMIN")
    throw new Error(
      "Unauthorized action: Only professors or admins can create subjects."
    );

  const slug =
    formData.get("name")?.toString().toLowerCase().replace(/\s+/g, "-") || "";
  await prisma.subject.create({
    data: {
      name: formData.get("name") as string,
      slug: slug,
      description: formData.get("description") as string,
      ownerId: session?.user?.id as string,
    },
  });
  revalidatePath("/subject");
  redirect(`/subject/${slug}`);
}
