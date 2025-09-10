// Single Responsibility Principle (SRP) - useForm only manages form state and validation

import { useCallback, useState } from 'react';

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isDirty: boolean;
}

export interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>(
    {} as Partial<Record<keyof T, string>>
  );
  const [isDirty, setIsDirty] = useState(false);

  const validateForm = useCallback(
    (formValues: T): Partial<Record<keyof T, string>> => {
      if (!validate) return {};
      return validate(formValues);
    },
    [validate]
  );

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  const setFieldError = useCallback(
    <K extends keyof T>(field: K, error: string) => {
      setErrors(prev => ({ ...prev, [field]: error }));
    },
    []
  );

  const validateField = useCallback(
    <K extends keyof T>(field: K) => {
      const fieldErrors = validateForm(values);
      setFieldError(field, fieldErrors[field] || '');
    },
    [values, validateForm, setFieldError]
  );

  const validateAllFields = useCallback(() => {
    const formErrors = validateForm(values);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [values, validateForm]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Partial<Record<keyof T, string>>);
    setIsDirty(false);
  }, [initialValues]);

  const isValid = Object.values(errors).every(error => !error);

  return {
    values,
    errors,
    isValid,
    isDirty,
    setValue,
    setFieldError,
    validateField,
    validateAllFields,
    reset,
  };
}
