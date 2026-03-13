"use client";

import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";

type ProjectRow = {
  id: string;
  panel_id: string;
  panel_source: string;
  processor_id: string;
  processor_source: string;
  config_json: {
    resolution?: {
      widthPixels: number;
      heightPixels: number;
    };
    panel?: {
      brand: string;
      model: string;
    };
    processor?: {
      brand: string;
      model: string;
    };
  };
  created_at: string;
};

export default function ProjectsPage() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const { user, session, authLoading, authMessage, authTone, signIn, signUp, signOut } =
    useSupabaseAuth();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [message, setMessage] = useState("Sign in to load saved projects.");

  useEffect(() => {
    if (!supabase || !session || !user) {
      setProjects([]);
      return;
    }

    supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setMessage(error.message);
          return;
        }

        setProjects((data ?? []) as ProjectRow[]);
        setMessage(data && data.length > 0 ? "" : "No saved projects.");
      });
  }, [session, supabase, user]);

  return (
    <AppLayout
      user={user}
      authLoading={authLoading}
      authMessage={authMessage}
      authTone={authTone}
      onSignIn={signIn}
      onSignUp={(email, password) =>
        signUp(
          email,
          password,
          process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? window.location.origin
        )
      }
      onSignOut={signOut}
      status={{
        left: `Projects loaded: ${projects.length}`,
        center: user ? `User: ${user.email}` : "Guest session",
        right: message || "Project database ready"
      }}
    >
      <div className="min-h-[calc(100vh-88px)] bg-white">
        <div className="border-b border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800">
          Projects
        </div>
        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm text-gray-800">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b border-r border-gray-300 px-3 py-2 text-left">
                  Project Name
                </th>
                <th className="border-b border-r border-gray-300 px-3 py-2 text-left">
                  Resolution
                </th>
                <th className="border-b border-r border-gray-300 px-3 py-2 text-left">
                  Panel Model
                </th>
                <th className="border-b border-r border-gray-300 px-3 py-2 text-left">
                  Processor
                </th>
                <th className="border-b border-gray-300 px-3 py-2 text-left">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="border-b border-r border-gray-300 px-3 py-2">
                    Project {new Date(project.created_at).toLocaleDateString()}
                  </td>
                  <td className="border-b border-r border-gray-300 px-3 py-2">
                    {project.config_json.resolution
                      ? `${project.config_json.resolution.widthPixels} x ${project.config_json.resolution.heightPixels}`
                      : "N/A"}
                  </td>
                  <td className="border-b border-r border-gray-300 px-3 py-2">
                    {project.config_json.panel
                      ? `${project.config_json.panel.brand} ${project.config_json.panel.model}`
                      : project.panel_id}
                  </td>
                  <td className="border-b border-r border-gray-300 px-3 py-2">
                    {project.config_json.processor
                      ? `${project.config_json.processor.brand} ${project.config_json.processor.model}`
                      : project.processor_id}
                  </td>
                  <td className="border-b border-gray-300 px-3 py-2">
                    {new Date(project.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 ? (
            <div className="px-3 py-3 text-sm text-gray-600">{message}</div>
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
