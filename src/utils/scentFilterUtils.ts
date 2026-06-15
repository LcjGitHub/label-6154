import type { Fragrance } from '../types';

export interface ScentFilterCriteria {
  category: Fragrance['category'] | null;
  topNoteKeywords: string;
  middleNoteKeywords: string;
  baseNoteKeywords: string;
}

export const EMPTY_CRITERIA: ScentFilterCriteria = {
  category: null,
  topNoteKeywords: '',
  middleNoteKeywords: '',
  baseNoteKeywords: '',
};

function splitKeywords(input: string): string[] {
  return input
    .split(/[,，、\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function matchKeywords(text: string, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const lower = text.toLowerCase();
  return keywords.every((kw) => lower.includes(kw));
}

export function filterFragrances(
  fragrances: Fragrance[],
  criteria: ScentFilterCriteria,
): Fragrance[] {
  const topKw = splitKeywords(criteria.topNoteKeywords);
  const midKw = splitKeywords(criteria.middleNoteKeywords);
  const baseKw = splitKeywords(criteria.baseNoteKeywords);

  return fragrances.filter((f) => {
    if (criteria.category && f.category !== criteria.category) return false;
    if (!matchKeywords(f.topNotes, topKw)) return false;
    if (!matchKeywords(f.middleNotes, midKw)) return false;
    if (!matchKeywords(f.baseNotes, baseKw)) return false;
    return true;
  });
}

export function hasAnyCriteria(criteria: ScentFilterCriteria): boolean {
  return (
    criteria.category !== null ||
    criteria.topNoteKeywords.trim() !== '' ||
    criteria.middleNoteKeywords.trim() !== '' ||
    criteria.baseNoteKeywords.trim() !== ''
  );
}
