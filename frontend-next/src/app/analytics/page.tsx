"use client";

import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";

const coursePerformance = [
  { name: "Machine Learning", enrolled: 120, avgScore: 78, passRate: 89 },
  { name: "DSA", enrolled: 150, avgScore: 82, passRate: 92 },
  { name: "Web Dev", enrolled: 95, avgScore: 75, passRate: 85 },
];

const weeklyProgress = [
  { week: "Week 1", score: 72 },
  { week: "Week 2", score: 75 },
  { week: "Week 3", score: 78 },
  { week: "Week 4", score: 74 },
  { week: "Week 5", score: 80 },
  { week: "Week 6", score: 82 },
  { week: "Week 7", score: 85 },
];

export default function AnalyticsPage() {
  const maxScore = Math.max(...weeklyProgress.map(w => w.score));

  return (
    <div className="p-8 pb-24 h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Track performance metrics and insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: "365", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", change: "+12%" },
          { label: "Avg Score", value: "78%", icon: Activity, color: "text-green-500", bg: "bg-green-500/10", change: "+5%" },
          { label: "Pass Rate", value: "89%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10", change: "+2%" },
          { label: "Active Courses", value: "3", icon: BarChart3, color: "text-orange-500", bg: "bg-orange-500/10", change: "—" },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-green-400">{stat.change}</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress Chart */}
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Weekly Progress
          </h2>
          <div className="flex items-end gap-3 h-48">
            {weeklyProgress.map((week, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{week.score}%</span>
                <div className="w-full bg-secondary rounded-t-md overflow-hidden" style={{ height: "100%" }}>
                  <div
                    className="w-full bg-gradient-to-t from-primary to-accent rounded-t-md transition-all duration-700 ease-out mt-auto"
                    style={{ height: `${(week.score / maxScore) * 100}%`, marginTop: `${100 - (week.score / maxScore) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{week.week.replace("Week ", "W")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Performance Table */}
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" /> Course Performance
          </h2>
          <div className="space-y-4">
            {coursePerformance.map((course, i) => (
              <div key={i} className="p-4 bg-secondary/30 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{course.name}</h3>
                  <span className="text-sm text-muted-foreground">{course.enrolled} students</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avg Score</p>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${course.avgScore}%` }} />
                    </div>
                    <p className="text-sm font-medium mt-1">{course.avgScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pass Rate</p>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${course.passRate}%` }} />
                    </div>
                    <p className="text-sm font-medium mt-1">{course.passRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
