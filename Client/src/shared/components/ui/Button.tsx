import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

function Button({
  children,
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`w-full rounded-lg bg-slate-900 px-4 py-3 text-white font-medium transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;