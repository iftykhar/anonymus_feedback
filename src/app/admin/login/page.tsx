"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShieldAlert, Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simple auth simulation using localStorage (for demo purposes)
        localStorage.setItem("adminAuth", "true");
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admin Access
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Secure gateway for administrators
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl text-lg font-semibold transition-all shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-slate-400">
            Authorized use only. Session will be tracked.
          </p>
        </div>
      </Card>
    </div>
  );
}
