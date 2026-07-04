"use client";

// Temporary mock persistence layer — no backend yet.
// Projects are stored client-side in localStorage so state survives
// navigation between routes (and page refreshes) during development.

import type { Project } from "@/types/project";

const STORAGE_KEY = "milestack:projects";

function readAll(): Project[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch (error) {
    console.error("[projectStore] Failed to read projects:", error);
    return [];
  }
}

function writeAll(projects: Project[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("[projectStore] Failed to save projects:", error);
  }
}

/** Returns every project currently in mock storage. */
export function listProjects(): Project[] {
  return readAll();
}

/** Returns a single project by id, or null if it doesn't exist. */
export function getProject(id: string): Project | null {
  return readAll().find((project) => project.id === id) ?? null;
}

/** Creates or updates a project (matched by id) in mock storage. */
export function saveProject(project: Project): void {
  const all = readAll();
  const index = all.findIndex((p) => p.id === project.id);

  if (index >= 0) {
    all[index] = project;
  } else {
    all.push(project);
  }

  writeAll(all);
}
