import { z } from "zod";

export const videoStatusEnum = z.enum(["draft", "published", "archived"]);

export const createVideoSchema = z.object({
  title: z.string().min(1, "標題為必填").max(200, "標題不可超過 200 字"),
  slug: z
    .string()
    .min(1, "Slug 為必填")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 格式不正確"),
  description: z.string().max(5000, "描述不可超過 5000 字").optional(),
  muxUploadId: z.string().min(1, "請上傳影片"),
  thumbnailUrl: z.string().url("請輸入有效的縮圖網址").optional().or(z.literal("")),
  status: videoStatusEnum.default("draft"),
});

export const updateVideoSchema = createVideoSchema.partial();

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
