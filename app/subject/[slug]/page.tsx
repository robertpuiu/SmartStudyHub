import { prisma } from "@/lib/db";

export default async function SubjectPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    // Fetch subject data based on the slug
    const subject = await prisma.subject.findUnique({
        where: { slug: slug },
    });

    if (!subject) {
        return <div>Subject not found</div>;
    }

    return (
        <div>
            <h1>{subject.name}</h1>
            <p>{subject.description}</p>
            {/* Add more subject details as needed */}
        </div>
    );
}