import { Badge, Button, Card, Group, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconClearAll, IconFilter, IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fragrancesData from '../mock/fragrances.json';
import { CategoryBadge, NOTE_TIERS } from '../components/NoteSummary';
import {
  EMPTY_CRITERIA,
  filterFragrances,
  hasAnyCriteria,
  type ScentFilterCriteria,
} from '../utils/scentFilterUtils';
import type { Fragrance } from '../types';

const fragrances = fragrancesData as Fragrance[];

const CATEGORY_OPTIONS = [
  { value: 'perfume', label: '香水' },
  { value: 'incense', label: '线香' },
];

export function ScentAdvancedFilter() {
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState<ScentFilterCriteria>(EMPTY_CRITERIA);

  const updateCriteria = <K extends keyof ScentFilterCriteria>(
    key: K,
    value: ScentFilterCriteria[K],
  ) => {
    setCriteria((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => setCriteria(EMPTY_CRITERIA);

  const results = useMemo(() => filterFragrances(fragrances, criteria), [criteria]);

  const active = hasAnyCriteria(criteria);

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Group>
          <Title order={2}>香调高级筛选</Title>
          {active && (
            <Badge color="teal" variant="light" size="lg">
              {results.length} 条结果
            </Badge>
          )}
        </Group>
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconClearAll size={16} />}
          onClick={clearAll}
          disabled={!active}
        >
          清空条件
        </Button>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group mb="md">
          <IconFilter size={20} />
          <Text fw={600}>筛选条件</Text>
        </Group>

        <Stack gap="md">
          <Select
            label="分类"
            placeholder="全部分类"
            clearable
            data={CATEGORY_OPTIONS}
            value={criteria.category}
            onChange={(val) => updateCriteria('category', val)}
            w={200}
          />

          <TextInput
            label="前调关键词"
            placeholder="如：佛手柑、柠檬（多个关键词用逗号或空格分隔）"
            leftSection={<IconSearch size={14} />}
            value={criteria.topNoteKeywords}
            onChange={(e) => updateCriteria('topNoteKeywords', e.currentTarget.value)}
          />

          <TextInput
            label="中调关键词"
            placeholder="如：玫瑰、茉莉（多个关键词用逗号或空格分隔）"
            leftSection={<IconSearch size={14} />}
            value={criteria.middleNoteKeywords}
            onChange={(e) => updateCriteria('middleNoteKeywords', e.currentTarget.value)}
          />

          <TextInput
            label="后调关键词"
            placeholder="如：麝香、檀木（多个关键词用逗号或空格分隔）"
            leftSection={<IconSearch size={14} />}
            value={criteria.baseNoteKeywords}
            onChange={(e) => updateCriteria('baseNoteKeywords', e.currentTarget.value)}
          />
        </Stack>
      </Card>

      {active ? (
        results.length > 0 ? (
          <Stack gap="sm">
            {results.map((fragrance) => (
              <Card
                key={fragrance.id}
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                style={{ cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
                onClick={() => navigate(`/library/${fragrance.id}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
              >
                <Group justify="space-between" align="flex-start" mb="xs">
                  <Group>
                    <Text fw={600} size="lg">
                      {fragrance.name}
                    </Text>
                    <CategoryBadge category={fragrance.category} />
                  </Group>
                </Group>

                <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                  {fragrance.description}
                </Text>

                <Stack gap={4}>
                  {NOTE_TIERS.map((tier) => (
                    <Group align="flex-start" key={tier.key}>
                      <Text size="sm" w={50} fw={500} c={tier.color}>
                        {tier.label}：
                      </Text>
                      <Text size="sm" style={{ flex: 1 }}>
                        {fragrance[tier.key]}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Card>
            ))}
          </Stack>
        ) : (
          <Title order={4} c="dimmed" ta="center" mt="xl">
            未找到匹配的香调
          </Title>
        )
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          请设置筛选条件后查看结果
        </Text>
      )}
    </Stack>
  );
}
