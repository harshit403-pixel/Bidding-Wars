import { FcGoogle } from "react-icons/fc";

import Button from "../../../shared/components/ui/Button";
import { useGoogleLogin } from "../hooks/useGoogleLogin";

export default function GoogleButton() {
    const { loginWithGoogle } = useGoogleLogin();

    return (
        <Button
            type="button"
           
            className="w-full flex items-center justify-center gap-3"
            onClick={loginWithGoogle}
        >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
        </Button>
    );
}