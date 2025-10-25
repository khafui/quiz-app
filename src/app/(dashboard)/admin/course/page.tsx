// 'use client';
//
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
//
// export default function NewCoursePage() {
//     const router = useRouter();
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [image, setImage] = useState('');
//     const [loading, setLoading] = useState(false);
//
//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//
//         if (!name.trim()) {
//             alert('Course name is required');
//             return;
//         }
//
//         setLoading(true);
//
//         try {
//             const res = await fetch('/api/courses', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ name, description, image }),
//             });
//
//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err?.error || 'Failed to create course');
//             }
//
//             router.push('/admin/courses');
//         } catch (error: any) {
//             alert(error.message || 'Error creating course');
//         } finally {
//             setLoading(false);
//         }
//     }
//
//     return (
//         <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
//             <h1 className="text-xl font-semibold mb-4">Add New Course</h1>
//
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <Label htmlFor="name">Course Name</Label>
//                     <Input
//                         id="name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         placeholder="Enter course name"
//                     />
//                 </div>
//
//                 <div>
//                     <Label htmlFor="description">Description</Label>
//                     <Textarea
//                         id="description"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         placeholder="Enter a brief description"
//                     />
//                 </div>
//
//                 <div>
//                     <Label htmlFor="image">Image URL (optional)</Label>
//                     <Input
//                         id="image"
//                         value={image}
//                         onChange={(e) => setImage(e.target.value)}
//                         placeholder="https://example.com/image.png"
//                     />
//                 </div>
//
//                 <Button type="submit" disabled={loading}>
//                     {loading ? 'Creating...' : 'Create Course'}
//                 </Button>
//             </form>
//         </div>
//     );
// }


'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
// import Image from 'next/image';

interface Course {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
}

export default function NewCoursePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    async function fetchCourses() {
        setFetching(true);
        try {
            const res = await fetch('/api/courses');
            const data = await res.json();
            setCourses(data);
        } catch (err) {
            console.error('Error fetching courses:', err);
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        fetchCourses();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) {
            alert('Course name is required');
            return;
        }

        setLoading(true);

        try {
            let image = imageUrl;

            // if an image file is selected, upload it first
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed');
                image = uploadData.url;
            }

            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, image }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.error || 'Failed to create course');
            }

            await fetchCourses();
            setName('');
            setDescription('');
            setImageUrl('');
            setImageFile(null);
        } catch (error: any) {
            alert(error.message || 'Error creating course');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            await fetchCourses();
        } catch (err) {
            console.error(err);
            alert('Error deleting course');
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-8">
            <h1 className="text-xl font-semibold">Add New Course</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Course Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter course name"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a brief description"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Course Image</Label>
                    <Input
                        type="url"
                        placeholder="Paste image URL (optional)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <div className="text-center text-gray-500">— or —</div>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Course'}
                </Button>
            </form>

            <div className="mt-8">
                <h2 className="text-lg font-medium mb-3">Existing Courses</h2>
                {fetching ? (
                    <p>Loading courses...</p>
                ) : courses.length === 0 ? (
                    <p className="text-gray-500">No courses found.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <Card key={course.id}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex gap-4 items-center">
                                        {course.image && (
                                            <img
                                                src={course.image}
                                                alt={course.name}
                                                width={60}
                                                height={60}
                                                className="rounded-md object-cover"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-semibold">{course.name}</h3>
                                            <p className="text-sm text-gray-600">{course.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/course/${course.id}`}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(course.id)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
