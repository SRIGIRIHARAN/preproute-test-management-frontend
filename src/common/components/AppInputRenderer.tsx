import { Controller, type FieldValues, type UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import AppInput from '@/common/components/AppInput';
import AppSelect from '@/common/components/AppSelect';
import AppMultiSelect from '@/common/components/AppMultiSelect';
import type { InputConfig, InputGroup } from '@/common/components/form/types';

interface AppInputRendererProps<TFieldValues extends FieldValues = FieldValues> {
  inputArr: InputGroup<TFieldValues>[];
  formUtils: UseFormReturn<TFieldValues>;
  formWrapperClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  enabledFieldNames?: string[] | null;
}

function getFieldError<TFieldValues extends FieldValues>(
  formUtils: UseFormReturn<TFieldValues>,
  name: string,
) {
  const error = formUtils.formState.errors[name as keyof TFieldValues];
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message as string;
  }
  return undefined;
}

export default function AppInputRenderer<TFieldValues extends FieldValues = FieldValues>({
  inputArr,
  formUtils,
  formWrapperClassName,
  labelClassName,
  disabled = false,
  enabledFieldNames = null,
}: AppInputRendererProps<TFieldValues>) {
  const isFieldEnabled = (name: string) => {
    if (enabledFieldNames == null || enabledFieldNames.length === 0) return !disabled;
    return enabledFieldNames.includes(name);
  };

  const renderInput = (input: InputConfig<TFieldValues>) => {
    if (input.showWhen && !input.showWhen(formUtils)) return null;

    const fieldDisabled =
      input.disabled ||
      input.readOnly ||
      !isFieldEnabled(String(input.name)) ||
      input.getDynamicDisabled?.(formUtils);

    const error = getFieldError(formUtils, input.name);
    const options = input.getDynamicOptions?.(formUtils) ?? input.options ?? [];
    const placeholder =
      input.getDynamicPlaceholder?.(formUtils) ?? input.placeholder ?? '';

    switch (input.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'password':
        return (
          <Controller
            key={input.name}
            name={input.name as never}
            control={formUtils.control}
            render={({ field }) => (
              <AppInput
                label={input.label}
                hint={input.hint}
                type={input.type === 'password' ? 'password' : input.type}
                placeholder={placeholder}
                min={input.min}
                readOnly={input.readOnly}
                disabled={fieldDisabled}
                showPasswordToggle={input.showPasswordToggle}
                error={error}
                className={cn(input.className, input.inputClassName)}
                value={
                  input.type === 'number' && field.value === undefined
                    ? ''
                    : (field.value as string | number | undefined)
                }
                onChange={(event) => {
                  const rawValue = event.target.value;
                  const nextValue =
                    input.type === 'number'
                      ? rawValue === ''
                        ? undefined
                        : Number(rawValue)
                      : rawValue;
                  field.onChange(nextValue);
                  input.customOnChange?.(nextValue, formUtils);
                }}
                onBlur={field.onBlur}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            key={input.name}
            name={input.name as never}
            control={formUtils.control}
            render={({ field }) => (
              <AppSelect
                label={input.label}
                options={options}
                value={field.value as string}
                placeholder={placeholder}
                disabled={fieldDisabled}
                error={error}
                className={input.className}
                onChange={(value) => {
                  field.onChange(value);
                  input.customOnChange?.(value, formUtils);
                }}
              />
            )}
          />
        );

      case 'multi-select':
        return (
          <Controller
            key={input.name}
            name={input.name as never}
            control={formUtils.control}
            render={({ field }) => (
              <AppMultiSelect
                label={input.label}
                options={options}
                value={(field.value as string[]) ?? []}
                placeholder={placeholder}
                disabled={fieldDisabled}
                error={error}
                onChange={(value) => {
                  field.onChange(value);
                  input.customOnChange?.(value, formUtils);
                }}
              />
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            key={input.name}
            name={input.name as never}
            control={formUtils.control}
            render={({ field }) => (
              <div className={cn('flex flex-col gap-2', input.className)}>
                {input.label && (
                  <label className={cn('text-sm font-medium text-gray-700', labelClassName)}>
                    {input.label}
                  </label>
                )}
                <div className="flex items-center gap-6">
                  {options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        value={option.value}
                        checked={field.value === option.value}
                        disabled={fieldDisabled}
                        onChange={() => {
                          field.onChange(option.value);
                          input.customOnChange?.(option.value, formUtils);
                        }}
                      />
                      <span
                        className={cn(
                          'h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0',
                          field.value === option.value ? 'border-primary' : 'border-gray-300',
                        )}
                      >
                        {field.value === option.value && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </span>
                      <span
                        className={cn(
                          'text-sm font-medium',
                          field.value === option.value ? 'text-primary' : 'text-gray-700',
                        )}
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
            )}
          />
        );

      case 'custom-comp': {
        const content =
          typeof input.customComp === 'function'
            ? input.customComp(formUtils)
            : input.customComp;

        return fieldDisabled ? (
          <div key={input.name} className="pointer-events-none opacity-60" aria-disabled="true">
            {content}
          </div>
        ) : (
          <div key={input.name} className={input.className}>
            {content}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className={cn('grid grid-cols-1 gap-4 items-baseline', formWrapperClassName)}>
      {inputArr.map((group, groupIndex) => (
        <div key={groupIndex} className={cn('space-y-4', group.outerWrapperClassName)}>
          {group.subTitle && (
            <p className="text-sm font-medium text-gray-700">{group.subTitle}</p>
          )}
          {group.subTitleTag && (
            <span className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-primary">
              {group.subTitleTag}
            </span>
          )}
          {group.render && group.render.length > 0 && (
            <div className={cn('grid grid-cols-1 gap-5 items-baseline', group.wrapperClassName)}>
              {group.render.map((input, index) => (
                <div key={input.name ?? `input-${index}`}>{renderInput(input)}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
