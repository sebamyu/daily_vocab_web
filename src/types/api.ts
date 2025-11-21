export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface WordResponse {
    id: number;
    word: string;
    definition: string;
    difficulty_level: DifficultyLevel;
}

export interface ValidateSentenceRequest {
  word_id: number;
  sentence: string;
}

export interface ValidateSentenceResponse {
  score: number;
  level: string; 
  suggestion: string;
  corrected_sentence: string;
}

export interface SummaryResponse {
  total_practices: number;
  average_score: number | null;
  total_words_practiced: number;
  level_distribution: { [key in DifficultyLevel]: number };
}

export interface HistoryItem {
  id: number;
  word: string;
  user_sentence: string;
  score: number;
  practiced_at: string; 
}