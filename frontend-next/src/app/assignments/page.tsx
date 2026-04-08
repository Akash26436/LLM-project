"use client";

import { useState } from "react";
import { FileText, CheckCircle, Clock, Upload, PlusCircle } from "lucide-react";
import {
  AssignmentItem,
  addCreatedAssignment,
  getCreatedAssignments,
} from "@/lib/learningStore";

const mockAssignments: AssignmentItem[] = [
  {
    id: 1,
    title: "Neural Network Implementation",
    course: "Introduction to Machine Learning",
    dueDate: "Apr 10, 2026",
    status: "pending",
    score: null,
  },
  {
    id: 2,
    title: "Binary Search Tree Operations",
    course: "Data Structures & Algorithms",
    dueDate: "Apr 8, 2026",
    status: "submitted",
    score: null,
  },
  {
    id: 3,
    title: "React Todo App",
    course: "Web Development with React",
    dueDate: "Apr 5, 2026",
    status: "graded",
    score: 92,
  },
  {
    id: 4,
    title: "Linear Regression from Scratch",
    course: "Introduction to Machine Learning",
    dueDate: "Mar 28, 2026",
    status: "graded",
    score: 85,
  },
  {
    id: 5,
    title: "Graph Traversal Algorithms",
    course: "Data Structures & Algorithms",
    dueDate: "Apr 15, 2026",
    status: "pending",
    score: null,
  },
];

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    icon: Clock,
  },
  submitted: {
    label: "Submitted",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    icon: Upload,
  },
  graded: {
    label: "Graded",
    color: "text-green-400",
    bg: "bg-green-500/10",
    icon: CheckCircle,
  },
};

export default function AssignmentsPage() {
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => [
    ...getCreatedAssignments(),
    ...mockAssignments,
  ]);

  const createAssignment = () => {
    const normalizedTitle = title.trim();
    const normalizedCourse = course.trim() || "General Classroom";
    if (!normalizedTitle || !dueDate) {
      alert("Please enter assignment title and due date.");
      return;
    }

    const item: AssignmentItem = {
      id: Date.now(),
      title: normalizedTitle,
      course: normalizedCourse,
      dueDate,
      status: "pending",
      score: null,
    };

    addCreatedAssignment(item);
    setAssignments((prev) => [item, ...prev]);
    setTitle("");
    setCourse("");
    setDueDate("");
  };

  const filteredAssignments =
    filter === "all"
      ? assignments
      : assignments.filter((a) => a.status === filter);

  return (
    <div className="p-8 pb-24 min-h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Assignments
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage classroom assignments.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-lg font-semibold">Create Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Assignment title"
            className="bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Classroom name"
            className="bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
        </div>
        <button
          onClick={createAssignment}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" /> Create Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Pending",
            value: assignments
              .filter((a) => a.status === "pending")
              .length.toString(),
            icon: Clock,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
          },
          {
            label: "Submitted",
            value: assignments
              .filter((a) => a.status === "submitted")
              .length.toString(),
            icon: Upload,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Graded",
            value: assignments
              .filter((a) => a.status === "graded")
              .length.toString(),
            icon: CheckCircle,
            color: "text-green-500",
            bg: "bg-green-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-panel p-6 flex items-center space-x-4 hover:scale-[1.02] transition-transform"
          >
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {["all", "pending", "submitted", "graded"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const config = statusConfig[assignment.status];
          const StatusIcon = config.icon;
          return (
            <div
              key={assignment.id}
              className="glass-panel p-6 group hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {assignment.course}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Due: {assignment.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {assignment.score !== null && (
                    <span className="text-2xl font-bold text-accent">
                      {assignment.score}%
                    </span>
                  )}
                  <span
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${config.bg} ${config.color}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {config.label}
                  </span>
                  {assignment.status === "pending" && (
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
