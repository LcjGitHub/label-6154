import { Card, Group, Stack, Switch, Text, Title } from '@mantine/core';
import { IconMoon, IconSettings, IconSun } from '@tabler/icons-react';
import { useThemeStore } from '../store/themeStore';

export function SettingsPage() {
  const { colorScheme, toggleColorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>
          <Group gap="sm" align="center">
            <IconSettings size={28} />
            设置
          </Group>
        </Title>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="center">
          <Group gap="sm">
            {isDark ? <IconMoon size={22} /> : <IconSun size={22} />}
            <div>
              <Text fw={500}>界面主题</Text>
              <Text size="sm" c="dimmed">
                {isDark ? '当前：深色模式' : '当前：浅色模式'}
              </Text>
            </div>
          </Group>
          <Switch
            checked={isDark}
            onChange={toggleColorScheme}
            onLabel={<IconMoon size={16} />}
            offLabel={<IconSun size={16} />}
            size="lg"
          />
        </Group>
      </Card>
    </Stack>
  );
}
