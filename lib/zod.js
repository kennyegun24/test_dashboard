import { number, object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = object({
  first_name: string({ required_error: "First name is required" }).min(
    3,
    "First name length can't be less than 3"
  ),
  last_name: string({ required_error: "Last name is required" }).min(
    3,
    "Last name length can't be less than 3"
  ),
  user_name: string({ required_error: "User name is required" })
    .min(1, "Username is required")
    .min(8, "Username should not be less than 8 characters"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const createProducySchema = object({
  productName: string({ required_error: "Poduct name is required" }),
  stockLevel: number({ required_error: "Stock level is required" }).min(1),
  costPrice: string({ required_error: "User name is required" })
    .min(1, "Username is required")
    .min(8, "Username should not be less than 8 characters"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
