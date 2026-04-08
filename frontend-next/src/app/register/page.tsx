"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { apiFetch, AuthPayload, UserRole } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = (params.get("role") as UserRole) || "student";

  const [role, setRole] = useState<UserRole>(
    initialRole === "teacher" ? "teacher" : "student",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch<AuthPayload>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });
      // Redirect to login page after successful registration
      router.push(`/login?role=${role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground">
            Register as teacher or student.
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
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
            className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50"
          />
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 chars)"
            required
            className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />{" "}
            {loading ? "Creating account..." : `Sign up as ${role}`}
          </button>
        </form>

        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
