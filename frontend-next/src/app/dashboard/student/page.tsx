"use client";

import { useState } from "react";
import { BookOpen, Calendar, Clock, Trophy, CheckCircle, AlertCircle, PlayCircle } from "lucide-react";

export default function StudentDashboard() {
  const [courses] = useState([
    { id: 1, title: "Introduction to Machine Learning", progress: 65, nextClass: "Tomorrow, 10:00 AM" },
    { id: 2, title: "Data Structures & Algorithms", progress: 82, nextClass: "Today, 2:00 PM" },
    { id: 3, title: "Web Development with React", progress: 45, nextClass: "Friday, 11:30 AM" }
  ]);

  return (
    <div className="p-8 pb-24 h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Welcome back, Alex!
          </h1>
          <p className="text-muted-foreground mt-1">Here is your learning overview for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Courses in Progress", value: "3", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Assignments Due", value: "2", icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Quizzes Completed", value: "12", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Overall Score", value: "88%", icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
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
            <PlayCircle className="h-5 w-5 text-primary" /> Active Courses
          </h2>
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="glass-panel p-6 group hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" /> Next class: {course.nextClass}
                    </p>
                  </div>
                  <span className="font-bold text-accent">{course.progress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" /> Upcoming Schedule
          </h2>
          <div className="glass-panel p-6 space-y-6">
            <div className="border-l-2 border-primary pl-4 py-1">
              <p className="text-xs text-primary font-bold mb-1">TODAY • 2:00 PM</p>
              <p className="font-medium">Data Structures & Algorithms</p>
              <p className="text-sm text-muted-foreground mt-1">Lecture: Graphs and Trees</p>
            </div>
            <div className="border-l-2 border-accent pl-4 py-1">
              <p className="text-xs text-accent font-bold mb-1">TOMORROW • 10:00 AM</p>
              <p className="font-medium">Introduction to Machine Learning</p>
              <p className="text-sm text-muted-foreground mt-1">Lecture: Neural Networks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
