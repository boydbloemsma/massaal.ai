import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm} from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notes',
        href: '/notes',
    },
];

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        text_file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/notes');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Note" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="relative overflow-hidden">
                    <CardHeader>
                        <h1 className="text-2xl font-bold">Upload Text File</h1>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-2">
                                    Title
                                </label>
                                <Input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>
                            <div>
                                <label htmlFor="text_file" className="block text-sm font-medium mb-2">
                                    Text File (.txt)
                                </label>
                                <Input
                                    type="file"
                                    id="text_file"
                                    onChange={(e) => setData('text_file', e.target.files?.[0] || null)}
                                    accept=".txt"
                                    required
                                />
                                {errors.text_file && <p className="mt-1 text-sm text-red-600">{errors.text_file}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                {processing && (
                                    <p className="text-sm text-gray-500">
                                        Your file is being uploaded and processed. You'll be redirected to the note page where you can see the processing progress.
                                    </p>
                                )}
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Uploading...' : 'Upload'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
