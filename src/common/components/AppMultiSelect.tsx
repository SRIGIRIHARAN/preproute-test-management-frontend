import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface AppMultiSelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export default function AppMultiSelect({
  label,
  error,
  placeholder = 'Choose from Drop-down',
  options,
  value,
  onChange,
  disabled,
}: AppMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  const selected = options.filter((o) => value.includes(o.value));

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div
        className={cn(
          'min-h-10 w-full rounded-lg border border-border bg-white px-3 py-2 cursor-pointer',
          'focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary',
          error && 'border-red-400',
          disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <div className="flex flex-wrap gap-1.5 items-center">
          {selected.length === 0 && (
            <span className="text-sm text-gray-400">{placeholder}</span>
          )}
          {selected.map((o) => (
            <span
              key={o.value}
              className="flex items-center gap-1 bg-blue-50 text-primary text-xs font-medium px-2 py-0.5 rounded-md"
            >
              {o.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(o.value);
                }}
              />
            </span>
          ))}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-gray-400 ml-auto transition-transform',
              open && 'rotate-180',
            )}
          />
        </div>
      </div>
      {open && (
        <div className="relative z-50">
          <ul className="absolute top-1 w-full rounded-lg border border-border bg-white shadow-lg py-1 max-h-48 overflow-y-auto">
            {options.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-400">No options</li>
            )}
            {options.map((o) => (
              <li
                key={o.value}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                onClick={() => toggle(o.value)}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded border flex items-center justify-center',
                    value.includes(o.value)
                      ? 'bg-primary border-primary'
                      : 'border-gray-300',
                  )}
                >
                  {value.includes(o.value) && <Check className="h-3 w-3 text-white" />}
                </div>
                {o.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
