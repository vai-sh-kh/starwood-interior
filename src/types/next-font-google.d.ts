// Type augmentation for next/font/google fonts that aren't properly resolved
declare module "next/font/google" {
    export * from 'next/dist/compiled/@next/font/dist/google';
}
