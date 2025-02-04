import type { Actions } from "./$types";

export const actions = {
    logout: async (event) => {
        event.locals.pb.authStore.clear();
    }
} satisfies Actions;