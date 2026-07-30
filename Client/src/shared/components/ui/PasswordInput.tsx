import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    (
        {
            label,
            error,
            className = "",
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-700">
                        {label}
                    </label>
                )}

                <div className="relative">
                    <input
                        ref={ref}
                        type={showPassword ? "text" : "password"}
                        className={`w-full border border-neutral-300 bg-white px-4 py-3 pr-12 outline-none transition focus:border-[#FF3B00] ${className}`}
                        {...props}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#111111]"
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;