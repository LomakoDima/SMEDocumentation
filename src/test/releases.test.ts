import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchReleases,
  getDownloadAsset,
  getLatestRelease,
  releaseDate,
  type Release,
} from "@/lib/releases";

// Synthetic metadata is only used in tests; no release versions are hardcoded in the page.
const release = (id: number, overrides: Partial<Release> = {}): Release => ({
  id,
  name: null,
  tag_name: `test-${id}`,
  html_url: `https://github.com/example/test/releases/tag/test-${id}`,
  published_at: "2026-01-01T00:00:00Z",
  draft: false,
  prerelease: false,
  assets: [],
  ...overrides,
});
const asset = (name: string, id = 1) => ({
  id,
  name,
  size: 2048,
  state: "uploaded",
  browser_download_url: `https://github.com/example/test/releases/download/test/${name}`,
});
afterEach(() => vi.unstubAllGlobals());
function respond(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ status, ok: status === 200, json: async () => body }),
  );
}

describe("Official releases", () => {
  it("distinguishes an inaccessible repository from an empty public release list", async () => {
    respond({}, 404);
    expect(await fetchReleases()).toEqual({ releases: [], repositoryUnavailable: true });
    respond([]);
    expect(await fetchReleases()).toEqual({ releases: [], repositoryUnavailable: false });
  });
  it("rejects rate limits, server failures and malformed metadata instead of reporting coming soon", async () => {
    for (const status of [403, 429, 500]) {
      respond({}, status);
      await expect(fetchReleases()).rejects.toThrow();
    }
    respond([{ unexpected: true }]);
    await expect(fetchReleases()).rejects.toThrow();
  });
  it("filters drafts and unpublished releases, sorts by publication and prefers stable builds", async () => {
    const stable = release(1);
    const preview = release(2, { prerelease: true, published_at: "2026-02-01T00:00:00Z" });
    respond([stable, release(3, { draft: true }), preview, release(4, { published_at: null })]);
    const data = await fetchReleases();
    expect(data.releases.map((r) => r.id)).toEqual([2, 1]);
    expect(getLatestRelease(data.releases)).toEqual(stable);
    expect(getLatestRelease([preview])).toEqual(preview);
    expect(getLatestRelease([])).toBeUndefined();
  });
  it("offers a direct download only for an unambiguous uploaded mod JAR", () => {
    const mod = asset("engine.jar");
    expect(
      getDownloadAsset(
        release(1, {
          assets: [mod, asset("engine-sources.jar", 2), asset("engine-javadoc.jar", 3)],
        }),
      ),
    ).toEqual(mod);
    expect(
      getDownloadAsset(release(1, { assets: [mod, asset("engine-fabric.jar", 2)] })),
    ).toBeUndefined();
    expect(getDownloadAsset(release(1, { assets: [asset("source.zip")] }))).toBeUndefined();
    expect(getDownloadAsset(release(1, { assets: [{ ...mod, state: "new" }] }))).toBeUndefined();
  });
  it("formats the published date in UTC", () => {
    expect(releaseDate("2026-01-01T00:00:00Z")).toBe("1 янв. 2026 г.");
  });
});
