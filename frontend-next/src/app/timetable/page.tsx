"use client";

import { Clock, BookOpen, MapPin } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timetableData: Record<string, { time: string; subject: string; room: string; type: string }[]> = {
  Monday: [
    { time: "10:00 - 11:30", subject: "Introduction to Machine Learning", room: "Room 301", type: "Lecture" },
    { time: "14:00 - 15:30", subject: "Data Structures & Algorithms", room: "Lab 102", type: "Lab" },
  ],
  Tuesday: [
    { time: "09:00 - 10:30", subject: "Web Development with React", room: "Room 205", type: "Lecture" },
    { time: "11:00 - 12:30", subject: "Introduction to Machine Learning", room: "Lab 301", type: "Tutorial" },
  ],
  Wednesday: [
    { time: "10:00 - 11:30", subject: "Data Structures & Algorithms", room: "Room 102", type: "Lecture" },
    { time: "14:00 - 16:00", subject: "Web Development with React", room: "Lab 205", type: "Lab" },
  ],
  Thursday: [
    { time: "09:00 - 10:30", subject: "Introduction to Machine Learning", room: "Room 301", type: "Lecture" },
    { time: "11:00 - 12:30", subject: "Data Structures & Algorithms", room: "Room 102", type: "Tutorial" },
  ],
  Friday: [
    { time: "10:00 - 11:30", subject: "Web Development with React", room: "Room 205", type: "Lecture" },
  ],
};

const typeColors: Record<string, string> = {
  Lecture: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Lab: "bg-green-500/10 text-green-400 border-green-500/30",
  Tutorial: "bg-purple-500/10 text-purple-400 border-purple-500/30",
};

export default function TimetablePage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="p-8 pb-24 h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Timetable
        </h1>
        <p className="text-muted-foreground mt-1">Your weekly class schedule.</p>
      </div>

      <div className="space-y-6">
        {days.map(day => (
          <div key={day} className="glass-panel overflow-hidden">
            <div className={`px-6 py-4 border-b border-white/5 flex items-center justify-between ${
              day === today ? "bg-primary/10" : ""
            }`}>
              <h2 className={`font-semibold text-lg flex items-center gap-2 ${day === today ? "text-primary" : ""}`}>
                {day}
                {day === today && (
                  <span className="text-xs font-medium px-2 py-0.5 bg-primary text-primary-foreground rounded-full">Today</span>
                )}
              </h2>
              <span className="text-sm text-muted-foreground">{timetableData[day]?.length || 0} classes</span>
            </div>
            <div className="divide-y divide-white/5">
              {timetableData[day]?.length > 0 ? (
                timetableData[day].map((slot, i) => (
                  <div key={i} className="p-4 px-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground min-w-[140px]">
                      <Clock className="h-4 w-4" /> {slot.time}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{slot.subject}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {slot.room}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${typeColors[slot.type]}`}>
                      {slot.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground text-sm">No classes scheduled</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
