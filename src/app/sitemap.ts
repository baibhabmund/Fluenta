import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { services } from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about", "/services", "/plans", "/consultation", ...services.map((s) => `/services/${s.slug}`)];
  return routes.map((r) => ({ url: brand.url + r, lastModified: new Date() }));
}
