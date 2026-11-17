type HNode = { type: string; value?: string; tagName?: string; properties?: Record<string, unknown>; children?: HNode[] };

export const CALLOUT_TYPES = ["note", "tip", "warning", "pending"] as const;
export type CalloutType = (typeof CALLOUT_TYPES)[number];

export function rehypeCallouts() {
  return (tree: HNode) => {
    const walk = (n: HNode) => {
      if (n.type === "element" && n.tagName === "blockquote") {
        const p = n.children?.find((c) => c.type === "element" && c.tagName === "p");
        const t = p?.children?.[0];
        const m = t?.type === "text" ? t.value?.match(/^\[!(NOTE|TIP|WARNING|PENDING)\]\s*/i) : null;
        if (t && m) {
          n.properties = { ...n.properties, dataCallout: (m[1] ?? "note").toLowerCase() };
          t.value = t.value!.slice(m[0].length);
        }
      }
      n.children?.forEach(walk);
    };
    walk(tree);
  };
}
