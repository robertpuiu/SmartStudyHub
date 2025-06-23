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
        title: body.title as string,
        courseId: body.courseId as string,
        ownerId: req.auth.user.id as string,
        name: body.fileName as string,
        type: body.type as string,
        fileKey: body.fileKey as string,
        attachedToId: body.attachedToId,
        url: body.url as string,
        attachedToType: body.attachedToType as string,
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
