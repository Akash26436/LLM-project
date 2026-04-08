"use client";

import { useState } from "react";
import { WandSparkles, PlusCircle, CheckSquare2 } from "lucide-react";
import {
  addCreatedQuiz,
  getCreatedQuizzes,
  QuizItem,
} from "@/lib/learningStore";

export default function QuizzesPage() {
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [questions, setQuestions] = useState("5");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [quizzes, setQuizzes] = useState<QuizItem[]>(() => getCreatedQuizzes());

  const generateQuiz = () => {
    const normalizedTopic = topic.trim();
    const normalizedCourse = course.trim() || "General Classroom";
    const qCount = Number(questions);

    if (!normalizedTopic || !Number.isFinite(qCount) || qCount <= 0) {
      alert("Please enter topic and a valid question count.");
      return;
    }

    const item: QuizItem = {
      id: Date.now(),
      topic: normalizedTopic,
      course: normalizedCourse,
      questions: qCount,
      difficulty,
      createdAt: new Date().toLocaleString(),
    };

    addCreatedQuiz(item);
    setQuizzes((prev) => [item, ...prev]);
    setTopic("");
    setCourse("");
    setQuestions("5");
    setDifficulty("medium");
  };

  return (
    <div className="p-8 pb-24 min-h-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Quizzes
        </h1>
        <p className="text-muted-foreground mt-1">
          Create and manage classroom quizzes.
        </p>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <WandSparkles className="h-5 w-5 text-primary" /> Generate Quiz
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter quiz topic"
            className="bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Enter classroom name"
            className="bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
          <input
            type="number"
            min={1}
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Question count"
            className="bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as "easy" | "medium" | "hard")
            }
            className="bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          onClick={generateQuiz}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" /> Create Quiz
        </button>
      </div>

      <div className="glass-panel p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CheckSquare2 className="h-5 w-5 text-accent" /> Recent Quizzes
        </h2>
        {quizzes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No quizzes yet. Generate your first one above.
          </p>
        ) : (
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-xl bg-secondary/30 px-4 py-3"
              >
                <p className="font-medium">{quiz.topic}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {quiz.course} • {quiz.questions} questions • {quiz.difficulty}{" "}
                  • {quiz.createdAt}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
