"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function ManageClassroomSettingsPage() {
  const params = useParams<{ id: string }>();
  const courseId = params?.id || "unknown";

  const [title, setTitle] = useState("Classroom Title");
  const [description, setDescription] = useState("Classroom description");
  const [status, setStatus] = useState("active");

  const handleSave = () => {
    alert(`Saved settings for classroom ${courseId}`);
  };

  return (
    <div className="p-8 pb-24 min-h-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link
        href={`/courses/manage/${courseId}`}
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Manage Classroom
      </Link>

      <div className="glass-panel p-6 space-y-5">
        <h1 className="text-2xl font-bold">Classroom Settings</h1>
        <p className="text-sm text-muted-foreground">
          Classroom ID: {courseId}
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Save className="h-4 w-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
