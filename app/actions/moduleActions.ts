"use server";

import { prisma } from "@/lib/db";

export async function createModuleFormAction(formData: FormData) {
    // validate permissions
    console.log("Creating module with form data:", formData);

    await prisma.module.create({
        data: {
        title: formData.get("title") as string,
        slug: formData.get("title")?.toString().toLowerCase().replace(/\s+/g, "-") || "",
        description: formData.get("description") as string,
        courseId: formData.get("courseId") as string,
        },
    });
    
   // revalidatePath("/module");
}