import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notes',
        href: '/notes',
    },
];

interface Note {
    id: number;
    title: string;
    created_at: string;
    created_at_human: string;
}

interface Props {
    notes: Note[];
}

export default function Index({ notes }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notes" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Your Notes</h1>
                    <Link
                        href="/notes/create"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Upload New Note
                    </Link>
                </div>

                {notes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">You don't have any notes yet.</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Upload a text file to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {notes.map((note) => (
                            <Link
                                key={note.id}
                                href={`/notes/${note.id}`}
                                className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Created {note.created_at_human}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
