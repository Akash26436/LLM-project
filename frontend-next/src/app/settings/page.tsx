"use client";

import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 pb-24 h-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="Prof. Smith"
                className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <input
                type="email"
                defaultValue="smith@university.edu"
                className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Department</label>
              <input
                type="text"
                defaultValue="Computer Science"
                className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Role</label>
              <input
                type="text"
                defaultValue="Teacher"
                disabled
                className="w-full bg-secondary/30 text-muted-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent cursor-not-allowed"
              />
            </div>
          </div>
          <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
            Save Changes
          </button>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent" /> Notifications
          </h2>
          <div className="space-y-4">
            {[
              { label: "Email Notifications", description: "Receive email updates about course activity" },
              { label: "Assignment Reminders", description: "Get notified when assignments are due" },
              { label: "Student Alerts", description: "Alert when students are at risk" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/20 transition-colors">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" /> Security
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
              />
            </div>
            <button className="px-6 py-2.5 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors text-sm">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
