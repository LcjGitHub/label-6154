import type { Note } from '../types';

const BACKUP_FILE_PREFIX = 'fragrance-notes-backup';
const BACKUP_FILE_VERSION = 1;

const NOTE_SEPARATOR = '-----';
const FILE_HEADER_SEPARATOR = '====================================';

export interface ParseResult {
  notes: Note[];
  skippedCount: number;
}

function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatTags(tags: string[]): string {
  return tags.length > 0 ? tags.join('、') : '无';
}

function parseDateString(dateStr: string): string | null {
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function parseTags(tagsStr: string): string[] {
  if (!tagsStr || tagsStr === '无') return [];
  return tagsStr.split(/[、,，\s]+/).filter(Boolean);
}

function parseRating(ratingStr: string): number | null {
  const match = ratingStr.match(/(\d+)\s*星/);
  if (match) {
    const rating = parseInt(match[1], 10);
    if (rating >= 1 && rating <= 5) return rating;
  }
  const num = parseInt(ratingStr, 10);
  if (!isNaN(num) && num >= 1 && num <= 5) return num;
  return null;
}

/**
 * 导出全部笔记为纯文本文件并触发下载
 * 每条笔记以中文可读形式写入名称、前中后调、评分、标签、备注与时间
 * @param notes - 待导出的笔记列表
 */
export function exportNotesToFile(notes: Note[]): void {
  const lines: string[] = [];

  lines.push('香调笔记备份');
  lines.push(`版本：${BACKUP_FILE_VERSION}`);
  lines.push(`导出时间：${formatDate(new Date().toISOString())}`);
  lines.push(FILE_HEADER_SEPARATOR);
  lines.push('');

  notes.forEach((note, index) => {
    lines.push(`${NOTE_SEPARATOR} 笔记 ${index + 1} ${NOTE_SEPARATOR}`);
    lines.push(`名称：${note.name}`);
    lines.push(`前调：${note.topNotes}`);
    lines.push(`中调：${note.middleNotes}`);
    lines.push(`后调：${note.baseNotes}`);
    lines.push(`评分：${note.rating}星`);
    lines.push(`标签：${formatTags(note.tags)}`);
    lines.push(`备注：${note.remark || '无'}`);
    lines.push(`创建时间：${formatDate(note.createdAt)}`);
    lines.push(`更新时间：${formatDate(note.updatedAt)}`);
    lines.push('');
  });

  const textContent = lines.join('\n');
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  link.href = url;
  link.download = `${BACKUP_FILE_PREFIX}-${dateStr}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface ParsedNoteFields {
  name?: string;
  topNotes?: string;
  middleNotes?: string;
  baseNotes?: string;
  rating?: number;
  tags?: string[];
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

function validateParsedNote(fields: ParsedNoteFields): fields is Note & { id: string } {
  return !!(
    fields.name?.trim() &&
    fields.topNotes?.trim() &&
    fields.middleNotes?.trim() &&
    fields.baseNotes?.trim() &&
    fields.rating !== undefined &&
    fields.tags !== undefined &&
    fields.createdAt &&
    fields.updatedAt
  );
}

/**
 * 解析导入的纯文本备份文件
 * 按纯文本格式解析后合并到现有笔记，解析失败时返回中文错误信息
 * @param file - 用户选择的纯文本文件
 * @returns 解析结果，包含有效笔记列表和跳过条数
 */
export function parseBackupFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.txt')) {
      reject(new Error('请选择有效的 .txt 纯文本备份文件'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content.trim()) {
          reject(new Error('备份文件为空，请选择有效的备份文件'));
          return;
        }

        const lines = content.split('\n');
        const validNotes: Note[] = [];
        let skippedCount = 0;

        const noteBlocks: string[][] = [];
        let currentBlock: string[] = [];
        let inNoteBlock = false;

        for (const line of lines) {
          const trimmedLine = line.trim();

          if (trimmedLine.startsWith(NOTE_SEPARATOR) && trimmedLine.includes('笔记')) {
            if (inNoteBlock && currentBlock.length > 0) {
              noteBlocks.push([...currentBlock]);
            }
            inNoteBlock = true;
            currentBlock = [];
            continue;
          }

          if (inNoteBlock) {
            if (trimmedLine === '') {
              if (currentBlock.length > 0) {
                noteBlocks.push([...currentBlock]);
                currentBlock = [];
              }
              inNoteBlock = false;
            } else {
              currentBlock.push(trimmedLine);
            }
          }
        }

        if (inNoteBlock && currentBlock.length > 0) {
          noteBlocks.push([...currentBlock]);
        }

        for (const block of noteBlocks) {
          const fields: ParsedNoteFields = { tags: [] };

          for (const line of block) {
            const colonIndex = line.indexOf('：');
            if (colonIndex === -1) continue;

            const key = line.slice(0, colonIndex).trim();
            const value = line.slice(colonIndex + 1).trim();

            switch (key) {
              case '名称':
                fields.name = value;
                break;
              case '前调':
                fields.topNotes = value;
                break;
              case '中调':
                fields.middleNotes = value;
                break;
              case '后调':
                fields.baseNotes = value;
                break;
              case '评分':
                fields.rating = parseRating(value) ?? undefined;
                break;
              case '标签':
                fields.tags = parseTags(value);
                break;
              case '备注':
                fields.remark = value === '无' ? '' : value;
                break;
              case '创建时间':
                fields.createdAt = parseDateString(value) ?? undefined;
                break;
              case '更新时间':
                fields.updatedAt = parseDateString(value) ?? undefined;
                break;
            }
          }

          if (validateParsedNote(fields)) {
            const note: Note = {
              id: generateId(),
              name: fields.name.trim(),
              topNotes: fields.topNotes.trim(),
              middleNotes: fields.middleNotes.trim(),
              baseNotes: fields.baseNotes.trim(),
              rating: fields.rating,
              remark: fields.remark ?? '',
              tags: fields.tags,
              createdAt: fields.createdAt,
              updatedAt: fields.updatedAt,
            };
            validNotes.push(note);
          } else {
            skippedCount++;
          }
        }

        if (validNotes.length === 0 && skippedCount === 0) {
          reject(new Error('备份文件格式错误：未找到有效的笔记数据，请检查文件格式'));
          return;
        }

        resolve({ notes: validNotes, skippedCount });
      } catch {
        reject(new Error('备份文件解析失败：文件格式不正确'));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}
