import type { IsoDateString } from "$lib/types/pocketbase";

// Ehhhh. too many types I guess
const validate = (
    { collectionName, startTime, endTime }: 
    { collectionName: string | undefined, startTime: IsoDateString | undefined, endTime: IsoDateString | undefined }): { error: string | undefined } => {
    // Validate events records
    if (collectionName == 'events') {
        if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
            return { error: 'The start time of the event is after the end time!' }
        }
    }
    // Assume everything else is always valid
    return { error: undefined };
}

export default validate;