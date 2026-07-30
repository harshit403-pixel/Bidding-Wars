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
      className={`w-full border-b-2 border-[#FF3B00] bg-[#FF3B00] px-4 py-3 text-white font-medium transition hover:bg-[#FF5A2C] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ fontFamily: "Bebas Neue" }}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;