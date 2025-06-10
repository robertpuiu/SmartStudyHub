"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createSubjectFormAction(formData: FormData) {
// validate permissions 

 await prisma.subject.create({
    data: {
        name: formData.get("name") as string,
        slug: formData.get("name")?.toString().toLowerCase().replace(/\s+/g, "-") || "",
        description: formData.get("description") as string,
    },
     });

     revalidatePath("/subject");
 }