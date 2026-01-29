"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  FileText,
  FolderKanban,
  Tags,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import RecentLeadItem from "./RecentLeadItem";
import QuickActionsWidget from "./QuickActionsWidget";
import BlogImage from "./BlogImage";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    categories: 0,
    leads: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const [blogsResult, projectsResult, categoriesResult, leadsResult] =
        await Promise.all([
          supabase.from("blogs").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("id", { count: "exact", head: true }),
          supabase
            .from("blog_categories")
            .select("id", { count: "exact", head: true }),
          supabase.from("leads").select("id", { count: "exact", head: true }),
        ]);

      setStats({
        blogs: blogsResult.count ?? 0,
        projects: projectsResult.count ?? 0,
        categories: categoriesResult.count ?? 0,
        leads: leadsResult.count ?? 0,
      });

      const { data: blogsData } = await supabase
        .from("blogs")
        .select("id, title, slug, image, created_at, author")
        .order("created_at", { ascending: false })
        .limit(7);
      setRecentBlogs(blogsData ?? []);

      const { data: leadsData } = await supabase
        .from("leads")
        .select("id, name, email, phone, created_at, status, avatar_color")
        .order("created_at", { ascending: false })
        .limit(4);
      setRecentLeads(leadsData ?? []);

      setLoading(false);
    };

    fetchData();
  }, []);

  function formatDate(dateString: string | null) {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  }

  const statCards = [
    {
      title: "Total Blogs",
      value: stats.blogs,
      icon: FileText,
      href: "/admin/blogs",
      color: "bg-blue-500",
    },
    {
      title: "Total Projects",
      value: stats.projects,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "bg-purple-500",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: Tags,
      href: "/admin/categories",
      color: "bg-green-500",
    },
    {
      title: "Total Leads",
      value: stats.leads,
      icon: Users,
      href: "/admin/leads",
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-7">
        {/* Header Skeleton */}
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-9 w-12" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Blogs Skeleton */}
          <Card className="border-0 shadow-sm flex flex-col h-full">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-2.5 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3.5 p-2.5 border-b border-gray-100 last:border-0">
                    <Skeleton className="h-12 w-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Leads Skeleton */}
          <Card className="border-0 shadow-sm flex flex-col h-full">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="p-4 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col gap-7">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to your CMS dashboard. Manage your content from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <Card className="border-0 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                Recent Blogs
              </CardTitle>
              <Link
                href="/admin/blogs"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className=" flex-1 overflow-hidden flex flex-col">
            {recentBlogs.length > 0 ? (
              <div className="overflow-y-auto max-h-[600px] pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 space-y-2">
                {recentBlogs.map((blog, index) => (
                  <Link
                    key={blog.id}
                    href={`/admin/blogs`}
                    className={`group flex items-start gap-3.5 p-2.5 hover:bg-gray-50 transition-colors ${index < recentBlogs.length - 1
                      ? "border-b border-gray-200"
                      : ""
                      }`}
                  >
                    <BlogImage src={blog.image} alt={blog.title} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {blog.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {blog.author && (
                          <>
                            <span className="text-xs text-gray-500 truncate">
                              {blog.author}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                          </>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDate(blog.created_at)}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 flex-1 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No blogs yet
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Start creating content to engage your audience
                </p>
                <Link
                  href="/admin/blogs"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first blog
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="border-0 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                Recent Leads
              </CardTitle>
              <Link
                href="/admin/leads"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className=" flex-1 overflow-hidden flex flex-col">
            {recentLeads.length > 0 ? (
              <div className="overflow-y-auto max-h-[600px] pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                {recentLeads.map((lead, index) => (
                  <div
                    key={lead.id}
                    className={
                      index < recentLeads.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }
                  >
                    <RecentLeadItem
                      id={lead.id}
                      name={lead.name}
                      email={lead.email}
                      phone={lead.phone}
                      created_at={lead.created_at}
                      status={lead.status}
                      avatar_color={lead.avatar_color}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 flex-1 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No leads yet
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Leads will appear here when visitors submit your contact form
                </p>
                <Link
                  href="/admin/leads"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  View leads page
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Widget */}
      <QuickActionsWidget />
    </div>
  );
}
