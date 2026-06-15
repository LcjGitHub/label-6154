import { ActionIcon, Badge, Card, Group, Stack, Text } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useFavoritesStore } from '../store/favoritesStore';
import type { Fragrance } from '../types';

interface FragranceCardProps {
  fragrance: Fragrance;
}

/**
 * Mock 香调示例卡片：点击跳转到香调详情页
 */
export function FragranceCard({ fragrance }: FragranceCardProps) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(fragrance.id);
  const categoryLabel = fragrance.category === 'perfume' ? '香水' : '线香';
  const categoryColor = fragrance.category === 'perfume' ? 'grape' : 'orange';

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ position: 'relative', cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
      onClick={() => navigate(`/library/${fragrance.id}`)}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="lg">
          {fragrance.name}
        </Text>
        <Group gap="xs">
          <Badge color={categoryColor} variant="light">
            {categoryLabel}
          </Badge>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(fragrance);
            }}
            title={favorited ? '取消收藏' : '添加收藏'}
          >
            <IconHeart size={18} fill={favorited ? 'red' : 'none'} />
          </ActionIcon>
        </Group>
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
