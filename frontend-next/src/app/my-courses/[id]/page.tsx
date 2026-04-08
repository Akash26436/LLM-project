"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  GraduationCap,
  PlayCircle,
} from "lucide-react";
import { StudentCourse, getStudentJoinedCourses } from "@/lib/courseStore";

const defaultStudentCourses: StudentCourse[] = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    instructor: "Prof. Smith",
    progress: 65,
    nextClass: "Tomorrow, 10:00 AM",
    totalLessons: 24,
    completedLessons: 16,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    instructor: "Prof. Johnson",
    progress: 82,
    nextClass: "Today, 2:00 PM",
    totalLessons: 30,
    completedLessons: 25,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 3,
    title: "Web Development with React",
    instructor: "Prof. Wilson",
    progress: 45,
    nextClass: "Friday, 11:30 AM",
    totalLessons: 20,
    completedLessons: 9,
    color: "from-purple-500 to-pink-600",
  },
];

export default function CourseLearningPage() {
  const params = useParams<{ id: string }>();
  const courseId = Number(params?.id);

  const course = useMemo(() => {
    if (!Number.isFinite(courseId)) {
      return null;
    }

    const joined = getStudentJoinedCourses();
    const allCourses = [
      ...defaultStudentCourses,
      ...joined.filter(
        (c) => !defaultStudentCourses.some((d) => d.id === c.id),
      ),
    ];
    return allCourses.find((c) => c.id === courseId) || null;
  }, [courseId]);

  if (!course) {
    return (
      <div className="p-8 pb-24 min-h-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
        <Link
          href="/my-courses"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Courses
        </Link>
        <div className="glass-panel p-8 text-center space-y-2">
          <h1 className="text-2xl font-semibold">Classroom Not Found</h1>
          <p className="text-sm text-muted-foreground">
            This classroom is not available in your enrolled list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-24 min-h-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Link
        href="/my-courses"
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Courses
      </Link>

      <div className="glass-panel overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${course.color}`} />
        <div className="p-6 space-y-5">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {course.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              Instructor: {course.instructor}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="text-xl font-semibold mt-1">{course.progress}%</p>
            </div>
            <div className="rounded-xl bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground">Lessons Completed</p>
              <p className="text-xl font-semibold mt-1">
                {course.completedLessons}/{course.totalLessons}
              </p>
            </div>
            <div className="rounded-xl bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground">Next Class</p>
              <p className="text-xl font-semibold mt-1">{course.nextClass}</p>
            </div>
          </div>

          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${course.color} transition-all duration-700`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`/my-courses/${course.id}/lesson`}
          className="glass-panel p-5 text-left hover:border-primary/50 transition-colors"
        >
          <PlayCircle className="h-5 w-5 text-primary mb-3" />
          <p className="font-medium">Resume Lesson</p>
          <p className="text-sm text-muted-foreground mt-1">
            Continue from your last watched topic.
          </p>
        </Link>
        <Link
          href={`/my-courses/${course.id}/materials`}
          className="glass-panel p-5 text-left hover:border-primary/50 transition-colors"
        >
          <BookOpen className="h-5 w-5 text-primary mb-3" />
          <p className="font-medium">Open Course Material</p>
          <p className="text-sm text-muted-foreground mt-1">
            Read notes and learning resources.
          </p>
        </Link>
        <Link
          href={`/my-courses/${course.id}/quiz`}
          className="glass-panel p-5 text-left hover:border-primary/50 transition-colors"
        >
          <GraduationCap className="h-5 w-5 text-primary mb-3" />
          <p className="font-medium">Practice Quiz</p>
          <p className="text-sm text-muted-foreground mt-1">
            Test yourself on this classroom.
          </p>
        </Link>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" /> Suggested Study Plan
        </h2>
        <p className="text-sm text-muted-foreground mt-3">
          Spend 30 minutes reviewing the previous topic, 20 minutes on new
          lecture material, and 10 minutes on recap questions.
        </p>
      </div>
    </div>
  );
}
