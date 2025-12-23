import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

// Add styles for project content - matching service detail styles
const projectContentStyles = `
  .project-content {
    font-size: 1.125rem;
    line-height: 1.75;
  }
  .project-content p {
    margin-bottom: 1.5rem;
    color: #4b5563;
  }
  .project-content h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    line-height: 1.3;
    font-family: var(--font-display-serif), serif;
  }
  .project-content h2:first-of-type {
    margin-top: 0;
  }
  .project-content p:last-child {
    margin-bottom: 0;
  }
`;

interface Project {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  description: string | null;
  content: string | null;
  category?: {
    name: string;
  } | null;
  tags?: string[] | null;
  is_new?: boolean | null;
}

interface ProjectDetailProps {
  project: Project;
  relatedProjects?: Array<{
    id: string;
    title: string;
    slug: string;
    image: string | null;
    description: string | null;
    category?: {
      name: string;
    } | null;
  }>;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: projectContentStyles }} />
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
        {/* Hero Section */}
        <div className="relative pt-20">
          <div className="absolute inset-0 z-0 h-[500px] w-full">
            {project.image ? (
              <Image
                src={"https://lh3.googleusercontent.com/aida-public/AB6AXuD5Dh94_tVPAlL5Qza5k6H0WNqMWZDdRySKNmXqZtS52Gc3QuRSBenajzOrf9vw1G-SUaHmmNOLNUPppKuqfjn_JoSF97-e1kFtBrqO-V4SjqQzyc97OW845wTrC5Tp_0g3RNOrFZxxSyQQX8sscMq6HP0P28FTpZh107ev2RZpvSxTSPzUaEjn-sl8xIOqQ5WxSyPG0ktvmfmAfnJm6mWqLbJEan6GjlqjZEtAjj9y3PLiTqxqbnZntYeihdEm80WnbDUtrOt0Y8w"}
                alt={"Project Image"}
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[500px] flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-display-serif font-bold text-white mb-4 leading-tight">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl font-light tracking-wide font-body">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8 md:pt-12 relative z-20 bg-background-light -mt-16 rounded-t-3xl md:mt-0 md:bg-transparent md:rounded-none">
          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-sm h-[400px] relative">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>

          {/* Content */}
          {project.content ? (
            <div className="prose prose-lg max-w-none text-gray-600">
              <div
                className="project-content leading-relaxed mb-12 text-lg"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </div>
          ) : (
            <div className="prose prose-lg max-w-none text-gray-600">
              <div className="project-content leading-relaxed mb-12 text-lg">
                {project.description ? (
                  <p>{project.description}</p>
                ) : (
                  <p>Premium design solutions tailored to your unique vision</p>
                )}
              </div>
            </div>
          )}
        </main>

        <BottomNav />
        <Footer />
      </div>
    </>
  );
}
