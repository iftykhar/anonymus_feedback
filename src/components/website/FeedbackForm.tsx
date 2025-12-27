"use client";

import React, { useState } from "react";
import { useFeedbackStore } from "@/store/useFeedbackStore";
import { Star, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FeedbackForm = () => {
  const {
    feedbackContent,
    rating,
    isSubmitting,
    submitSuccess,
    error,
    setFeedbackContent,
    setRating,
    submitFeedback,
    reset,
  } = useFeedbackStore();

  const [hoveredRating, setHoveredRating] = useState(0);

  if (submitSuccess) {
    return (
      <Card className="w-full max-w-lg p-10 bg-white/10 backdrop-blur-xl border-white/20 rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Thank You!</h2>
          <p className="text-white/60 text-lg">
            Your anonymous feedback has been safely submitted.
          </p>
        </div>
        <Button
          onClick={reset}
          className="bg-white/10 hover:bg-white/20 text-white border-white/10 rounded-xl px-8 py-6 h-auto text-lg transition-all"
        >
          Submit Another
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg overflow-hidden bg-slate-900 border-white/10 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="p-8 md:p-12 space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400 leading-tight">
            Share Your Thoughts
          </h2>
          <p className="text-slate-400 text-lg">
            Your identity remains a secret. We value your honest feedback.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform active:scale-95 group focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-all duration-300 ${
                      (hoveredRating || rating) >= star
                        ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                        : "text-slate-700 fill-transparent group-hover:text-slate-500"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-slate-500 font-medium min-w-[3ch]">
                {rating > 0 ? rating : ""}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Feedback Content
            </label>
            <textarea
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              placeholder="Tell us what's on your mind..."
              className="w-full min-h-[160px] p-5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none text-lg"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Button
            onClick={submitFeedback}
            disabled={isSubmitting || !feedbackContent.trim()}
            className="w-full h-16 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xl font-bold shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Submit Feedback
                <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="px-12 py-6 bg-slate-950/50 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm italic">
          🔒 Secure and 100% Anonymous
        </p>
      </div>
    </Card>
  );
};

export default FeedbackForm;
