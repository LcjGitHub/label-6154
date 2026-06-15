import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, NoteFormValues } from '../types';

interface NotesState {
  notes: Note[];
  addNote: (values: NoteFormValues) => void;
  updateNote: (id: string, values: NoteFormValues) => void;
  deleteNote: (id: string) => void;
  importNotes: (notesToImport: Note[]) => number;
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
        return importedCount;
      },
    }),
    {
      name: 'fragrance-notes-storage',
    }
  )
);
