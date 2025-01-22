import pb from '$lib/server/database';
import validate from '$lib/server/validate_record';
import { json, error, type RequestHandler } from '@sveltejs/kit';

const handlePOST: RequestHandler = async ({ request }: { request: Request }) => {
    try {
        const new_record = await request.json();
        const message = validate(new_record)?.error;
        if (message)
            return json({ message }, { status: 400 })
        await pb.collection(new_record.collectionName).create(new_record);
    } catch(e) {
        console.error(e);
        return error(500, e);
    }

    return json({});
};

export const POST = handlePOST;