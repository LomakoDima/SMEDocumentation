import { createContext, useContext, type RefObject } from "react";

export const SiteJourney = createContext<RefObject<number> | null>(null);
export const useSiteJourney = () => useContext(SiteJourney);
