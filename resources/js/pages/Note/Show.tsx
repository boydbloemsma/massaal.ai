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
                {/* Mobile floating action button for new note - only visible on small screens */}
                <Link
                    href="/notes/create"
                    className="md:hidden fixed bottom-6 right-6 z-10 inline-flex justify-center items-center w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    title="Upload new note"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </Link>

                {/* Main content */}
                <div className="flex flex-1 flex-col">
                    {/* Chat interface */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex-1 rounded-xl border flex flex-col h-full">
                        <div className="p-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <div className="flex items-center justify-between mb-1">
                                <h2 className="text-xl font-semibold">{note.title}</h2>
                                <Link
                                    href="/notes"
                                    className="md:hidden inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    All Notes
                                </Link>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Created {note.created_at_human}
                            </p>
                        </div>

                        {/* Chat messages */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {noteQuestions.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-center text-gray-500 dark:text-gray-400">
                                        No questions yet. Ask your first question below.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {noteQuestions.map((q) => (
                                        <div key={q.id} className="space-y-3">
                                            {/* User question */}
                                            <div className="flex justify-end">
                                                <div className="bg-indigo-600 text-white rounded-lg rounded-tr-none p-3 max-w-[80%]">
                                                    <p>{q.question}</p>
                                                    <div className="text-xs text-indigo-200 mt-1 text-right">
                                                        {q.created_at_human}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AI answer */}
                                            <div className="flex justify-start">
                                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                                                    <p>{q.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={questionsEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Ask a question form */}
                        <div className="p-4 border-t border-sidebar-border/70 dark:border-sidebar-border">
                            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                                <div className="flex-1">
                                    <textarea
                                        id="question"
                                        rows={1}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 resize-none"
                                        placeholder="Ask a question about this note..."
                                        value={data.question}
                                        onChange={(e) => setData('question', e.target.value)}
                                        required
                                    />
                                    {errors.question && <p className="mt-1 text-sm text-red-600">{errors.question}</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" transform="rotate(180, 10, 10)" />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
