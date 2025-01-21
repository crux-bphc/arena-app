const handlePOST: RequestHandler = async ({ locals, url }) => {
	console.log("POST on /api/collection/update");
    return new Response('Post recieved');
};

export const POST = handlePOST;