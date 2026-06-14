import Fuse from 'fuse.js';
import type { Fragrance } from '../types';

/**
 * 按名称模糊搜索香调列表
 * @param items - 待搜索列表
 * @param query - 搜索关键词
 */
export function searchByName<T extends Pick<Fragrance, 'name'>>(
  items: T[],
  query: string
): T[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return items;
  }

  const fuse = new Fuse(items, {
    keys: ['name'],
    threshold: 0.4,
    ignoreLocation: true,
  });

  return fuse.search(trimmed).map((result) => result.item);
}

/**
 * 按名称模糊搜索笔记列表
 * @param items - 待搜索笔记
 * @param query - 搜索关键词
 */
export function searchNotesByName<T extends { name: string }>(
  items: T[],
  query: string
): T[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return items;
  }

  const fuse = new Fuse(items, {
    keys: ['name'],
    threshold: 0.4,
    ignoreLocation: true,
  });

  return fuse.search(trimmed).map((result) => result.item);
}
