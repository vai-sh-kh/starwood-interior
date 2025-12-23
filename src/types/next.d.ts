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

