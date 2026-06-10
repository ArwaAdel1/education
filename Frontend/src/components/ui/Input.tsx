import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasError = Boolean(error);

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-start font-cairo text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={hasError}
          className={cn(
            'h-[48px] w-full rounded-input border bg-surface px-3 font-cairo text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-accent',
            hasError ? 'border-danger focus:border-danger' : 'border-border',
            className,
          )}
          {...props}
        />
        {hasError ? (
          <span className="text-start text-sm text-danger">{error}</span>
        ) : (
          helperText && <span className="text-start text-sm text-text-secondary">{helperText}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
