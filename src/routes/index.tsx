import { createFileRoute } from "@tanstack/react-router";
import { HomeExperience } from "@/components/home/HomeExperience";
import homeCss from "@/components/home/home.css?url";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "stylesheet", href: homeCss }],
    meta: [
      { title: "StoryModEngine — игровой движок внутри Minecraft 1.20.1" },
      {
        name: "description",
        content:
          "StoryModEngine — движок внутри Minecraft Java Edition 1.20.1: редакторы сцен, персонажей и эффектов, а также язык сценариев SME Scripting.",
      },
      { property: "og:title", content: "StoryModEngine" },
      {
        property: "og:description",
        content:
          "Редактирование сцен, персонажи, визуальные эффекты и сценарии внутри Minecraft Java Edition 1.20.1.",
      },
    ],
  }),
  component: HomeExperience,
});
