import { z } from "zod";
import { roleSchema } from "./roleSchema.js";

export const ChangePasswordSchema = z.object({
  uid: z.string().min(1, { message: "uid is required" }),
  oldPassword: z.string().min(1, { message: "oldPassword is required" }),
  newPassword: z.string().min(1, { message: "newPassword is required" }),
  role: roleSchema,
});

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
