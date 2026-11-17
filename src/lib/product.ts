export const PRODUCT_CAPTURES = [
  {
    file: "MainViewportEngine.jpg",
    title: "Главное окно редактора",
    group: "Рабочее пространство",
    description: "Игровой мир, браузер проекта и панель свойств в одном рабочем пространстве.",
  },
  {
    file: "SMECreateNPC.jpg",
    title: "Редактор NPC",
    group: "Редакторы",
    description: "Предпросмотр персонажа рядом с панелью свойств NPC.",
  },
  {
    file: "SMEVFXEditor.jpg",
    title: "Редактор эффектов",
    group: "Редакторы",
    description: "Предпросмотр эффекта, иерархия сцены, свойства и временная шкала.",
  },
  {
    file: "SMETimelineCutscene.jpg",
    title: "Монтаж катсцен",
    group: "Редакторы",
    description: "Дорожки и клипы на временной шкале катсцены.",
  },
  {
    file: "SMEUIDesigner.jpg",
    title: "Редактор интерфейсов",
    group: "Редакторы",
    description: "Меню Minecraft в редакторе интерфейсов.",
  },
  {
    file: "SME_IDE.jpg",
    title: "Среда разработки SME",
    group: "Редакторы",
    description: "Сценарий проекта, открытый во встроенном редакторе кода движка.",
  },
  {
    file: "SMEReplayView.jpg",
    title: "Просмотр повторов",
    group: "Редакторы",
    description: "Записанная сцена Minecraft в окне просмотра повторов.",
  },
  {
    file: "SMEViewTexture.jpg",
    title: "Просмотр текстур",
    group: "Ресурсы",
    description: "Текстура на пиксельной сетке.",
  },
  {
    file: "SMEViewGLTFModel.jpg",
    title: "Просмотр моделей glTF",
    group: "Ресурсы",
    description: "Модель персонажа в трёхмерном предпросмотре.",
  },
  {
    file: "SMEViewAudio.jpg",
    title: "Просмотр аудио",
    group: "Ресурсы",
    description: "Звуковая волна и элементы управления воспроизведением внутри движка.",
  },
  {
    file: "SMEItemViewVanilla.jpg",
    title: "Просмотр предметов Minecraft",
    group: "Ресурсы",
    description: "Предмет Minecraft и его свойства в окне просмотра.",
  },
  {
    file: "SMEViewItemVanillaAnother.jpg",
    title: "Предпросмотр блока",
    group: "Ресурсы",
    description: "Блок в трёхмерном окне просмотра предметов.",
  },
  {
    file: "SMEViewJSON.jpg",
    title: "Дерево JSON",
    group: "Ресурсы",
    description: "Документ JSON в виде дерева данных.",
  },
  {
    file: "SMEViewJSONAnother.jpg",
    title: "Код JSON",
    group: "Ресурсы",
    description: "Исходный код JSON и панель вывода в рабочем пространстве.",
  },
  {
    file: "SMEViewTXT.jpg",
    title: "Просмотр текста",
    group: "Ресурсы",
    description: "Текстовый файл рядом с браузером проекта и панелью свойств.",
  },
  {
    file: "SMECreateCustomItem.jpg",
    title: "Редактор предметов",
    group: "Контент",
    description: "Предмет в редакторе собственного контента.",
  },
  {
    file: "SMECreateRecipes.jpg",
    title: "Редактор рецептов",
    group: "Контент",
    description: "Рецепт крафта в редакторе рецептов.",
  },
  {
    file: "SMECreateCreativeTabs.jpg",
    title: "Вкладки инвентаря",
    group: "Контент",
    description: "Вкладка творческого инвентаря в редакторе.",
  },
  {
    file: "SMESettings.jpg",
    title: "Настройки движка",
    group: "Рабочее пространство",
    description: "Окно настроек движка.",
  },
  {
    file: "SMEAbout.jpg",
    title: "О StoryModEngine",
    group: "Рабочее пространство",
    description: "Окно «О движке» поверх главного окна редактора.",
  },
  {
    file: "MainMenuGame.jpg",
    title: "Главное меню Minecraft",
    group: "Рабочее пространство",
    description: "Главное меню Minecraft в игре.",
  },
] as const;

export type ProductCapture = (typeof PRODUCT_CAPTURES)[number];
export const productImage = (file: string) => `/product/${file}`;
