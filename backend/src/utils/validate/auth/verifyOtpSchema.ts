import { z } from "zod";
import { roleSchema } from "./roleSchema.js";

export const VerifyOtpSchema = z.object({
  code: z.string().length(6, { message: "Invalid otp." }),
  uid: z.string(),
  type: z.enum(["otp", "reset"]),
  role: roleSchema.default("customer"),
  newPassword: z
    .string()
    .min(8, { message: "Password must be atleast 8 character long." })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain an uppercase character, a digit and a special symbol."
    )
    .optional(),
});

export type VerifyOtpSchemaType = z.infer<typeof VerifyOtpSchema>;
