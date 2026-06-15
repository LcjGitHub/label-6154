import { Grid, Group, Select, TextInput, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import fragrancesData from '../mock/fragrances.json';
import { FragranceCard } from '../components/FragranceCard';
import { NoteFormModal } from '../components/NoteFormModal';
import { useNotesStore } from '../store/notesStore';
import { searchFragranceFullText } from '../utils/search';
import type { Fragrance, NoteFormValues } from '../types';

const fragrances = fragrancesData as Fragrance[];

/**
 * 示例库页面：浏览 Mock 香调，支持全文模糊搜索（名称、前调、中调、后调、描述）
 */
export function LibraryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [formOpened, setFormOpened] = useState(false);
  const [prefillFragrance, setPrefillFragrance] = useState<Fragrance | null>(null);
  const { addNote } = useNotesStore();

  const openForm = () => setFormOpened(true);
  const closeForm = () => setFormOpened(false);

  const filtered = useMemo(() => {
    let result = searchFragranceFullText(fragrances, query);
    if (category) {
      result = result.filter((f) => f.category === category);
    }
    return result;
  }, [query, category]);

  const handleQuickNote = (fragrance: Fragrance) => {
    setPrefillFragrance(fragrance);
    openForm();
  };

  const handleSubmit = (values: NoteFormValues) => {
    addNote(values);
    setPrefillFragrance(null);
  };

  const handleClose = () => {
    closeForm();
    setPrefillFragrance(null);
  };

  return (
    <>
      <Title order={2} mb="md">
        示例库
      </Title>

      <Group mb="lg" align="flex-end">
        <TextInput
          placeholder="搜索名称、前中后调或描述..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          style={{ flex: 1, maxWidth: 400 }}
        />
        <Select
          placeholder="分类筛选"
          clearable
          data={[
            { value: 'perfume', label: '香水' },
            { value: 'incense', label: '线香' },
          ]}
          value={category}
          onChange={setCategory}
          w={160}
        />
      </Group>

      <Grid>
        {filtered.map((fragrance) => (
          <Grid.Col key={fragrance.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <FragranceCard fragrance={fragrance} onQuickNote={handleQuickNote} />
          </Grid.Col>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Title order={4} c="dimmed" ta="center" mt="xl">
          未找到匹配的香调
        </Title>
      )}

      <NoteFormModal
        opened={formOpened}
        onClose={handleClose}
        onSubmit={handleSubmit}
        prefillFragrance={prefillFragrance}
        title="记为笔记"
      />
    </>
  );
}
