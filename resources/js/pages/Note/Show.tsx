import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    allNotes?: Note[];
}

export default function Show({ note, noteQuestions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
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
                {/* Main content */}
                <div className="flex flex-1 flex-col">
                    {/* Chat interface */}
                    <Card className="flex-1 flex flex-col h-full">

                        {/* Chat messages */}
                        <CardContent className="flex-1 overflow-y-auto p-4">
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
                                                <Card className="bg-gray-800 text-white rounded-lg rounded-tr-none p-3 max-w-[80%]">
                                                    <CardContent className="p-0">
                                                        <p>{q.question}</p>
                                                        <div className="text-xs text-indigo-200 mt-1 text-right">
                                                            {q.created_at_human}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* AI answer */}
                                            <div className="flex justify-start">
                                                <Card className="bg-gray-100 dark:bg-gray-800 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                                                    <CardContent className="p-0">
                                                        <p>{q.answer}</p>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={questionsEndRef} />
                                </div>
                            )}
                        </CardContent>

                        {/* Ask a question form */}
                        <CardFooter className="p-4 border-sidebar-border/70 dark:border-sidebar-border">
                            <form onSubmit={handleSubmit} className="flex items-end gap-2 w-full">
                                <div className="flex-1">
                                    <Input
                                        id="question"
                                        className="resize-none"
                                        placeholder="Ask a question about this note..."
                                        value={data.question}
                                        onChange={(e) => setData('question', e.target.value)}
                                        required
                                    />
                                    {errors.question && <p className="mt-1 text-sm text-red-600">{errors.question}</p>}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="p-2"
                                >
                                    {processing ? (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>Send</>
                                    )}
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
