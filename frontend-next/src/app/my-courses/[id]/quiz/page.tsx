"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, GraduationCap } from "lucide-react";

export default function CourseQuizPage() {
  const params = useParams<{ id: string }>();
  const courseId = params?.id;

  return (
    <div className="p-8 pb-24 min-h-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link
        href={`/my-courses/${courseId}`}
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Classroom
      </Link>

      <div className="glass-panel p-8 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" /> Practice Quiz
        </h1>
        <p className="text-sm text-muted-foreground">
          Quiz screen is now connected for course ID: {courseId}.
        </p>
        <p className="text-sm text-muted-foreground">
          Next step can be wiring this page to your existing quiz generator
          APIs.
        </p>
      </div>
    </div>
  );
}
