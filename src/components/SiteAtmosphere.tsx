import type { RefObject } from "react";
import { HalftoneFlow } from "@/components/HalftoneFlow";

export function SiteAtmosphere({
  root,
  journey,
}: {
  root: RefObject<HTMLDivElement | null>;
  journey: RefObject<number>;
}) {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <HalftoneFlow paused={false} interactionRoot={root} journey={journey} />
      <div className="site-atmosphere-shade" />
    </div>
  );
}
