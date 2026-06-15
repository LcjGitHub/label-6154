import { ActionIcon, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useFavoritesStore } from '../store/favoritesStore';
import { NoteSummary } from '../components/NoteSummary';

/**
 * 收藏夹页面：展示已收藏的香调列表
 */
export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavoritesStore();

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>
          <Group gap="xs">
            <IconHeart size={24} fill="red" color="red" />
            我的收藏
          </Group>
        </Title>
        <Text size="sm" c="dimmed">
          共 {favorites.length} 个收藏
        </Text>
      </Group>

      {favorites.length === 0 ? (
        <Card withBorder padding="xl" ta="center">
          <Stack align="center" gap="md">
            <IconHeart size={48} color="gray" />
            <Title order={4} c="dimmed">
              暂无收藏
            </Title>
            <Text c="dimmed">在示例库中点击卡片右上角的心形按钮，将喜欢的香调添加到收藏夹</Text>
          </Stack>
        </Card>
      ) : (
        <Stack gap="md">
          {favorites.map((fragrance) => {
            return (
              <Card
                key={fragrance.id}
                withBorder
                padding="lg"
                radius="md"
                style={{ cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
                onClick={() => navigate(`/library/${fragrance.id}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
              >
                <NoteSummary
                  fragrance={fragrance}
                  variant="list"
                  headerExtra={
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(fragrance);
                      }}
                      title="取消收藏"
                    >
                      <IconHeart size={18} fill="red" />
                    </ActionIcon>
                  }
                />
              </Card>
            );
          })}
        </Stack>
      )}
    </>
  );
}
