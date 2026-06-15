import { Badge, Group, Stack, Text } from '@mantine/core';
import type { Fragrance } from '../types';

export function getCategoryInfo(category: Fragrance['category']) {
  return category === 'perfume'
    ? { label: '香水', color: 'grape' }
    : { label: '线香', color: 'orange' };
}

export function CategoryBadge({ category }: { category: Fragrance['category'] }) {
  const { label, color } = getCategoryInfo(category);
  return (
    <Badge color={color} variant="light">
      {label}
    </Badge>
  );
}

export const NOTE_TIERS = [
  { label: '前调', key: 'topNotes' as const, color: 'teal' },
  { label: '中调', key: 'middleNotes' as const, color: 'blue' },
  { label: '后调', key: 'baseNotes' as const, color: 'violet' },
];

interface NoteSummaryProps {
  fragrance: Fragrance;
  variant?: 'card' | 'list';
  headerExtra?: React.ReactNode;
}

export function NoteSummary({ fragrance, variant = 'card', headerExtra }: NoteSummaryProps) {
  if (variant === 'card') {
    return (
      <>
        <Group justify="space-between" mb="xs">
          <Text fw={600} size="lg">
            {fragrance.name}
          </Text>
          <Group gap="xs">
            <CategoryBadge category={fragrance.category} />
            {headerExtra}
          </Group>
        </Group>

        <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
          {fragrance.description}
        </Text>

        <Stack gap={4}>
          {NOTE_TIERS.map((tier) => (
            <Text size="sm" key={tier.key}>
              <Text span fw={500} c={tier.color}>
                {tier.label}：
              </Text>
              {fragrance[tier.key]}
            </Text>
          ))}
        </Stack>
      </>
    );
  }

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="xs">
        <Group>
          <Text fw={600} size="lg">
            {fragrance.name}
          </Text>
          <CategoryBadge category={fragrance.category} />
        </Group>
        {headerExtra}
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
    </>
  );
}
