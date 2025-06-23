import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/s3Client";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const uploeadRequestSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number(),
});

export const POST = auth(async (request) => {
  try {
    if (!request?.auth) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request?.json();
    const validation = uploeadRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { filename, contentType, size } = validation.data;

    const uniqueKey = `${uuidv4()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
      Metadata: {
        ownerId: body.ownerId,
        attachedToType: body.attachedToType,
        attachedToId: body.attachedToId,
      },
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360, // URL expires in 6 minutes
    });

    const response = {
      presignedUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
});
