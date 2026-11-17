export const SITE = {
  name: "StoryModEngine",
  mcVersion: "Minecraft Java Edition 1.20.1",
  github: "https://github.com/LomakoDima/StoryModEngine",
  author: "LomakoDima",
  authorUrl: "https://github.com/LomakoDima",
};
export const NAV = [
  { to: "/docs", label: "Документация" },
  { to: "/download", label: "Скачать" },
] as const;
export const TOOLS = [
  {
    key: "level",
    image: "MainViewportEngine.jpg",
    imageTitle: "Главное окно редактора",
    name: "Редактор сцен",
    desc: "Создавай и обустраивай сцены прямо внутри Minecraft.",
    doc: "latest/editors/scene-editing",
    purpose: "Создавай окружение",
    detail:
      "Создавай места, в которых разворачивается твоя история. Редактор сцен позволяет строить и обустраивать их прямо в игре.",
  },
  {
    key: "npc",
    image: "SMECreateNPC.jpg",
    imageTitle: "Редактор NPC",
    name: "Редактор NPC",
    desc: "Создавай персонажей своего мира и настраивай их.",
    doc: "latest/editors/npc-editor",
    purpose: "Создавай персонажей",
    detail:
      "Насели мир персонажами. Редактор NPC позволяет создавать их и настраивать внутри Minecraft.",
  },
  {
    key: "vfx",
    image: "SMEVFXEditor.jpg",
    imageTitle: "Редактор эффектов",
    name: "Редактор эффектов",
    desc: "Создавай визуальные эффекты для своего контента в Minecraft.",
    doc: "latest/editors/vfx-editor",
    purpose: "Добавляй эффекты",
    detail:
      "Дополняй свой контент визуальными эффектами. Для их создания в движке есть отдельный внутриигровой редактор.",
  },
  {
    key: "sme",
    image: "SME_IDE.jpg",
    imageTitle: "Среда разработки SME",
    name: "SME Scripting",
    desc: "Связывай контент с помощью языка сценариев движка.",
    doc: "latest/sme-scripting/overview",
    purpose: "Связывай всё воедино",
    detail:
      "Объединяй контент из редакторов с помощью собственного языка сценариев StoryModEngine. Документация языка и API дополняется.",
  },
];
