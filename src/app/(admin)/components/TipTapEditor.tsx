"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback, useEffect, useRef } from "react";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// ToolbarButton component defined outside to avoid React component creation during render
const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  children,
  tooltip,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  tooltip: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onClick}
        disabled={disabled}
        className={cn("h-8 w-8", isActive && "bg-gray-200 text-gray-900")}
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="top" className="text-xs">
      {tooltip}
    </TooltipContent>
  </Tooltip>
);

export default function TipTapEditor({
  content,
  onChange,
  placeholder = "Start writing your content...",
}: TipTapEditorProps) {
  const contentRef = useRef<string>(content || "");
  const isUpdatingFromPropRef = useRef(false);
  const isInitialMountRef = useRef(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        // Exclude link and underline from StarterKit since we're adding them separately
        link: false,
        underline: false,
        // Ensure all other StarterKit features are enabled
        bold: true,
        italic: true,
        strike: true,
        code: true,
        paragraph: true,
        bulletList: true,
        orderedList: true,
        listItem: true,
        blockquote: true,
        hardBreak: true,
        horizontalRule: true,
        history: true,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800 cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || "",
    editable: true,
    onUpdate: ({ editor }) => {
      // Only call onChange if the update is from user interaction, not from prop update
      if (!isUpdatingFromPropRef.current) {
        const newContent = editor.getHTML();
        contentRef.current = newContent;
        onChange(newContent);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-3",
        spellcheck: "true",
      },
    },
    immediatelyRender: false,
    parseOptions: {
      preserveWhitespace: "full",
    },
  });

  // Initialize contentRef on mount
  useEffect(() => {
    if (editor && isInitialMountRef.current) {
      contentRef.current = editor.getHTML();
      isInitialMountRef.current = false;
    }
  }, [editor]);

  // Update editor content when content prop changes (but not from user edits)
  useEffect(() => {
    if (!editor || isInitialMountRef.current) return;
    
    const currentContent = editor.getHTML();
    const normalizedCurrent = (currentContent || "").trim();
    const normalizedProp = (content || "").trim();
    
    // Only update if content actually changed and it's different from what we have
    if (normalizedProp !== normalizedCurrent && normalizedProp !== contentRef.current) {
      isUpdatingFromPropRef.current = true;
      // setContent with emitUpdate: false to prevent triggering onChange
      editor.commands.setContent(content || "", false);
      contentRef.current = normalizedProp;
      // Reset flag after a brief delay to ensure the update completes
      setTimeout(() => {
        isUpdatingFromPropRef.current = false;
      }, 0);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    try {
      const previousUrl = editor.getAttributes("link").href || "";
      const url = window.prompt("Enter URL:", previousUrl);

      if (url === null) return;

      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      // Validate URL format
      let finalUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("mailto:") && !url.startsWith("#")) {
        finalUrl = `https://${url}`;
      }

      editor.chain().focus().extendMarkRange("link").setLink({ href: finalUrl }).run();
    } catch (error) {
      console.error("Error setting link:", error);
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 min-h-[400px] animate-pulse bg-gray-50" />
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
          {/* Headings */}
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
              } catch (error) {
                console.error("Error toggling heading 1:", error);
              }
            }}
            isActive={editor.isActive("heading", { level: 1 })}
            tooltip="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              } catch (error) {
                console.error("Error toggling heading 2:", error);
              }
            }}
            isActive={editor.isActive("heading", { level: 2 })}
            tooltip="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              } catch (error) {
                console.error("Error toggling heading 3:", error);
              }
            }}
            isActive={editor.isActive("heading", { level: 3 })}
            tooltip="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Text formatting */}
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleBold().run();
              } catch (error) {
                console.error("Error toggling bold:", error);
              }
            }}
            isActive={editor.isActive("bold")}
            tooltip="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleItalic().run();
              } catch (error) {
                console.error("Error toggling italic:", error);
              }
            }}
            isActive={editor.isActive("italic")}
            tooltip="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleUnderline().run();
              } catch (error) {
                console.error("Error toggling underline:", error);
              }
            }}
            isActive={editor.isActive("underline")}
            tooltip="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleStrike().run();
              } catch (error) {
                console.error("Error toggling strike:", error);
              }
            }}
            isActive={editor.isActive("strike")}
            tooltip="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleCode().run();
              } catch (error) {
                console.error("Error toggling code:", error);
              }
            }}
            isActive={editor.isActive("code")}
            tooltip="Inline Code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleBulletList().run();
              } catch (error) {
                console.error("Error toggling bullet list:", error);
              }
            }}
            isActive={editor.isActive("bulletList")}
            tooltip="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleOrderedList().run();
              } catch (error) {
                console.error("Error toggling ordered list:", error);
              }
            }}
            isActive={editor.isActive("orderedList")}
            tooltip="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().toggleBlockquote().run();
              } catch (error) {
                console.error("Error toggling blockquote:", error);
              }
            }}
            isActive={editor.isActive("blockquote")}
            tooltip="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Links */}
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive("link")}
            tooltip="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().setHorizontalRule().run();
              } catch (error) {
                console.error("Error setting horizontal rule:", error);
              }
            }}
            tooltip="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>

          <div className="flex-1" />

          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().undo().run();
              } catch (error) {
                console.error("Error undoing:", error);
              }
            }}
            disabled={!editor.can().undo()}
            tooltip="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                editor.chain().focus().redo().run();
              } catch (error) {
                console.error("Error redoing:", error);
              }
            }}
            disabled={!editor.can().redo()}
            tooltip="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Editor content */}
        <EditorContent editor={editor} />
      </div>
    </TooltipProvider>
  );
}
