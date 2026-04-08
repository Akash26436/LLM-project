export type CourseCard = {
  id: number;
  title: string;
  students: number;
  avgScore: number;
  topics: number;
  status: "active" | "draft";
  color: string;
  description?: string;
  duration?: string;
};

export type StudentCourse = {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  nextClass: string;
  totalLessons: number;
  completedLessons: number;
  color: string;
};

const STORAGE_KEY = "teacher_created_courses";
const STUDENT_JOINED_STORAGE_KEY = "student_joined_courses";

export function getCreatedCourses(): CourseCard[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as CourseCard[];
  } catch {
    return [];
  }
}

export function addCreatedCourse(course: CourseCard): void {
  if (typeof window === "undefined") {
    return;
  }

  const existing = getCreatedCourses();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([course, ...existing]));
}

function toStudentCourse(course: CourseCard): StudentCourse {
  return {
    id: course.id,
    title: course.title,
    instructor: "Class Instructor",
    progress: 0,
    nextClass: "To be announced",
    totalLessons: Math.max(8, course.topics || 8),
    completedLessons: 0,
    color: course.color || "from-cyan-500 to-blue-600",
  };
}

export function getStudentJoinedCourses(): StudentCourse[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STUDENT_JOINED_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as StudentCourse[];
  } catch {
    return [];
  }
}

export function joinStudentCourse(course: CourseCard): {
  joined: boolean;
  message: string;
} {
  if (typeof window === "undefined") {
    return {
      joined: false,
      message: "Join is only available in browser mode.",
    };
  }

  const joinedCourses = getStudentJoinedCourses();
  const alreadyJoined = joinedCourses.some((c) => c.id === course.id);
  if (alreadyJoined) {
    return { joined: false, message: "You already joined this classroom." };
  }

  const updated = [toStudentCourse(course), ...joinedCourses];
  localStorage.setItem(STUDENT_JOINED_STORAGE_KEY, JSON.stringify(updated));
  return { joined: true, message: "Classroom joined successfully." };
}
