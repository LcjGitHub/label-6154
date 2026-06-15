import type { Note } from '../types';

const BACKUP_FILE_PREFIX = 'fragrance-notes-backup';
const BACKUP_FILE_VERSION = 1;

interface BackupFileData {
  version: number;
  exportedAt: string;
  notes: Note[];
}

/**
 * 导出全部笔记为 JSON 文件并触发下载
 * @param notes - 待导出的笔记列表
 */
export function exportNotesToFile(notes: Note[]): void {
  const backupData: BackupFileData = {
    version: BACKUP_FILE_VERSION,
    exportedAt: new Date().toISOString(),
    notes,
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  link.href = url;
  link.download = `${BACKUP_FILE_PREFIX}-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 验证单个笔记数据的完整性
 */
function isValidNote(note: unknown): note is Note {
  if (typeof note !== 'object' || note === null) return false;

  const n = note as Record<string, unknown>;

  return (
    typeof n.id === 'string' &&
    typeof n.name === 'string' &&
    typeof n.topNotes === 'string' &&
    typeof n.middleNotes === 'string' &&
    typeof n.baseNotes === 'string' &&
    typeof n.rating === 'number' &&
    typeof n.remark === 'string' &&
    Array.isArray(n.tags) &&
    typeof n.createdAt === 'string' &&
    typeof n.updatedAt === 'string'
  );
}

/**
 * 解析导入的备份文件
 * @param file - 用户选择的文件
 * @returns 解析后的笔记列表
 */
export function parseBackupFile(file: File): Promise<Note[]> {
  return new Promise((resolve, reject) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      reject(new Error('请选择有效的 JSON 备份文件'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as Partial<BackupFileData>;

        if (!data.notes || !Array.isArray(data.notes)) {
          reject(new Error('备份文件格式错误：未找到笔记数据'));
          return;
        }

        const validNotes: Note[] = [];
        data.notes.forEach((note) => {
          if (isValidNote(note)) {
            validNotes.push(note);
          }
        });

        resolve(validNotes);
      } catch {
        reject(new Error('备份文件解析失败：文件格式不正确'));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsText(file);
  });
}
