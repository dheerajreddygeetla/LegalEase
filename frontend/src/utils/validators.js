import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  state: z.string().min(1, 'State is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  income: z.string().min(1, 'Income is required'),
  education: z.string().min(1, 'Education is required'),
  category: z.string().min(1, 'Category is required'),
});

export const eligibilitySchema = z.object({
  age: z.string().min(1, 'Age is required'),
  state: z.string().min(1, 'State is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  income: z.string().min(1, 'Income is required'),
  education: z.string().min(1, 'Education is required'),
  category: z.string().min(1, 'Category is required'),
  isFarmer: z.boolean().optional(),
  isStudent: z.boolean().optional(),
  isRural: z.boolean().optional(),
});

export const schemeSearchSchema = z.object({
  keyword: z.string().optional(),
  state: z.string().optional(),
  category: z.string().optional(),
});
