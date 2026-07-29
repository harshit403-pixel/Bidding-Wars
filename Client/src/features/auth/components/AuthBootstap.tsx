import type { ReactNode } from "react";

import { useCurrentUser } from "../hooks/useCurrentUser";

interface AuthBootstrapProps {
    children: ReactNode;
}

function AuthBootstrap({
    children,
}: AuthBootstrapProps) {
    useCurrentUser();

    return <>{children}</>;
}

export default AuthBootstrap;