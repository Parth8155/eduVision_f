import { useState, useCallback } from "react";

const useFormValidation = (validationRules) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback(
    (fieldName, value, formData) => {
      const rules = validationRules[fieldName];
      if (!rules) return null;

      if (
        rules.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (!value || (typeof value === "string" && !value.trim())) {
        return null;
      }
      if (rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
      }
      if (rules.minLength && value.length < rules.minLength) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be less than ${rules.maxLength} characters`;
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } format is invalid`;
      }
      if (rules.match && formData && value !== formData[rules.match]) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } does not match`;
      }
      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
          return customError;
        }
      }
      return null;
    },
    [validationRules]
  );

  const validateForm = useCallback(
    (formData) => {
      const newErrors = {};
      let isFormValid = true;
      Object.keys(validationRules).forEach((fieldName) => {
        const error = validateField(fieldName, formData[fieldName], formData);
        if (error) {
          newErrors[fieldName] = error;
          isFormValid = false;
        }
      });
      setErrors(newErrors);
      const newTouched = {};
      Object.keys(validationRules).forEach((fieldName) => {
        newTouched[fieldName] = true;
      });
      setTouched(newTouched);
      return isFormValid;
    },
    [validationRules, validateField]
  );

  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: isTouched,
    }));
  }, []);

  const setFieldError = useCallback((fieldName, error) => {
    setErrors((prev) => {
      if (error) {
        return { ...prev, [fieldName]: error };
      } else {
        const { [fieldName]: _, ...rest } = prev;
        return rest;
      }
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    touched,
    isValid,
    validateField,
    validateForm,
    setFieldTouched,
    setFieldError,
    clearErrors,
    clearFieldError,
    resetValidation,
  };
};

export const commonValidationRules = {
  email: {
    required: true,
    email: true,
    maxLength: 255,
  },
  password: {
    required: true,
    minLength: 6,
    maxLength: 128,
    custom: (value) => {
      if (!/(?=.*[a-z])/.test(value)) {
        return "Password must contain at least one lowercase letter";
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return "Password must contain at least one uppercase letter";
      }
      if (!/(?=.*\d)/.test(value)) {
        return "Password must contain at least one number";
      }
      return null;
    },
  },
  confirmPassword: {
    required: true,
    match: "password",
  },
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-']+$/,
    custom: (value) => {
      if (!/^[a-zA-Z\s\-']+$/.test(value)) {
        return "First name can only contain letters, spaces, hyphens, and apostrophes";
      }
      return null;
    },
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-']+$/,
    custom: (value) => {
      if (!/^[a-zA-Z\s\-']+$/.test(value)) {
        return "Last name can only contain letters, spaces, hyphens, and apostrophes";
      }
      return null;
    },
  },
};

export default useFormValidation;
