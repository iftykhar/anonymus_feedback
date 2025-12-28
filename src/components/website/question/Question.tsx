"use client";

import React from "react";
import { useFeedbackStore } from "@/store/useFeedbackStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { questions } from "@/lib/questions";
import {
  Star,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Question = () => {
  const {
    currentStep,
    totalSteps,
    answers,
    feedbackContent,
    rating,
    subject,
    name,
    isSubmitting,
    submitSuccess,
    error,
    setAnswer,
    setFeedbackContent,
    setRating,
    setSubject,
    setName,
    submitFeedback,
    nextStep,
    prevStep,
    reset,
  } = useFeedbackStore();

  if (submitSuccess) {
    return (
      <Card className="w-full max-w-lg p-10 bg-slate-900 border-white/10 rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Submitted!</h2>
          <p className="text-white/60 text-lg">
            Your anonymous feedback has been safely recorded.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full px-2">
          <Button
            onClick={reset}
            variant="outline"
            className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-white border-white/5 rounded-2xl px-8 py-6 h-auto text-lg transition-all"
          >
            Submit Another
          </Button>
          <Button
            asChild
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-8 py-6 h-auto text-lg transition-all shadow-lg shadow-blue-900/40"
          >
            <Link href="/reviews">
              View All Reviews
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  const renderProgress = () => (
    <div className="flex items-center justify-center gap-4 mb-10">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
              currentStep === step
                ? "bg-blue-600 text-white ring-4 ring-blue-600/20"
                : currentStep > step
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-1 rounded-full transition-all duration-500 ${
                currentStep > step ? "bg-emerald-500" : "bg-slate-800"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    if (currentStep <= 2) {
      const q = questions[currentStep - 1];
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">{q.title}</h2>
            <p className="text-slate-400 text-lg">{q.subtitle}</p>
          </div>
          <div className="space-y-3">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setAnswer(q.id, option);
                  nextStep();
                }}
                className={`w-full p-5 rounded-2xl flex items-center justify-between group transition-all duration-300 transform active:scale-[0.98] ${
                  answers[q.id] === option
                    ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/40"
                    : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                }`}
              >
                <span className="text-lg font-medium">{option}</span>
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    answers[q.id] === option
                      ? "translate-x-1"
                      : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Final Details</h2>
          <p className="text-slate-400 text-lg">
            Wrap up your feedback with these optional fields.
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
                  className="p-1 transition-transform active:scale-95 focus:outline-none"
                >
                  <Star
                    className={`w-9 h-9 transition-all duration-300 ${
                      rating >= star
                        ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                        : "text-slate-700 fill-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-slate-400">
                Subject (Optional)
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSubject(e.target.value)
                }
                placeholder="Topic of feedback"
                className="bg-slate-800/50 border-slate-700 text-white rounded-xl p-4 h-auto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-400">
                Name (Optional)
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                placeholder="Anonymous"
                className="bg-slate-800/50 border-slate-700 text-white rounded-xl p-4 h-auto"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Detailed Feedback
            </label>
            <textarea
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="w-full min-h-[120px] p-5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none text-lg"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl overflow-hidden bg-slate-900 border-white/10 rounded-[2.5rem] shadow-2xl p-8 md:p-12">
      {renderProgress()}

      <div className="min-h-[400px]">{renderStep()}</div>

      <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
          className="text-slate-400 hover:text-white hover:bg-white/5 px-6 py-6 rounded-2xl h-auto font-bold transition-all disabled:opacity-0"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        {currentStep === totalSteps ? (
          <Button
            onClick={submitFeedback}
            disabled={isSubmitting || !feedbackContent.trim()}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl px-10 py-6 h-auto text-xl font-bold shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit
                <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!answers[`q${currentStep}`]}
            className="bg-slate-800 hover:bg-slate-700 text-white rounded-2xl px-10 py-6 h-auto text-xl font-bold transition-all disabled:opacity-50"
          >
            Continue
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Question;
