"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, UserPlus, Trash2 } from "lucide-react";

export default function ManageStudentsPage() {
  const params = useParams<{ id: string }>();
  const courseId = params?.id || "unknown";

  const [students, setStudents] = useState<string[]>([
    "Ava Johnson",
    "Liam Smith",
    "Noah Brown",
  ]);
  const [newStudent, setNewStudent] = useState("");

  const addStudent = () => {
    const name = newStudent.trim();
    if (!name) {
      return;
    }
    setStudents((prev) => [...prev, name]);
    setNewStudent("");
  };

  const removeStudent = (name: string) => {
    setStudents((prev) => prev.filter((s) => s !== name));
  };

  return (
    <div className="p-8 pb-24 min-h-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link
        href={`/courses/manage/${courseId}`}
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Manage Classroom
      </Link>

      <div className="glass-panel p-6 space-y-4">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <p className="text-sm text-muted-foreground">
          Classroom ID: {courseId}
        </p>

        <div className="flex gap-3">
          <input
            value={newStudent}
            onChange={(e) => setNewStudent(e.target.value)}
            placeholder="Enter student name"
            className="flex-1 bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
          <button
            onClick={addStudent}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" /> Add
          </button>
        </div>

        <div className="space-y-3 pt-2">
          {students.map((student) => (
            <div
              key={student}
              className="flex items-center justify-between bg-secondary/30 rounded-xl px-4 py-3"
            >
              <span className="text-sm">{student}</span>
              <button
                onClick={() => removeStudent(student)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
