# Next.js Static Pages Integration Guide

This guide explains how to integrate the dynamic page creation functionality with Next.js routing system.

## 🏗️ Architecture Overview

The page management system allows admin users to create static pages that are dynamically routed through Next.js. Here's how it works:

### 1. Database Storage

Pages are stored in your database with the following key fields:

- `slug`: URL path (e.g., "about-us")
- `content`: Markdown content
- `visibility`: Access control
- `status`: Published/Draft/Archived
- `priority`: Display order

### 2. Dynamic Routing Setup

#### Option A: Catch-All Routes (Recommended)

Create a catch-all route that handles all dynamic pages:

**File: `app/[...slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/pages";
import { renderMarkdown } from "@/lib/markdown";

interface PageProps {
  params: {
    slug: string[];
  };
}

export async function generateMetadata({ params }: PageProps) {
  const slug = params.slug?.join("/") || "home";
  const page = await getPageBySlug(slug);

  if (!page || page.status !== "published") {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    openGraph: {
      title: page.openGraph?.title || page.title,
      description: page.openGraph?.description || page.metaDescription,
      type: page.openGraph?.type || "website",
      images: page.openGraph?.image ? [page.openGraph.image] : [],
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const slug = params.slug?.join("/") || "home";
  const page = await getPageBySlug(slug);

  if (!page || page.status !== "published") {
    notFound();
  }

  // Handle visibility
  if (page.visibility === "private") {
    // Check user authentication/authorization
    // Redirect to login or show 403
  }

  if (page.visibility === "password") {
    // Show password form or check session
  }

  // Handle redirects
  if (page.redirectUrl) {
    redirect(page.redirectUrl);
  }

  const htmlContent = await renderMarkdown(page.content);

  return (
    <div className={`page-template-${page.template}`}>
      {/* Custom CSS */}
      {page.customCSS && <style jsx>{page.customCSS}</style>}

      {/* Page Content */}
      <article className="prose prose-lg max-w-none">
        <header>
          <h1>{page.title}</h1>
          {page.featuredImage && (
            <img
              src={page.featuredImage}
              alt={page.title}
              className="featured-image"
            />
          )}
        </header>

        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>

      {/* Custom JavaScript */}
      {page.customJS && (
        <script dangerouslySetInnerHTML={{ __html: page.customJS }} />
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const pages = await getAllPublishedPages();

  return pages.map((page) => ({
    slug: page.slug.split("/").filter(Boolean),
  }));
}
```

#### Option B: Individual Route Files

For specific important pages, you can create dedicated route files:

**File: `app/about/page.tsx`**

```tsx
import { getPageBySlug } from "@/lib/pages";

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  // Similar implementation as above
  return <DynamicPageComponent page={page} />;
}
```

### 3. Database Functions

Create helper functions to interact with your database:

**File: `lib/pages.ts`**

```tsx
import { db } from "@/lib/database"; // Your DB connection

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  visibility: "public" | "private" | "password" | "groups";
  status: "published" | "draft" | "archived";
  priority: number;
  metaTitle?: string;
  metaDescription?: string;
  customCSS?: string;
  customJS?: string;
  template?: string;
  redirectUrl?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const page = await db.page.findFirst({
      where: {
        slug,
        status: "published", // Only get published pages
      },
    });
    return page;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export async function getAllPublishedPages(): Promise<Page[]> {
  try {
    return await db.page.findMany({
      where: { status: "published" },
      orderBy: { priority: "desc" },
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
}

export async function createPage(pageData: PageFormData): Promise<Page> {
  return await db.page.create({
    data: {
      ...pageData,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function updatePage(
  id: string,
  pageData: Partial<PageFormData>
): Promise<Page> {
  return await db.page.update({
    where: { id },
    data: {
      ...pageData,
      updatedAt: new Date(),
    },
  });
}

export async function deletePage(id: string): Promise<void> {
  await db.page.delete({
    where: { id },
  });
}
```

### 4. Markdown Rendering

Create a markdown renderer with your preferred library:

**File: `lib/markdown.ts`**

```tsx
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export async function renderMarkdown(content: string): Promise<string> {
  // Configure marked options
  marked.setOptions({
    highlight: function (code, lang) {
      // Add syntax highlighting if needed
      return code;
    },
    breaks: true,
    gfm: true,
  });

  const html = await marked(content);
  return DOMPurify.sanitize(html);
}
```

### 5. API Routes for Admin

Create API endpoints for the admin interface:

**File: `app/api/admin/pages/route.ts`**

```tsx
import { NextRequest, NextResponse } from "next/server";
import { createPage, getAllPages } from "@/lib/pages";

export async function GET() {
  try {
    const pages = await getAllPages();
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const pageData = await request.json();
    const page = await createPage(pageData);
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
```

**File: `app/api/admin/pages/[id]/route.ts`**

```tsx
import { NextRequest, NextResponse } from "next/server";
import { updatePage, deletePage, getPageById } from "@/lib/pages";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await getPageById(params.id);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pageData = await request.json();
    const page = await updatePage(params.id, pageData);
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deletePage(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
```

### 6. Navigation Integration

Automatically generate navigation from pages:

**File: `components/Navigation.tsx`**

```tsx
import { getAllPublishedPages } from "@/lib/pages";

export default async function Navigation() {
  const pages = await getAllPublishedPages();
  const navPages = pages
    .filter((page) => page.showInNavigation)
    .sort((a, b) => b.priority - a.priority);

  return (
    <nav>
      <ul>
        {navPages.map((page) => (
          <li key={page.id}>
            <Link href={`/${page.slug}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### 7. Sitemap Generation

**File: `app/sitemap.xml/route.ts`**

```tsx
import { getAllPublishedPages } from "@/lib/pages";

export async function GET() {
  const pages = await getAllPublishedPages();
  const sitemapPages = pages.filter((page) => page.showInSitemap);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapPages
        .map(
          (page) => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_SITE_URL}/${page.slug}</loc>
          <lastmod>${page.updatedAt.toISOString()}</lastmod>
          <priority>${(page.priority + 10) / 20}</priority>
        </url>
      `
        )
        .join("")}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
```

## 🔧 Implementation Steps

### Step 1: Database Schema

Set up your database tables (example with Prisma):

```prisma
model Page {
  id                String   @id @default(cuid())
  title             String
  slug              String   @unique
  content           String   @db.Text
  visibility        String   @default("public")
  password          String?
  status            String   @default("draft")
  priority          Int      @default(0)
  metaTitle         String?
  metaDescription   String?
  customCSS         String?  @db.Text
  customJS          String?  @db.Text
  template          String   @default("default")
  redirectUrl       String?
  showInNavigation  Boolean  @default(true)
  showInSitemap     Boolean  @default(true)
  showInSearch      Boolean  @default(true)
  enableComments    Boolean  @default(false)
  featuredImage     String?
  openGraphTitle    String?
  openGraphDescription String?
  openGraphImage    String?
  openGraphType     String   @default("website")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("pages")
}
```

### Step 2: Update Admin Interface

Modify the `handlePageSave` function in `PagesPage.tsx` to use API calls:

```tsx
const handlePageSave = async (pageData: PageFormData) => {
  try {
    if (modalMode === "create") {
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });
      const newPage = await response.json();
      setPages((prev) => [newPage, ...prev]);
    } else if (modalMode === "edit" && selectedPage) {
      const response = await fetch(`/api/admin/pages/${selectedPage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });
      const updatedPage = await response.json();
      setPages((prev) =>
        prev.map((page) => (page.id === selectedPage.id ? updatedPage : page))
      );
    }
  } catch (error) {
    console.error("Error saving page:", error);
    // Handle error (show toast, etc.)
  }
};
```

### Step 3: File Structure

Your project structure should look like this:

```
app/
├── [...slug]/
│   └── page.tsx          # Dynamic page handler
├── admin/
│   └── pages/
│       └── page.tsx      # Admin pages management
├── api/
│   └── admin/
│       └── pages/
│           ├── route.ts   # GET /api/admin/pages, POST /api/admin/pages
│           └── [id]/
│               └── route.ts # GET/PUT/DELETE /api/admin/pages/[id]
└── sitemap.xml/
    └── route.ts          # Dynamic sitemap generation

components/
├── admin/
│   └── pages/
│       ├── PageModal.tsx
│       └── PageCard.tsx
└── Navigation.tsx

lib/
├── pages.ts              # Database functions
├── markdown.ts           # Markdown rendering
└── database.ts           # Database connection
```

## 🚀 Advanced Features

### 1. Page Templates

Create different templates for different page types:

**File: `components/templates/DefaultTemplate.tsx`**

```tsx
export default function DefaultTemplate({ page, content }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose max-w-none">
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </div>
  );
}
```

### 2. Page Caching

Implement caching for better performance:

```tsx
import { unstable_cache } from "next/cache";

export const getCachedPage = unstable_cache(
  async (slug: string) => getPageBySlug(slug),
  ["page-by-slug"],
  { revalidate: 3600 } // Cache for 1 hour
);
```

### 3. Preview Mode

Add preview functionality for draft pages:

```tsx
// In your dynamic page
export default async function DynamicPage({ params, searchParams }: PageProps) {
  const isPreview = searchParams.preview === "true";
  const slug = params.slug?.join("/") || "home";

  const page = isPreview
    ? await getPageBySlugIncludingDrafts(slug)
    : await getPageBySlug(slug);

  // Rest of the implementation
}
```

This comprehensive integration allows you to:

- ✅ Create dynamic pages through the admin interface
- ✅ Automatically generate routes for all pages
- ✅ Handle SEO metadata and Open Graph tags
- ✅ Support multiple page templates
- ✅ Generate sitemaps automatically
- ✅ Handle visibility and access control
- ✅ Support custom CSS/JS per page
- ✅ Enable page previews and drafts

The pages created through your admin interface will be immediately accessible via their slugs and properly integrated into your Next.js application!
