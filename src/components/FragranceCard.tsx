import { ActionIcon, Button, Card, Group } from '@mantine/core';
import { IconColumns, IconHeart, IconNotes } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useFavoritesStore } from '../store/favoritesStore';
import { useComparisonStore } from '../store/comparisonStore';
import type { Fragrance } from '../types';
import { NoteSummary } from './NoteSummary';

interface FragranceCardProps {
  fragrance: Fragrance;
  onQuickNote?: (fragrance: Fragrance) => void;
}

/**
 * Mock 香调示例卡片：点击跳转到香调详情页
 */
export function FragranceCard({ fragrance, onQuickNote }: FragranceCardProps) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparisonStore();
  const favorited = isFavorite(fragrance.id);
  const inComparison = isInComparison(fragrance.id);

  const handleToggleComparison = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inComparison) {
      removeFromComparison(fragrance.id);
    } else {
      addToComparison(fragrance);
    }
  };

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
      <NoteSummary
        fragrance={fragrance}
        variant="card"
        headerExtra={
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
        }
      />

      <Group mt="md" justify="space-between">
        {onQuickNote && (
          <Button
            size="xs"
            variant="light"
            color="teal"
            onClick={(e) => {
              e.stopPropagation();
              onQuickNote(fragrance);
            }}
            leftSection={<IconNotes size={14} />}
          >
            记为笔记
          </Button>
        )}
        <Button
          size="xs"
          variant={inComparison ? 'filled' : 'light'}
          color={inComparison ? 'blue' : 'gray'}
          onClick={handleToggleComparison}
          disabled={!inComparison && !canAddMore()}
          leftSection={<IconColumns size={14} />}
        >
          {inComparison ? '移出对比' : canAddMore() ? '加入对比' : '对比已满'}
        </Button>
      </Group>
    </Card>
  );
}
