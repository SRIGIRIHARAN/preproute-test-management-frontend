import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface AppSelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function AppSelect({
  label,
  error,
  placeholder = 'Choose from Drop-down',
  options,
  value,
  onChange,
  disabled,
  className,
}: AppSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            'h-10 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-10 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
            !value && 'text-gray-400',
            value && 'text-gray-900',
            error && 'border-red-400',
            className,
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
