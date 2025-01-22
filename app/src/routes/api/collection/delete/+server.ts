import pb from '$lib/server/database';
import { json, error, type RequestHandler } from '@sveltejs/kit';

const handlePOST: RequestHandler = async ({ request }: { request: Request }) => {
    try {
        const deleted_record = await request.json();
        await pb.collection(deleted_record.collectionName).delete(deleted_record.id);    
    } catch(e) {
        console.error(e);
        return error(500, e);
    }
    return json({});
};

export const POST = handlePOST;