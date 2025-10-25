'use server'
// import { v2 as cloudinary } from 'cloudinary';
// import { NextResponse } from 'next/server';
//
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//     api_key: process.env.CLOUDINARY_API_KEY!,
//     api_secret: process.env.CLOUDINARY_API_SECRET!,
// });
//
// export async function POST(req: Request) {
//     try {
//         const data = await req.formData();
//         const file = data.get('file') as File | null;
//
//         if (!file) {
//             return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//         }
//
//         if (!file.type.startsWith('image/')) {
//             return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 });
//         }
//
//         if (file.size > 5 * 1024 * 1024) {
//             return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
//         }
//
//         const bytes = await file.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//
//         const uploadResult = await new Promise((resolve, reject) => {
//             const stream = cloudinary.uploader.upload_stream(
//                 {
//                     folder: 'quiz-app',
//                     resource_type: 'image',
//                 },
//                 (error, result) => {
//                     if (error) reject(error);
//                     else resolve(result);
//                 }
//             );
//             stream.end(buffer);
//         });
//
//         const { secure_url } = uploadResult as { secure_url: string };
//
//         return NextResponse.json({ url: secure_url });
//     } catch (error: any) {
//         console.error('Cloudinary upload error:', error);
//         return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
//     }
// }


import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file = data.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'quiz-app',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(buffer);
        });

        const { secure_url } = uploadResult as { secure_url: string };
        return NextResponse.json({ url: secure_url });
    } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 });
    }
}
