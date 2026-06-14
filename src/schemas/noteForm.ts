import { z } from 'zod';

/** 笔记表单 Zod 校验 schema */
export const noteFormSchema = z.object({
  name: z.string().min(1, '请输入名称'),
  topNotes: z.string().min(1, '请输入前调'),
  middleNotes: z.string().min(1, '请输入中调'),
  baseNotes: z.string().min(1, '请输入后调'),
  rating: z.number().min(1, '请选择评分').max(5),
  remark: z.string(),
});

export type NoteFormSchema = z.infer<typeof noteFormSchema>;
