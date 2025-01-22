import pb from '$lib/server/database';
import validate from '$lib/server/validate_record';
import { json, error, type RequestHandler } from '@sveltejs/kit';

const handlePOST: RequestHandler = async ({ request }: { request: Request }) => {
    try {
        const updated_record = await request.json();
        const message = validate(updated_record)?.error;
        if (message)
            return json({ message }, { status: 400 })    
        await pb.collection(updated_record.collectionName).update(updated_record.id, updated_record);
    } catch(e) {
        console.error(e);
        return error(500, e);
    }
    return json({});
};

export const POST = handlePOST;