// Type augmentation for Next.js 16.0.7 compatibility
declare module "next/types.js" {
  export type ResolvingMetadata = (
    props: any,
    parent: any
  ) => Promise<any> | any;
  
  export type ResolvingViewport = (
    props: any,
    parent: any
  ) => Promise<any> | any;
}

declare module "next" {
  export interface Metadata {
    title?: string | { default?: string; template?: string; absolute?: string };
    description?: string;
    keywords?: string | string[];
    authors?: Array<{ name: string; url?: string }>;
    creator?: string;
    publisher?: string;
    formatDetection?: {
      email?: boolean;
      address?: boolean;
      telephone?: boolean;
    };
    metadataBase?: URL;
    alternates?: {
      canonical?: string | URL;
      languages?: Record<string, string>;
    };
    openGraph?: {
      title?: string;
      description?: string;
      url?: string | URL;
      siteName?: string;
      images?: Array<{
        url: string | URL;
        width?: number;
        height?: number;
        alt?: string;
      }>;
      locale?: string;
      type?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
      images?: string[];
      creator?: string;
    };
    robots?: {
      index?: boolean;
      follow?: boolean;
      googleBot?: {
        index?: boolean;
        follow?: boolean;
        "max-video-preview"?: number;
        "max-image-preview"?: string;
        "max-snippet"?: number;
      };
    };
    icons?: string | URL | Array<{ rel?: string; url: string | URL }>;
    manifest?: string | URL;
    viewport?: {
      width?: string | number;
      height?: string | number;
      initialScale?: number;
      maximumScale?: number;
      userScalable?: boolean;
      viewportFit?: "auto" | "contain" | "cover";
    };
  }
}

declare module "next/navigation" {
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    refresh: () => void;
    back: () => void;
    forward: () => void;
    prefetch: (href: string) => void;
  };
  
  export function usePathname(): string;
  
  export function useSearchParams(): URLSearchParams;
  
  export function notFound(): never;
  
  export function redirect(url: string): never;
  
  export function permanentRedirect(url: string): never;
}

declare module "next/headers" {
  interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none" | boolean;
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
  }

  export function cookies(): {
    getAll(): Array<{ name: string; value: string }>;
    get(name: string): { name: string; value: string } | undefined;
    set(name: string, value: string, options?: CookieOptions): void;
    delete(name: string): void;
    has(name: string): boolean;
  };
}

declare module "next/font/google" {
  interface FontOptions {
    variable?: string;
    subsets?: string[];
    weight?: string[] | string;
    style?: string[];
    display?: string;
    preload?: boolean;
    fallback?: string[];
    adjustFontFallback?: boolean;
    declarations?: Array<{ prop: string; value: string }>;
  }

  interface FontReturn {
    className: string;
    style: { fontFamily: string };
    variable?: string;
  }

  export function Plus_Jakarta_Sans(options?: FontOptions): FontReturn;
  export function DM_Sans(options?: FontOptions): FontReturn;
  export function Playfair_Display(options?: FontOptions): FontReturn;
}

