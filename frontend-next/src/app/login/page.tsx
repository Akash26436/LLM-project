"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, LogIn } from "lucide-react";
import {
  apiFetch,
  AuthPayload,
  getStoredUser,
  saveAuth,
  UserRole,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = (params.get("role") as UserRole) || "student";

  const [role, setRole] = useState<UserRole>(
    initialRole === "teacher" ? "teacher" : "student",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "teacher") {
      router.replace("/dashboard/teacher");
      return;
    }
    if (user?.role === "student") {
      router.replace("/dashboard/student");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = await apiFetch<AuthPayload>("/auth/login-json", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (payload.role !== role) {
        setError(
          `This account is registered as ${payload.role}. Please switch role or use the correct account.`,
        );
        setLoading(false);
        return;
      }

      saveAuth(payload);
      router.push(
        payload.role === "teacher"
          ? "/dashboard/teacher"
          : "/dashboard/student",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md glass-panel p-8 space-y-6">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in as teacher or student.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary/40 p-1">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`rounded-lg px-3 py-2 text-sm ${role === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`rounded-lg px-3 py-2 text-sm ${role === "teacher" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />{" "}
            {loading ? "Signing in..." : `Login as ${role}`}
          </button>
        </form>

        <p className="text-sm text-muted-foreground">
          New user?{" "}
          <Link href="/register" className="text-primary hover:text-primary/80">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
