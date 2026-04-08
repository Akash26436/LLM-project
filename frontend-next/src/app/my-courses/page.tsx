"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Trophy,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import {
  CourseCard,
  StudentCourse,
  getStudentJoinedCourses,
  joinStudentCourse,
} from "@/lib/courseStore";
import { apiFetch } from "@/lib/auth";

const mockCourses: StudentCourse[] = [
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

function getInitialStudentCourses(): StudentCourse[] {
  const joined = getStudentJoinedCourses();
  const baseIds = new Set(mockCourses.map((c) => c.id));
  const onlyNewJoined = joined.filter((c) => !baseIds.has(c.id));
  return [...mockCourses, ...onlyNewJoined];
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<StudentCourse[]>(
    getInitialStudentCourses,
  );
  const [classroomIdInput, setClassroomIdInput] = useState("");
  const [joinMessage, setJoinMessage] = useState("");

  const refreshCourses = () => {
    const joined = getStudentJoinedCourses();
    const baseIds = new Set(mockCourses.map((c) => c.id));
    const onlyNewJoined = joined.filter((c) => !baseIds.has(c.id));
    setCourses([...mockCourses, ...onlyNewJoined]);
  };

  const avgProgress = useMemo(() => {
    if (!courses.length) {
      return 0;
    }

    const sum = courses.reduce((acc, c) => acc + c.progress, 0);
    return Math.round(sum / courses.length);
  }, [courses]);

  const handleJoinClassroomById = async () => {
    setJoinMessage("");
    const parsedId = Number(classroomIdInput.trim());
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      setJoinMessage("Enter a valid classroom ID.");
      return;
    }

    try {
      await apiFetch<{ message: string; classroom_id: number }>(
        "/courses/join",
        {
          method: "POST",
          body: JSON.stringify({ classroom_id: parsedId }),
        },
        true,
      );

      const localCourse: CourseCard = {
        id: parsedId,
        title: `Classroom ${parsedId}`,
        students: 0,
        avgScore: 0,
        topics: 0,
        status: "active",
        color: "from-cyan-500 to-blue-600",
      };
      joinStudentCourse(localCourse);
      refreshCourses();
      setClassroomIdInput("");
      setJoinMessage("Joined classroom successfully.");
    } catch (err) {
      setJoinMessage(
        err instanceof Error ? err.message : "Could not join classroom",
      );
    }
  };

  return (
    <div className="p-8 pb-24 min-h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          My Courses
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your enrolled courses and progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Enrolled Courses",
            value: courses.length.toString(),
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Hours Studied",
            value: (courses.length * 12).toString(),
            icon: Clock,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
          },
          {
            label: "Avg Progress",
            value: `${avgProgress}%`,
            icon: Trophy,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
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

      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Join Classroom</h2>
            <p className="text-sm text-muted-foreground">
              Enter the Classroom ID provided by your instructor.
            </p>
          </div>
          {joinMessage && <p className="text-sm text-primary">{joinMessage}</p>}
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={classroomIdInput}
            onChange={(e) => setClassroomIdInput(e.target.value)}
            placeholder="Enter Classroom ID"
            className="flex-1 bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
          <button
            onClick={handleJoinClassroomById}
            className="px-4 py-3 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Join by ID
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="glass-panel overflow-hidden group hover:border-primary/50 transition-all duration-300"
          >
            <div className={`h-1.5 bg-gradient-to-r ${course.color}`} />
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Instructor: {course.instructor}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-3.5 w-3.5" />{" "}
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Next: {course.nextClass}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 min-w-[160px]">
                  <span className="text-2xl font-bold text-accent">
                    {course.progress}%
                  </span>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${course.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/my-courses/${course.id}`}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Continue Learning <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
