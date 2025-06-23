import { prisma } from "@/lib/db";

// add auth and [id] route
export async function DELETE() {
  try {
    const dbResponse = await prisma.material.deleteMany({
      where: {},
    });
    console.log("All materials deleted:", dbResponse);
    return new Response("All materials deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting all materials:", error);
    return new Response("Failed to delete materials", { status: 500 });
  }
}
