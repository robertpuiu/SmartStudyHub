import { createCourseFormAction } from "@/app/actions/courseActions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CreateCoursePage() {
  const session = await auth();
  const role = await session?.user?.role;
  if (role !== "PROFESSOR" && role !== "ADMIN") redirect("/course");

  const subjects = await prisma.subject.findMany({
    where: {
      ownerId: session?.user.id,
    },
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-2xl font-bold">Create Course</h1>
      <form action={createCourseFormAction}>
        <label className="block mb-2">
          Select Subject:
          <select
            name="subjectId"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Course Title:
          <input
            type="text"
            name="title"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-4">
          Description:
          <textarea
            name="description"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}
