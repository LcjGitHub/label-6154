import { ActionIcon, Card, Group, Rating, Stack, Text, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

/**
 * 个人笔记卡片
 */
export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="lg">
          {note.name}
        </Text>
        <Group gap="xs">
          <Tooltip label="编辑">
            <ActionIcon variant="light" color="blue" onClick={() => onEdit(note)}>
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="删除">
            <ActionIcon variant="light" color="red" onClick={() => onDelete(note.id)}>
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Rating value={note.rating} readOnly mb="sm" />

      <Stack gap={4} mb="sm">
        <Text size="sm">
          <Text span fw={500} c="teal">
            前调：
          </Text>
          {note.topNotes}
        </Text>
        <Text size="sm">
          <Text span fw={500} c="blue">
            中调：
          </Text>
          {note.middleNotes}
        </Text>
        <Text size="sm">
          <Text span fw={500} c="violet">
            后调：
          </Text>
          {note.baseNotes}
        </Text>
      </Stack>

      {note.remark && (
        <Text size="sm" c="dimmed" fs="italic">
          备注：{note.remark}
        </Text>
      )}

      <Text size="xs" c="dimmed" mt="sm">
        更新于 {new Date(note.updatedAt).toLocaleString('zh-CN')}
      </Text>
    </Card>
  );
}
