"use client";

import { usePathname, useRouter } from "next/navigation";
import { BookOpen, User, GraduationCap, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-4xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-6">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Agentic <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Classroom</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of education with AI-powered personalized learning, automated assessments, and intelligent insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Teacher Login Card */}
          <div 
            onClick={() => router.push("/dashboard/teacher")}
            className="group relative cursor-pointer glass-panel p-8 rounded-3xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(var(--primary),0.2)]"
          >
            <div className="absolute top-6 right-6 p-2 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <User className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Teacher Portal</h2>
            <p className="text-muted-foreground">
              Manage courses, track student analytics, and generate AI-powered assignments.
            </p>
          </div>

          {/* Student Login Card */}
          <div 
            onClick={() => router.push("/dashboard/student")}
            className="group relative cursor-pointer glass-panel p-8 rounded-3xl hover:border-accent/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(var(--accent),0.2)]"
          >
            <div className="absolute top-6 right-6 p-2 bg-accent/10 rounded-full group-hover:scale-110 transition-transform">
              <ArrowRight className="h-5 w-5 text-accent" />
            </div>
            <div className="h-16 w-16 bg-gradient-to-br from-green-500/20 to-teal-500/20 text-green-500 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">Student Portal</h2>
            <p className="text-muted-foreground">
              Access your personalized learning path, take quizzes, and chat with AI tutors.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>© 2026 Agentic Classroom. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
