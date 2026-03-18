import { create } from 'zustand';
import type { ScorecardResult, EvaluationResult, ComplianceResult, QuizResult, LocalizationJob, ModelComparison } from '@/types';

interface AppState {
  // Scorecard
  scorecardResults: ScorecardResult[];
  addScorecardResult: (result: ScorecardResult) => void;

  // Evaluation
  evaluationResults: EvaluationResult[];
  addEvaluationResult: (result: EvaluationResult) => void;

  // Compliance
  complianceResults: ComplianceResult[];
  addComplianceResult: (result: ComplianceResult) => void;

  // Quiz
  quizResults: QuizResult[];
  addQuizResult: (result: QuizResult) => void;

  // Localization
  localizationJobs: LocalizationJob[];
  addLocalizationJob: (job: LocalizationJob) => void;
  updateLocalizationJob: (id: string, updates: Partial<LocalizationJob>) => void;

  // Comparison
  comparisons: ModelComparison[];
  setComparisons: (comparisons: ModelComparison[]) => void;

  // UI state
  selectedLocale: string;
  setSelectedLocale: (locale: string) => void;
}

export const useStore = create<AppState>((set) => ({
  scorecardResults: [],
  addScorecardResult: (result) => set((state) => ({ scorecardResults: [...state.scorecardResults, result] })),

  evaluationResults: [],
  addEvaluationResult: (result) => set((state) => ({ evaluationResults: [...state.evaluationResults, result] })),

  complianceResults: [],
  addComplianceResult: (result) => set((state) => ({ complianceResults: [...state.complianceResults, result] })),

  quizResults: [],
  addQuizResult: (result) => set((state) => ({ quizResults: [...state.quizResults, result] })),

  localizationJobs: [],
  addLocalizationJob: (job) => set((state) => ({ localizationJobs: [...state.localizationJobs, job] })),
  updateLocalizationJob: (id, updates) =>
    set((state) => ({
      localizationJobs: state.localizationJobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    })),

  comparisons: [],
  setComparisons: (comparisons) => set({ comparisons }),

  selectedLocale: 'en',
  setSelectedLocale: (locale) => set({ selectedLocale: locale }),
}));
