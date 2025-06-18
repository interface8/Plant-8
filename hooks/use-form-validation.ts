// import { useState } from "react";

// export function useFormValidation(
//   validators: Record<string, (value: string) => string>
// ) {
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const validateField = (field: string, value: string) => {
//     const error = validators[field] ? validators[field](value) : "";
//     setErrors((prev) => ({ ...prev, [field]: error }));
//   };

//   const validateForm = (data: Record<string, string>) => {
//     const newErrors = Object.keys(validators).reduce((acc, field) => {
//       const error = validators[field](data[field] || "");
//       if (error) acc[field] = error;
//       return acc;
//     }, {} as Record<string, string>);
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   return { errors, validateField, validateForm };
// }

"use client";

import { useState, useCallback } from "react";
import { z } from "zod";

export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (name: string, value: any, allValues?: Record<string, any>) => {
      try {
        // Get the current form data
        const currentData = allValues || {};
        const dataToValidate = { ...currentData, [name]: value };

        // For individual field validation, we need to handle it differently
        // based on the field type and dependencies

        if (name === "confirmPassword") {
          // Special handling for confirm password
          if (!value) {
            setErrors((prev) => ({
              ...prev,
              [name]: "Please confirm your password",
            }));
            return false;
          }

          if (currentData.password && value !== currentData.password) {
            setErrors((prev) => ({ ...prev, [name]: "Passwords don't match" }));
            return false;
          }

          // Clear error if passwords match
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
          return true;
        }

        // For other fields, validate using the schema
        // We'll create a partial validation by extracting the field schema
        const schemaShape = (schema as any)._def.shape();

        if (schemaShape[name]) {
          // Validate the individual field
          schemaShape[name].parse(value);

          // Clear error if validation passes
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
          return true;
        }

        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors[0]?.message || "Invalid input";
          setErrors((prev) => ({ ...prev, [name]: errorMessage }));
          return false;
        }
        return false;
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    (data: any) => {
      try {
        schema.parse(data);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(newErrors);
          return false;
        }
        return false;
      }
    },
    [schema]
  );

  const setFieldTouched = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const clearFieldError = useCallback((name: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  return {
    errors,
    touched,
    validateField,
    validateForm,
    setFieldTouched,
    clearErrors,
    clearFieldError,
  };
}
