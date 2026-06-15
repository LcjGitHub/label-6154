import {
  Badge,
  Button,
  Grid,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NoteCard } from '../components/NoteCard';
import { NoteDetailDrawer } from '../components/NoteDetailDrawer';
import { NoteFormModal } from '../components/NoteFormModal';
import { useNotesStore } from '../store/notesStore';
import { NOTE_TAGS, NOTE_TAG_COLORS, type Note, type NoteFormValues, type NoteTag } from '../types';
import {
  searchNotesFullText,
  sortNotes,
  filterNotesByMinRating,
  NOTE_SORT_OPTIONS,
  type NoteSortKey,
} from '../utils/search';

/**
 * 我的笔记页面：新建、编辑、删除笔记
 */
export function NotesPage() {
  const location = useLocation();
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<NoteTag[]>([]);
  const [sortKey, setSortKey] = useState<NoteSortKey>('updatedAt');
  const [minRating, setMinRating] = useState<string | null>(null);
  const [formOpened, setFormOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [detailOpened, setDetailOpened] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  const openForm = () => setFormOpened(true);
  const closeForm = () => setFormOpened(false);
  const openDelete = () => setDeleteOpened(true);
  const closeDelete = () => setDeleteOpened(false);
  const openDetail = () => setDetailOpened(true);
  const closeDetail = () => setDetailOpened(false);

  useEffect(() => {
    const state = location.state as { openNoteId?: string } | null;
    if (state?.openNoteId) {
      const note = notes.find((n) => n.id === state.openNoteId);
      if (note) {
        setViewingNote(note);
        setDetailOpened(true);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state, notes]);

  const ratingOptions = [
    { value: '0', label: '全部评分' },
    { value: '1', label: '1星及以上' },
    { value: '2', label: '2星及以上' },
    { value: '3', label: '3星及以上' },
    { value: '4', label: '4星及以上' },
    { value: '5', label: '5星' },
  ];

  const { filtered, emptyReason } = useMemo(() => {
    const bySearch = searchNotesFullText(notes, query);
    if (query.trim() && bySearch.length === 0) {
      return { filtered: [], emptyReason: 'search' as const };
    }

    const byTags =
      selectedTags.length === 0
        ? bySearch
        : bySearch.filter((note) => {
            const noteTags = note.tags ?? [];
            return selectedTags.some((tag) => noteTags.includes(tag));
          });
    if (selectedTags.length > 0 && byTags.length === 0) {
      return { filtered: [], emptyReason: 'tags' as const };
    }

    const rating = minRating ? parseInt(minRating, 10) : 0;
    const byRating = filterNotesByMinRating(byTags, rating);
    if (rating > 0 && byRating.length === 0) {
      return { filtered: [], emptyReason: 'rating' as const };
    }

    return { filtered: sortNotes(byRating, sortKey), emptyReason: null };
  }, [notes, query, selectedTags, sortKey, minRating]);

  const toggleTag = (tag: NoteTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
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

  const handleOpenDetail = (note: Note) => {
    setViewingNote(note);
    openDetail();
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
        <Group gap="sm" align="center">
          <TextInput
            placeholder="搜索名称、香调、备注、标签..."
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            style={{ width: 320 }}
          />
          <Select
            placeholder="排序方式"
            data={NOTE_SORT_OPTIONS}
            value={sortKey}
            onChange={(value) => value && setSortKey(value as NoteSortKey)}
            style={{ width: 160 }}
          />
          <Select
            placeholder="最低评分"
            data={ratingOptions}
            value={minRating}
            onChange={setMinRating}
            clearable
            style={{ width: 140 }}
          />
        </Group>
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
            : emptyReason === 'search'
              ? `未找到包含「${query.trim()}」的笔记（可匹配名称、香调、备注、标签）`
              : emptyReason === 'tags'
                ? `未找到同时匹配「${selectedTags.join('」或「')}」标签的笔记`
                : emptyReason === 'rating'
                  ? `未找到评分达到 ${minRating} 星及以上的笔记`
                  : '未找到符合条件的笔记'}
        </Text>
      ) : (
        <Grid>
          {filtered.map((note) => (
            <Grid.Col key={note.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <NoteCard
                note={note}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onViewDetail={handleOpenDetail}
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

      <NoteDetailDrawer
        opened={detailOpened}
        onClose={closeDetail}
        note={viewingNote}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />
    </>
  );
}
