"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Star, MessageSquare, Clock, User, Loader2 } from "lucide-react";

interface Review {
  id: string;
  content: string;
  rating: number | null;
  subject: string | null;
  name: string;
  timestamp: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin opacity-50" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          What People <span className="text-blue-500">Say</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Honest, anonymous feedback from our community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <Card
            key={review.id}
            className="group relative p-8 bg-slate-900/40 border-white/5 hover:border-blue-500/30 rounded-[2rem] transition-all duration-500 hover:translate-y-[-4px] animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      review.rating && s <= review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-800 fill-transparent"
                    }`}
                  />
                ))}
              </div>
              <MessageSquare className="w-5 h-5 text-blue-500/20 group-hover:text-blue-500 transition-colors" />
            </div>

            <div className="space-y-4">
              {review.subject && (
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/5 px-3 py-1 rounded-full w-fit">
                  {review.subject}
                </p>
              )}
              <p className="text-slate-200 text-lg leading-relaxed italic">
                &quot;{review.content}&quot;
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                  <User className="w-3 h-3" />
                </div>
                <span className="font-medium">{review.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {new Date(review.timestamp).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
