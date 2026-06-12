import { create } from 'zustand';
import type { Test, Question } from '../types';

interface TestState {
  currentTest: Test | null;
  questions: Question[];
  setCurrentTest: (test: Test) => void;
  setQuestions: (questions: Question[]) => void;
  reset: () => void;
}

export const useTestStore = create<TestState>((set) => ({
  currentTest: null,
  questions: [],
  setCurrentTest: (test) => set({ currentTest: test }),
  setQuestions: (questions) => set({ questions }),
  reset: () => set({ currentTest: null, questions: [] }),
}));
