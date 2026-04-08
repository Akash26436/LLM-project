"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { apiFetch } from "@/lib/auth";

export default function CreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("4 weeks");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      alert("Please enter a classroom title.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiFetch<{ course_id: number }>(
        "/courses/",
        {
          method: "POST",
          body: JSON.stringify({
            title: normalizedTitle,
            description: description.trim(),
            duration: duration.trim() || "4 weeks",
            syllabus_context: "",
          }),
        },
        true,
      );

      alert(
        `Classroom created. Share this Classroom ID with students: ${result.course_id}`,
      );
      router.push("/courses");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create classroom",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-24 h-full max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Create Classroom
          </h1>
          <p className="text-muted-foreground mt-1">
            Set up a new classroom/course for your students.
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-5">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Classroom Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Intro to AI"
            className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Write a short description for this classroom"
            className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors resize-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="duration" className="text-sm font-medium">
            Duration
          </label>
          <input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 4 weeks"
            className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />{" "}
          {loading ? "Saving..." : "Save Classroom"}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>
    </div>
  );
}
