import type { MetadataRoute } from "next";
import { siteUrl } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "aboutus", "thin-clients", "mini-pc", "tower-desktop", "desktop-pc", "all-in-one", "kiosks-display", "hardware-training", "our-clients", "contact"];
  return pages.map((path) => ({ url: `${siteUrl}/${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : ["contact", "mini-pc", "thin-clients", "kiosks-display"].includes(path) ? 0.8 : 0.6 }));
}
