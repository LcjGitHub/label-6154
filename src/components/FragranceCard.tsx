import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import type { Fragrance } from '../types';

interface FragranceCardProps {
  fragrance: Fragrance;
}

/**
 * Mock 香调示例卡片
 */
export function FragranceCard({ fragrance }: FragranceCardProps) {
  const categoryLabel = fragrance.category === 'perfume' ? '香水' : '线香';
  const categoryColor = fragrance.category === 'perfume' ? 'grape' : 'orange';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="lg">
          {fragrance.name}
        </Text>
        <Badge color={categoryColor} variant="light">
          {categoryLabel}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
        {fragrance.description}
      </Text>

      <Stack gap={4}>
        <Text size="sm">
          <Text span fw={500} c="teal">
            前调：
          </Text>
          {fragrance.topNotes}
        </Text>
        <Text size="sm">
          <Text span fw={500} c="blue">
            中调：
          </Text>
          {fragrance.middleNotes}
        </Text>
        <Text size="sm">
          <Text span fw={500} c="violet">
            后调：
          </Text>
          {fragrance.baseNotes}
        </Text>
      </Stack>
    </Card>
  );
}
