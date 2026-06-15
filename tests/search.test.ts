import { describe, it, expect } from 'vitest';
import {
  sortNotes,
  filterNotesByMinRating,
  searchFragranceFullText,
  searchNotesFullText,
  type NoteSortKey,
} from '../src/utils/search';
import type { Note, Fragrance } from '../src/types';

function makeNote(overrides: Partial<Note> & Pick<Note, 'id' | 'name'>): Note {
  return {
    topNotes: '',
    middleNotes: '',
    baseNotes: '',
    rating: 3,
    remark: '',
    tags: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeFragrance(overrides: Partial<Fragrance> & Pick<Fragrance, 'id' | 'name'>): Fragrance {
  return {
    topNotes: '',
    middleNotes: '',
    baseNotes: '',
    category: 'perfume',
    description: '',
    ...overrides,
  };
}

describe('sortNotes', () => {
  const notes: Note[] = [
    makeNote({
      id: '1',
      name: 'A',
      rating: 5,
      createdAt: '2024-01-10T00:00:00.000Z',
      updatedAt: '2024-03-01T00:00:00.000Z',
    }),
    makeNote({
      id: '2',
      name: 'B',
      rating: 3,
      createdAt: '2024-02-15T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
    }),
    makeNote({
      id: '3',
      name: 'C',
      rating: 1,
      createdAt: '2024-03-20T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }),
  ];

  it('空数组排序应返回空数组', () => {
    const result = sortNotes([], 'updatedAt');
    expect(result).toEqual([]);
  });

  it('单元素数组排序应返回相同数组', () => {
    const single = [notes[0]];
    const result = sortNotes(single, 'ratingDesc');
    expect(result).toEqual(single);
  });

  it('按 updatedAt 降序排序', () => {
    const result = sortNotes(notes, 'updatedAt');
    expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
  });

  it('按 createdAt 降序排序', () => {
    const result = sortNotes(notes, 'createdAt');
    expect(result.map((n) => n.id)).toEqual(['3', '2', '1']);
  });

  it('按 ratingDesc 降序排序', () => {
    const result = sortNotes(notes, 'ratingDesc');
    expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
  });

  it('按 ratingAsc 升序排序', () => {
    const result = sortNotes(notes, 'ratingAsc');
    expect(result.map((n) => n.id)).toEqual(['3', '2', '1']);
  });

  it('评分相同时按 updatedAt 降序排序（ratingDesc）', () => {
    const sameRating: Note[] = [
      makeNote({ id: 'a', name: 'A', rating: 4, updatedAt: '2024-01-01T00:00:00.000Z' }),
      makeNote({ id: 'b', name: 'B', rating: 4, updatedAt: '2024-06-01T00:00:00.000Z' }),
    ];
    const result = sortNotes(sameRating, 'ratingDesc');
    expect(result.map((n) => n.id)).toEqual(['b', 'a']);
  });

  it('评分相同时按 updatedAt 降序排序（ratingAsc）', () => {
    const sameRating: Note[] = [
      makeNote({ id: 'a', name: 'A', rating: 4, updatedAt: '2024-01-01T00:00:00.000Z' }),
      makeNote({ id: 'b', name: 'B', rating: 4, updatedAt: '2024-06-01T00:00:00.000Z' }),
    ];
    const result = sortNotes(sameRating, 'ratingAsc');
    expect(result.map((n) => n.id)).toEqual(['b', 'a']);
  });

  it('排序不修改原数组', () => {
    const copy = [...notes];
    sortNotes(notes, 'ratingDesc');
    expect(notes).toEqual(copy);
  });

  it('边界评分 0 排序', () => {
    const zeroNotes: Note[] = [
      makeNote({ id: '1', name: 'A', rating: 0, updatedAt: '2024-02-01T00:00:00.000Z' }),
      makeNote({ id: '2', name: 'B', rating: 5, updatedAt: '2024-01-01T00:00:00.000Z' }),
    ];
    const result = sortNotes(zeroNotes, 'ratingDesc');
    expect(result.map((n) => n.id)).toEqual(['2', '1']);
  });

  it('边界评分 5 排序', () => {
    const maxNotes: Note[] = [
      makeNote({ id: '1', name: 'A', rating: 5, updatedAt: '2024-01-01T00:00:00.000Z' }),
      makeNote({ id: '2', name: 'B', rating: 5, updatedAt: '2024-02-01T00:00:00.000Z' }),
      makeNote({ id: '3', name: 'C', rating: 3, updatedAt: '2024-03-01T00:00:00.000Z' }),
    ];
    const result = sortNotes(maxNotes, 'ratingDesc');
    expect(result.map((n) => n.id)).toEqual(['2', '1', '3']);
  });
});

describe('filterNotesByMinRating', () => {
  const notes: Note[] = [
    makeNote({ id: '1', name: 'A', rating: 1 }),
    makeNote({ id: '2', name: 'B', rating: 3 }),
    makeNote({ id: '3', name: 'C', rating: 5 }),
  ];

  it('空数组筛选应返回空数组', () => {
    expect(filterNotesByMinRating([], 3)).toEqual([]);
  });

  it('minRating 为 0 时不筛选，返回全部', () => {
    const result = filterNotesByMinRating(notes, 0);
    expect(result).toEqual(notes);
  });

  it('minRating 为负数时不筛选，返回全部', () => {
    const result = filterNotesByMinRating(notes, -1);
    expect(result).toEqual(notes);
  });

  it('minRating 为 3 时筛选评分 >= 3 的笔记', () => {
    const result = filterNotesByMinRating(notes, 3);
    expect(result.map((n) => n.id)).toEqual(['2', '3']);
  });

  it('minRating 为 1 时筛选评分 >= 1 的笔记', () => {
    const result = filterNotesByMinRating(notes, 1);
    expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
  });

  it('minRating 为 5 时筛选评分 >= 5 的笔记（边界）', () => {
    const result = filterNotesByMinRating(notes, 5);
    expect(result.map((n) => n.id)).toEqual(['3']);
  });

  it('minRating 超过最大评分时返回空数组', () => {
    const result = filterNotesByMinRating(notes, 6);
    expect(result).toEqual([]);
  });

  it('minRating 为小数时筛选评分 >= 小数的笔记', () => {
    const decimalNotes: Note[] = [
      makeNote({ id: '1', name: 'A', rating: 2 }),
      makeNote({ id: '2', name: 'B', rating: 3 }),
    ];
    const result = filterNotesByMinRating(decimalNotes, 2.5);
    expect(result.map((n) => n.id)).toEqual(['2']);
  });

  it('筛选不修改原数组', () => {
    const copy = [...notes];
    filterNotesByMinRating(notes, 3);
    expect(notes).toEqual(copy);
  });
});

describe('searchFragranceFullText', () => {
  const items: Fragrance[] = [
    makeFragrance({
      id: '1',
      name: '薰衣草之梦',
      topNotes: '薰衣草',
      middleNotes: '玫瑰',
      baseNotes: '麝香',
      description: '宁静安详',
    }),
    makeFragrance({
      id: '2',
      name: '海洋微风',
      topNotes: '海盐',
      middleNotes: '茉莉',
      baseNotes: '琥珀',
      description: '清新海洋',
    }),
    makeFragrance({
      id: '3',
      name: '玫瑰花园',
      topNotes: '玫瑰',
      middleNotes: '牡丹',
      baseNotes: '檀香',
      description: '浪漫花海',
    }),
  ];

  it('空数组搜索应返回空数组', () => {
    const result = searchFragranceFullText([], '薰衣草');
    expect(result).toEqual([]);
  });

  it('空字符串查询应返回全部列表', () => {
    const result = searchFragranceFullText(items, '');
    expect(result).toEqual(items);
  });

  it('纯空格查询应返回全部列表', () => {
    const result = searchFragranceFullText(items, '   ');
    expect(result).toEqual(items);
  });

  it('按名称搜索应返回匹配结果', () => {
    const result = searchFragranceFullText(items, '薰衣草之梦');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some((f) => f.id === '1')).toBe(true);
  });

  it('按 topNotes 搜索应返回匹配结果', () => {
    const result = searchFragranceFullText(items, '薰衣草');
    expect(result.some((f) => f.id === '1')).toBe(true);
  });

  it('按 middleNotes 搜索应返回匹配结果', () => {
    const result = searchFragranceFullText(items, '玫瑰');
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.some((f) => f.id === '1')).toBe(true);
    expect(result.some((f) => f.id === '3')).toBe(true);
  });

  it('按 baseNotes 搜索应返回匹配结果', () => {
    const result = searchFragranceFullText(items, '麝香');
    expect(result.some((f) => f.id === '1')).toBe(true);
  });

  it('按 description 搜索应返回匹配结果', () => {
    const result = searchFragranceFullText(items, '海洋');
    expect(result.some((f) => f.id === '2')).toBe(true);
  });

  it('无匹配时应返回空数组', () => {
    const result = searchFragranceFullText(items, '不存在的香调');
    expect(result).toEqual([]);
  });

  it('搜索不修改原数组', () => {
    const copy = [...items];
    searchFragranceFullText(items, '玫瑰');
    expect(items).toEqual(copy);
  });
});

describe('searchNotesFullText', () => {
  const notes: Note[] = [
    makeNote({
      id: '1',
      name: '薰衣草之夜',
      topNotes: '薰衣草',
      middleNotes: '玫瑰',
      baseNotes: '麝香',
      remark: '宁静的夜晚使用',
      tags: ['日常', '睡前'],
    }),
    makeNote({
      id: '2',
      name: '海洋微风',
      topNotes: '海盐',
      middleNotes: '茉莉',
      baseNotes: '琥珀',
      remark: '清新工作香',
      tags: ['工作'],
    }),
    makeNote({
      id: '3',
      name: '玫瑰花园',
      topNotes: '玫瑰',
      middleNotes: '牡丹',
      baseNotes: '檀香',
      remark: '浪漫约会必备',
      tags: ['约会'],
    }),
  ];

  it('空数组搜索应返回空数组', () => {
    const result = searchNotesFullText([], '薰衣草');
    expect(result).toEqual([]);
  });

  it('空字符串查询应返回全部列表', () => {
    const result = searchNotesFullText(notes, '');
    expect(result).toEqual(notes);
  });

  it('纯空格查询应返回全部列表', () => {
    const result = searchNotesFullText(notes, '   ');
    expect(result).toEqual(notes);
  });

  it('按名称搜索应返回匹配结果', () => {
    const result = searchNotesFullText(notes, '薰衣草之夜');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some((n) => n.id === '1')).toBe(true);
  });

  it('按 topNotes 搜索应返回匹配结果', () => {
    const result = searchNotesFullText(notes, '薰衣草');
    expect(result.some((n) => n.id === '1')).toBe(true);
  });

  it('按 middleNotes 搜索应返回匹配结果', () => {
    const result = searchNotesFullText(notes, '玫瑰');
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.some((n) => n.id === '1')).toBe(true);
    expect(result.some((n) => n.id === '3')).toBe(true);
  });

  it('按 baseNotes 搜索应返回匹配结果', () => {
    const result = searchNotesFullText(notes, '麝香');
    expect(result.some((n) => n.id === '1')).toBe(true);
  });

  it('按 remark 搜索应返回匹配结果', () => {
    const result = searchNotesFullText(notes, '工作');
    expect(result.some((n) => n.id === '2')).toBe(true);
  });

  it('按 tags 搜索应返回匹配结果', () => {
    const result = searchNotesFullText(notes, '睡前');
    expect(result.some((n) => n.id === '1')).toBe(true);
  });

  it('按 tags 搜索多个标签应返回对应结果', () => {
    const result = searchNotesFullText(notes, '约会');
    expect(result.some((n) => n.id === '3')).toBe(true);
  });

  it('模糊搜索标签应返回匹配结果', () => {
    const result = searchNotesFullText(notes, '日');
    expect(result.some((n) => n.id === '1')).toBe(true);
  });

  it('无匹配时应返回空数组', () => {
    const result = searchNotesFullText(notes, '不存在的香调');
    expect(result).toEqual([]);
  });

  it('搜索不修改原数组', () => {
    const copy = [...notes];
    searchNotesFullText(notes, '玫瑰');
    expect(notes).toEqual(copy);
  });
});

describe('多条件组合：排序 + 评分筛选 + 全文搜索', () => {
  const notes: Note[] = [
    makeNote({
      id: '1',
      name: '薰衣草之夜',
      rating: 5,
      createdAt: '2024-01-10T00:00:00.000Z',
      updatedAt: '2024-03-01T00:00:00.000Z',
    }),
    makeNote({
      id: '2',
      name: '海洋微风',
      rating: 3,
      createdAt: '2024-02-15T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
    }),
    makeNote({
      id: '3',
      name: '玫瑰花园',
      rating: 4,
      createdAt: '2024-03-20T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }),
  ];

  it('先筛选评分 >= 4 再按 ratingDesc 排序', () => {
    const filtered = filterNotesByMinRating(notes, 4);
    const sorted = sortNotes(filtered, 'ratingDesc');
    expect(sorted.map((n) => n.id)).toEqual(['1', '3']);
  });

  it('先筛选评分 >= 3 再按 ratingAsc 排序', () => {
    const filtered = filterNotesByMinRating(notes, 3);
    const sorted = sortNotes(filtered, 'ratingAsc');
    expect(sorted.map((n) => n.id)).toEqual(['2', '3', '1']);
  });

  it('先搜索再筛选评分再排序', () => {
    const fragrances: Fragrance[] = [
      makeFragrance({
        id: 'f1',
        name: '薰衣草之梦',
        topNotes: '薰衣草',
        description: '宁静',
        middleNotes: '',
        baseNotes: '',
      }),
      makeFragrance({
        id: 'f2',
        name: '薰衣草晨露',
        topNotes: '薰衣草 柑橘',
        description: '清晨',
        middleNotes: '',
        baseNotes: '',
      }),
      makeFragrance({
        id: 'f3',
        name: '海洋微风',
        topNotes: '海盐',
        description: '清新',
        middleNotes: '',
        baseNotes: '',
      }),
    ];
    const searched = searchFragranceFullText(fragrances, '薰衣草');
    expect(searched.length).toBeGreaterThanOrEqual(2);
    expect(searched.every((f) => f.name.includes('薰衣草') || f.topNotes.includes('薰衣草'))).toBe(
      true,
    );
  });

  it('筛选评分 6（超出最大值）再排序应返回空', () => {
    const filtered = filterNotesByMinRating(notes, 6);
    const sorted = sortNotes(filtered, 'ratingDesc');
    expect(sorted).toEqual([]);
  });

  it('筛选评分 0 再排序应返回全部排序结果', () => {
    const filtered = filterNotesByMinRating(notes, 0);
    const sorted = sortNotes(filtered, 'updatedAt');
    expect(sorted.map((n) => n.id)).toEqual(['1', '2', '3']);
  });

  it('全部条件组合：筛选 >= 4 + ratingDesc + 验证顺序', () => {
    const filtered = filterNotesByMinRating(notes, 4);
    const sorted = sortNotes(filtered, 'ratingDesc');
    expect(sorted.length).toBe(2);
    expect(sorted[0].rating).toBeGreaterThanOrEqual(sorted[1].rating);
  });
});
