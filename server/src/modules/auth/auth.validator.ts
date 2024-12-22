import { errorResponse } from "@/utils/errorMessage";
import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(1, { message: errorResponse.NAME.REQUIRED }),
  email: z
    .string()
    .min(1, { message: errorResponse.EMAIL.REQUIRED })
    .email({ message: errorResponse.EMAIL.INVALID }),
  password: z
    .string()
    .min(1, { message: errorResponse.PASSWORD.REQUIRED })
    .min(6, { message: errorResponse.PASSWORD.LENGTH })
    .max(10, { message: errorResponse.PASSWORD.LENGTH }),
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: errorResponse.EMAIL.REQUIRED })
    .email({ message: errorResponse.EMAIL.INVALID }),
  password: z
    .string()
    .min(1, { message: errorResponse.PASSWORD.REQUIRED })
    .min(6, { message: errorResponse.PASSWORD.LENGTH })
    .max(10, { message: errorResponse.PASSWORD.LENGTH }),
});

export const updateUserSchema = z.object({
  name: z.string().min(1),
});

export type loginUserType = z.infer<typeof loginUserSchema>;
export type registerUserType = z.infer<typeof registerUserSchema>;
export type updateUserType = z.infer<typeof updateUserSchema>;
