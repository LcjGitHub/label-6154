import { Button, Checkbox, Group, Modal, Rating, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useEffect } from 'react';
import { noteFormSchema } from '../schemas/noteForm';
import { NOTE_TAGS, NOTE_TAG_COLORS, type Note, type NoteFormValues, type NoteTag } from '../types';

interface NoteFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: NoteFormValues) => void;
  initialValues?: Note | null;
  title: string;
}

const emptyValues: NoteFormValues = {
  name: '',
  topNotes: '',
  middleNotes: '',
  baseNotes: '',
  rating: 3,
  remark: '',
  tags: [],
};

/**
 * 新建 / 编辑笔记 Modal 表单
 */
export function NoteFormModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
  title,
}: NoteFormModalProps) {
  const form = useForm<NoteFormValues>({
    initialValues: emptyValues,
    validate: zodResolver(noteFormSchema),
  });

  useEffect(() => {
    if (opened) {
      if (initialValues) {
        form.setValues({
          name: initialValues.name,
          topNotes: initialValues.topNotes,
          middleNotes: initialValues.middleNotes,
          baseNotes: initialValues.baseNotes,
          rating: initialValues.rating,
          remark: initialValues.remark,
          tags: initialValues.tags ?? [],
        });
      } else {
        form.setValues(emptyValues);
      }
      form.clearErrors();
    }
  }, [opened, initialValues]);

  const handleSubmit = form.onSubmit((values) => {
    onSubmit(values);
    onClose();
  });

  const currentTags = form.values.tags;

  return (
    <Modal opened={opened} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="名称"
            placeholder="输入香调名称"
            withAsterisk
            {...form.getInputProps('name')}
          />
          <TextInput
            label="前调"
            placeholder="例如：佛手柑、青柠"
            withAsterisk
            {...form.getInputProps('topNotes')}
          />
          <TextInput
            label="中调"
            placeholder="例如：白兰花、茉莉"
            withAsterisk
            {...form.getInputProps('middleNotes')}
          />
          <TextInput
            label="后调"
            placeholder="例如：白麝香、雪松"
            withAsterisk
            {...form.getInputProps('baseNotes')}
          />
          <Stack gap={4}>
            <Text size="sm" fw={500}>
              评分 <Text span c="red">*</Text>
            </Text>
            <Rating
              value={form.values.rating}
              onChange={(value) => form.setFieldValue('rating', value)}
            />
            {form.errors.rating && (
              <Text size="xs" c="red">
                {form.errors.rating}
              </Text>
            )}
          </Stack>
          <Stack gap={4}>
            <Text size="sm" fw={500}>
              标签
            </Text>
            <Checkbox.Group
              value={currentTags as string[]}
              onChange={(values) => form.setFieldValue('tags', values as NoteTag[])}
            >
              <Group mt="xs">
                {NOTE_TAGS.map((tag) => (
                  <Checkbox
                    key={tag}
                    value={tag}
                    label={tag}
                    color={NOTE_TAG_COLORS[tag]}
                  />
                ))}
              </Group>
            </Checkbox.Group>
          </Stack>
          <Textarea
            label="备注"
            placeholder="个人感受、使用场景等"
            minRows={3}
            {...form.getInputProps('remark')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
