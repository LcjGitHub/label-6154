import { ActionIcon, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconClock, IconTrash, IconTrashX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useRecentHistoryStore } from '../store/recentHistoryStore';
import { NoteSummary } from '../components/NoteSummary';

function formatViewedAt(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

export function RecentHistoryPage() {
  const navigate = useNavigate();
  const { history, removeFromHistory, clearHistory } = useRecentHistoryStore();

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>
          <Group gap="xs">
            <IconClock size={24} color="blue" />
            最近浏览
          </Group>
        </Title>
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            共 {history.length} 条记录
          </Text>
          {history.length > 0 && (
            <Button
              size="xs"
              variant="light"
              color="gray"
              leftSection={<IconTrashX size={14} />}
              onClick={clearHistory}
            >
              清空全部
            </Button>
          )}
        </Group>
      </Group>

      {history.length === 0 ? (
        <Card withBorder padding="xl" ta="center">
          <Stack align="center" gap="md">
            <IconClock size={48} color="gray" />
            <Title order={4} c="dimmed">
              暂无浏览记录
            </Title>
            <Text c="dimmed">在示例库中打开香调详情页，浏览记录会自动保存在这里</Text>
          </Stack>
        </Card>
      ) : (
        <Stack gap="md">
          {history.map((item) => {
            return (
              <Card
                key={item.fragrance.id}
                withBorder
                padding="lg"
                radius="md"
                style={{ cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
                onClick={() => navigate(`/library/${item.fragrance.id}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
              >
                <Group justify="space-between" align="flex-start" mb="xs">
                  <Group align="flex-start">
                    <NoteSummary fragrance={item.fragrance} variant="list" />
                  </Group>
                  <Group gap="xs" align="flex-start">
                    <Text size="xs" c="dimmed">
                      {formatViewedAt(item.viewedAt)}
                    </Text>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item.fragrance.id);
                      }}
                      title="删除记录"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            );
          })}
        </Stack>
      )}
    </>
  );
}
