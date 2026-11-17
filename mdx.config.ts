import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { rehypeCallouts } from "./src/lib/rehype-callouts";

export function docsMdx() {
  const plugin = mdx({
    remarkPlugins: [remarkFrontmatter, remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeCallouts, [rehypeHighlight, { detect: false }]],
  });
  const transform = plugin.transform as (this: unknown, code: string, id: string) => unknown;
  return {
    ...plugin,
    enforce: "pre" as const,
    transform(this: unknown, code: string, id: string) {
      if (id.includes("?")) return null;
      return transform.call(this, code, id);
    },
  };
}
