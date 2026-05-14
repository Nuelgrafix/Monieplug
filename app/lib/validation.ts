// Validation utilities for forms and API inputs

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Phone number validation (basic)
export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Check if it's a valid length (10-15 digits)
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

// Form validation helpers
export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateMinLength(value: string, minLength: number, fieldName: string): string | null {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
}

// Comprehensive form validation
export function validateSignupForm(data: {
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Required field validations
  const emailError = validateRequired(data.email, 'Email');
  if (emailError) errors.email = emailError;

  const passwordError = validateRequired(data.password, 'Password');
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateRequired(data.confirmPassword, 'Confirm Password');
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  // Email format validation
  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password strength validation
  if (data.password) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }
  }

  // Password confirmation validation
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Phone validation (optional)
  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Name validations (optional)
  if (data.firstName) {
    const firstNameError = validateMinLength(data.firstName, 2, 'First name');
    if (firstNameError) errors.firstName = firstNameError;
  }

  if (data.lastName) {
    const lastNameError = validateMinLength(data.lastName, 2, 'Last name');
    if (lastNameError) errors.lastName = lastNameError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginForm(data: { email: string; password: string }): ValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateRequired(data.email, 'Email');
  if (emailError) errors.email = emailError;

  const passwordError = validateRequired(data.password, 'Password');
  if (passwordError) errors.password = passwordError;

  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateEventForm(data: {
  title: string;
  description: string;
  date: string;
  image?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  const titleError = validateRequired(data.title, 'Title');
  if (titleError) errors.title = titleError;

  const descriptionError = validateRequired(data.description, 'Description');
  if (descriptionError) errors.description = descriptionError;

  const dateError = validateRequired(data.date, 'Date');
  if (dateError) errors.date = dateError;

  // Title length validation
  if (data.title) {
    const titleLengthError = validateMaxLength(data.title, 100, 'Title');
    if (titleLengthError) errors.title = titleLengthError;
  }

  // Description length validation
  if (data.description) {
    const descLengthError = validateMaxLength(data.description, 500, 'Description');
    if (descLengthError) errors.description = descLengthError;
  }

  // Date validation (basic - should be in future)
  if (data.date) {
    const eventDate = new Date(data.date);
    const now = new Date();
    if (eventDate <= now) {
      errors.date = 'Event date must be in the future';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Sanitization helpers
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// All validation functions are exported above