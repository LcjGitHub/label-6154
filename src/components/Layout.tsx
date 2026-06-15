import { AppShell, Badge, Burger, Button, Divider, Group, Modal, NavLink, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBook, IconChartBar, IconColumns, IconDownload, IconHeart, IconNotes, IconUpload } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router-dom';
import { useFavoritesStore } from '../store/favoritesStore';
import { useComparisonStore } from '../store/comparisonStore';
import { useNotesStore } from '../store/notesStore';
import { exportNotesToFile, parseBackupFile } from '../utils/backup';

/**
 * 应用布局：顶部导航 + 侧边栏
 */
export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const { favorites } = useFavoritesStore();
  const { comparisonList } = useComparisonStore();
  const { notes, importNotes } = useNotesStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<{ count: number; show: boolean }>({
    count: 0,
    show: false,
  });
  const [errorModal, setErrorModal] = useState<{ message: string; show: boolean }>({
    message: '',
    show: false,
  });

  const handleExport = () => {
    exportNotesToFile(notes);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedNotes = await parseBackupFile(file);
      if (parsedNotes.length === 0) {
        setErrorModal({ message: '未找到有效的笔记数据', show: true });
      } else {
        const count = importNotes(parsedNotes);
        setImportResult({ count, show: true });
      }
    } catch (err) {
      setErrorModal({
        message: err instanceof Error ? err.message : '导入失败',
        show: true,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const navItems = [
    { to: '/library', label: '示例库', icon: IconBook },
    { to: '/comparison', label: '香调对比', icon: IconColumns, badge: comparisonList.length },
    { to: '/favorites', label: '我的收藏', icon: IconHeart, badge: favorites.length },
    { to: '/notes', label: '我的笔记', icon: IconNotes },
    { to: '/statistics', label: '数据统计', icon: IconChartBar },
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
        <Stack gap="xs" style={{ height: '100%', justifyContent: 'space-between' }}>
          <div>
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
          </div>

          <div>
            <Divider my="md" />
            <Stack gap="xs">
              <Button
                variant="default"
                leftSection={<IconDownload size={16} />}
                onClick={handleExport}
                fullWidth
                size="sm"
              >
                导出备份
              </Button>
              <Button
                variant="default"
                leftSection={<IconUpload size={16} />}
                onClick={handleImportClick}
                fullWidth
                size="sm"
              >
                导入恢复
              </Button>
            </Stack>
          </div>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <input
        type="file"
        accept=".json,application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Modal
        opened={importResult.show}
        onClose={() => setImportResult((prev) => ({ ...prev, show: false }))}
        title="导入成功"
        size="sm"
      >
        <Text>成功导入 {importResult.count} 条笔记</Text>
        <Group justify="flex-end" mt="md">
          <Button onClick={() => setImportResult((prev) => ({ ...prev, show: false }))}>
            确定
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={errorModal.show}
        onClose={() => setErrorModal((prev) => ({ ...prev, show: false }))}
        title="导入失败"
        size="sm"
        c="red"
      >
        <Text c="red">{errorModal.message}</Text>
        <Group justify="flex-end" mt="md">
          <Button onClick={() => setErrorModal((prev) => ({ ...prev, show: false }))}>
            确定
          </Button>
        </Group>
      </Modal>
    </AppShell>
  );
}
