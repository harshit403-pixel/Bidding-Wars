import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import "./index.css";

import App from "./App";
import { store } from "./app/store";
import { queryClient } from "./app/queryCLient";
import SocketProvider from "./socket/SocketProvider";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <SocketProvider>
                <App />
            </SocketProvider>
            <Toaster
                position="top-right"
                richColors
            />
        </QueryClientProvider>
    </Provider>
);