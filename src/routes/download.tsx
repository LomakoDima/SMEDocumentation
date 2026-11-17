import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Download, ExternalLink, Github } from "lucide-react";
import { SITE } from "@/lib/site";
import { SITE_BUILD } from "@/lib/site-build";
import {
  fetchReleases,
  fileSize,
  getDownloadAsset,
  getLatestRelease,
  releaseDate,
  type Release,
} from "@/lib/releases";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Скачать — StoryModEngine" },
      {
        name: "description",
        content:
          "Официальные версии StoryModEngine, требования и руководство по установке для Minecraft Java Edition 1.20.1.",
      },
      { property: "og:title", content: "Скачать — StoryModEngine" },
      {
        property: "og:description",
        content:
          "Скачай официальную версию StoryModEngine и подготовь Minecraft к работе с движком.",
      },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const query = useQuery({
    queryKey: ["github", "StoryModEngine", "releases"],
    queryFn: ({ signal }) => fetchReleases(signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const releases = query.data?.releases ?? [];
  const latest = getLatestRelease(releases);
  const previous = releases.filter((release) => release.id !== latest?.id);
  const asset = latest ? getDownloadAsset(latest) : undefined;
  const newerOnGithub = latest && latest.tag_name !== SITE_BUILD.tag ? latest : undefined;
  const prerelease = newerOnGithub ? newerOnGithub.prerelease : SITE_BUILD.prerelease;
  const githubDownload = newerOnGithub
    ? (asset?.browser_download_url ?? newerOnGithub.html_url)
    : SITE_BUILD.githubDownloadUrl;
  const releaseUrl = newerOnGithub ? newerOnGithub.html_url : SITE_BUILD.releaseUrl;

  return (
    <div className="download-page site-width">
      <section className="download-intro" aria-labelledby="download-heading">
        <div>
          <h1 id="download-heading" className="display-heading">
            Скачать
          </h1>
        </div>
        <div className="download-intro-note">
          <p>
            Minecraft Java Edition 1.20.1.
            <br />
            Java 17 или новее.
          </p>
        </div>
      </section>

      <div className="download-layout">
        <section aria-labelledby="release-heading" className="release-panel">
          <div className="release-kicker">
            <p className="release-label">Последняя официальная сборка</p>
            <span className="release-status metadata" data-state={prerelease ? "preview" : "stable"}>
              <span aria-hidden="true" />
              {prerelease ? "Ранний доступ" : "Стабильная версия"}
            </span>
          </div>
          <div aria-live="polite" aria-atomic="true" className="release-message">
            <h2 id="release-heading" className="display-heading">
              {newerOnGithub ? (
                newerOnGithub.name || newerOnGithub.tag_name
              ) : (
                <>
                  StoryModEngine <span className="release-version">{SITE_BUILD.version}</span>{" "}
                  <span className="release-version">({SITE_BUILD.channel})</span>
                </>
              )}
            </h2>
            <p>
              {newerOnGithub
                ? `На GitHub уже вышла версия ${newerOnGithub.tag_name}. Скачай её с GitHub — с сайта пока доступна ${SITE_BUILD.tag}.`
                : "Скачай jar-файл прямо с сайта или с GitHub — это один и тот же файл, его контрольная сумма указана ниже. Ранний доступ: возможности и форматы файлов ещё могут меняться между версиями."}
            </p>
          </div>
          <div className="release-actions cta-row">
            <a href={SITE_BUILD.href} download={SITE_BUILD.file} className="action-button">
              <Download size={17} aria-hidden="true" />
              {newerOnGithub ? `Скачать ${SITE_BUILD.tag} с сайта` : "Скачать с сайта"}
            </a>
            <a href={githubDownload} className="action-button is-secondary">
              <Github size={17} aria-hidden="true" />
              Скачать с GitHub
            </a>
          </div>
          <p className="release-filename">
            {SITE_BUILD.file} · {fileSize(SITE_BUILD.size)}
          </p>
          <p className="release-checksum">
            <span>SHA-256</span>
            <code>{SITE_BUILD.sha256}</code>
          </p>
          <dl className="release-details">
            <div>
              <dt>Версия</dt>
              <dd>{newerOnGithub?.tag_name ?? SITE_BUILD.tag}</dd>
            </div>
            <div>
              <dt>Дата выпуска</dt>
              <dd>
                <time dateTime={newerOnGithub?.published_at ?? SITE_BUILD.publishedAt}>
                  {releaseDate(newerOnGithub?.published_at ?? SITE_BUILD.publishedAt)}
                </time>
              </dd>
            </div>
          </dl>
          <div className="release-links">
            <a href={releaseUrl} className="editorial-link">
              <Github size={15} aria-hidden="true" /> Описание версии на GitHub{" "}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <Link
              to="/docs/$"
              params={{ _splat: "latest/getting-started/installation" }}
              className="editorial-link"
            >
              Руководство по установке <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <aside aria-labelledby="requirements-heading" className="requirements-panel">
          <h2 id="requirements-heading" className="display-heading">
            Совместимость
          </h2>
          <dl className="requirements-list">
            {[
              { label: "Minecraft", value: "Java Edition 1.20.1", confirmed: true },
              { label: "Среда Java", value: "Java 17 или новее", confirmed: true },
              { label: "Загрузчик модов", value: "Forge 47.x", confirmed: true },
              { label: "Зависимости", value: "Библиотеки включены в мод", confirmed: true },
            ].map(({ label, value, confirmed }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd className={confirmed ? "confirmed-value" : undefined}>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="requirements-note">
            Для видео движок автоматически скачивает FFmpeg при первом запуске воспроизведения.
            Подробности и настройки загрузки — в руководстве по установке.
          </p>
          <Link
            to="/docs/$"
            params={{ _splat: "latest/getting-started/installation" }}
            hash="что-нужно"
            className="editorial-link"
          >
            Все требования <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </aside>
      </div>

      <section aria-labelledby="installation-heading" className="install-section">
        <div className="install-intro">
          <h2 id="installation-heading" className="display-heading">
            Установка
          </h2>
          <Link to="/docs" className="editorial-link">
            <BookOpen size={15} aria-hidden="true" /> Открыть документацию{" "}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <ol className="install-steps">
          {[
            [
              "Подготовь Minecraft",
              "Установи Forge 47.x для Minecraft Java Edition 1.20.1. Для запуска нужна Java 17 — она уже есть в современных лаунчерах.",
            ],
            [
              "Выбери официальную версию",
              "Прочитай описание доступной версии и скачай подходящий файл с этой страницы или из раздела версий на GitHub.",
            ],
            [
              "Установи движок",
              "Положи файл движка в папку mods и запусти игру. Для игры на сервере установи тот же файл и на сервер. Подробности — в руководстве по установке.",
            ],
          ].map(([title, description], index) => (
            <li key={title}>
              <span className="step-number" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="previous-heading" className="release-history">
        <div className="history-heading">
          <h2 id="previous-heading" className="display-heading">
            Предыдущие версии
          </h2>
          <a href={`${SITE.github}/releases`} className="editorial-link">
            Описание версии <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
        <div className="history-content">
          {query.isPending ? (
            <p>Загружаем историю версий…</p>
          ) : query.isError && !query.data ? (
            <p>История версий сейчас недоступна. Открой GitHub по ссылке ниже.</p>
          ) : previous.length ? (
            <ul className="release-list">
              {previous.slice(0, 6).map((release) => (
                <ReleaseRow key={release.id} release={release} />
              ))}
            </ul>
          ) : (
            <div className="history-empty">
              <p>
                {latest
                  ? "Предыдущих версий пока нет. История выпусков появится здесь."
                  : "Истории публичных версий пока нет. Официальные сборки появятся здесь после публикации."}
              </p>
            </div>
          )}
          <div className="history-links">
            <a href={`${SITE.github}/releases`} className="editorial-link">
              <Github size={16} aria-hidden="true" /> Все версии на GitHub{" "}
              <ExternalLink size={13} aria-hidden="true" />
            </a>
            <a href={SITE.github} className="editorial-link">
              Исходный код <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReleaseRow({ release }: { release: Release }) {
  return (
    <li>
      <a href={release.html_url} className="release-row">
        <div>
          <span className="release-tag">{release.tag_name}</span>
          {release.prerelease && (
            <span className="metadata release-preview">Ранний доступ</span>
          )}
          <p>
            <time dateTime={release.published_at ?? undefined}>
              {releaseDate(release.published_at)}
            </time>
          </p>
        </div>
        <span className="editorial-link">
          Описание версии <ArrowRight size={15} aria-hidden="true" />
        </span>
      </a>
    </li>
  );
}
