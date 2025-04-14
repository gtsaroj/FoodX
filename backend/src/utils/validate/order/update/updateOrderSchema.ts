import { z } from "zod";
import { orderStatusSchema } from "../OrderStatusSchema.js";
import { roleSchema } from "../../auth/roleSchema.js";

export const UpdateOrderSchema = z.object({
  id: z.string({ required_error: "Order ID is required." }),
  status: orderStatusSchema,
  price: z.number({ required_error: "Price is required." }),
  uid: z.string({ required_error: "User ID is required." }),
  role: roleSchema.default("customer"),
});

export type UpdateOrderSchemaType = z.infer<typeof UpdateOrderSchema>;
