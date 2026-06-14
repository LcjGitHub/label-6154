import { Button, Grid, Group, Modal, Text, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { NoteCard } from '../components/NoteCard';
import { NoteFormModal } from '../components/NoteFormModal';
import { useNotesStore } from '../store/notesStore';
import type { Note, NoteFormValues } from '../types';
import { searchNotesByName } from '../utils/search';

/**
 * 我的笔记页面：新建、编辑、删除笔记
 */
export function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const [query, setQuery] = useState('');
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => searchNotesByName(notes, query), [notes, query]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    openForm();
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    openForm();
  };

  const handleSubmit = (values: NoteFormValues) => {
    if (editingNote) {
      updateNote(editingNote.id, values);
    } else {
      addNote(values);
    }
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    openDelete();
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteNote(deletingId);
    }
    setDeletingId(null);
    closeDelete();
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>我的笔记</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          新建笔记
        </Button>
      </Group>

      <TextInput
        placeholder="按名称搜索笔记..."
        leftSection={<IconSearch size={16} />}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        mb="lg"
        style={{ maxWidth: 400 }}
      />

      {filtered.length === 0 ? (
        <Text c="dimmed" ta="center" mt="xl" size="lg">
          {notes.length === 0 ? '还没有笔记，点击「新建笔记」开始记录' : '未找到匹配的笔记'}
        </Text>
      ) : (
        <Grid>
          {filtered.map((note) => (
            <Grid.Col key={note.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <NoteCard
                note={note}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            </Grid.Col>
          ))}
        </Grid>
      )}

      <NoteFormModal
        opened={formOpened}
        onClose={closeForm}
        onSubmit={handleSubmit}
        initialValues={editingNote}
        title={editingNote ? '编辑笔记' : '新建笔记'}
      />

      <Modal opened={deleteOpened} onClose={closeDelete} title="确认删除" centered>
        <Text mb="lg">确定要删除这条笔记吗？此操作不可撤销。</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={closeDelete}>
            取消
          </Button>
          <Button color="red" onClick={handleConfirmDelete}>
            删除
          </Button>
        </Group>
      </Modal>
    </>
  );
}
