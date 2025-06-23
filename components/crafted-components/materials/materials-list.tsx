// components/crafted-components/materials/MaterialsList.tsx
import { prisma } from "@/lib/db";
import Link from "next/link";

interface MaterialsListProps {
  attachedToType: string;
  attachedToId: string;
}

export default async function MaterialsList({
  attachedToType,
  attachedToId,
}: MaterialsListProps) {
  const materials = await prisma.material.findMany({
    where: { attachedToId },
    orderBy: { createdAt: "asc" },
  });

  if (materials.length === 0) {
    return (
      <div className="max-w-lg mx-auto mt-6">
        <p className="text-gray-500">
          No materials found for this {attachedToType.toLowerCase()}.
        </p>
      </div>
    );
  }

  return (
    <div className=" mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {attachedToType} Materials
      </h2>
      <ul className="space-y-2">
        {materials.map((material) => (
          <li key={material.id} className="border p-4 rounded-md">
            <Link
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {material.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
