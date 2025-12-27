// store/useFeedbackStore.ts
import { create } from "zustand";

type FeedbackStore = {
  answers: Record<string, string>;
  note: string;
  name?: string;

  setAnswer: (questionId: string, answer: string) => void;
  setNote: (note: string) => void;
  setName: (name: string) => void;
  reset: () => void;
};

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  answers: {},
  note: "",
  name: "",

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answer,
      },
    })),

  setNote: (note) => set({ note }),
  setName: (name) => set({ name }),

  reset: () => set({ answers: {}, note: "", name: "" }),
}));
