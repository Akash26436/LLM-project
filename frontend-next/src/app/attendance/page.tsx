"use client";

import { useState } from "react";
import { Users, CheckCircle, XCircle, Calendar } from "lucide-react";

const mockStudents = [
  { id: 1, name: "Alex Johnson", present: true },
  { id: 2, name: "Maria Garcia", present: true },
  { id: 3, name: "James Wilson", present: false },
  { id: 4, name: "Sarah Chen", present: true },
  { id: 5, name: "David Kim", present: true },
  { id: 6, name: "Emily Brown", present: false },
  { id: 7, name: "Michael Lee", present: true },
  { id: 8, name: "Sophia Martinez", present: true },
  { id: 9, name: "Daniel Taylor", present: true },
  { id: 10, name: "Olivia Anderson", present: false },
];

export default function AttendancePage() {
  const [students, setStudents] = useState(mockStudents);
  const [selectedDate] = useState(new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));

  const toggleAttendance = (id: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s));
  };

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.filter(s => !s.present).length;

  return (
    <div className="p-8 pb-24 h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Attendance
        </h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-2">
          <Calendar className="h-4 w-4" /> {selectedDate}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Students", value: students.length.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Present", value: presentCount.toString(), icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Absent", value: absentCount.toString(), icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
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

      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-semibold text-lg">Introduction to Machine Learning</h2>
        </div>
        <div className="divide-y divide-white/5">
          {students.map(student => (
            <div key={student.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-semibold text-sm">
                  {student.name.split(" ").map(n => n[0]).join("")}
                </div>
                <span className="font-medium">{student.name}</span>
              </div>
              <button
                onClick={() => toggleAttendance(student.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  student.present
                    ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                }`}
              >
                {student.present ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {student.present ? "Present" : "Absent"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
