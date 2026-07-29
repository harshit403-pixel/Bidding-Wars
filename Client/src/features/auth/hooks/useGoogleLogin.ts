export function useGoogleLogin() {
    const loginWithGoogle = () => {
        window.location.href = "/api/auth/google";
    };

    return {
        loginWithGoogle,
    };
}