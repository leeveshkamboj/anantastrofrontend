'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type BirthGender = 'Male' | 'Female';

export interface BirthGenderSelectProps {
  id?: string;
  value: BirthGender;
  onChange: (value: BirthGender) => void;
  className?: string;
  labelClassName?: string;
  /** Override translation namespace; defaults to services.kundli.birthForm */
  translationNamespace?: string;
}

export function BirthGenderSelect({
  id = 'birth-gender',
  value,
  onChange,
  className,
  labelClassName,
  translationNamespace = 'services.kundli.birthForm',
}: BirthGenderSelectProps) {
  const t = useTranslations(translationNamespace);
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className={labelClassName}>
        {t('gender')}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as BirthGender)}
        className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="Male">{t('genderMale')}</option>
        <option value="Female">{t('genderFemale')}</option>
      </select>
    </div>
  );
}
