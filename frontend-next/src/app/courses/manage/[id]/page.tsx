"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, Settings, Users } from "lucide-react";

export default function ManageCoursePage() {
  const params = useParams<{ id: string }>();
  const courseId = params?.id || "unknown";

  return (
    <div className="p-8 pb-24 h-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Manage Classroom
          </h1>
          <p className="text-muted-foreground mt-1">Classroom ID: {courseId}</p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/courses/manage/${courseId}/students`}
          className="glass-panel p-6 space-y-3 hover:border-primary/50 transition-colors"
        >
          <div className="inline-flex p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold">Student Management</h2>
          <p className="text-sm text-muted-foreground">
            Add/remove students, review enrollment, and monitor participation.
          </p>
        </Link>

        <Link
          href={`/courses/manage/${courseId}/settings`}
          className="glass-panel p-6 space-y-3 hover:border-primary/50 transition-colors"
        >
          <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Settings className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold">Classroom Settings</h2>
          <p className="text-sm text-muted-foreground">
            Update title, description, grading rules, and publication state.
          </p>
        </Link>

        <Link
          href={`/courses/manage/${courseId}/materials`}
          className="glass-panel p-6 space-y-3 hover:border-primary/50 transition-colors"
        >
          <div className="inline-flex p-3 rounded-xl bg-violet-500/10 text-violet-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold">Course Materials</h2>
          <p className="text-sm text-muted-foreground">
            Create notes, links, and learning resources for this classroom.
          </p>
        </Link>
      </div>
    </div>
  );
}
