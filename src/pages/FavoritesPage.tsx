import { ActionIcon, Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconHeart, IconTrash } from '@tabler/icons-react';
import { useFavoritesStore } from '../store/favoritesStore';

/**
 * 收藏夹页面：展示已收藏的香调列表
 */
export function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoritesStore();

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
            <Text c="dimmed">
              在示例库中点击卡片右上角的心形按钮，将喜欢的香调添加到收藏夹
            </Text>
          </Stack>
        </Card>
      ) : (
        <Stack gap="md">
          {favorites.map((fragrance) => {
            const categoryLabel = fragrance.category === 'perfume' ? '香水' : '线香';
            const categoryColor = fragrance.category === 'perfume' ? 'grape' : 'orange';

            return (
              <Card key={fragrance.id} withBorder padding="lg" radius="md">
                <Group justify="space-between" align="flex-start" mb="xs">
                  <Group>
                    <Text fw={600} size="lg">
                      {fragrance.name}
                    </Text>
                    <Badge color={categoryColor} variant="light">
                      {categoryLabel}
                    </Badge>
                  </Group>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => removeFavorite(fragrance.id)}
                    title="取消收藏"
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>

                <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                  {fragrance.description}
                </Text>

                <Stack gap={4}>
                  <Group align="flex-start">
                    <Text size="sm" w={50} fw={500} c="teal">
                      前调：
                    </Text>
                    <Text size="sm" style={{ flex: 1 }}>
                      {fragrance.topNotes}
                    </Text>
                  </Group>
                  <Group align="flex-start">
                    <Text size="sm" w={50} fw={500} c="blue">
                      中调：
                    </Text>
                    <Text size="sm" style={{ flex: 1 }}>
                      {fragrance.middleNotes}
                    </Text>
                  </Group>
                  <Group align="flex-start">
                    <Text size="sm" w={50} fw={500} c="violet">
                      后调：
                    </Text>
                    <Text size="sm" style={{ flex: 1 }}>
                      {fragrance.baseNotes}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      )}
    </>
  );
}
