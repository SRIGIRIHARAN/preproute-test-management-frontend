import { ChevronDown, ChevronUp } from 'lucide-react';

interface MarkingSpinnerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function MarkingSpinner({ label, value, onChange }: MarkingSpinnerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center justify-between border border-border rounded-lg h-10 px-3 bg-white">
        <span className="text-sm font-medium text-gray-900">
          {value > 0 ? `+${value}` : value}
        </span>
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            className="flex items-center justify-center h-4 w-4 text-gray-400 hover:text-primary"
            aria-label={`Increase ${label}`}
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChange(value - 1)}
            className="flex items-center justify-center h-4 w-4 text-gray-400 hover:text-primary"
            aria-label={`Decrease ${label}`}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
