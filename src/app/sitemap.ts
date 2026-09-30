import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { pages } from "@/lib/content";
const extra = ["/", "/about/", "/contact/"];
export default function sitemap(): MetadataRoute.Sitemap {
  return [...extra, ...pages.map((p) => p.path)].map((r) => ({ url: `${site.url}${r}`, lastModified: new Date() }));
}
