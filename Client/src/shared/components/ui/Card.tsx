import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`w-full max-w-md border border-neutral-200 bg-white p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;