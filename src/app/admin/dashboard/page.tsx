"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  MessageSquare,
  Clock,
  LogOut,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { questions } from "@/lib/questions";

interface Feedback {
  id: string;
  content: string;
  rating: number | null;
  answers?: Record<string, string>;
  subject: string | null;
  name: string | null;
  timestamp: string;
}

export default function AdminDashboard() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/feedback");
      if (res.ok) {
        const data = await res.json();
        setFeedback(data);
      }
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const isAuth = localStorage.getItem("adminAuth") === "true";
    if (!isAuth) {
      router.push("/admin/login");
      return;
    }
    fetchFeedback();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  if (!isMounted) return null;

  if (loading && feedback.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading feedback data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-10">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Feedback <span className="text-blue-500">Center</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              Authenticated as Administrator
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchFeedback}
              className="px-6 py-6 rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all font-semibold"
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={handleLogout}
              className="px-6 py-6 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all shadow-lg shadow-red-500/10"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedback.length > 0 ? (
            feedback.map((item) => (
              <Card
                key={item.id}
                className="group flex flex-col p-8 bg-white dark:bg-slate-900 border-transparent hover:border-blue-500/20 dark:hover:border-blue-500/30 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 animate-in fade-in zoom-in-95"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          item.rating && s <= item.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-200 dark:text-slate-800"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                    ID: {item.id.split("-")[0]}
                  </div>
                </div>

                <div className="flex-1 space-y-6 mb-8">
                  {item.subject && (
                    <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">
                        Subject
                      </p>
                      <p className="text-white font-medium">{item.subject}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {Object.entries(item?.answers || {}).map(([key, value]) => {
                      const qTitle =
                        questions.find((q) => q.id === key)?.title || key;
                      return (
                        <div
                          key={key}
                          className="p-4 bg-slate-800/40 rounded-2xl border border-white/5"
                        >
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            {qTitle}
                          </p>
                          <p className="text-slate-200 font-medium">{value}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-6 h-6 text-blue-500 mt-1 shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
                    <p className="text-slate-700 dark:text-slate-200 text-lg leading-relaxed italic">
                      &quot;{item.content}&quot;
                    </p>
                  </div>

                  {item.name && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <span className="font-bold">By:</span> {item.name}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between opacity-60">
                  <div className="flex items-center text-xs font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 mb-4">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-400">
                No feedback yet
              </h3>
              <p className="text-slate-500">
                When users submit feedback, it will appear here.
              </p>
            </div>
          )}
        </main>

        <footer className="text-center pt-20">
          <p className="text-slate-400 text-sm font-medium">
            Showing {feedback.length} total entries
          </p>
        </footer>
      </div>
    </div>
  );
}
