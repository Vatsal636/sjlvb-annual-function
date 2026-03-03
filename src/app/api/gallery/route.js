import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        const result = await cloudinary.api.resources_by_tag('annual', {
            max_results: 100,
            resource_type: 'image',
        });

        const images = result.resources.map(img => ({
            publicId: img.public_id,
            format: img.format,
            width: img.width,
            height: img.height,
            createdAt: img.created_at,
            url: img.secure_url,
            thumb: cloudinary.url(img.public_id, {
                width: 500,
                height: 500,
                crop: 'fill',
                quality: 'auto',
                format: 'auto',
            }),
            full: cloudinary.url(img.public_id, {
                width: 1400,
                quality: 'auto',
                format: 'auto',
            }),
        }));

        return NextResponse.json({ images });
    } catch (error) {
        console.error('Cloudinary fetch error:', error);
        return NextResponse.json({ images: [], error: error.message }, { status: 200 });
    }
}
