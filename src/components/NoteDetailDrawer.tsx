import { Badge, Button, Drawer, Group, Rating, Stack, Text } from '@mantine/core';
import { IconCalendarTime, IconClock, IconEdit, IconTrash } from '@tabler/icons-react';
import { NOTE_TAG_COLORS, type Note } from '../types';

interface NoteDetailDrawerProps {
  opened: boolean;
  onClose: () => void;
  note: Note | null;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

/**
 * 笔记详情抽屉：从右侧滑出展示笔记完整信息，底部提供编辑、删除等快捷操作
 */
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
      styles={{
        body: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 0,
        },
      }}
    >
      <Stack gap="lg" style={{ flex: 1, overflowY: 'auto', paddingTop: 'var(--mantine-spacing-md)' }}>
        <Text fw={700} size="xl">
          {note.name}
        </Text>

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

        <Stack gap={4}>
          <Text size="sm" fw={500} c="dimmed">
            备注
          </Text>
          <Text size="md" c={note.remark ? undefined : 'dimmed'} style={{ whiteSpace: 'pre-wrap' }}>
            {note.remark || '暂无'}
          </Text>
        </Stack>

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

      <Group justify="space-between" pt="md" mt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)', flexShrink: 0 }}>
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
    </Drawer>
  );
}
