export type AssignmentItem = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score: number | null;
};

export type QuizItem = {
  id: number;
  topic: string;
  course: string;
  questions: number;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
};

export type CourseMaterialItem = {
  id: number;
  courseId: string;
  title: string;
  type: "note" | "slides" | "link" | "pdf";
  description: string;
  resourceUrl: string;
  fileName?: string;
  createdAt: string;
};

const ASSIGNMENTS_KEY = "teacher_created_assignments";
const QUIZZES_KEY = "teacher_created_quizzes";
const MATERIALS_KEY = "teacher_created_materials";

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(key, JSON.stringify(list));
}

export function getCreatedAssignments(): AssignmentItem[] {
  return readList<AssignmentItem>(ASSIGNMENTS_KEY);
}

export function addCreatedAssignment(item: AssignmentItem): void {
  const current = getCreatedAssignments();
  writeList(ASSIGNMENTS_KEY, [item, ...current]);
}

export function getCreatedQuizzes(): QuizItem[] {
  return readList<QuizItem>(QUIZZES_KEY);
}

export function addCreatedQuiz(item: QuizItem): void {
  const current = getCreatedQuizzes();
  writeList(QUIZZES_KEY, [item, ...current]);
}

export function getCreatedMaterials(): CourseMaterialItem[] {
  return readList<CourseMaterialItem>(MATERIALS_KEY);
}

export function addCreatedMaterial(item: CourseMaterialItem): void {
  const current = getCreatedMaterials();
  writeList(MATERIALS_KEY, [item, ...current]);
}
