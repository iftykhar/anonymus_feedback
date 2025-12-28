"use client";

import Reviews from "@/components/website/Reviews";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeedbackStore } from "@/store/useFeedbackStore";

export default function ReviewsPage() {
  const router = useRouter();
  const reset = useFeedbackStore((state) => state.reset);

  return (
    <div className="relative min-h-screen bg-[#020617] p-6 overflow-x-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full flex flex-col items-center">
        <header className="w-full max-w-6xl mx-auto py-8">
          <Button
            variant="ghost"
            onClick={() => {
              reset();
              router.push("/");
            }}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-0 hover:bg-transparent"
          >
            <div className="p-2 rounded-xl bg-slate-900 border border-white/5 group-hover:border-white/20">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to Feedback</span>
          </Button>
        </header>

        <Reviews />
      </main>
    </div>
  );
}
