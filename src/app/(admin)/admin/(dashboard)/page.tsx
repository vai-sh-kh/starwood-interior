import { createClient } from "@/lib/supabase/server";
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
import Link from "next/link";
import RecentLeadItem from "./RecentLeadItem";
import QuickActionsWidget from "./QuickActionsWidget";
import BlogImage from "./BlogImage";

async function getStats() {
  const supabase = await createClient();

  const [blogsResult, projectsResult, categoriesResult, leadsResult] =
    await Promise.all([
      supabase.from("blogs").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase
        .from("blog_categories")
        .select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }),
    ]);

  return {
    blogs: blogsResult.count ?? 0,
    projects: projectsResult.count ?? 0,
    categories: categoriesResult.count ?? 0,
    leads: leadsResult.count ?? 0,
  };
}

async function getRecentBlogs() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, image, created_at, author")
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

async function getRecentLeads() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("id, name, email, phone, created_at, status, avatar_color")
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

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

export default async function DashboardPage() {
  const stats = await getStats();
  const recentBlogs = await getRecentBlogs();
  const recentLeads = await getRecentLeads();

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

  return (
    <div className="space-y-8">
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
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                Recent Blogs
              </CardTitle>
              <Link
                href="/admin/blogs"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentBlogs.length > 0 ? (
              <div className="space-y-3">
                {recentBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/admin/blogs`}
                    className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <BlogImage src={blog.image} alt={blog.title} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {blog.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {blog.author && (
                          <span className="text-xs text-gray-500">
                            {blog.author}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(blog.created_at)}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No blogs yet
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Start creating content to engage your audience
                </p>
                <Link
                  href="/admin/blogs"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first blog
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-500" />
                Recent Leads
              </CardTitle>
              <Link
                href="/admin/leads"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <RecentLeadItem
                    key={lead.id}
                    id={lead.id}
                    name={lead.name}
                    email={lead.email}
                    phone={lead.phone}
                    created_at={lead.created_at}
                    status={lead.status}
                    avatar_color={lead.avatar_color}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No leads yet
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Leads will appear here when visitors submit your contact form
                </p>
                <Link
                  href="/admin/leads"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
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
