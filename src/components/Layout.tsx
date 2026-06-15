import { AppShell, Badge, Burger, Group, NavLink, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBook, IconHeart, IconNotes } from '@tabler/icons-react';
import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router-dom';
import { useFavoritesStore } from '../store/favoritesStore';

/**
 * 应用布局：顶部导航 + 侧边栏
 */
export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const { favorites } = useFavoritesStore();

  const navItems = [
    { to: '/library', label: '示例库', icon: IconBook },
    { to: '/favorites', label: '我的收藏', icon: IconHeart, badge: favorites.length },
    { to: '/notes', label: '我的笔记', icon: IconNotes },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 220,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>香调笔记</Title>
          </Group>
          <Text size="sm" c="dimmed">
            香水 / 线香香调 Mock 库
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            component={RouterNavLink}
            to={to}
            label={label}
            leftSection={<Icon size={18} stroke={1.5} />}
            rightSection={
              badge ? (
                <Badge size="sm" color="red" variant="filled">
                  {badge}
                </Badge>
              ) : null
            }
            active={location.pathname === to}
            variant="light"
            mb="xs"
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
