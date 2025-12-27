// store/useFeedbackStore.ts
import { create } from "zustand";

type FeedbackStore = {
  currentStep: number;
  totalSteps: number;
  answers: Record<string, string>;
  feedbackContent: string;
  rating: number;
  subject: string;
  name: string;
  
  isSubmitting: boolean;
  submitSuccess: boolean;
  error: string | null;

  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAnswer: (id: string, answer: string) => void;
  setFeedbackContent: (content: string) => void;
  setRating: (rating: number) => void;
  setSubject: (subject: string) => void;
  setName: (name: string) => void;
  submitFeedback: () => Promise<void>;
  reset: () => void;
};

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  currentStep: 1,
  totalSteps: 3,
  answers: {},
  feedbackContent: "",
  rating: 0,
  subject: "",
  name: "",
  isSubmitting: false,
  submitSuccess: false,
  error: null,

  setCurrentStep: (currentStep) => set({ currentStep }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, state.totalSteps) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  
  setAnswer: (id, answer) => set((state) => ({
    answers: { ...state.answers, [id]: answer }
  })),

  setFeedbackContent: (feedbackContent) => set({ feedbackContent }),
  setRating: (rating) => set({ rating }),
  setSubject: (subject) => set({ subject }),
  setName: (name) => set({ name }),

  submitFeedback: async () => {
    const { feedbackContent, rating, answers, subject, name } = get();

    if (!feedbackContent.trim()) {
      set({ error: "Please enter your final feedback." });
      return;
    }

    set({ isSubmitting: true, error: null, submitSuccess: false });

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: feedbackContent, 
          rating: rating > 0 ? rating : undefined,
          answers,
          subject: subject || undefined,
          name: name || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      set({ 
        submitSuccess: true, 
        currentStep: 1,
        answers: {},
        feedbackContent: "", 
        rating: 0,
        subject: "",
        name: "",
        isSubmitting: false 
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isSubmitting: false });
    }
  },

  reset: () => set({ 
    currentStep: 1,
    answers: {},
    feedbackContent: "", 
    rating: 0, 
    subject: "",
    name: "",
    isSubmitting: false, 
    submitSuccess: false, 
    error: null 
  }),
}));
