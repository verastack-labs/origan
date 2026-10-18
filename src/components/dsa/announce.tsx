"use client";

import { createContext, useContext } from "react";

/**
 * How an article tells the chapters shell, which stays mounted, that a new
 * one has arrived, so the shell's polite live region can say its title.
 */
export const AnnounceContext = createContext<(text: string) => void>(() => {});

export const useAnnounce = () => useContext(AnnounceContext);
