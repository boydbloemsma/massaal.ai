import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useStream } from '@laravel/stream-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Note {
    id: string;
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
}

export default function Show({ note, noteQuestions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: note.title,
            href: `/notes/${note.id}`,
        },
    ];

    const [question, setQuestion] = useState('');
    const [lastQuestion, setLastQuestion] = useState('');
    const [streamingJustFinished, setStreamingJustFinished] = useState(false);

    const { data, isFetching, isStreaming, send, cancel } = useStream(`/notes/${note.id}/ask`, {
        csrfToken: (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
        onFinish: () => {
            setStreamingJustFinished(true);
            router.reload({ only: ['noteQuestions'] });
        },
    });

    const isLoading = isFetching || isStreaming;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLastQuestion(question);

        send({
            question,
        });

        setQuestion('');

        // Scroll to bottom when a new question is submitted
        if (questionsEndRef.current) {
            questionsEndRef.current.scrollIntoView({ behavior: 'auto' });
        }

        // Add a small delay to ensure scrolling happens after any DOM updates
        setTimeout(() => {
            if (questionsEndRef.current) {
                questionsEndRef.current.scrollIntoView({ behavior: 'auto' });
            }
        }, 50);
    };

    const questionsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (questionsEndRef.current) {
            // Use auto behavior for more reliable scrolling
            questionsEndRef.current.scrollIntoView({ behavior: 'auto' });

            // Add a small delay to ensure scrolling happens after any DOM updates
            const timeoutId = setTimeout(() => {
                if (questionsEndRef.current) {
                    questionsEndRef.current.scrollIntoView({ behavior: 'auto' });
                }
            }, 50);

            return () => clearTimeout(timeoutId);
        }
    }, [noteQuestions, data, isStreaming]);

    // Handle scrolling after router.reload
    useEffect(() => {
        if (streamingJustFinished && questionsEndRef.current) {
            // First immediate scroll without smooth behavior for reliability
            questionsEndRef.current.scrollIntoView({ behavior: 'auto' });

            // Then add a delayed scroll to handle cases where the DOM might not be fully updated
            const timeoutId = setTimeout(() => {
                if (questionsEndRef.current) {
                    questionsEndRef.current.scrollIntoView({ behavior: 'auto' });
                }
            }, 100);

            setStreamingJustFinished(false);

            return () => clearTimeout(timeoutId);
        }
    }, [streamingJustFinished]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={note.title} />
            <div className="flex h-full flex-1 gap-4 p-4">
                {/* Main content */}
                <div className="flex flex-1 flex-col h-full">
                    {/* Chat interface */}
                    <Card className="flex-1 flex flex-col h-full max-h-screen">

                        {/* Chat messages */}
                        <CardContent className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-180px)]">
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

                                    {/* Loading and streaming indicators */}
                                    {isLoading && (
                                        <div className="space-y-3">
                                            {/* User question */}
                                            <div className="flex justify-end">
                                                <Card className="bg-gray-800 text-white rounded-lg rounded-tr-none p-3 max-w-[80%]">
                                                    <CardContent className="p-0">
                                                        <p>{lastQuestion}</p>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* AI answer - loading or streaming */}
                                            <div className="flex justify-start">
                                                <Card className="bg-gray-100 dark:bg-gray-800 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                                                    <CardContent className="p-0">
                                                        {isFetching && !isStreaming ? (
                                                            <div className="flex items-center space-x-2">
                                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                <p>Loading...</p>
                                                            </div>
                                                        ) : (
                                                            <p>{data}</p>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    )}

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
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                {isLoading ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="p-2"
                                        onClick={cancel}
                                        formNoValidate={true}
                                    >
                                        Cancel
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="p-2"
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <>Send</>
                                        )}
                                    </Button>
                                )}
                            </form>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
