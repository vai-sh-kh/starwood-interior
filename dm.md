# Project Quotation: Premium Web Development Solution
## Starwood Interiors - Complete Website & CMS Platform

**Prepared For:** Starwood Interiors  
**Prepared By:** Vaishakh P (CloudFusion)  
**Date:** December 30, 2025  
**Project Type:** Full-Stack Web Application with Admin CMS

---

## 1. EXECUTIVE SUMMARY

This comprehensive proposal outlines the complete design and development of a high-performance, SEO-optimized corporate website for Starwood Interiors. The solution includes a sophisticated client-facing interface and a robust administrative backend built with modern web technologies. Our goal is to provide a digital experience that reflects the premium nature of your interior design work while offering seamless content management and lead generation tools for sustainable business growth.

**Key Highlights:**
- Modern, responsive design optimized for all devices
- Complete Content Management System (CMS) for non-technical users
- Advanced lead management and tracking system
- SEO-optimized architecture for maximum search engine visibility
- High-performance infrastructure with optimized loading speeds
- Secure authentication and role-based access control

---

## 2. TECHNICAL STACK & ARCHITECTURE

### 2.1 Frontend Framework
- **Next.js 16.0.7** - React-based framework with App Router
- **React 19.2.0** - Latest React with React Compiler enabled
- **TypeScript 5** - Full type safety throughout the application
- **Server-Side Rendering (SSR)** - For optimal SEO and performance
- **Static Site Generation (SSG)** - For pre-rendered pages where applicable

### 2.2 Styling & UI Components
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled component primitives
  - Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
  - Label, Popover, Scroll Area, Select, Separator
  - Switch, Tabs, Tooltip
- **shadcn/ui** - High-quality React components built on Radix UI
- **Lucide React** - Modern icon library
- **Material Symbols** - Additional icon support
- **Custom Design System** - Brand-specific styling and components

### 2.3 Backend & Database
- **Supabase** - Backend-as-a-Service platform
  - PostgreSQL database with Row Level Security (RLS)
  - Real-time subscriptions capability
  - Authentication & authorization
  - File storage (Supabase Storage)
  - Edge Functions support
- **Database Features:**
  - Automatic `updated_at` triggers on all tables
  - Comprehensive RLS policies for data security
  - Full-text search capabilities
  - Optimized indexes for performance
  - Migration-based schema management

### 2.4 Rich Text Editing
- **TipTap 3.13.0** - Modern WYSIWYG editor
  - Starter Kit (paragraphs, headings, lists, quotes, code blocks)
  - Image embedding support
  - Link insertion and editing
  - Underline formatting
  - Placeholder text support
  - Custom styling for blog content rendering

### 2.5 Additional Libraries & Tools
- **Zod 3.23.8** - Schema validation for forms and API
- **Lenis 1.3.16** - Smooth scrolling library
- **next-themes 0.4.6** - Theme management (light/dark mode support)
- **Sonner 2.0.7** - Toast notification system
- **xlsx 0.18.5** - Excel export functionality for leads
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional class utilities

### 2.6 Performance Optimizations
- **Next.js Image Optimization** - Automatic image optimization
- **Code Splitting** - Automatic route-based code splitting
- **Lazy Loading** - Images and components loaded on demand
- **Caching Strategies** - Server-side caching for improved performance
- **Image Compression** - Optimized image formats (WebP support)
- **Bundle Optimization** - Tree-shaking and minification

---

## 3. CLIENT-FACING INTERFACE (FRONTEND)

### 3.1 Home Page
**Features:**
- **Hero Section**
  - High-definition banner images with parallax scrolling effects
  - Responsive typography scaling
  - Call-to-action buttons
  - Smooth scroll animations using Intersection Observer API

- **Work Overview Section**
  - Curated "Recent Projects" showcase
  - Project cards with hover effects
  - Quick preview of project details
  - Direct links to project detail pages

- **Value Proposition Section**
  - "About Us" snippet with link to full page
  - "Core Services" overview
  - Statistics display (Projects, Products, Customers)
  - Collection showcase with image galleries

- **Testimonials Section**
  - Customer testimonials with avatars
  - Smooth scrolling carousel
  - Responsive grid layout

- **FAQ Section**
  - Expandable accordion interface
  - Common questions and answers
  - Smooth animations

- **Mobile Responsive Design**
  - Touch-optimized interactions
  - Bottom navigation bar for mobile devices
  - Responsive image sizing
  - Adaptive typography

### 3.2 About Us Page
**Features:**
- **Brand Story Section**
  - Detailed company history and mission
  - Vision statement
  - Design philosophy explanation

- **Team Profiles**
  - Individual team member cards
  - Professional photos
  - Role descriptions
  - Social links (if applicable)

- **Mission & Vision**
  - Structured content presentation
  - Visual elements supporting text
  - Call-to-action sections

### 3.3 Services Architecture
**Main Services Page:**
- **Service Grid Layout**
  - Infinite scrolling implementation
  - Intersection Observer API for lazy loading
  - Service cards with images and descriptions
  - Hover effects and transitions
  - Direct links to service detail pages

- **Service Detail Pages**
  - Full-width hero image with overlay
  - Detailed service description
  - Rich text content support
  - Gallery images (up to 6 images per service)
  - Subservices listing (if applicable)
  - Share functionality (native share API with clipboard fallback)
  - Related services suggestions
  - SEO-optimized metadata

**Subservices System:**
- **Hierarchical Service Structure**
  - Parent-child relationship between services and subservices
  - Dedicated subservice detail pages
  - URL structure: `/services/[service-slug]/[subservice-slug]`
  - Independent SEO metadata for each subservice
  - Gallery images for subservices
  - Share functionality

### 3.4 Projects & Portfolio
**Projects Listing Page:**
- **Infinite Scroll Gallery**
  - Grid layout with responsive columns
  - Intersection Observer for automatic loading
  - Category filtering support
  - Search functionality
  - Loading states and skeletons
  - Smooth scroll animations

- **Project Detail Pages**
  - **Hero Section**
    - Featured image with parallax effect
    - Project title and description
    - Category badge
    - Share button

  - **Project Information**
    - Project duration
    - Materials used
    - Project location
    - Budget range (if applicable)
    - Client quote/testimonial

  - **Image Gallery**
    - Up to 6 gallery images per project
    - Lightbox/modal view for full-screen images
    - Keyboard navigation (Arrow keys, Escape)
    - Image zoom functionality
    - Display order management

  - **Related Projects**
    - Automatically suggested based on category
    - Grid layout with 4 related projects
    - Smooth hover transitions

  - **SEO Optimization**
    - Dynamic meta titles and descriptions
    - Open Graph tags for social sharing
    - Twitter Card support
    - Canonical URLs
    - Structured data (JSON-LD ready)

### 3.5 Blog & Insights
**Blog Listing Page:**
- **Blog Grid with Infinite Scroll**
  - Responsive card layout
  - Category filtering
  - Full-text search with debouncing
  - Tag-based filtering
  - Author information
  - Publication dates
  - Excerpt previews
  - Featured images

- **Blog Detail Pages**
  - **Rich Content Display**
    - TipTap-formatted content rendering
    - Custom typography for blog content
    - Heading hierarchy (H1, H2, H3)
    - Paragraph spacing
    - List formatting (ordered and unordered)
    - Blockquote styling
    - Code block support
    - Link styling

  - **Article Metadata**
    - Author information
    - Publication date
    - Category badge
    - Tags display
    - Reading time estimate

  - **Social Sharing**
    - Native Web Share API integration
    - Clipboard fallback for unsupported browsers
    - Share button with visual feedback

  - **Related Articles**
    - Category-based suggestions
    - Grid layout
    - Smooth transitions

  - **SEO Features**
    - Dynamic meta tags
    - Open Graph images
    - Article schema markup ready
    - Canonical URLs

### 3.6 Contact & Lead Capture
**Contact Page:**
- **Professional Contact Form**
  - **Form Fields:**
    - Full Name (required, 2-100 characters)
    - Email Address (required, validated format)
    - Phone Number (required, 10-15 digits)
    - Message (required, 10-2000 characters)

  - **Validation Features:**
    - Real-time field validation using Zod
    - Email format validation (comprehensive regex)
    - Phone number format validation
    - Character count limits
    - Error messages displayed inline
    - Validation on blur events
    - Form-level validation on submit

  - **User Experience:**
    - Loading states during submission
    - Success toast notifications
    - Error handling with user-friendly messages
    - Form reset after successful submission
    - Keyboard navigation support
    - Accessible form labels and ARIA attributes

- **Contact Information Display**
  - Email address with mailto link
  - Phone number with tel link
  - Physical address with Google Maps link
  - Click-to-call functionality on mobile

- **Google Maps Integration**
  - Embedded interactive map
  - Click-to-open in Google Maps
  - Responsive iframe
  - Hover effects

- **Lead Management Integration**
  - Automatic lead creation in database
  - Avatar color generation based on name
  - Source tracking (contact_form)
  - Timestamp recording
  - Status assignment (new)

---

## 4. PROFESSIONAL ADMIN CONTROL SUITE (BACKEND)

### 4.1 Authentication & Security
- **Supabase Authentication**
  - Email/password authentication
  - Secure session management
  - Protected admin routes
  - Server-side authentication checks
  - Automatic session refresh

- **Access Control**
  - Role-based access (admin-only)
  - Route protection middleware
  - Server-side authorization checks
  - Secure API endpoints

### 4.2 Centralized Dashboard
**Dashboard Overview:**
- **Activity Monitor**
  - Real-time feed of latest leads
  - Recent blog posts display
  - User interaction tracking
  - Time-relative timestamps (e.g., "2h ago", "3d ago")

- **Total Metrics Cards**
  - Total Blogs count
  - Total Projects count
  - Total Categories count
  - Total Leads count
  - Clickable cards linking to respective pages
  - Color-coded icons
  - Real-time data updates

- **Quick Actions Widget**
  - Quick links to common tasks
  - Create new content shortcuts
  - Recent activity access

- **Recent Activity Sections**
  - Recent Blogs (last 7)
  - Recent Leads (last 4)
  - Image previews
  - Quick navigation links

### 4.3 Content Management System (CMS)

#### 4.3.1 Projects Management
**Features:**
- **Full CRUD Operations**
  - Create new projects
  - Read/view project details
  - Update existing projects
  - Delete projects (with confirmation)

- **Project Form Fields:**
  - Title (required, 2-200 characters)
  - Slug (auto-generated or manual, URL-friendly)
  - Description (rich text editor)
  - Featured Image (drag-and-drop upload)
  - Category selection (dropdown)
  - Status (Published/Draft)
  - SEO Fields:
    - Meta Title
    - Meta Description
  - Project Information:
    - Project Duration
    - Materials Used
    - Project Quote/Testimonial

- **Gallery Images Manager**
  - Upload up to 6 gallery images
  - Drag-and-drop interface
  - Image reordering (display order)
  - Image preview
  - Delete individual images
  - File validation (type, size)
  - Upload progress indicators
  - Supabase Storage integration

- **Advanced Features:**
  - Pagination (6 items per page)
  - Search functionality
  - Category filtering
  - Sort options (title, date, category)
  - Bulk actions support
  - Image optimization on upload
  - Responsive table layout
  - Mobile-optimized interface

#### 4.3.2 Services Management
**Features:**
- **Service CRUD Operations**
  - Create, read, update, delete services
  - Service form with validation

- **Service Form Fields:**
  - Title (required)
  - Slug (URL-friendly)
  - Description (rich text editor)
  - Featured Image
  - Status (Published/Draft)
  - SEO Fields:
    - Meta Title
    - Meta Description

- **Gallery Images**
  - Up to 6 gallery images
  - Drag-and-drop upload
  - Display order management

- **Management Features:**
  - Pagination
  - Search
  - Sort options
  - Status filtering
  - Image previews

#### 4.3.3 Subservices Management
**Features:**
- **Subservice CRUD Operations**
  - Create subservices linked to parent services
  - Update and delete subservices
  - Parent service selection

- **Subservice Form Fields:**
  - Title (required)
  - Slug (URL-friendly)
  - Parent Service (required, dropdown)
  - Description (rich text editor)
  - Featured Image
  - Status (Published/Draft)
  - SEO Fields:
    - Meta Title
    - Meta Description

- **Gallery Images**
  - Up to 6 gallery images per subservice
  - Drag-and-drop interface
  - Display order management

- **Management Features:**
  - Pagination
  - Search
  - Filter by parent service
  - Sort options

#### 4.3.4 Blog Management
**Features:**
- **Blog CRUD Operations**
  - Create, read, update, delete blog posts
  - Rich text editor for content

- **Blog Form Fields:**
  - Title (required, 2-200 characters)
  - Slug (required, URL-friendly format)
  - Excerpt (optional, max 500 characters)
  - Content (TipTap rich text editor)
  - Featured Image (drag-and-drop)
  - Author (optional, max 100 characters)
  - Category (dropdown selection)
  - Tags (array of strings)
  - Status (Published/Draft)

- **Rich Text Editor Features:**
  - Headings (H1, H2, H3)
  - Bold, italic, underline, strikethrough
  - Ordered and unordered lists
  - Blockquotes
  - Code blocks
  - Links
  - Images (embedded)
  - Placeholder text
  - Custom styling

- **Advanced Features:**
  - Full-text search
  - Category filtering
  - Tag-based filtering
  - Sort options (title, date, author, category)
  - Pagination (6 items per page)
  - Image previews
  - Content preview

#### 4.3.5 Categories Management
**Features:**
- **Category CRUD Operations**
  - Create, read, update, delete categories
  - Category form with validation

- **Category Form Fields:**
  - Name (required, 2-100 characters)
  - Slug (auto-generated or manual)
  - Description (optional)

- **Management Features:**
  - Search functionality
  - Sort options
  - Usage count display
  - Delete confirmation

#### 4.3.6 Visibility Toggle System
**Settings Page:**
- **One-Click Enable/Disable**
  - Projects section toggle
  - Blogs section toggle
  - Real-time updates
  - Visual feedback
  - Server-side persistence

- **Implementation:**
  - Settings stored in database
  - Server-side checks before rendering
  - Automatic redirects when disabled
  - Admin-only access

### 4.4 Advanced Leads Management

#### 4.4.1 Lead Tracking
**Features:**
- **Lead List View**
  - Table layout with all lead information
  - Avatar with color-coded backgrounds
  - Name, email, phone display
  - Status badges
  - Source tracking
  - Timestamp display
  - Pagination (10 items per page)

- **Lead Detail View**
  - Full lead information in side panel
  - All form fields displayed
  - Timestamp information
  - Status history (if implemented)
  - Quick actions

#### 4.4.2 Status Management
**Lead Status Pipeline:**
- **Status Options:**
  - New (default for new leads)
  - Contacted
  - In-Progress
  - Closed
  - Custom statuses (extensible)

- **Status Updates:**
  - Quick status change dropdown
  - Inline editing
  - Visual status badges
  - Color-coded status indicators

#### 4.4.3 Advanced Filtering & Search
**Filter Options:**
- **Search Functionality:**
  - Full-text search across name, email, phone
  - Real-time search results
  - Debounced input for performance

- **Status Filtering:**
  - Filter by single or multiple statuses
  - "All" option to clear filters
  - Visual filter indicators

- **Date Range Filtering:**
  - Start date picker
  - End date picker
  - Calendar interface
  - Date range validation
  - Clear date filters

- **Sort Options:**
  - Sort by date (ascending/descending)
  - Sort by name
  - Sort by status
  - Visual sort indicators

#### 4.4.4 Lead Form (Manual Entry)
**Features:**
- **Create Lead Form:**
  - Same validation as contact form
  - Name, email, phone, message fields
  - Status selection
  - Source selection
  - Form validation with Zod
  - Error handling
  - Success notifications

- **Edit Lead Form:**
  - Pre-populated with existing data
  - Update all fields
  - Validation on save
  - Confirmation dialogs

#### 4.4.5 Data Portability
**Export Functionality:**
- **Excel/CSV Export**
  - Export all leads to Excel format
  - Export filtered leads
  - Includes all lead fields:
    - Name
    - Email
    - Phone
    - Message
    - Status
    - Source
    - Created Date
  - Dynamic filename with timestamp
  - One-click download
  - xlsx library integration

#### 4.4.6 Lead Actions
**Quick Actions:**
- **View Details**
  - Side panel with full information
  - All lead data displayed
  - Timestamp information

- **Edit Lead**
  - Inline editing form
  - Update any field
  - Save changes

- **Delete Lead**
  - Confirmation dialog
  - Permanent deletion
  - Success notification

- **Contact Actions**
  - Email link (mailto:)
  - Phone link (tel:)
  - External link indicators

---

## 5. SEARCH ENGINE OPTIMIZATION (SEO) & TECHNICAL EXCELLENCE

### 5.1 On-Page SEO
**Metadata Implementation:**
- **Dynamic Meta Tags**
  - Custom meta titles for every page
  - Unique meta descriptions (up to 160 characters)
  - Keywords support
  - Author information
  - Publisher information

- **Page-Specific SEO:**
  - Home page: Brand-focused metadata
  - Service pages: Service-specific titles and descriptions
  - Subservice pages: Detailed subservice metadata
  - Project pages: Project-specific SEO
  - Blog pages: Article-specific metadata
  - About page: Company-focused SEO
  - Contact page: Location-based SEO

### 5.2 Open Graph & Social Media
**Social Sharing Optimization:**
- **Open Graph Tags**
  - og:title (page-specific)
  - og:description (page-specific)
  - og:url (canonical URLs)
  - og:image (1200x630px images)
  - og:type (website/article)
  - og:site_name (Starwood Interiors)
  - og:locale (en_US)

- **Twitter Card Support**
  - twitter:card (summary_large_image)
  - twitter:title
  - twitter:description
  - twitter:images
  - twitter:creator (if applicable)

### 5.3 Structured Data (JSON-LD Ready)
**Schema Markup Support:**
- **Organization Schema**
  - Business type identification
  - Contact information
  - Location data

- **Article Schema (Blogs)**
  - Article type
  - Author information
  - Publication dates
  - Category classification

- **Product/Service Schema**
  - Service descriptions
  - Pricing information (if applicable)
  - Availability

- **Project Schema**
  - Project type
  - Location
  - Completion dates
  - Images

### 5.4 URL Structure & Canonical URLs
**SEO-Friendly URLs:**
- **URL Patterns:**
  - `/services/[slug]` - Service pages
  - `/services/[slug]/[subservice-slug]` - Subservice pages
  - `/projects/[slug]` - Project pages
  - `/blogs/[slug]` - Blog articles
  - `/about-us` - About page
  - `/contact` - Contact page

- **Canonical URLs:**
  - Every page has canonical URL
  - Prevents duplicate content issues
  - Absolute URLs for canonical tags

### 5.5 Sitemap & Robots.txt
**Search Engine Crawling:**
- **Sitemap Generation**
  - Dynamic sitemap generation
  - All public pages included
  - Last modified dates
  - Priority settings
  - Change frequency indicators

- **Robots.txt**
  - Allow/disallow rules
  - Sitemap location
  - Crawler directives
  - Admin panel exclusion

### 5.6 Performance Optimization
**Loading Speed Optimization:**
- **Image Optimization**
  - Next.js Image component
  - Automatic format conversion (WebP)
  - Responsive image sizing
  - Lazy loading
  - Blur placeholders
  - Size optimization

- **Code Optimization**
  - Tree-shaking
  - Code splitting
  - Minification
  - Gzip compression
  - Bundle size optimization

- **Caching Strategies**
  - Static page caching
  - API response caching
  - Image caching
  - Browser caching headers

- **Loading Performance**
  - Server-side rendering for SEO
  - Incremental Static Regeneration (ISR) where applicable
  - Optimized database queries
  - Efficient data fetching

### 5.7 Accessibility Features
**WCAG Compliance:**
- **Semantic HTML**
  - Proper heading hierarchy
  - ARIA labels
  - Alt text for images
  - Form labels

- **Keyboard Navigation**
  - Full keyboard accessibility
  - Focus indicators
  - Tab order
  - Escape key handlers

- **Screen Reader Support**
  - Descriptive alt text
  - ARIA attributes
  - Semantic markup
  - Form error announcements

---

## 6. USER EXPERIENCE (UX) FEATURES

### 6.1 Smooth Scrolling
- **Lenis Integration**
  - Smooth scroll animations
  - Parallax effects
  - Custom scroll behavior
  - Performance optimized

### 6.2 Loading States
- **Skeleton Loaders**
  - Content placeholders
  - Smooth loading transitions
  - Reduced perceived load time

- **Loading Indicators**
  - Spinner animations
  - Progress feedback
  - Button loading states

### 6.3 Animations & Transitions
- **Intersection Observer Animations**
  - Fade-in on scroll
  - Stagger animations
  - Performance optimized

- **Hover Effects**
  - Smooth transitions
  - Color changes
  - Scale effects
  - Shadow effects

### 6.4 Responsive Design
- **Breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
  - Large Desktop: > 1440px

- **Mobile Optimizations:**
  - Touch-friendly buttons (min 44x44px)
  - Bottom navigation bar
  - Swipe gestures support
  - Mobile menu
  - Optimized image sizes

### 6.5 Error Handling
- **User-Friendly Error Messages**
  - Form validation errors
  - Network error handling
  - 404 page customization
  - Error boundaries
  - Toast notifications for errors

### 6.6 Toast Notifications
- **Sonner Integration**
  - Success notifications
  - Error notifications
  - Loading states
  - Customizable styling
  - Auto-dismiss
  - Action buttons

---

## 7. FILE UPLOAD & STORAGE

### 7.1 Supabase Storage Integration
**Storage Buckets:**
- **blog-images** - Blog featured images
- **project-images** - Project images and galleries
- **service-images** - Service images and galleries
- **subservice-images** - Subservice images and galleries

### 7.2 Image Upload Features
- **Drag-and-Drop Interface**
  - Visual drop zones
  - Multiple file selection
  - Upload progress indicators
  - Error handling

- **File Validation:**
  - File type validation (JPEG, JPG, PNG, WebP)
  - File size limits (5MB default, configurable)
  - Image dimension validation (if needed)

- **Upload Process:**
  - Unique filename generation
  - Folder organization
  - Public URL generation
  - Error handling and retry logic

### 7.3 Image Management
- **Gallery Management:**
  - Up to 6 images per gallery
  - Display order management
  - Image preview
  - Delete functionality
  - Replace functionality

---

## 8. DATABASE SCHEMA & STRUCTURE

### 8.1 Core Tables
**Projects Table:**
- id (UUID, primary key)
- title, slug, description
- image (featured image URL)
- category_id (foreign key)
- status (published/draft)
- meta_title, meta_description
- project_duration, materials_used, project_quote
- created_at, updated_at

**Project Gallery Images Table:**
- id (UUID, primary key)
- project_id (foreign key)
- image_url
- display_order
- created_at, updated_at

**Services Table:**
- id (UUID, primary key)
- title, slug, description
- image (featured image URL)
- status (published/draft)
- meta_title, meta_description
- created_at, updated_at

**Service Gallery Images Table:**
- id (UUID, primary key)
- service_id (foreign key)
- image_url
- display_order
- created_at, updated_at

**Subservices Table:**
- id (UUID, primary key)
- service_id (foreign key to services)
- title, slug, description
- image (featured image URL)
- status (published/draft)
- meta_title, meta_description
- created_at, updated_at

**Subservice Gallery Images Table:**
- id (UUID, primary key)
- subservice_id (foreign key)
- image_url
- display_order
- created_at, updated_at

**Blogs Table:**
- id (UUID, primary key)
- title, slug, excerpt, content
- image (featured image URL)
- author
- category_id (foreign key)
- tags (array)
- status (published/draft)
- created_at, updated_at

**Blog Categories Table:**
- id (UUID, primary key)
- name, slug, description
- created_at, updated_at

**Leads Table:**
- id (UUID, primary key)
- name, email, phone, message
- status (new/contacted/in-progress/closed)
- source (contact_form/manual)
- avatar_color (hex color)
- created_at, updated_at

**Settings Table:**
- id (UUID, primary key)
- key (unique)
- value (text/boolean)
- created_at, updated_at

### 8.2 Database Features
- **Row Level Security (RLS)**
  - Public read access for published content
  - Admin-only write access
  - Secure authentication checks

- **Automatic Triggers**
  - `updated_at` timestamp on all tables
  - Universal trigger function

- **Indexes**
  - Slug indexes for fast lookups
  - Full-text search indexes
  - Foreign key indexes

- **Constraints**
  - Unique constraints on slugs
  - Foreign key constraints
  - Check constraints for status values

---

## 9. API ENDPOINTS

### 9.1 Public API Routes
- **GET /api/projects**
  - Pagination support
  - Category filtering
  - Returns: projects array, hasMore, total, page, limit

- **GET /api/services**
  - Pagination support
  - Returns: services array, hasMore, total, page, limit

### 9.2 Admin API Routes
- **Protected Routes**
  - All admin operations require authentication
  - Server-side authorization checks
  - Supabase client with admin privileges

---

## 10. DEPLOYMENT & HOSTING

### 10.1 Hosting Platform
- **Vercel** (Recommended)
  - Next.js optimized hosting
  - Automatic deployments
  - Edge network
  - SSL certificates
  - Custom domain support

### 10.2 Environment Configuration
- **Environment Variables:**
  - Supabase URL
  - Supabase Anon Key
  - Supabase Service Role Key (server-side only)
  - Next.js configuration

### 10.3 Domain & DNS
- **Domain Mapping**
  - Custom domain configuration
  - SSL certificate setup
  - DNS record configuration
  - Subdomain support (if needed)

---

## 11. MAINTENANCE & SUPPORT

### 11.1 Basic Maintenance Included
- **Initial Setup:**
  - Hosting configuration
  - Domain mapping
  - SSL certificate setup
  - Database initialization
  - Admin user creation

- **Documentation:**
  - Admin panel usage guide
  - Content management instructions
  - Troubleshooting guide

### 11.2 Support Period
- **Post-Launch Support:**
  - 30 days of basic support
  - Bug fixes
  - Minor adjustments
  - Technical assistance

---

## 12. PRICING BREAKDOWN

| Phase / Feature | Detailed Description | Price (INR) |
|----------------|---------------------|-------------|
| **Frontend Development** | Complete client-facing website with all pages (Home, About, Services, Subservices, Projects, Blogs, Contact). Includes mobile-responsive design, infinite scrolling, smooth animations, parallax effects, image galleries, lightbox functionality, social sharing, and all interactive features. | **8,000** |
| **Admin Panel & CMS** | Full-featured Content Management System with dashboard, lead management, content CRUD operations (Projects, Services, Subservices, Blogs, Categories), rich text editor (TipTap), image upload and gallery management, settings toggles, advanced filtering, search, pagination, Excel export, and comprehensive admin interface. | **7,000** |
| **SEO & Technical Setup** | Complete SEO implementation including dynamic meta tags, Open Graph tags, Twitter Cards, canonical URLs, structured data support, sitemap generation, robots.txt, performance optimization, image optimization, code splitting, caching strategies, and accessibility features. | **3,000** |
| **Deployment & Support** | Hosting setup (Vercel), domain mapping, SSL certificate configuration, database initialization, admin user creation, basic maintenance, and 30 days post-launch support. | **2,000** |
| **Total Project Cost** | Complete end-to-end solution with all features, optimizations, and support | **20,000** |

---

## 13. PROJECT DELIVERABLES

### 13.1 Code Deliverables
- Complete source code
- Database migration files
- Environment configuration files
- Documentation files

### 13.2 Documentation
- Admin panel user guide
- Content management instructions
- Technical documentation
- Deployment guide

### 13.3 Training
- Admin panel walkthrough
- Content management training
- Best practices guidance

---

## 14. TECHNICAL SPECIFICATIONS SUMMARY

### 14.1 Frontend Technologies
- Next.js 16.0.7 with App Router
- React 19.2.0 with React Compiler
- TypeScript 5
- Tailwind CSS 4
- Radix UI Components
- shadcn/ui Component Library

### 14.2 Backend Technologies
- Supabase (PostgreSQL Database)
- Supabase Authentication
- Supabase Storage
- Row Level Security (RLS)
- Server-Side Rendering (SSR)

### 14.3 Key Libraries
- TipTap 3.13.0 (Rich Text Editor)
- Zod 3.23.8 (Validation)
- Lenis 1.3.16 (Smooth Scrolling)
- xlsx 0.18.5 (Excel Export)
- Sonner 2.0.7 (Toast Notifications)

### 14.4 Features Count
- **Frontend Pages:** 8+ pages
- **Admin Pages:** 7+ management pages
- **Database Tables:** 10+ tables
- **API Endpoints:** 2+ public APIs
- **Image Galleries:** 4 types (Projects, Services, Subservices, Blogs)
- **Form Validations:** 5+ forms with comprehensive validation
- **Export Features:** Excel/CSV export for leads
- **SEO Features:** Dynamic metadata on all pages
- **Sharing Features:** Native share API on 4 content types

---

## 15. CONTACT INFORMATION

For any clarifications, questions, or to initiate the project, please reach out to:

**Vaishakh P**  
**CloudFusion**  
**Email:** vaishakhpat2003@gmail.com  
**Phone:** 9777018675

---


## 16. TERMS & CONDITIONS

- Payment terms: 30% advance, balance on completion
- All source code and assets will be delivered upon final payment
- Custom domain and hosting setup included in deployment phase
- 30 days of post-launch support included
- Additional features beyond scope will be quoted separately

---

**End of Quotation Document**

This document provides a comprehensive overview of all features, specifications, and technical details of the Starwood Interiors website project. All features listed have been implemented and tested to ensure optimal performance and user experience.

