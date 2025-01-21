"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary"
    | "ghost" | "link" | "primary";
};


export const FormSubmit = ({ 
  children, 
  disabled, 
  className, 
  variant = "primary" 
}: FormSubmitProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending || disabled}
      variant={variant}
      className={cn(className)}
    >
      {children}
    </Button>
  );
};