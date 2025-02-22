import { z } from "zod";
import { orderStatusSchema } from "../order/OrderStatusSchema.js";

export const createPaginationSchema = (
  config: {
    pageSize?: boolean;
    startAfterDoc?: boolean;
    startAtDoc?: boolean;
    direction?: boolean;
    status?: boolean;
    userId?: boolean;
    sort?: boolean;
  } = {}
) => {
  return z.object({
    pageSize: config.pageSize
      ? z.number().min(1)
      : z.number().min(1).optional(),
    startAfterDoc: config.startAfterDoc ? z.any() : z.any().optional(),
    startAtDoc: config.startAtDoc ? z.any() : z.any().optional(),
    direction: config.direction
      ? z.enum(["prev", "next"])
      : z.enum(["prev", "next"]).optional(),
    status: config.status ? orderStatusSchema : orderStatusSchema.optional(),
    userId: config.userId ? z.string() : z.string().optional(),
    sort: config.sort
      ? z.enum(["asc", "desc"])
      : z.enum(["asc", "desc"]).optional(),
  });
};

// You can still keep the default schema with all optional fields
export const PaginationSchema = createPaginationSchema();

export type PaginationSchemaType = z.infer<typeof PaginationSchema>;
