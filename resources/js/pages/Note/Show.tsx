import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

interface Note {
    id: number;
    title: string;
    created_at: string;
    created_at_human: string;
}

interface NoteQuestion {
    id: number;
    question: string;
    answer: string;
    created_at: string;
    created_at_human: string;
}

interface Props {
    note: Note;
    noteQuestions: NoteQuestion[];
    allNotes: Note[];
}

export default function Show({ note, noteQuestions, allNotes }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Notes',
            href: '/notes',
        },
        {
            title: note.title,
            href: `/notes/${note.id}`,
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        question: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/notes/${note.id}/ask`, {
            onSuccess: () => reset('question'),
        });
    };

    const questionsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (questionsEndRef.current) {
            questionsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [noteQuestions]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={note.title} />
            <div className="flex h-full flex-1 gap-4 p-4">
                {/* Sidebar with all notes */}
                <div className="hidden w-64 flex-shrink-0 md:block">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                        <h2 className="mb-4 text-lg font-semibold">Your Notes</h2>
                        <div className="space-y-2">
                            {allNotes.map((n) => (
                                <Link
                                    key={n.id}
                                    href={`/notes/${n.id}`}
                                    className={`block rounded-lg p-2 ${
                                        n.id === note.id
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {n.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex flex-1 flex-col gap-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-6">
                        <h1 className="mb-2 text-2xl font-bold">{note.title}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Created {note.created_at_human}
                        </p>
                    </div>

                    {/* Questions and answers */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex-1 rounded-xl border p-6">
                        <h2 className="mb-6 text-xl font-semibold">Questions & Answers</h2>

                        <div className="mb-6 space-y-6">
                            {noteQuestions.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400">
                                    No questions yet. Ask your first question below.
                                </p>
                            ) : (
                                noteQuestions.map((q) => (
                                    <div key={q.id} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                        <div className="mb-2">
                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Q: </span>
                                            <span>{q.question}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-green-600 dark:text-green-400">A: </span>
                                            <span>{q.answer}</span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            {q.created_at_human}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={questionsEndRef} />
                        </div>

                        {/* Ask a question form */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Ask a question about this note
                                </label>
                                <textarea
                                    id="question"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                                    placeholder="What would you like to know?"
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    required
                                />
                                {errors.question && <p className="mt-1 text-sm text-red-600">{errors.question}</p>}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    disabled={processing}
                                >
                                    {processing ? 'Asking...' : 'Ask Question'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
