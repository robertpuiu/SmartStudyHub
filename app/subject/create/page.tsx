import { createSubjectFormAction } from "@/app/actions/subjectActions";

export default async function CreateSubjectPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
            <h1 className="text-2xl font-bold">Create Subject</h1>
            <form action={createSubjectFormAction}>
                <label className="block mb-2">
                    Subject Name:
                    <input
                        type="text"
                        name="name"
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
                    Create Subject
                </button>   
            </form>
        </div>
    )
}