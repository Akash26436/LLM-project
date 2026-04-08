"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getCreatedMaterials } from "@/lib/learningStore";

export default function CourseMaterialsPage() {
  const params = useParams<{ id: string }>();
  const courseId = params?.id || "unknown";

  const materials = useMemo(
    () => getCreatedMaterials().filter((m) => m.courseId === courseId),
    [courseId],
  );

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
          <BookOpen className="h-6 w-6 text-primary" /> Course Materials
        </h1>
        {materials.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No materials available yet for this classroom.
          </p>
        ) : (
          <div className="space-y-3">
            {materials.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-secondary/30 px-4 py-3"
              >
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.type} • {item.createdAt}
                </p>
                {item.fileName && (
                  <p className="text-xs text-muted-foreground mt-1">
                    File: {item.fileName}
                  </p>
                )}
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {item.description}
                  </p>
                )}
                {item.resourceUrl && (
                  <a
                    href={item.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary hover:text-primary/80 mt-2 inline-block"
                  >
                    {item.type === "pdf" ? "Open PDF" : "Open Resource"}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
