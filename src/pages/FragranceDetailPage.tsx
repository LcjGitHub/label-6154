import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowLeft, IconHeart } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFavoritesStore } from '../store/favoritesStore';
import { useRecentHistoryStore } from '../store/recentHistoryStore';
import fragrancesData from '../mock/fragrances.json';
import type { Fragrance } from '../types';

const fragrances = fragrancesData as Fragrance[];

/**
 * 香调详情页：展示指定香调的完整名称、分类、前中后调与描述，顶部提供返回按钮
 */
export function FragranceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addToHistory } = useRecentHistoryStore();

  const fragrance = fragrances.find((f) => f.id === id);

  useEffect(() => {
    if (fragrance) {
      addToHistory(fragrance);
    }
  }, [fragrance, addToHistory]);

  if (!fragrance) {
    return (
      <Stack align="center" mt="xl">
        <Text c="dimmed" size="lg">
          未找到该香调
        </Text>
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/library')}
        >
          返回示例库
        </Button>
      </Stack>
    );
  }

  const categoryLabel = fragrance.category === 'perfume' ? '香水' : '线香';
  const categoryColor = fragrance.category === 'perfume' ? 'grape' : 'orange';

  return (
    <Box>
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate('/library')}
        mb="md"
      >
        返回示例库
      </Button>

      <Title order={2} mb="md">
        香调详情
      </Title>

      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Group justify="space-between" mb="sm">
          <Title order={3}>{fragrance.name}</Title>
          <Group gap="xs">
            <Badge color={categoryColor} variant="light" size="lg">
              {categoryLabel}
            </Badge>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => toggleFavorite(fragrance)}
              title={isFavorite(fragrance.id) ? '取消收藏' : '添加收藏'}
            >
              <IconHeart size={20} fill={isFavorite(fragrance.id) ? 'red' : 'none'} />
            </ActionIcon>
          </Group>
        </Group>

        <Text c="dimmed" size="md" mb="lg">
          {fragrance.description}
        </Text>

        <Divider my="md" />

        <Stack gap="md">
          <Paper withBorder p="md" radius="sm" bg="teal.0">
            <Text fw={600} size="sm" c="teal.7" mb={4}>
              前调
            </Text>
            <Text size="md">{fragrance.topNotes}</Text>
          </Paper>

          <Paper withBorder p="md" radius="sm" bg="blue.0">
            <Text fw={600} size="sm" c="blue.7" mb={4}>
              中调
            </Text>
            <Text size="md">{fragrance.middleNotes}</Text>
          </Paper>

          <Paper withBorder p="md" radius="sm" bg="violet.0">
            <Text fw={600} size="sm" c="violet.7" mb={4}>
              后调
            </Text>
            <Text size="md">{fragrance.baseNotes}</Text>
          </Paper>
        </Stack>
      </Paper>
    </Box>
  );
}
