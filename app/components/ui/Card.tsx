import type { ComponentPropsWithoutRef } from "react";

type CardProps = ComponentPropsWithoutRef<"div">;

type HeadingProps = ComponentPropsWithoutRef<"h3">;

type ParagraphProps = ComponentPropsWithoutRef<"p">;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: CardProps) {
  return <div className={`mb-4 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: HeadingProps) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props} />;
}

export function CardDescription({ className = "", ...props }: ParagraphProps) {
  return <p className={`text-sm text-slate-500 ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: CardProps) {
  return <div className={className} {...props} />;
}
