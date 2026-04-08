"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Users, Plus, Search, MoreVertical } from "lucide-react";
import { apiFetch } from "@/lib/auth";

type CourseCard = {
  id: number;
  title: string;
  students: number;
  avgScore: number;
  topics: number;
  status: "active" | "draft";
  color: string;
};

const fallbackCourses: CourseCard[] = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    students: 120,
    avgScore: 78,
    topics: 12,
    status: "active",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    students: 150,
    avgScore: 82,
    topics: 18,
    status: "active",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 3,
    title: "Web Development with React",
    students: 95,
    avgScore: 75,
    topics: 15,
    status: "active",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 4,
    title: "Database Management Systems",
    students: 80,
    avgScore: 71,
    topics: 10,
    status: "draft",
    color: "from-orange-500 to-red-600",
  },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<CourseCard[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await apiFetch<Array<{ id: number; title: string }>>(
          "/courses/",
          {},
          true,
        );
        const mapped: CourseCard[] = data.map((course, index) => ({
          id: course.id,
          title: course.title,
          students: 0,
          avgScore: 0,
          topics: 0,
          status: "active",
          color: [
            "from-blue-500 to-indigo-600",
            "from-green-500 to-emerald-600",
            "from-purple-500 to-pink-600",
            "from-orange-500 to-red-600",
          ][index % 4],
        }));
        setCourses(mapped);
      } catch {
        setCourses(fallbackCourses);
      }
    };
    void loadCourses();
  }, []);

  const filteredCourses = useMemo(
    () =>
      courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [courses, searchQuery],
  );

  return (
    <div className="p-8 pb-24 h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your courses.
          </p>
        </div>
        <Link
          href="/courses/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        >
          <Plus className="h-4 w-4" /> Create Classroom
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-secondary/50 text-foreground text-sm rounded-xl pl-10 pr-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="glass-panel overflow-hidden group hover:border-primary/50 transition-all duration-300"
          >
            <div className={`h-2 bg-gradient-to-r ${course.color}`} />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors leading-tight">
                  {course.title}
                </h3>
                <Link
                  href={`/courses/manage/${course.id}`}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {course.students} students
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> {course.topics} topics
                </span>
                <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                  ID: {course.id}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Avg Score</span>
                  <span className="font-medium">{course.avgScore}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${course.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${course.avgScore}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    course.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {course.status === "active" ? "Active" : "Draft"}
                </span>
                <Link
                  href={`/courses/manage/${course.id}`}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Manage Classroom
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
