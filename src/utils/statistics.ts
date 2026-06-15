import type { Note, Fragrance } from '../types';

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface NotesStatistics {
  totalNotes: number;
  averageRating: number;
  ratingDistribution: RatingDistribution;
}

export interface LibraryStatistics {
  totalFragrances: number;
  perfumeCount: number;
  incenseCount: number;
}

export interface StatisticsData {
  notes: NotesStatistics;
  library: LibraryStatistics;
}

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

export function calculateStatistics(notes: Note[], fragrances: Fragrance[]): StatisticsData {
  return {
    notes: calculateNotesStatistics(notes),
    library: calculateLibraryStatistics(fragrances),
  };
}

export function getRatingPercentage(distribution: RatingDistribution, rating: number): number {
  const total = distribution[1] + distribution[2] + distribution[3] + distribution[4] + distribution[5];
  if (total === 0) return 0;
  return (distribution[rating as keyof RatingDistribution] / total) * 100;
}
