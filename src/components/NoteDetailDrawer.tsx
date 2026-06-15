import { ActionIcon, Badge, Button, Drawer, Group, Rating, Stack, Text, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash, IconCalendarTime, IconClock } from '@tabler/icons-react';
import { NOTE_TAG_COLORS, type Note } from '../types';

interface NoteDetailDrawerProps {
  opened: boolean;
  onClose: () => void;
  note: Note | null;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteDetailDrawer({ opened, onClose, note, onEdit, onDelete }: NoteDetailDrawerProps) {
  if (!note) return null;

  const tags = note.tags ?? [];

  const handleEdit = () => {
    onEdit(note);
    onClose();
  };

  const handleDelete = () => {
    onDelete(note.id);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="笔记详情"
      position="right"
      size="md"
      padding="xl"
    >
      <Stack gap="lg" h="100%">
        <Stack gap="md" style={{ flex: 1, overflowY: 'auto' }}>
          <Group justify="space-between" align="flex-start">
            <Text fw={700} size="xl">
              {note.name}
            </Text>
            <Group gap="xs">
              <Tooltip label="编辑">
                <ActionIcon variant="light" color="blue" onClick={handleEdit}>
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="删除">
                <ActionIcon variant="light" color="red" onClick={handleDelete}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          {tags.length > 0 && (
            <Group gap="xs">
              {tags.map((tag) => (
                <Badge key={tag} color={NOTE_TAG_COLORS[tag]} variant="light">
                  {tag}
                </Badge>
              ))}
            </Group>
          )}

          <Rating value={note.rating} readOnly size="lg" />

          <Stack gap="md">
            <Stack gap={4}>
              <Text size="sm" fw={500} c="teal">
                前调
              </Text>
              <Text size="md">{note.topNotes}</Text>
            </Stack>

            <Stack gap={4}>
              <Text size="sm" fw={500} c="blue">
                中调
              </Text>
              <Text size="md">{note.middleNotes}</Text>
            </Stack>

            <Stack gap={4}>
              <Text size="sm" fw={500} c="violet">
                后调
              </Text>
              <Text size="md">{note.baseNotes}</Text>
            </Stack>
          </Stack>

          {note.remark && (
            <Stack gap={4}>
              <Text size="sm" fw={500} c="dimmed">
                备注
              </Text>
              <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
                {note.remark}
              </Text>
            </Stack>
          )}

          <Stack gap={4} pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
            <Group gap="xs">
              <IconCalendarTime size={14} />
              <Text size="sm" c="dimmed">
                创建时间：{new Date(note.createdAt).toLocaleString('zh-CN')}
              </Text>
            </Group>
            <Group gap="xs">
              <IconClock size={14} />
              <Text size="sm" c="dimmed">
                更新时间：{new Date(note.updatedAt).toLocaleString('zh-CN')}
              </Text>
            </Group>
          </Stack>
        </Stack>

        <Group justify="space-between" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Button variant="default" onClick={onClose} style={{ flex: 1 }}>
            关闭
          </Button>
          <Button variant="light" color="blue" leftSection={<IconEdit size={16} />} onClick={handleEdit} style={{ flex: 1 }}>
            编辑
          </Button>
          <Button variant="light" color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete} style={{ flex: 1 }}>
            删除
          </Button>
        </Group>
      </Stack>
    </Drawer>
  );
}
