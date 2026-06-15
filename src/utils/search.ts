import Fuse from 'fuse.js';
import type { Fragrance, Note } from '../types';

/**
 * 全文模糊搜索香调列表（匹配名称、前调、中调、后调、描述）
 * @param items - 待搜索列表
 * @param query - 搜索关键词
 */
export function searchFragranceFullText<
  T extends Pick<Fragrance, 'name' | 'topNotes' | 'middleNotes' | 'baseNotes' | 'description'>,
>(items: T[], query: string): T[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return items;
  }

  const fuse = new Fuse(items, {
    keys: ['name', 'topNotes', 'middleNotes', 'baseNotes', 'description'],
    threshold: 0.4,
    ignoreLocation: true,
  });

  return fuse.search(trimmed).map((result) => result.item);
}

/**
 * 全文模糊搜索笔记列表（匹配名称、前调、中调、后调、备注、标签）
 * @param items - 待搜索笔记
 * @param query - 搜索关键词
 */
export function searchNotesFullText<
  T extends Pick<Note, 'name' | 'topNotes' | 'middleNotes' | 'baseNotes' | 'remark' | 'tags'>,
>(items: T[], query: string): T[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return items;
  }

  const fuse = new Fuse(items, {
    keys: ['name', 'topNotes', 'middleNotes', 'baseNotes', 'remark', 'tags'],
    threshold: 0.4,
    ignoreLocation: true,
    getFn: (obj, path) => {
      const value = obj[path as keyof T];
      if (Array.isArray(value)) {
        return value.join(' ');
      }
      return value as string;
    },
  });

  return fuse.search(trimmed).map((result) => result.item);
}

/**
 * 按名称模糊搜索笔记列表
 * @param items - 待搜索笔记
 * @param query - 搜索关键词
 */
export function searchNotesByName<T extends { name: string }>(items: T[], query: string): T[] {
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

/** 全局搜索结果类型 */
export interface GlobalSearchResult {
  fragrances: Fragrance[];
  notes: Note[];
}

/**
 * 全局统一搜索：同时检索示例库香调与个人笔记
 * @param fragrances - 示例库香调列表
 * @param notes - 个人笔记列表
 * @param query - 搜索关键词
 * @returns 分类的搜索结果，香调与笔记分开返回
 */
export function globalSearch(
  fragrances: Fragrance[],
  notes: Note[],
  query: string,
): GlobalSearchResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return { fragrances: [], notes: [] };
  }

  return {
    fragrances: searchFragranceFullText(fragrances, trimmed),
    notes: searchNotesFullText(notes, trimmed),
  };
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
export function sortNotes<T extends Note>(items: T[], sortKey: NoteSortKey): T[] {
  const sorted = [...items];
  switch (sortKey) {
    case 'updatedAt':
      sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      break;
    case 'createdAt':
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'ratingDesc':
      sorted.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      break;
    case 'ratingAsc':
      sorted.sort((a, b) => {
        if (a.rating !== b.rating) return a.rating - b.rating;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      break;
  }
  return sorted;
}

/**
 * 按最低评分筛选笔记
 * @param items - 待筛选笔记列表
 * @param minRating - 最低评分，0 表示不筛选
 */
export function filterNotesByMinRating<T extends Note>(items: T[], minRating: number): T[] {
  if (minRating <= 0) {
    return items;
  }
  return items.filter((note) => note.rating >= minRating);
}

/** 香调排序方式 */
export type FragranceSortKey = 'nameAsc' | 'nameDesc' | 'categoryGroup';

/** 香调排序选项列表 */
export const FRAGRANCE_SORT_OPTIONS: { value: FragranceSortKey; label: string }[] = [
  { value: 'nameAsc', label: '名称升序' },
  { value: 'nameDesc', label: '名称降序' },
  { value: 'categoryGroup', label: '按分类分组' },
];

const CATEGORY_ORDER: Record<string, number> = {
  perfume: 0,
  incense: 1,
};

/**
 * 对香调列表进行排序
 * @param items - 待排序香调列表
 * @param sortKey - 排序方式
 */
export function sortFragrances<T extends Fragrance>(items: T[], sortKey: FragranceSortKey): T[] {
  const sorted = [...items];
  switch (sortKey) {
    case 'nameAsc':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
      break;
    case 'nameDesc':
      sorted.sort((a, b) => b.name.localeCompare(a.name, 'zh-CN'));
      break;
    case 'categoryGroup':
      sorted.sort((a, b) => {
        const categoryA = CATEGORY_ORDER[a.category] ?? 99;
        const categoryB = CATEGORY_ORDER[b.category] ?? 99;
        if (categoryA !== categoryB) return categoryA - categoryB;
        return a.name.localeCompare(b.name, 'zh-CN');
      });
      break;
  }
  return sorted;
}
