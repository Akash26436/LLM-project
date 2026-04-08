"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/auth";
import {
  BookOpen,
  BrainCircuit,
  ClipboardList,
  LayoutDashboard,
  Lightbulb,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  Wand2,
} from "lucide-react";

type CourseSummary = {
  id: number;
  title: string;
  description?: string | null;
};

type TopicSummary = {
  id: number;
  title: string;
  description?: string | null;
  course_id: number;
};

type DashboardData = {
  course_id?: number;
  attendance?: unknown[];
  report?: Record<string, unknown>;
};

type LiveContext = {
  course: CourseSummary | null;
  topic: TopicSummary | null;
  topics: TopicSummary[];
  dashboard: DashboardData | null;
};

type AgenticFeature = {
  name: string;
  endpoint: string;
  method: "POST" | "GET";
  description: string;
  icon: typeof Sparkles;
  buildPayload: (context: LiveContext) => Record<string, unknown>;
};

const featureSummary = [
  "Curriculum design",
  "Planning",
  "Teaching support",
  "Assessment generation",
  "Auto grading",
  "Progress insights",
  "Performance analysis",
  "Feedback",
  "Reporting",
  "Engagement nudges",
];

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function createLivePayload(
  feature: AgenticFeature,
  context: LiveContext,
): Record<string, unknown> {
  return feature.buildPayload(context);
}

const features: AgenticFeature[] = [
  {
    name: "Curriculum Builder",
    endpoint: "curriculum",
    method: "POST",
    description:
      "Generate a structured curriculum from the selected classroom.",
    icon: BookOpen,
    buildPayload: ({ course, topics }) => ({
      subject: course?.title ?? "",
      duration: "",
      context: course?.description ?? "",
      learning_goals: topics.map((topic) => topic.title),
      course_id: course?.id ?? null,
    }),
  },
  {
    name: "Study Planner",
    endpoint: "plans",
    method: "POST",
    description: "Create a study plan from the selected classroom context.",
    icon: ClipboardList,
    buildPayload: ({ course, topics }) => ({
      user_goal: "",
      user_knowledge_summary: course?.description ?? "",
      subject: course?.title ?? "",
      style: "",
      course_id: course?.id ?? null,
      topic_context: topics.map((topic) => topic.title),
    }),
  },
  {
    name: "Teaching Assistant",
    endpoint: "teach",
    method: "POST",
    description: "Explain the selected topic using live classroom context.",
    icon: BrainCircuit,
    buildPayload: ({ course, topic, topics }) => ({
      topic: topic?.title ?? course?.title ?? "",
      style: "",
      level: "",
      context: course?.description ?? "",
      related_topics: topics.map((item) => item.title),
      course_id: course?.id ?? null,
    }),
  },
  {
    name: "Assessment Generator",
    endpoint: "assessment",
    method: "POST",
    description: "Create assignment and quiz prompts from live course topics.",
    icon: Wand2,
    buildPayload: ({ course, topic, topics }) => ({
      topic: topic?.title ?? course?.title ?? "",
      difficulty: "",
      assignment_type: "",
      roadmap: topics.map((item) => item.title).join(", "),
      num_questions: topics.length,
      user_goal: "",
      course_id: course?.id ?? null,
    }),
  },
  {
    name: "Auto Grading",
    endpoint: "grade",
    method: "POST",
    description: "Evaluate a submission against the selected classroom topic.",
    icon: Trophy,
    buildPayload: ({ course, topic }) => ({
      assessment_type: "",
      prompt_or_details: {
        course_id: course?.id ?? null,
        course_title: course?.title ?? "",
        topic_title: topic?.title ?? "",
        topic_description: topic?.description ?? "",
      },
      submission_content: "",
      total_marks: 10,
      rubric: "",
      course_id: course?.id ?? null,
    }),
  },
  {
    name: "Progress Tracking",
    endpoint: "progress",
    method: "POST",
    description: "Record a live progress snapshot for the selected classroom.",
    icon: TrendingUp,
    buildPayload: ({ course, topics, dashboard }) => ({
      course_id: course?.id ?? null,
      student_id: null,
      metrics: {
        course_title: course?.title ?? "",
        course_description: course?.description ?? "",
        topics: topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          description: topic.description ?? "",
        })),
        attendance: dashboard?.attendance ?? [],
        report: dashboard?.report ?? {},
      },
    }),
  },
  {
    name: "Performance Analysis",
    endpoint: "performance",
    method: "POST",
    description:
      "Analyze classroom progress using live attendance and report data.",
    icon: LayoutDashboard,
    buildPayload: ({ course, topics, dashboard }) => ({
      course_id: course?.id ?? null,
      student_id: null,
      progress_snapshot: dashboard?.report ?? {},
      mastery_by_topic: topics.map((topic) => ({
        title: topic.title,
        description: topic.description ?? "",
      })),
    }),
  },
  {
    name: "Feedback Coach",
    endpoint: "feedback",
    method: "POST",
    description: "Generate recommendations from the current classroom report.",
    icon: Lightbulb,
    buildPayload: ({ course, dashboard }) => ({
      subject: course?.title ?? "",
      course_id: course?.id ?? null,
      performance_summary: dashboard?.report ?? {},
      style: "balanced",
    }),
  },
  {
    name: "Course Report",
    endpoint: "report",
    method: "POST",
    description: "Summarize the live classroom data into a report.",
    icon: MessageSquare,
    buildPayload: ({ course, topics, dashboard }) => ({
      course_id: course?.id ?? 0,
      summary_data: {
        course_title: course?.title ?? "",
        course_description: course?.description ?? "",
        topics: topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          description: topic.description ?? "",
        })),
        attendance: dashboard?.attendance ?? [],
        report: dashboard?.report ?? {},
      },
    }),
  },
  {
    name: "Engagement Nudge",
    endpoint: "engagement",
    method: "POST",
    description: "Build follow-up actions from live classroom engagement data.",
    icon: ShieldCheck,
    buildPayload: ({ course, topics, dashboard }) => ({
      course_id: course?.id ?? null,
      student_id: null,
      engagement_data: {
        course_title: course?.title ?? "",
        topic_titles: topics.map((topic) => topic.title),
        attendance: dashboard?.attendance ?? [],
        report: dashboard?.report ?? {},
      },
    }),
  },
];

export default function AiHubPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<AgenticFeature>(
    features[0],
  );
  const [payload, setPayload] = useState("");
  const [payloadDirty, setPayloadDirty] = useState(false);
  const [result, setResult] = useState("");
  const [running, setRunning] = useState(false);
  const [operationError, setOperationError] = useState("");

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId],
  );
  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopicId) ?? null,
    [topics, selectedTopicId],
  );
  const liveContext = useMemo(
    () => ({
      course: selectedCourse,
      topic: selectedTopic,
      topics,
      dashboard,
    }),
    [dashboard, selectedCourse, selectedTopic, topics],
  );
  const livePayload = useMemo(
    () => formatJson(createLivePayload(selectedFeature, liveContext)),
    [liveContext, selectedFeature],
  );

  useEffect(() => {
    const loadCourses = async () => {
      setCoursesLoading(true);
      setCoursesError("");

      try {
        const data = await apiFetch<Array<CourseSummary>>(
          "/courses/",
          {},
          true,
        );
        setCourses(data);
        setSelectedCourseId((current) => current ?? data[0]?.id ?? null);
      } catch (err) {
        setCourses([]);
        setCoursesError(
          err instanceof Error ? err.message : "Could not load classrooms",
        );
      } finally {
        setCoursesLoading(false);
      }
    };

    void loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId === null) {
      setTopics([]);
      setSelectedTopicId(null);
      setDashboard(null);
      return;
    }

    const loadCourseData = async () => {
      setTopicsLoading(true);
      setDashboardLoading(true);
      setOperationError("");

      try {
        const [topicsData, dashboardData] = await Promise.all([
          apiFetch<Array<TopicSummary>>(
            `/courses/${selectedCourseId}/topics`,
            {},
            true,
          ),
          apiFetch<DashboardData>(
            `/agentic/dashboard/${selectedCourseId}`,
            {},
            true,
          ),
        ]);
        setTopics(topicsData);
        setSelectedTopicId(topicsData[0]?.id ?? null);
        setDashboard(dashboardData);
        setPayloadDirty(false);
      } catch (err) {
        setTopics([]);
        setSelectedTopicId(null);
        setDashboard(null);
        setOperationError(
          err instanceof Error ? err.message : "Could not load classroom data",
        );
      } finally {
        setTopicsLoading(false);
        setDashboardLoading(false);
      }
    };

    void loadCourseData();
  }, [selectedCourseId]);

  useEffect(() => {
    if (!payloadDirty) {
      setPayload(livePayload);
    }
  }, [livePayload, payloadDirty]);

  const handleFeatureChange = (feature: AgenticFeature) => {
    setSelectedFeature(feature);
    setPayloadDirty(false);
    setResult("");
    setOperationError("");
  };

  const handleCourseChange = (courseId: number) => {
    setSelectedCourseId(courseId);
    setPayloadDirty(false);
    setResult("");
    setOperationError("");
  };

  const handleTopicChange = (topicId: number) => {
    setSelectedTopicId(topicId);
    setPayloadDirty(false);
  };

  const handleResetLivePayload = () => {
    setPayload(formatJson(createLivePayload(selectedFeature, liveContext)));
    setPayloadDirty(false);
  };

  const handleRefreshLiveData = async () => {
    if (selectedCourseId === null) {
      return;
    }

    setDashboardLoading(true);
    setOperationError("");

    try {
      const [topicsData, dashboardData] = await Promise.all([
        apiFetch<Array<TopicSummary>>(
          `/courses/${selectedCourseId}/topics`,
          {},
          true,
        ),
        apiFetch<DashboardData>(
          `/agentic/dashboard/${selectedCourseId}`,
          {},
          true,
        ),
      ]);
      setTopics(topicsData);
      setSelectedTopicId(topicsData[0]?.id ?? null);
      setDashboard(dashboardData);
      setPayloadDirty(false);
    } catch (err) {
      setOperationError(
        err instanceof Error ? err.message : "Could not refresh classroom data",
      );
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRunning(true);
    setResult("");
    setOperationError("");

    try {
      const body = JSON.parse(payload) as Record<string, unknown>;
      const response = await apiFetch<Record<string, unknown>>(
        `/agentic/${selectedFeature.endpoint}`,
        {
          method: selectedFeature.method,
          body: JSON.stringify(body),
        },
        true,
      );
      setResult(JSON.stringify(response, null, 2));
      setPayloadDirty(false);
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-8 pb-24 h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI Hub
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Agentic classroom features in one place
          </h1>
          <p className="max-w-3xl text-muted-foreground">
            The form is driven by the live classroom data loaded from the
            backend. Pick a course and topic, then run any agentic feature
            against the real payload.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featureSummary.map((label) => (
          <div
            key={label}
            className="glass-panel p-4 text-sm text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Live classroom</h2>
              <button
                type="button"
                onClick={handleRefreshLiveData}
                disabled={
                  dashboardLoading || topicsLoading || selectedCourseId === null
                }
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-60"
              >
                {dashboardLoading || topicsLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Refresh
              </button>
            </div>

            {coursesLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading classrooms...
              </div>
            ) : courses.length > 0 ? (
              <div className="space-y-3">
                <label className="space-y-2 block">
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Classroom
                  </span>
                  <select
                    value={selectedCourseId ?? ""}
                    onChange={(e) =>
                      handleCourseChange(Number.parseInt(e.target.value, 10))
                    }
                    className="w-full rounded-xl border border-white/10 bg-secondary/40 px-3 py-3 text-sm outline-none focus:border-primary/50"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} (ID {course.id})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 block">
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Topic
                  </span>
                  <select
                    value={selectedTopicId ?? ""}
                    onChange={(e) =>
                      handleTopicChange(Number.parseInt(e.target.value, 10))
                    }
                    className="w-full rounded-xl border border-white/10 bg-secondary/40 px-3 py-3 text-sm outline-none focus:border-primary/50"
                    disabled={topics.length === 0}
                  >
                    {topics.length > 0 ? (
                      topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.title}
                        </option>
                      ))
                    ) : (
                      <option value="">No topics available</option>
                    )}
                  </select>
                </label>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {selectedCourse?.title ?? "Select a classroom"}
                  </p>
                  <p>
                    {selectedCourse?.description ||
                      "No classroom description available."}
                  </p>
                  <p>Topics loaded: {topics.length}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  {coursesError ||
                    "No classrooms found for the current account."}
                </p>
              </div>
            )}
          </div>

          <div className="glass-panel p-5 space-y-3">
            <h2 className="text-lg font-semibold">Available features</h2>
            <div className="grid gap-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isActive = selectedFeature.endpoint === feature.endpoint;

                return (
                  <button
                    key={feature.endpoint}
                    type="button"
                    onClick={() => handleFeatureChange(feature)}
                    className={`text-left rounded-2xl border p-4 transition-all ${isActive ? "border-primary/60 bg-primary/10" : "border-white/5 bg-white/5 hover:border-primary/30 hover:bg-white/10"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-primary/10 p-3 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{feature.name}</h3>
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                            {feature.method}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                        <p className="text-xs text-primary/80">
                          /agentic/{feature.endpoint}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Try {selectedFeature.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  The payload is built from the currently selected classroom and
                  topic.
                </p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                /agentic/{selectedFeature.endpoint}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={payload}
                onChange={(e) => {
                  setPayload(e.target.value);
                  setPayloadDirty(true);
                }}
                rows={18}
                spellCheck={false}
                className="w-full rounded-2xl border border-white/10 bg-secondary/40 px-4 py-3 font-mono text-sm text-foreground outline-none focus:border-primary/50"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={running || selectedCourseId === null}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {running ? "Running..." : "Run feature"}
                </button>
                <button
                  type="button"
                  onClick={handleResetLivePayload}
                  className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                >
                  Use live payload
                </button>
              </div>
            </form>

            {operationError && (
              <p className="text-sm text-red-400">{operationError}</p>
            )}

            {result && (
              <pre className="overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-zinc-200">
                {result}
              </pre>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 space-y-3">
              <h3 className="text-lg font-semibold">Selected classroom</h3>
              <p className="text-sm text-muted-foreground">
                {selectedCourse?.title ?? "No classroom selected"}
              </p>
              <p className="text-xs text-muted-foreground">
                ID: {selectedCourse?.id ?? "-"}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedCourse?.description ||
                  "Use the classroom selector to load real data."}
              </p>
            </div>

            <div className="glass-panel p-6 space-y-3">
              <h3 className="text-lg font-semibold">Selected topic</h3>
              <p className="text-sm text-muted-foreground">
                {selectedTopic?.title ?? "No topic selected"}
              </p>
              <p className="text-xs text-muted-foreground">
                ID: {selectedTopic?.id ?? "-"}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedTopic?.description ||
                  "Topics are loaded from the backend for the selected classroom."}
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  Live classroom dashboard
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pulled directly from{" "}
                  <span className="font-mono">/agentic/dashboard</span> for the
                  selected classroom.
                </p>
              </div>
              {dashboardLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
            </div>

            <pre className="overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-zinc-200">
              {dashboard
                ? formatJson(dashboard)
                : "No dashboard data loaded yet."}
            </pre>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-xl font-semibold">Live payload preview</h2>
            <p className="text-sm text-muted-foreground">
              This preview is built from the selected classroom, topic, and
              dashboard data. No sample data is used.
            </p>
            <pre className="overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-zinc-200">
              {payload || livePayload}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
