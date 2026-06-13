import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import AppButton from '@/common/components/AppButton';
import AppInputRenderer from '@/common/components/AppInputRenderer';
import SkeletonFormFields from '@/common/components/SkeletonFormFields';
import type { InputGroup } from '@/common/components/form/types';
import { cn } from '@/lib/utils';

interface AppFormProps<TFieldValues extends FieldValues = FieldValues> {
  inputArr: InputGroup<TFieldValues>[];
  onSubmit: SubmitHandler<TFieldValues>;
  formUtils: UseFormReturn<TFieldValues>;
  className?: string;
  formClassName?: string;
  children?: ReactNode;
  topChildren?: boolean;
  formWrapperClassName?: string;
  isLoading?: boolean;
  fieldsCount?: number;
  skeletonWrapperClassName?: string;
  noDefaultButtons?: boolean;
  onSecondaryButtonClick?: () => void;
  isSubmitting?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryBtnType?: 'submit' | 'button';
  onPrimaryButtonClick?: () => void;
  secondaryButtonDisabled?: boolean;
  labelClassName?: string;
  primaryButtonClassName?: string;
  secondaryButtonClassName?: string;
  disabled?: boolean;
  enabledFieldNames?: string[] | null;
  footerClassName?: string;
}

export default function AppForm<TFieldValues extends FieldValues = FieldValues>({
  inputArr,
  onSubmit,
  formUtils,
  className,
  formClassName,
  children,
  topChildren = false,
  formWrapperClassName,
  isLoading = false,
  fieldsCount = 4,
  skeletonWrapperClassName,
  noDefaultButtons = false,
  onSecondaryButtonClick,
  isSubmitting = false,
  primaryButtonText = 'Submit',
  secondaryButtonText = 'Cancel',
  primaryBtnType = 'submit',
  onPrimaryButtonClick,
  secondaryButtonDisabled,
  labelClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  disabled = false,
  enabledFieldNames = null,
  footerClassName,
}: AppFormProps<TFieldValues>) {
  if (isLoading) {
    return (
      <SkeletonFormFields
        fieldsCount={fieldsCount}
        skeletonWrapperClassName={skeletonWrapperClassName}
      />
    );
  }

  return (
    <div className={className}>
      <form onSubmit={formUtils.handleSubmit(onSubmit)} className={formClassName}>
        {topChildren && children}
        <AppInputRenderer
          labelClassName={labelClassName}
          inputArr={inputArr}
          formUtils={formUtils}
          formWrapperClassName={formWrapperClassName}
          disabled={disabled}
          enabledFieldNames={enabledFieldNames}
        />
        {!topChildren && children}
        {!noDefaultButtons && (
          <div className={cn('flex justify-end gap-3 mt-6', footerClassName)}>
            <AppButton
              type="button"
              variant="ghost"
              onClick={onSecondaryButtonClick}
              disabled={secondaryButtonDisabled}
              className={cn(
                'bg-[#EEF2FF] text-primary hover:bg-[#E8EEFF] px-6 border-0',
                secondaryButtonClassName,
              )}
            >
              {secondaryButtonText}
            </AppButton>
            <AppButton
              type={primaryBtnType}
              loading={isSubmitting}
              onClick={onPrimaryButtonClick}
              className={cn('px-8', primaryButtonClassName)}
            >
              {primaryButtonText}
            </AppButton>
          </div>
        )}
      </form>
    </div>
  );
}
