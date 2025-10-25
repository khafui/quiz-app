'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    // 🧩 Fetch course data
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/courses/${courseId}`);
                const data = await res.json();
                if (res.ok) {
                    setFormData({
                        title: data.name || '',
                        description: data.description || '',
                        image: data.image || '',
                    });
                }
            } catch (error) {
                console.error('Error loading course:', error);
            }
        };
        fetchCourse();
    }, [courseId]);

    // 🖼️ Upload image to Cloudinary
    const handleImageUpload = async () => {
        if (!file) return;
        try {
            setUploading(true);
            const form = new FormData();
            form.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: form,
            });

            const data = await res.json();
            if (res.ok) {
                setFormData((prev) => ({ ...prev, image: data.url }));
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    // 📝 Handle text input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💾 Submit update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch(`/api/courses/${courseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.back();
            } else {
                const data = await res.json();
                alert(data.error || 'Update failed');
            }
        } catch (error) {
            console.error('Error updating course:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-semibold mb-6">Edit Course</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <Label>Title</Label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Course title"
                        required
                    />
                </div>

                <div>
                    <Label>Description</Label>
                    <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        required
                    />
                </div>


                <div>
                    <Label>Image URL (or upload below)</Label>
                    <Input
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Paste an image URL or upload below"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Button type="button" onClick={handleImageUpload} disabled={!file || uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </div>

                {formData.image && (
                    <div className="mt-3">
                        <img src={formData.image} alt="Course" className="rounded-md w-full h-56 object-cover" />
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </form>
        </div>
    );
}
