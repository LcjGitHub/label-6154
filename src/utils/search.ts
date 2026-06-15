import Fuse from 'fuse.js';
import type { Fragrance, Note } from '../types';

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

/** 笔记排序方式 */
export type NoteSortKey = 'updatedAt' | 'createdAt' | 'ratingDesc' | 'ratingAsc';

/** 笔记排序选项列表 */
export const NOTE_SORT_OPTIONS: { value: NoteSortKey; label: string }[] = [
  { value: 'updatedAt', label: '按更新时间' },
  { value: 'createdAt', label: '按创建时间' },
  { value: 'ratingDesc', label: '评分从高到低' },
  { value: 'ratingAsc', label: '评分从低到高' },
];

/**
 * 对笔记列表进行排序
 * @param items - 待排序笔记列表
 * @param sortKey - 排序方式
 */
export function sortNotes<T extends Note>(
  items: T[],
  sortKey: NoteSortKey
): T[] {
  const sorted = [...items];
  switch (sortKey) {
    case 'updatedAt':
      sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      break;
    case 'createdAt':
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'ratingDesc':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'ratingAsc':
      sorted.sort((a, b) => a.rating - b.rating);
      break;
  }
  return sorted;
}

/**
 * 按最低评分筛选笔记
 * @param items - 待筛选笔记列表
 * @param minRating - 最低评分，0 表示不筛选
 */
export function filterNotesByMinRating<T extends Note>(
  items: T[],
  minRating: number
): T[] {
  if (minRating <= 0) {
    return items;
  }
  return items.filter((note) => note.rating >= minRating);
}
