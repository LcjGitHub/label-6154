import { ActionIcon, Badge, Button, Container, Group, ScrollArea, Stack, Table, Text, Title } from '@mantine/core';
import { IconColumns, IconExternalLink, IconTrash, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useComparisonStore } from '../store/comparisonStore';

/**
 * 香调对比页：以表格形式并列展示所选香调的名称、分类、前中后调与简介
 */
export function ComparisonPage() {
  const navigate = useNavigate();
  const { comparisonList, removeFromComparison, clearComparison } = useComparisonStore();

  const rows = [
    { label: '分类', key: 'category', color: '' },
    { label: '前调', key: 'topNotes', color: 'teal' },
    { label: '中调', key: 'middleNotes', color: 'blue' },
    { label: '后调', key: 'baseNotes', color: 'violet' },
    { label: '简介', key: 'description', color: '' },
  ] as const;

  const formatCategory = (category: 'perfume' | 'incense') => {
    return category === 'perfume'
      ? { label: '香水', color: 'grape' }
      : { label: '线香', color: 'orange' };
  };

  if (comparisonList.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center" gap="lg" py={40}>
          <IconColumns size={64} stroke={1.5} color="#adb5bd" />
          <Stack gap={4} align="center">
            <Title order={3} c="dimmed">
              暂无对比项
            </Title>
            <Text size="sm" c="dimmed">
              请前往示例库选择最多 3 款香调加入对比
            </Text>
          </Stack>
          <Button variant="light" onClick={() => navigate('/library')}>
            去示例库选择
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Stack gap={4}>
            <Title order={2}>香调对比</Title>
            <Text size="sm" c="dimmed">
              已选择 {comparisonList.length} / 3 款进行对比
            </Text>
          </Stack>
          <Group>
            <Button
              variant="subtle"
              color="red"
              onClick={clearComparison}
              leftSection={<IconTrash size={16} />}
            >
              清空对比
            </Button>
            <Button variant="light" onClick={() => navigate('/library')}>
              继续选择
            </Button>
          </Group>
        </Group>

        <ScrollArea type="always" scrollbarSize={6} offsetScrollbars>
          <Table striped highlightOnHover withTableBorder verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={100} style={{ backgroundColor: '#f8f9fa' }}>
                  <Text fw={600}>属性</Text>
                </Table.Th>
                {comparisonList.map((fragrance) => (
                  <Table.Th key={fragrance.id} style={{ minWidth: 240 }}>
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={4}>
                        <Text fw={600} size="lg">
                          {fragrance.name}
                        </Text>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="gray"
                          onClick={() => navigate(`/library/${fragrance.id}`)}
                          title="查看详情"
                        >
                          <IconExternalLink size={14} />
                        </ActionIcon>
                      </Stack>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => removeFromComparison(fragrance.id)}
                        title="移除对比"
                      >
                        <IconX size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Th>
                ))}
                {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                  <Table.Th key={`empty-${i}`} style={{ minWidth: 240, backgroundColor: '#f8f9fa' }}>
                    <Stack align="center" justify="center" h={60}>
                      <Text size="sm" c="dimmed">
                        空位
                      </Text>
                      <Button size="xs" variant="subtle" onClick={() => navigate('/library')}>
                        + 添加
                      </Button>
                    </Stack>
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {rows.map((row) => (
                <Table.Tr key={row.key}>
                  <Table.Td style={{ backgroundColor: '#f8f9fa' }}>
                    <Text fw={500} c={row.color || undefined}>
                      {row.label}
                    </Text>
                  </Table.Td>
                  {comparisonList.map((fragrance) => (
                    <Table.Td
                      key={`${fragrance.id}-${row.key}`}
                      style={{ verticalAlign: 'top' }}
                    >
                      {row.key === 'category' ? (
                        (() => {
                          const cat = formatCategory(fragrance.category);
                          return (
                            <Badge color={cat.color} variant="light">
                              {cat.label}
                            </Badge>
                          );
                        })()
                      ) : (
                        <Text size="sm" lh={1.6}>
                          {fragrance[row.key]}
                        </Text>
                      )}
                    </Table.Td>
                  ))}
                  {Array.from({ length: 3 - comparisonList.length }).map((_, i) => (
                    <Table.Td
                      key={`empty-${row.key}-${i}`}
                      style={{ backgroundColor: '#fafafa' }}
                    >
                      <Text size="sm" c="dimmed" ta="center">
                        —
                      </Text>
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Container>
  );
}
