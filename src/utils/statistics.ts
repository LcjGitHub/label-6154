import type { Note, Fragrance } from '../types';

/** 评分档位分布（1~5 星） */
export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

/** 个人笔记统计结果 */
export interface NotesStatistics {
  totalNotes: number;
  averageRating: number;
  ratingDistribution: RatingDistribution;
}

/** 示例库统计结果 */
export interface LibraryStatistics {
  totalFragrances: number;
  perfumeCount: number;
  incenseCount: number;
}

/**
 * 计算个人笔记统计数据：总数、平均评分、各档位分布
 */
export function calculateNotesStatistics(notes: Note[]): NotesStatistics {
  const totalNotes = notes.length;

  const ratedNotes = notes.filter((note) => note.rating > 0);
  const totalRating = ratedNotes.reduce((sum, note) => sum + note.rating, 0);
  const averageRating = ratedNotes.length > 0 ? totalRating / ratedNotes.length : 0;

  const ratingDistribution: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  notes.forEach((note) => {
    const rating = Math.round(note.rating);
    if (rating >= 1 && rating <= 5) {
      ratingDistribution[rating as keyof RatingDistribution]++;
    }
  });

  return {
    totalNotes,
    averageRating,
    ratingDistribution,
  };
}

/**
 * 计算示例库统计数据：总数、香水数量、线香数量
 */
export function calculateLibraryStatistics(fragrances: Fragrance[]): LibraryStatistics {
  const totalFragrances = fragrances.length;
  const perfumeCount = fragrances.filter((f) => f.category === 'perfume').length;
  const incenseCount = fragrances.filter((f) => f.category === 'incense').length;

  return {
    totalFragrances,
    perfumeCount,
    incenseCount,
  };
}

/**
 * 计算某一评分档位的占比
 */
export function getRatingPercentage(distribution: RatingDistribution, rating: number): number {
  const total = distribution[1] + distribution[2] + distribution[3] + distribution[4] + distribution[5];
  if (total === 0) return 0;
  return (distribution[rating as keyof RatingDistribution] / total) * 100;
}
