import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { AnimatedText } from "@/components/ui/animated-text";
import { useSiteJourney } from "@/lib/site-journey";
import { useHomeSequence } from "./useHomeSequence";
import { ProductShot } from "./ProductShot";
import { InterfaceCompare } from "./InterfaceCompare";
import { CaptureSet, type CaptureChoice } from "./CaptureSet";
import { SceneSequence } from "./SceneSequence";
import { ScrollShowcase } from "@/components/ui/you-can-scroll";
import { productImage } from "@/lib/product";

const CONTENT: readonly CaptureChoice[] = [
  {
    file: "SMECreateRecipes.jpg",
    title: "Рецепты",
    copy: "Размещай ингредиенты и результат крафта в редакторе рецептов.",
  },
  {
    file: "SMECreateCustomItem.jpg",
    title: "Свои предметы",
    copy: "Создавай предметы и настраивай их свойства в отдельном редакторе.",
  },
  {
    file: "SMECreateCreativeTabs.jpg",
    title: "Вкладки инвентаря",
    copy: "Собирай свои предметы во вкладки творческого инвентаря.",
  },
];
const RESOURCES: readonly CaptureChoice[] = [
  {
    file: "SMEViewTexture.jpg",
    title: "Текстуры",
    copy: "Рассматривай текстуры на пиксельной сетке.",
  },
  {
    file: "SMEViewGLTFModel.jpg",
    title: "Модели",
    copy: "Просматривай модели glTF в трёхмерном окне движка.",
  },
  {
    file: "SMEViewAudio.jpg",
    title: "Аудио",
    copy: "Слушай аудиофайлы и просматривай их звуковую волну.",
  },
  {
    file: "SMEItemViewVanilla.jpg",
    title: "Предметы",
    copy: "Просматривай предметы Minecraft и их свойства.",
  },
  {
    file: "SMEViewItemVanillaAnother.jpg",
    title: "Блоки",
    copy: "Рассматривай блоки в трёхмерном предпросмотре.",
  },
  {
    file: "SMEViewJSON.jpg",
    title: "Дерево JSON",
    copy: "Изучай структуру данных в виде дерева значений.",
  },
  {
    file: "SMEViewJSONAnother.jpg",
    title: "Код JSON",
    copy: "Открывай исходный код JSON и панель вывода прямо в проекте.",
  },
  {
    file: "SMEViewTXT.jpg",
    title: "Текст",
    copy: "Читай текстовые файлы, не выходя из проекта.",
  },
];

const RESOURCE_STEPS = RESOURCES.map((resource) => ({
  title: resource.title,
  description: resource.copy,
  href: productImage(resource.file),
  content: <ProductShot file={resource.file} caption={false} eager />,
}));

export function HomeExperience() {
  const page = useRef<HTMLDivElement>(null);
  const fallbackJourney = useRef(0);
  const journey = useSiteJourney() ?? fallbackJourney;
  useHomeSequence(page, journey);
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div ref={page} className="creation-home">
          <section
            className="home-chapter opening-chapter"
            id="overview-scene"
            data-home-slide="1"
            aria-labelledby="home-heading"
          >
            <div className="sequence-width opening-composition">
              <div className="opening-masthead">
                <h1 id="home-heading" className="opening-title">
                  <span className="opening-word">
                    <span className="opening-word-core">
                      <AnimatedText text="StoryMod" />
                    </span>
                  </span>
                  <span className="opening-word opening-engine">
                    <span className="opening-word-core">
                      <AnimatedText text="Engine" />
                    </span>
                  </span>
                </h1>
              </div>
              <div className="opening-description">
                <p className="opening-statement">
                  <span className="opening-line">
                    <span>Игровой движок внутри Minecraft.</span>
                  </span>
                </p>
              </div>
              <div className="opening-actions">
                <div className="opening-actions-inner">
                  <span className="opening-action-reveal">
                    <Link to="/download" className="action-button">
                      Скачать <ArrowDown size={19} aria-hidden="true" />
                    </Link>
                  </span>
                  <span className="opening-action-reveal">
                    <Link to="/docs" className="editorial-link">
                      Документация <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section
            className="home-chapter world-chapter"
            id="world"
            data-home-slide="2"
            aria-labelledby="world-heading"
          >
            <div className="sequence-width world-heading chapter-heading">
              <h2 id="world-heading">
                Minecraft,
                <br />
                <AnimatedText text="в режиме редактора." />
              </h2>
              <p>
                Игровой мир, управление сценой и ресурсы проекта — в одном рабочем пространстве.
              </p>
            </div>
            <ProductShot
              file="MainViewportEngine.jpg"
              className="world-screen"
              caption={false}
              eager
            />
          </section>

          <section
            className="home-chapter cast-chapter"
            id="characters"
            data-home-slide="3"
            aria-labelledby="cast-heading"
          >
            <div className="sequence-width cast-composition">
              <div className="cast-copy">
                <h2 id="cast-heading">
                  Создавай
                  <br />
                  <AnimatedText text="персонажей." />
                </h2>
                <p>
                  Внешность, свойства и поведение персонажа — всё настраивается в редакторе NPC.
                </p>
                <ul>
                  <li>Внешность</li>
                  <li>Атрибуты</li>
                  <li>Поведение</li>
                  <li>Инвентарь</li>
                </ul>
                <Link
                  to="/docs/$"
                  params={{ _splat: "latest/editors/npc-editor" }}
                  className="editorial-link"
                >
                  О редакторе NPC <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <ProductShot
                file="SMECreateNPC.jpg"
                className="cast-screen"
                caption={false}
                description="Предпросмотр персонажа в редакторе NPC StoryModEngine"
              />
            </div>
          </section>

          <SceneSequence />

          <section
            className="home-chapter interface-chapter"
            id="interface"
            data-home-slide="5"
            aria-labelledby="interface-heading"
          >
            <div className="sequence-width">
              <div className="chapter-heading interface-heading">
                <h2 id="interface-heading">
                  Создавай
                  <br />
                  <AnimatedText text="интерфейсы." />
                </h2>
                <p>
                  Панели, изображения, текст и кнопки в редакторе интерфейсов. Сравни результат в
                  редакторе и в самой игре.
                </p>
              </div>
              <InterfaceCompare />
            </div>
          </section>

          <section
            className="home-chapter content-chapter"
            id="content"
            data-home-slide="6"
            aria-labelledby="content-heading"
          >
            <div className="sequence-width">
              <h2 id="content-heading" className="content-title">
                Предметы. Рецепты.
                <br />
                <AnimatedText text="Вкладки инвентаря." />
              </h2>
              <CaptureSet choices={CONTENT} label="Редакторы контента Minecraft" layout="content" />
            </div>
          </section>

          <section
            className="home-chapter resources-chapter"
            id="resources"
            data-home-slide="7"
            aria-labelledby="resources-heading"
          >
            <ScrollShowcase
              prefix="Ресурсы проекта"
              headingId="resources-heading"
              items={RESOURCE_STEPS}
            />
          </section>

          <section
            className="home-chapter script-chapter"
            id="scripting"
            data-home-slide="8"
            aria-labelledby="script-heading"
          >
            <ProductShot file="SME_IDE.jpg" className="script-screen" caption={false} />
            <div className="sequence-width script-description">
              <h2 id="script-heading">
                <AnimatedText text="SME Scripting." />
              </h2>
              <div>
                <p>
                  Пиши сценарии, которые связывают твой контент, во встроенной среде разработки
                  движка.
                </p>
                <Link
                  to="/docs/$"
                  params={{ _splat: "latest/sme-scripting/overview" }}
                  className="editorial-link"
                >
                  О языке сценариев <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
