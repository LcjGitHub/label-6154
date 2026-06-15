import { Card, Grid, Group, Progress, Stack, Text, Title } from '@mantine/core';
import { IconChartBar, IconNotes, IconStar, IconFlask2, IconTags } from '@tabler/icons-react';
import { useMemo } from 'react';
import fragrancesData from '../mock/fragrances.json';
import { useNotesStore } from '../store/notesStore';
import { NOTE_TAGS, NOTE_TAG_COLORS, type Fragrance, type NoteTag } from '../types';
import {
  calculateNotesStatistics,
  calculateLibraryStatistics,
  getRatingPercentage,
  getTagPercentage,
} from '../utils/statistics';

const fragrances = fragrancesData as Fragrance[];

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

/** 通用统计卡片 */
function StatCard({ icon, title, value, subtitle, color = 'blue' }: StatCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group gap="md">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `var(--mantine-color-${color}-light)`,
            color: `var(--mantine-color-${color}-filled)`,
          }}
        >
          {icon}
        </div>
        <Stack gap={0}>
          <Text size="sm" c="dimmed">
            {title}
          </Text>
          <Text size="xl" fw={700}>
            {value}
          </Text>
          {subtitle && (
            <Text size="xs" c="dimmed">
              {subtitle}
            </Text>
          )}
        </Stack>
      </Group>
    </Card>
  );
}

interface RatingBarProps {
  rating: number;
  count: number;
  percentage: number;
}

/** 评分档位进度条 */
function RatingBar({ rating, count, percentage }: RatingBarProps) {
  const colors = ['red', 'orange', 'yellow', 'lime', 'green'];
  return (
    <Group gap="sm" align="center">
      <Text w={30} size="sm" fw={500} ta="right">
        {rating}星
      </Text>
      <Progress
        value={percentage}
        color={colors[rating - 1]}
        size="lg"
        style={{ flex: 1 }}
        radius="sm"
      />
      <Text w={60} size="sm" c="dimmed" ta="right">
        {count} 条 ({percentage.toFixed(1)}%)
      </Text>
    </Group>
  );
}

interface CategoryBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

/** 示例库分类进度条 */
function CategoryBar({ label, count, total, color }: CategoryBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <Group gap="sm" align="center">
      <Text w={60} size="sm" fw={500} ta="right">
        {label}
      </Text>
      <Progress value={percentage} color={color} size="lg" style={{ flex: 1 }} radius="sm" />
      <Text w={80} size="sm" c="dimmed" ta="right">
        {count} 款 ({percentage.toFixed(1)}%)
      </Text>
    </Group>
  );
}

interface TagBarProps {
  tag: NoteTag;
  count: number;
  percentage: number;
}

/** 标签统计进度条 */
function TagBar({ tag, count, percentage }: TagBarProps) {
  return (
    <Group gap="sm" align="center">
      <Text w={60} size="sm" fw={500} ta="right">
        {tag}
      </Text>
      <Progress
        value={percentage}
        color={NOTE_TAG_COLORS[tag]}
        size="lg"
        style={{ flex: 1 }}
        radius="sm"
      />
      <Text w={80} size="sm" c="dimmed" ta="right">
        {count} 条 ({percentage.toFixed(1)}%)
      </Text>
    </Group>
  );
}

/**
 * 数据统计页面：展示笔记统计与示例库统计概览
 */
export function StatisticsPage() {
  const { notes } = useNotesStore();

  const notesStats = useMemo(() => calculateNotesStatistics(notes), [notes]);
  const libraryStats = useMemo(() => calculateLibraryStatistics(fragrances), []);

  const notesEmpty = notes.length === 0;

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>
          <Group gap="sm" align="center">
            <IconChartBar size={28} />
            数据统计
          </Group>
        </Title>
      </Group>

      <Title order={3} size="h4" mt="md">
        个人笔记统计
      </Title>

      {notesEmpty ? (
        <Text c="dimmed" ta="center" py="xl" size="lg">
          还没有笔记，前往「我的笔记」页面开始记录，即可查看统计数据
        </Text>
      ) : (
        <>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <StatCard
                icon={<IconNotes size={24} />}
                title="笔记总数"
                value={notesStats.totalNotes}
                subtitle="已记录的香调笔记"
                color="blue"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <StatCard
                icon={<IconStar size={24} />}
                title="平均评分"
                value={notesStats.averageRating.toFixed(1)}
                subtitle="满分 5.0"
                color="yellow"
              />
            </Grid.Col>
          </Grid>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md" justify="space-between">
              <Text size="lg" fw={600}>
                评分档位分布
              </Text>
              <Text size="sm" c="dimmed">
                共 {notesStats.totalNotes} 条笔记
              </Text>
            </Group>
            <Stack gap="md">
              {[5, 4, 3, 2, 1].map((rating) => (
                <RatingBar
                  key={rating}
                  rating={rating}
                  count={
                    notesStats.ratingDistribution[
                      rating as keyof typeof notesStats.ratingDistribution
                    ]
                  }
                  percentage={getRatingPercentage(notesStats.ratingDistribution, rating)}
                />
              ))}
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md" justify="space-between">
              <Group gap="sm" align="center">
                <IconTags size={20} />
                <Text size="lg" fw={600}>
                  标签分布
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                共{' '}
                {notesStats.tagDistribution.日常 +
                  notesStats.tagDistribution.约会 +
                  notesStats.tagDistribution.工作 +
                  notesStats.tagDistribution.睡前}{' '}
                条标签使用
              </Text>
            </Group>
            {notesStats.tagDistribution.日常 +
              notesStats.tagDistribution.约会 +
              notesStats.tagDistribution.工作 +
              notesStats.tagDistribution.睡前 ===
            0 ? (
              <Text c="dimmed" ta="center" py="xl" size="lg">
                还没有添加标签，编辑笔记添加标签后即可查看统计
              </Text>
            ) : (
              <Stack gap="md">
                {NOTE_TAGS.map((tag) => (
                  <TagBar
                    key={tag}
                    tag={tag}
                    count={
                      notesStats.tagDistribution[tag as keyof typeof notesStats.tagDistribution]
                    }
                    percentage={getTagPercentage(notesStats.tagDistribution, tag)}
                  />
                ))}
              </Stack>
            )}
          </Card>
        </>
      )}

      <Title order={3} size="h4" mt="md">
        示例库统计
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <StatCard
            icon={<IconFlask2 size={24} />}
            title="香调总数"
            value={libraryStats.totalFragrances}
            subtitle="示例库中的全部香调"
            color="violet"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <StatCard
            icon={<IconFlask2 size={24} />}
            title="香水数量"
            value={libraryStats.perfumeCount}
            subtitle="香水分类"
            color="pink"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <StatCard
            icon={<IconFlask2 size={24} />}
            title="线香数量"
            value={libraryStats.incenseCount}
            subtitle="线香分类"
            color="indigo"
          />
        </Grid.Col>
      </Grid>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group mb="md" justify="space-between">
          <Text size="lg" fw={600}>
            分类占比分布
          </Text>
          <Text size="sm" c="dimmed">
            共 {libraryStats.totalFragrances} 款香调
          </Text>
        </Group>
        <Stack gap="md">
          <CategoryBar
            label="香水"
            count={libraryStats.perfumeCount}
            total={libraryStats.totalFragrances}
            color="pink"
          />
          <CategoryBar
            label="线香"
            count={libraryStats.incenseCount}
            total={libraryStats.totalFragrances}
            color="indigo"
          />
        </Stack>
      </Card>
    </Stack>
  );
}
