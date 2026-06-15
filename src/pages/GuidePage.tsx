import { Badge, Card, Group, List, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import {
  IconBook,
  IconCirclesRelation,
  IconDeviceFloppy,
  IconFileText,
  IconHeart,
  IconHelp,
  IconNotes,
} from '@tabler/icons-react';

const APP_VERSION = '1.0.0';

const sections = [
  {
    icon: IconBook,
    title: '示例库浏览',
    color: 'blue',
    steps: [
      '点击侧边栏「示例库」进入浏览页面',
      '使用顶部搜索框输入关键词，支持搜索名称、前调、中调、后调及描述',
      '通过分类筛选下拉框选择「香水」或「线香」缩小范围',
      '点击卡片可查看香调详情页的完整信息',
    ],
  },
  {
    icon: IconHeart,
    title: '收藏对比',
    color: 'red',
    steps: [
      '在示例库或详情页点击收藏图标，将喜欢的香调加入收藏夹',
      '点击侧边栏「我的收藏」查看所有已收藏的香调列表',
      '在收藏页勾选多个香调，点击「加入对比」进行横向比较',
      '通过「香调对比」页面查看前中后调的详细对照表',
    ],
  },
  {
    icon: IconNotes,
    title: '快捷记笔记',
    color: 'yellow',
    steps: [
      '在任意香调卡片或详情页点击「记笔记」按钮',
      '系统将自动填充香调名称、分类等基础信息',
      '填写自己的使用感受、留香时间、适用场景等内容',
      '点击「保存」即可将笔记存入个人笔记库',
    ],
  },
  {
    icon: IconFileText,
    title: '个人笔记管理',
    color: 'green',
    steps: [
      '点击侧边栏「我的笔记」查看所有已创建的笔记',
      '使用搜索框按关键词快速定位笔记',
      '点击笔记卡片展开详情，可查看完整内容与创建时间',
      '支持编辑、删除操作，及时更新笔记内容',
    ],
  },
  {
    icon: IconDeviceFloppy,
    title: '数据备份',
    color: 'purple',
    steps: [
      '点击侧边栏底部「导出备份」，将全部笔记导出为纯文本文件',
      '建议定期导出备份，防止本地数据丢失',
      '更换设备或数据丢失时，点击「导入恢复」选择之前的备份文件',
      '系统将自动解析并合并笔记，显示导入成功和跳过的条数',
    ],
  },
];

export function GuidePage() {
  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>
          <Group gap="sm" align="center">
            <IconHelp size={28} />
            使用指南
          </Group>
        </Title>
        <Group>
          <Badge size="lg" variant="light" color="blue">
            香调笔记 v{APP_VERSION}
          </Badge>
        </Group>
      </Group>

      <Stack gap="md">
        {sections.map(({ icon: Icon, title, color, steps }) => (
          <Card key={title} shadow="sm" padding="lg" radius="md" withBorder>
            <Group gap="sm" mb="md" align="flex-start">
              <ThemeIcon color={color} variant="light" size={32} radius="md">
                <Icon size={20} />
              </ThemeIcon>
              <div>
                <Title order={4}>{title}</Title>
                <Text size="sm" c="dimmed">
                  操作步骤说明
                </Text>
              </div>
            </Group>
            <List
              spacing="sm"
              size="sm"
              center
              icon={
                <ThemeIcon color={color} variant="light" size={18} radius="xl">
                  <IconCirclesRelation size={10} />
                </ThemeIcon>
              }
            >
              {steps.map((step, idx) => (
                <List.Item key={idx}>
                  <Text>{step}</Text>
                </List.Item>
              ))}
            </List>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
