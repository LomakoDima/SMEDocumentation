import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Download,
  ExternalLink,
  Github,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { SITE } from "@/lib/site";
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
  const status = query.isPending
    ? "Проверяем GitHub"
    : latest
      ? latest.prerelease
        ? "Ранний доступ"
        : "Стабильная версия"
      : query.isError
        ? "Недоступно"
        : "Скоро";

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
        <section
          aria-labelledby="release-heading"
          aria-busy={query.isPending}
          className="release-panel"
        >
          <div className="release-kicker">
            <p className="release-label">Последняя официальная сборка</p>
            <span
              className="release-status metadata"
              data-state={
                latest
                  ? latest.prerelease
                    ? "preview"
                    : "stable"
                  : query.isError
                    ? "error"
                    : "pending"
              }
            >
              <span aria-hidden="true" />
              {status}
            </span>
          </div>
          <div aria-live="polite" aria-atomic="true" className="release-message">
            <h2 id="release-heading" className="display-heading">
              {query.isPending
                ? "Ищем последнюю сборку."
                : latest
                  ? latest.name || latest.tag_name
                  : query.isError
                    ? "Не удалось проверить версии."
                    : "Публичных версий пока нет"}
            </h2>
            <p>
              {query.isPending
                ? "Проверяем официальный репозиторий на GitHub: ищем опубликованные версии и файлы для скачивания."
                : latest
                  ? "Скачай официальную сборку. Перед установкой проверь в описании версии совместимость с Minecraft, загрузчик и зависимости."
                  : query.isError
                    ? "Не удалось связаться с GitHub. Попробуй ещё раз или открой страницу официальных версий."
                    : query.data?.repositoryUnavailable
                      ? "Официальный репозиторий пока недоступен публично. Файлы появятся здесь после публикации первой версии."
                      : "Публичных версий пока нет. Первая официальная сборка появится здесь, когда будет готова."}
            </p>
          </div>
          <div className="release-actions cta-row">
            {latest ? (
              <a href={asset?.browser_download_url ?? latest.html_url} className="action-button">
                <Download size={17} aria-hidden="true" />
                {asset ? "Скачать StoryModEngine" : "Файлы версии"}
              </a>
            ) : query.isError ? (
              <button onClick={() => void query.refetch()} className="action-button">
                <RefreshCw size={17} aria-hidden="true" />
                Попробовать снова
              </button>
            ) : (
              <button disabled className="action-button">
                {query.isPending ? (
                  <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Download size={17} aria-hidden="true" />
                )}
                {query.isPending ? "Проверяем версии…" : "Скачивание скоро появится"}
              </button>
            )}
            <Link
              to="/docs/$"
              params={{ _splat: "latest/getting-started/installation" }}
              className="editorial-link"
            >
              Руководство по установке <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          {asset && (
            <p className="release-filename">
              {asset.name} · {fileSize(asset.size)}
            </p>
          )}
          <dl className="release-details">
            <div>
              <dt>Версия</dt>
              <dd>
                {latest?.tag_name ??
                  (query.isPending
                    ? "Проверяем…"
                    : query.isError
                      ? "Недоступно"
                      : "Не опубликована")}
              </dd>
            </div>
            <div>
              <dt>Дата выпуска</dt>
              <dd>
                {latest?.published_at ? (
                  <time dateTime={latest.published_at}>{releaseDate(latest.published_at)}</time>
                ) : query.isPending ? (
                  "Проверяем…"
                ) : query.isError ? (
                  "Недоступно"
                ) : (
                  "Не объявлена"
                )}
              </dd>
            </div>
          </dl>
          {latest && (
            <a href={latest.html_url} className="editorial-link release-notes">
              Описание версии на GitHub <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
          {query.isError && query.data && (
            <p role="status" className="release-refresh-note">
              Не удалось обновить данные с GitHub. Показана последняя загруженная информация о
              версии.
            </p>
          )}
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
