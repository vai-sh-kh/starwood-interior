"use client";
import { useEffect, useState } from "react";
import { getBooleanSettingClient } from "@/lib/api/client/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import ProjectsToggle from "../ProjectsToggle";
import BlogsToggle from "../BlogsToggle";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [projectsEnabled, setProjectsEnabled] = useState(true);
  const [blogsEnabled, setBlogsEnabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const p = await getBooleanSettingClient("projects_enabled", true);
      const b = await getBooleanSettingClient("blogs_enabled", true);
      setProjectsEnabled(p);
      setBlogsEnabled(b);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your site settings and preferences from here.
        </p>
      </div>

      {/* Projects Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-4">
          <ProjectsToggle initialValue={projectsEnabled} />

          <BlogsToggle initialValue={blogsEnabled} />

        </CardContent>
      </Card>


    </div>
  );
}
