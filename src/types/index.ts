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
}
