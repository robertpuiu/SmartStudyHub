import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = auth(async (req) => {
  try {
    if (!req.auth) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    // check role

    const body = await req.json();

    const createMaterialInDB = await prisma.material.create({
      data: {
        title: body.title as string, // Assuming body.title is the title of the material
        courseId: body.courseId as string, // Assuming body.courseId is the ID of the course
        ownerId: req.auth.user.id as string, // Assuming req.auth.user.id is the user ID
        name: body.fileName as string,
        type: body.fileType as string, // Assuming body.fileType is the type of the file (e.g., "pdf", "docx", etc.)
        fileKey: body.fileKey as string,
        attachedToId: body.attachedToId, // This should be the ID of the course or module
      },
    });

    prisma.course.update({
      where: { id: body.courseId as string },
      data: {
        Material: {
          connect: { id: createMaterialInDB.id },
        },
      },
    });

    return NextResponse.json(
      { message: "Material created successfully", data: createMaterialInDB },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/materials/create:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
});
