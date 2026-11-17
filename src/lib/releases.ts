import { z } from "zod";

export const RELEASES_API =
  "https://api.github.com/repos/LomakoDima/StoryModEngine/releases?per_page=100";

const releaseSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  tag_name: z.string(),
  html_url: z.string().url(),
  published_at: z.string().datetime().nullable(),
  draft: z.boolean(),
  prerelease: z.boolean(),
  assets: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      size: z.number().nonnegative(),
      browser_download_url: z.string().url(),
      state: z.string(),
    }),
  ),
});

export type Release = z.infer<typeof releaseSchema>;
export type ReleaseData = {
  releases: Release[];
  repositoryUnavailable: boolean;
};

export async function fetchReleases(signal?: AbortSignal): Promise<ReleaseData> {
  const response = await fetch(RELEASES_API, {
    headers: { Accept: "application/vnd.github+json" },
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(12_000)])
      : AbortSignal.timeout(12_000),
  });

  // GitHub also returns 404 for private repositories. Do not imply a release exists.
  if (response.status === 404) return { releases: [], repositoryUnavailable: true };
  if (!response.ok) throw new Error("Версии на GitHub временно недоступны.");

  const releases = z
    .array(releaseSchema)
    .parse(await response.json())
    .filter((release) => !release.draft && release.published_at)
    .sort((a, b) => Date.parse(b.published_at!) - Date.parse(a.published_at!));

  return { releases, repositoryUnavailable: false };
}

export function getLatestRelease(releases: Release[]) {
  // Prefer a stable release; clearly label a preview when no stable build exists.
  return releases.find((release) => !release.prerelease) ?? releases[0];
}

export function getDownloadAsset(release: Release) {
  const candidates = release.assets.filter(
    (asset) =>
      asset.state === "uploaded" &&
      /\.jar$/i.test(asset.name) &&
      !/(?:^|[-_.])(sources?|javadoc|dev)(?:[-_.]|$)/i.test(asset.name),
  );
  // Multiple loaders/builds require a deliberate choice on the release page.
  return candidates.length === 1 ? candidates[0] : undefined;
}

export function releaseDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(value))
    : "Не объявлена";
}

export function fileSize(bytes: number) {
  return bytes < 1_048_576
    ? `${new Intl.NumberFormat("ru-RU").format(Math.max(1, Math.round(bytes / 1024)))} КБ`
    : `${new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(bytes / 1_048_576)} МБ`;
}
