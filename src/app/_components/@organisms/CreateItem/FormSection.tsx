import React from "react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="rounded-lg border border-border bg-box-background-dark p-5">
      <h3 className="mb-4 text-sm font-semibold text-accent">
        {title}
      </h3>
      {children}
    </div>
  );
}
