import { SITE } from "@/lib/site";

export const SITE_BUILD = {
  tag: "v0.1.0-ea",
  version: "0.1.0-ea",
  channel: "Early Access",
  prerelease: true,
  file: "storymodengine-0.1.0-ea-all.jar",
  href: "/downloads/storymodengine-0.1.0-ea-all.jar",
  size: 24_719_740,
  sha256: "252e37d48e40b74523109352d9c9af95f4afad89a593fbf2a7726ffbd79c4e21",
  publishedAt: "2026-11-17T18:11:20Z",
  releaseUrl: `${SITE.github}/releases/tag/v0.1.0-ea`,
  githubDownloadUrl: `${SITE.github}/releases/download/v0.1.0-ea/storymodengine-0.1.0-ea-all.jar`,
} as const;
