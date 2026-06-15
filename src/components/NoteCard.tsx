import { ActionIcon, Badge, Card, Group, Rating, Stack, Text, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { NOTE_TAG_COLORS, type Note } from '../types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onViewDetail: (note: Note) => void;
}

/**
 * 个人笔记卡片
 */
export function NoteCard({ note, onEdit, onDelete, onViewDetail }: NoteCardProps) {
  const tags = note.tags ?? [];

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetail(note);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder onClick={handleContentClick} style={{ cursor: 'pointer' }}>
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="lg">
          {note.name}
        </Text>
        <Group gap="xs" onClick={handleActionClick}>
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

      {tags.length > 0 && (
        <Group gap="xs" mb="sm">
          {tags.map((tag) => (
            <Badge key={tag} color={NOTE_TAG_COLORS[tag]} variant="light">
              {tag}
            </Badge>
          ))}
        </Group>
      )}

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
