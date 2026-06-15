import { Badge, Card, Group, Rating, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import fragrancesData from '../mock/fragrances.json';
import { NoteSummary, NOTE_TIERS } from '../components/NoteSummary';
import { useNotesStore } from '../store/notesStore';
import { globalSearch } from '../utils/search';
import { NOTE_TAG_COLORS, type Fragrance, type Note } from '../types';

const fragrances = fragrancesData as Fragrance[];

/**
 * 全局搜索页面：同时检索示例库香调与个人笔记
 * 结果分两个区域展示，香调结果可跳转详情页，笔记结果可跳转笔记页并打开详情抽屉
 */
export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { notes } = useNotesStore();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const results = useMemo(() => {
    return globalSearch(fragrances, notes, query);
  }, [query, notes]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  const handleFragranceClick = (fragrance: Fragrance) => {
    navigate(`/library/${fragrance.id}`);
  };

  const handleNoteClick = (note: Note) => {
    navigate('/notes', { state: { openNoteId: note.id } });
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" mb="md">
        <Title order={2}>全局搜索</Title>
      </Group>

      <TextInput
        placeholder="搜索香调名称、前中后调、描述或笔记名称、备注..."
        leftSection={<IconSearch size={16} />}
        value={query}
        onChange={(e) => handleSearch(e.currentTarget.value)}
        size="lg"
        autoFocus
      />

      {query.trim() && (
        <Group gap="lg" align="flex-start">
          <Text size="sm" c="dimmed">
            共找到 {results.fragrances.length} 条香调，{results.notes.length} 条笔记
          </Text>
        </Group>
      )}

      <Stack gap="xl">
        <div>
          <Group justify="space-between" mb="md">
            <Title order={3}>
              香调结果
              {results.fragrances.length > 0 && (
                <Badge ml="sm" size="sm" color="teal" variant="light">
                  {results.fragrances.length}
                </Badge>
              )}
            </Title>
          </Group>

          {results.fragrances.length === 0 ? (
            query.trim() ? (
              <Text c="dimmed" ta="center" py="xl">
                未找到匹配的香调
              </Text>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                输入关键词开始搜索香调
              </Text>
            )
          ) : (
            <Stack gap="sm">
              {results.fragrances.map((fragrance) => (
                <Card
                  key={fragrance.id}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  style={{ cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
                  onClick={() => handleFragranceClick(fragrance)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
                >
                  <NoteSummary fragrance={fragrance} variant="list" />
                </Card>
              ))}
            </Stack>
          )}
        </div>

        <div>
          <Group justify="space-between" mb="md">
            <Title order={3}>
              笔记结果
              {results.notes.length > 0 && (
                <Badge ml="sm" size="sm" color="blue" variant="light">
                  {results.notes.length}
                </Badge>
              )}
            </Title>
          </Group>

          {results.notes.length === 0 ? (
            query.trim() ? (
              <Text c="dimmed" ta="center" py="xl">
                未找到匹配的笔记
              </Text>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                输入关键词开始搜索笔记
              </Text>
            )
          ) : (
            <Stack gap="sm">
              {results.notes.map((note) => (
                <Card
                  key={note.id}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  style={{ cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
                  onClick={() => handleNoteClick(note)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
                >
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Group>
                        <Text fw={600} size="lg">
                          {note.name}
                        </Text>
                        {note.tags && note.tags.length > 0 && (
                          <Group gap="xs">
                            {note.tags.map((tag) => (
                              <Badge
                                key={tag}
                                color={NOTE_TAG_COLORS[tag]}
                                variant="light"
                                size="sm"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </Group>
                        )}
                      </Group>
                      <Rating value={note.rating} readOnly size="sm" />
                    </Group>

                    <Stack gap={3}>
                      {NOTE_TIERS.map((tier) => (
                        <Group align="flex-start" key={tier.key}>
                          <Text size="sm" w={50} fw={500} c={tier.color}>
                            {tier.label}：
                          </Text>
                          <Text size="sm" style={{ flex: 1 }}>
                            {note[tier.key]}
                          </Text>
                        </Group>
                      ))}
                    </Stack>

                    {note.remark && (
                      <Text size="sm" c="dimmed" fs="italic" lineClamp={2}>
                        备注：{note.remark}
                      </Text>
                    )}

                    <Text size="xs" c="dimmed">
                      更新于 {new Date(note.updatedAt).toLocaleString('zh-CN')}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </div>
      </Stack>
    </Stack>
  );
}
