import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SITE_BUILD } from "@/lib/site-build";

describe("site build", () => {
  const file = resolve(process.cwd(), "public", SITE_BUILD.href.replace(/^\//, ""));

  it("ships the jar the download page links to", () => {
    expect(statSync(file).size).toBe(SITE_BUILD.size);
  });

  it("publishes the checksum of that exact file", () => {
    expect(createHash("sha256").update(readFileSync(file)).digest("hex")).toBe(SITE_BUILD.sha256);
  });

  it("points GitHub links at the same tag and file", () => {
    expect(SITE_BUILD.href.endsWith(SITE_BUILD.file)).toBe(true);
    expect(SITE_BUILD.githubDownloadUrl).toContain(`/download/${SITE_BUILD.tag}/${SITE_BUILD.file}`);
    expect(SITE_BUILD.releaseUrl.endsWith(`/tag/${SITE_BUILD.tag}`)).toBe(true);
  });
});
