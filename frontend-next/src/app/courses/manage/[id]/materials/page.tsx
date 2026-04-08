"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, PlusCircle } from "lucide-react";
import {
  CourseMaterialItem,
  addCreatedMaterial,
  getCreatedMaterials,
} from "@/lib/learningStore";

export default function ManageCourseMaterialsPage() {
  const params = useParams<{ id: string }>();
  const courseId = params?.id || "unknown";

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"note" | "slides" | "link" | "pdf">("note");
  const [description, setDescription] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [materials, setMaterials] = useState<CourseMaterialItem[]>(() =>
    getCreatedMaterials(),
  );

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Failed to read selected PDF."));
      reader.readAsDataURL(file);
    });

  const createMaterial = async () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      alert("Please enter material title.");
      return;
    }

    let resolvedResourceUrl = resourceUrl.trim();
    let resolvedFileName = "";

    if (type === "pdf") {
      if (!pdfFile) {
        alert("Please select a PDF file.");
        return;
      }

      try {
        resolvedResourceUrl = await fileToDataUrl(pdfFile);
        resolvedFileName = pdfFile.name;
      } catch {
        alert("Could not read selected PDF file.");
        return;
      }
    }

    const item: CourseMaterialItem = {
      id: Date.now(),
      courseId,
      title: normalizedTitle,
      type,
      description: description.trim(),
      resourceUrl: resolvedResourceUrl,
      fileName: resolvedFileName || undefined,
      createdAt: new Date().toLocaleString(),
    };

    addCreatedMaterial(item);
    setMaterials((prev) => [item, ...prev]);
    setTitle("");
    setType("note");
    setDescription("");
    setResourceUrl("");
    setPdfFile(null);
    setFileInputKey((k) => k + 1);
  };

  const currentCourseMaterials = useMemo(
    () => materials.filter((m) => m.courseId === courseId),
    [materials, courseId],
  );

  return (
    <div className="p-8 pb-24 min-h-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link
        href={`/courses/manage/${courseId}`}
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Manage Classroom
      </Link>

      <div className="glass-panel p-6 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" /> Course Materials
        </h1>
        <p className="text-sm text-muted-foreground">
          Classroom ID: {courseId}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Material title"
            className="bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          />
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "note" | "slides" | "link" | "pdf")
            }
            className="bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
          >
            <option value="note">Note</option>
            <option value="slides">Slides</option>
            <option value="link">Link</option>
            <option value="pdf">PDF Upload</option>
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Description"
            className="md:col-span-2 bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors resize-none"
          />
          {type === "pdf" ? (
            <div className="md:col-span-2 space-y-2">
              <input
                key={fileInputKey}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                Upload a PDF directly. It will be available to students in
                Course Materials.
              </p>
            </div>
          ) : (
            <input
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              placeholder="Resource URL (optional)"
              className="md:col-span-2 bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/50 transition-colors"
            />
          )}
        </div>

        <button
          onClick={createMaterial}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" /> Add Material
        </button>
      </div>

      <div className="glass-panel p-6 space-y-3">
        <h2 className="text-lg font-semibold">Saved Materials</h2>
        {currentCourseMaterials.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No materials created for this classroom yet.
          </p>
        ) : (
          <div className="space-y-3">
            {currentCourseMaterials.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-secondary/30 px-4 py-3"
              >
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.type} • {item.createdAt}
                </p>
                {item.fileName && (
                  <p className="text-xs text-muted-foreground mt-1">
                    File: {item.fileName}
                  </p>
                )}
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {item.description}
                  </p>
                )}
                {item.resourceUrl && (
                  <a
                    href={item.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary hover:text-primary/80 mt-2 inline-block"
                  >
                    {item.type === "pdf" ? "Open PDF" : "Open Resource"}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
