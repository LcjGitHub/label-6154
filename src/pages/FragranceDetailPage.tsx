import { Badge, Box, Button, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import fragrancesData from '../mock/fragrances.json';
import type { Fragrance } from '../types';

const fragrances = fragrancesData as Fragrance[];

export function FragranceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fragrance = fragrances.find((f) => f.id === id);

  if (!fragrance) {
    return (
      <Stack align="center" mt="xl">
        <Text c="dimmed" size="lg">未找到该香调</Text>
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/library')}>
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

      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Group justify="space-between" mb="sm">
          <Title order={2}>{fragrance.name}</Title>
          <Badge color={categoryColor} variant="light" size="lg">
            {categoryLabel}
          </Badge>
        </Group>

        <Text c="dimmed" size="md" mb="lg">
          {fragrance.description}
        </Text>

        <Divider my="md" />

        <Stack gap="md">
          <Paper withBorder p="md" radius="sm" bg="teal.0">
            <Text fw={600} size="sm" c="teal.7" mb={4}>前调</Text>
            <Text size="md">{fragrance.topNotes}</Text>
          </Paper>

          <Paper withBorder p="md" radius="sm" bg="blue.0">
            <Text fw={600} size="sm" c="blue.7" mb={4}>中调</Text>
            <Text size="md">{fragrance.middleNotes}</Text>
          </Paper>

          <Paper withBorder p="md" radius="sm" bg="violet.0">
            <Text fw={600} size="sm" c="violet.7" mb={4}>后调</Text>
            <Text size="md">{fragrance.baseNotes}</Text>
          </Paper>
        </Stack>
      </Paper>
    </Box>
  );
}
