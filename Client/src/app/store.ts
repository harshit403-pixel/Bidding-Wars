import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/auth.slice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },

    devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;