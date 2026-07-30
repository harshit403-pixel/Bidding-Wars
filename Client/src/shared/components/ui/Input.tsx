import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium uppercase tracking-wide text-neutral-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-[#FF3B00] ${className}`}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;