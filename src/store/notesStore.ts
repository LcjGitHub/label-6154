import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, NoteFormValues } from '../types';

export interface ImportResult {
  importedCount: number;
}

interface NotesState {
  notes: Note[];
  addNote: (values: NoteFormValues) => void;
  updateNote: (id: string, values: NoteFormValues) => void;
  deleteNote: (id: string) => void;
  importNotes: (notesToImport: Note[]) => ImportResult;
}

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * 个人笔记 Zustand store，localStorage 持久化
 */
export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],

      addNote: (values) => {
        const now = new Date().toISOString();
        const note: Note = {
          id: generateId(),
          ...values,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ notes: [note, ...state.notes] }));
      },

      updateNote: (id, values) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...values, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      /**
       * 批量导入笔记并合并到现有笔记
       * 数据备份功能：将从纯文本备份文件解析得到的笔记批量导入
       * 自动处理 ID 冲突，为重复 ID 生成新的唯一 ID
       * @param notesToImport - 待导入的笔记列表
       * @returns 导入结果，包含成功导入的笔记条数
       */
      importNotes: (notesToImport) => {
        let importedCount = 0;
        set((state) => {
          const existingIds = new Set(state.notes.map((n) => n.id));
          const newNotes: Note[] = [];

          notesToImport.forEach((note) => {
            if (existingIds.has(note.id)) {
              newNotes.push({
                ...note,
                id: generateId(),
              });
            } else {
              newNotes.push(note);
              existingIds.add(note.id);
            }
            importedCount++;
          });

          return {
            notes: [...newNotes, ...state.notes],
          };
        });
        return { importedCount };
      },
    }),
    {
      name: 'fragrance-notes-storage',
    }
  )
);
