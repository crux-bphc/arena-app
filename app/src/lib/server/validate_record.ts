import type { IsoDateString } from "$lib/types/pocketbase";

interface ValidateParams {
    collectionName: string | undefined,
    startTime: IsoDateString | undefined,
    endTime: IsoDateString | undefined,
}

const validate = ({ collectionName, startTime, endTime }: ValidateParams): { error: string | undefined } => {
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