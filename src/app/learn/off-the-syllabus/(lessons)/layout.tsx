import type { ReactNode } from "react";
import { ArticlesShell } from "@/components/dsa/ots-pages";

// The chapters sidebar lives here, above `[slug]`, so it is not rebuilt when
// the reader moves from one article to the next.
export default function ArticlesLayout({ children }: { children: ReactNode }) {
  return <ArticlesShell>{children}</ArticlesShell>;
}
