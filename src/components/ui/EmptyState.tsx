import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export function EmptyState({ icon, title, description, ctaLabel, ctaTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-20 px-6">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-blush/60 flex items-center justify-center text-plum mb-5">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-xl text-chocolate mb-2">{title}</h3>
      {description && (
        <p className="text-plum-400 text-sm max-w-sm mb-6 font-sans">{description}</p>
      )}
      {ctaLabel && ctaTo && (
        <Link to={ctaTo}>
          <Button variant="primary">{ctaLabel}</Button>
        </Link>
      )}
    </div>
  );
}
