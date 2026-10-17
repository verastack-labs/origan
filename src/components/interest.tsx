"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { interest, studentReferral } from "@/data/content";
import { actionClass } from "./action";
import { FormDialog } from "./form-dialog";

/**
 * The two dialog forms, reachable from calls to action across the site: the
 * interest list (three fields) and the student referral.
 *
 * The full enquiry form at the foot of each page asks for a conversation and
 * takes six fields. Most readers are not ready for that on a first visit, and
 * a dean who wants to be kept in the loop should not have to write a message
 * to say so. The interest list asks for an email, a college and a city, and
 * nothing else.
 *
 * Built on the native `<dialog>`, which gives focus trapping, Escape to close,
 * and a backdrop without a library. Opened through context so a button
 * anywhere in the tree, including the sticky header, can raise the instance
 * mounted in the layout. Only one is open at a time, so this owns the shared
 * behaviour: Escape, the scroll lock, the inert page, and handing focus back
 * to whatever opened it.
 */
type Kind = "interest" | "referral";

const Ctx = createContext<(kind: Kind) => void>(() => {});

export function InterestProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Kind | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Where focus was when the dialog opened, so closing hands it back.
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((kind: Kind) => {
    opener.current = document.activeElement as HTMLElement | null;
    // The widget inside follows the page's theme, read at open rather than at
    // mount, because the reader may have switched since.
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    setActive(kind);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    opener.current?.focus?.();
  }, []);

  const isOpen = active !== null;

  // Escape closes it, and the page behind must not scroll while it is up.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <Ctx.Provider value={open}>
      {/* The page, made inert while a dialog is up. A wrapper rather than
          <body>, because hCaptcha attaches its challenge popup to <body>, and
          an inert body would leave the challenge unclickable. `contents` so
          the wrapper adds no box and the sticky header still sticks. */}
      <div className="contents" inert={isOpen || undefined}>
        {children}
      </div>

      <FormDialog copy={interest} isOpen={active === "interest"} theme={theme} onClose={close} />
      <FormDialog copy={studentReferral} isOpen={active === "referral"} theme={theme} onClose={close} />
    </Ctx.Provider>
  );
}

/** A call to action that raises the interest dialog. Styled like `Action`. */
export function InterestButton({
  tone = "primary",
  className = "",
  children,
}: {
  tone?: "primary" | "secondary" | "nav";
  className?: string;
  children?: ReactNode;
}) {
  const open = useContext(Ctx);
  return (
    <button type="button" onClick={() => open("interest")} className={`${actionClass(tone)} ${className}`}>
      {children ?? interest.cta}
    </button>
  );
}

/** Raises the student referral dialog. A button, or a quiet text link in the footer. */
export function ReferralButton({
  tone = "secondary",
  className = "",
  children,
}: {
  tone?: "secondary" | "link";
  className?: string;
  children?: ReactNode;
}) {
  const open = useContext(Ctx);
  const classes =
    tone === "link"
      ? "text-left text-[13.5px] text-fg-2 underline decoration-line decoration-1 underline-offset-4 transition-colors hover:text-survey hover:decoration-survey-2"
      : actionClass("secondary");
  return (
    <button type="button" onClick={() => open("referral")} className={`${classes} ${className}`}>
      {children ?? studentReferral.cta}
    </button>
  );
}
