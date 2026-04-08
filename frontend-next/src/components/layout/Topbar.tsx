"use client";

import { Bell, Search } from "lucide-react";
import { getStoredUser } from "@/lib/auth";

export default function Topbar({
  userRole = "teacher",
}: {
  userRole?: "teacher" | "student";
}) {
  const user = getStoredUser();
  const name = user?.name || (userRole === "teacher" ? "Teacher" : "Student");

  return (
    <header className="h-16 shrink-0 glass border-b flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex-1 flex">
        <form className="relative flex w-full max-w-md" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-3 h-full w-4 text-zinc-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-10 pr-0 text-white focus:ring-0 sm:text-sm placeholder:text-zinc-500"
            placeholder="Search classes, tools, files..."
            type="search"
            name="search"
          />
        </form>
      </div>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <button
          type="button"
          className="relative p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent animate-pulse"></span>
        </button>

        <div
          className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10"
          aria-hidden="true"
        />

        <div className="relative">
          <button className="flex items-center p-1.5 focus:outline-none gap-x-3">
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-semibold">
              {userRole === "teacher" ? "T" : "S"}
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span
                className="text-sm font-medium leading-6 text-white"
                aria-hidden="true"
              >
                {name}
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
