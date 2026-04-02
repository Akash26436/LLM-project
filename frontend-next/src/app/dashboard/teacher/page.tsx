"use client";

import { useState } from "react";
import { Users, BookOpen, Activity, AlertTriangle, FileText, CheckSquare, Plus } from "lucide-react";

export default function TeacherDashboard() {
  const [courses] = useState([
    { id: 1, title: "Introduction to Machine Learning", students: 120, avgScore: 78, alerts: 5 },
    { id: 2, title: "Data Structures & Algorithms", students: 150, avgScore: 82, alerts: 2 },
  ]);

  return (
    <div className="p-8 pb-24 h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage your courses, assignments, and student performance.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(var(--primary),0.5)]">
          <Plus className="h-4 w-4" /> New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: "270", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Courses", value: "2", icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Avg Class Score", value: "80%", icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Students at Risk", value: "7", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 flex items-center space-x-4 hover:scale-[1.02] transition-transform">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Active Courses
          </h2>
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="glass-panel p-6 group hover:border-primary/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3"/> {course.students}</span>
                    <span className="flex items-center gap-1"><Activity className="h-3 w-3"/> {course.avgScore}% avg</span>
                    {course.alerts > 0 && (
                      <span className="flex items-center gap-1 text-red-400 font-medium"><AlertTriangle className="h-3 w-3"/> {course.alerts} alerts</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors">Manage</button>
                  <button className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors">Analytics</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-accent" /> Quick Actions
          </h2>
          <div className="glass-panel p-4 space-y-2">
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/50 rounded-lg transition-colors">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md"><FileText className="h-4 w-4"/></div>
              <span className="font-medium">Generate Assignment</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/50 rounded-lg transition-colors">
              <div className="p-2 bg-green-500/10 text-green-500 rounded-md"><CheckSquare className="h-4 w-4"/></div>
              <span className="font-medium">Create Quiz</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/50 rounded-lg transition-colors">
              <div className="p-2 bg-purple-500/10 text-purple-500 rounded-md"><Activity className="h-4 w-4"/></div>
              <span className="font-medium">View Analytics Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
