# StoryModEngine

Русскоязычный сайт игрового движка внутри Minecraft Java Edition 1.20.1.
Автор — [LomakoDima](https://github.com/LomakoDima).

Сайт использует React, TanStack Start с серверным рендерингом, Vite, Nitro,
Tailwind CSS, GSAP и Motion. Документация хранится в MDX, сведения о сборках
загружаются из публичного API GitHub. Для запуска не нужны ключи API или база данных.

## Локальная разработка

Нужны Node.js **24.x** и npm. Версия Node также указана в `.nvmrc`.

```sh
npm ci
npm run dev
```

Сайт: `http://localhost:8080`.

```sh
npm run typecheck
npm test
npm run build
```

Обычная production-сборка создаёт `.vercel/output/`: статические файлы и
серверную функцию. Для локального просмотра production-сервера:

```sh
npm run preview
```

Эта команда собирает вариант для Node в `.output/` и запускает его на порту 3000.
Если он уже собран, достаточно `npm start`.

## Деплой на Vercel

1. Загрузите проект в GitHub и импортируйте репозиторий в Vercel.
2. Выберите корень этого проекта как **Root Directory**.
3. Используйте **TanStack Start** в качестве Framework Preset и **Node.js 24.x**.
4. Установка — `npm ci`, сборка — `npm run build`. Они уже заданы в `vercel.json`.
5. Оставьте **Output Directory** без ручного переопределения. Nitro формирует
   `.vercel/output` по Build Output API; сайт включает серверный рендеринг.
6. Нажмите **Deploy**. Обязательных переменных окружения нет.

При импорте существующего проекта удалите прежние переопределения команд и
каталога вывода в настройках Vercel, если они отличаются от указанных выше.
Маршруты документации обслуживаются серверной функцией: переписывать все адреса
на `index.html` не нужно.

Настройка основана на официальных руководствах
[TanStack Start на Vercel](https://vercel.com/docs/frameworks/full-stack/tanstack-start)
и [Nitro для Vercel](https://nitro.build/deploy/providers/vercel).

## Контент

- Страницы и маршруты: `src/routes/`.
- Документация: `src/content/docs/<версия>/<раздел>/<страница>.mdx`.
  Метаданные `title`, `description` и `order` в начале файла управляют меню и поиском.
- Подлинные снимки редакторов: `public/product/`.
- Снимки для документации: `src/assets/docs/screenshots/`.
- Общие стили: `src/styles.css`; стили главной: `src/components/home/home.css`.
- Название, автор и ссылки: `src/lib/site.ts`.
- Источник загрузок: `RELEASES_API` в `src/lib/releases.ts`.

`src/routeTree.gen.ts` создаётся автоматически. Шрифты хранятся локально
в `public/fonts/` вместе с лицензиями.
