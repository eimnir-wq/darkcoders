import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5555";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/#platform`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/#visibility`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/#compliance`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/#copilot`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/#dashboard`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/#architecture`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/#cta`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
