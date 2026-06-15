/** 预设标签枚举 */
export type NoteTag = '日常' | '约会' | '工作' | '睡前';

/** 预设标签列表 */
export const NOTE_TAGS: NoteTag[] = ['日常', '约会', '工作', '睡前'];

/** 标签对应的徽章颜色映射 */
export const NOTE_TAG_COLORS: Record<NoteTag, string> = {
  日常: 'green',
  约会: 'pink',
  工作: 'blue',
  睡前: 'violet',
};

/** 香调条目（Mock 库与笔记共用结构） */
export interface Fragrance {
  id: string;
  name: string;
  topNotes: string;
  middleNotes: string;
  baseNotes: string;
  category: 'perfume' | 'incense';
  description: string;
}

/** 用户个人笔记 */
export interface Note {
  id: string;
  name: string;
  topNotes: string;
  middleNotes: string;
  baseNotes: string;
  rating: number;
  remark: string;
  tags: NoteTag[];
  relatedExampleId?: string;
  createdAt: string;
  updatedAt: string;
}

/** 笔记表单值 */
export interface NoteFormValues {
  name: string;
  topNotes: string;
  middleNotes: string;
  baseNotes: string;
  rating: number;
  remark: string;
  tags: NoteTag[];
  relatedExampleId?: string;
}
