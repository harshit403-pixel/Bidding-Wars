import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "@fontsource/inter";
import "@fontsource/bebas-neue";
import "./index.css";

import App from "./App";
import { store } from "./app/store";
import { queryClient } from "./app/queryCLient";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <App />
            <Toaster
                position="top-right"
                richColors
            />
        </QueryClientProvider>
    </Provider>
);