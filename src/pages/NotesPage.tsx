import { Badge, Button, Grid, Group, Modal, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { NoteCard } from '../components/NoteCard';
import { NoteFormModal } from '../components/NoteFormModal';
import { useNotesStore } from '../store/notesStore';
import { NOTE_TAGS, NOTE_TAG_COLORS, type Note, type NoteFormValues, type NoteTag } from '../types';
import { searchNotesByName } from '../utils/search';

/**
 * 我的笔记页面：新建、编辑、删除笔记
 */
export function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<NoteTag[]>([]);
  const [formOpened, setFormOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openForm = () => setFormOpened(true);
  const closeForm = () => setFormOpened(false);
  const openDelete = () => setDeleteOpened(true);
  const closeDelete = () => setDeleteOpened(false);

  const filtered = useMemo(() => {
    const byName = searchNotesByName(notes, query);
    if (selectedTags.length === 0) {
      return byName;
    }
    return byName.filter((note) => {
      const noteTags = note.tags ?? [];
      return selectedTags.some((tag) => noteTags.includes(tag));
    });
  }, [notes, query, selectedTags]);

  const toggleTag = (tag: NoteTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent, tag: NoteTag) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTag(tag);
    }
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  const handleClearKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      clearTags();
    }
  };

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

      <Stack mb="lg" gap="sm">
        <TextInput
          placeholder="按名称搜索笔记..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          style={{ maxWidth: 400 }}
        />
        <Group gap="xs">
          <Text size="sm" fw={500} mr={4}>
            标签筛选：
          </Text>
          {NOTE_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <Badge
                key={tag}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                aria-label={`${tag}标签，${active ? '已选中' : '未选中'}`}
                color={NOTE_TAG_COLORS[tag]}
                variant={active ? 'filled' : 'light'}
                style={{ cursor: 'pointer' }}
                onClick={() => toggleTag(tag)}
                onKeyDown={(e) => handleTagKeyDown(e, tag)}
              >
                {tag}
              </Badge>
            );
          })}
          {selectedTags.length > 0 && (
            <Badge
              role="button"
              tabIndex={0}
              aria-label="清除所有标签筛选"
              variant="outline"
              style={{ cursor: 'pointer' }}
              onClick={clearTags}
              onKeyDown={handleClearKeyDown}
            >
              清除筛选
            </Badge>
          )}
        </Group>
      </Stack>

      {filtered.length === 0 ? (
        <Text c="dimmed" ta="center" mt="xl" size="lg">
          {notes.length === 0
            ? '还没有笔记，点击「新建笔记」开始记录'
            : selectedTags.length > 0
              ? '未找到匹配标签的笔记'
              : '未找到匹配名称的笔记'}
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
