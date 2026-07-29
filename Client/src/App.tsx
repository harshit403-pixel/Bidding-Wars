import { RouterProvider } from "react-router";

import AuthBootstrap from "./features/auth/components/AuthBootstap";
import { router } from "./routes";

function App() {
    return (
        <AuthBootstrap>
            <RouterProvider router={router} />
        </AuthBootstrap>
    );
}

export default App;