"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { form as endpoint } from "@/data/site";
import { interest } from "@/data/content";
import { submissionBody } from "@/lib/enquiry";
import { actionClass } from "./action";
import { BenchmarkMark } from "./benchmark-mark";

/**
 * The interest list: three fields in a dialog, reachable from every call to
 * action on the site.
 *
 * The full enquiry form at the foot of each page asks for a conversation and
 * takes six fields. Most readers are not ready for that on a first visit, and
 * a dean who wants to be kept in the loop should not have to write a message
 * to say so. This asks for an email, a college and a city, and nothing else.
 *
 * Built on the native `<dialog>`, which gives focus trapping, Escape to close,
 * and a backdrop without a library. It is opened through context so a button
 * anywhere in the tree, including the sticky header, can raise the one
 * instance mounted in the layout.
 */
const HCaptcha = dynamic(() => import("@hcaptcha/react-hcaptcha"), { ssr: false });

const Ctx = createContext<() => void>(() => {});

type State = "idle" | "sending" | "sent" | "error";

const control =
  "w-full rounded-control border border-line bg-ground px-3.5 py-3 text-[15.5px] text-fg transition-colors placeholder:text-fg-3 focus:border-survey-2 disabled:opacity-60";

export function InterestProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const id = useId();

  // Where focus was when the dialog opened, so closing hands it back.
  const opener = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    opener.current = document.activeElement as HTMLElement | null;
    setMounted(true);
    // The widget inside follows the page's theme, read at open rather than at
    // mount, because the reader may have switched since.
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    opener.current?.focus?.();
  }, []);

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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending" || !token) return;

    setState("sending");
    setError("");

    const data = submissionBody(new FormData(event.currentTarget), token, interest.subject);

    try {
      const response = await fetch(endpoint.endpoint, { method: "POST", body: data });
      const body = await response.json();
      if (!response.ok || !body.success) {
        throw new Error(body.message || `Request failed with ${response.status}`);
      }
      setState("sent");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unknown error");
      setState("error");
      setCaptchaKey((n) => n + 1);
      setToken("");
    }
  }

  return (
    <Ctx.Provider value={open}>
      {/* The page, made inert while the dialog is up. A wrapper rather than
          <body>, because hCaptcha attaches its challenge popup to <body>, and
          an inert body would leave the challenge unclickable. `contents` so
          the wrapper adds no box and the sticky header still sticks. */}
      <div className="contents" inert={isOpen || undefined}>
        {children}
      </div>

      {/* Not a native modal. `showModal()` lifts a dialog into the browser's
          top layer, above everything, and makes the rest of the document
          inert: the hCaptcha challenge, appended to <body>, then opened
          underneath the dialog and could not be clicked. Positioned here at a
          z-index below hCaptcha's own, the challenge sits on top as it should. */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={close}
          className="register-backdrop fixed inset-0 z-[60] bg-ground/70 backdrop-blur-[3px]"
        />
      )}
      <dialog
        open={isOpen}
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="register fixed inset-0 z-[61] m-auto h-fit max-h-[calc(100dvh-32px)] w-[min(100%-32px,520px)] overflow-y-auto rounded-panel border border-line bg-panel p-0 text-fg"
      >
        {/* Contents, and with them the captcha script, load on first open. */}
        {mounted && (
          <>
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
            <span className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-2">
              <span className="text-survey">
                <BenchmarkMark size={13} />
              </span>
              {interest.notation}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="inline-flex h-8 w-8 items-center justify-center rounded-control border border-line text-fg-2 transition-colors hover:border-survey-2 hover:text-fg"
            >
              <X size={14} strokeWidth={1.9} aria-hidden="true" />
            </button>
          </div>

          <div className="px-[clamp(20px,4vw,32px)] pb-[clamp(22px,4vw,32px)] pt-6">
            {state === "sent" ? (
              <div role="status">
                <h2 id={`${id}-title`} className="text-[clamp(22px,3vw,28px)] font-bold tracking-[-0.03em]">
                  {interest.sentHeading}
                </h2>
                <p className="mt-3 text-[16px] text-fg-2">{interest.sent}</p>
                <button type="button" onClick={close} className={`${actionClass("secondary")} mt-6`}>
                  {interest.done}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <h2 id={`${id}-title`} className="text-[clamp(22px,3vw,28px)] font-bold tracking-[-0.03em]">
                  {interest.heading}
                </h2>
                <p className="mt-2.5 text-[15.5px] text-fg-2">{interest.body}</p>

                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="mt-6 grid gap-4">
                  {interest.fields.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={`${id}-${field.name}`}
                        className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.11em] text-fg-3"
                      >
                        {field.label}
                      </label>
                      <input
                        id={`${id}-${field.name}`}
                        name={field.name}
                        type={field.type ?? "text"}
                        required
                        // The first field takes focus when the dialog opens, so a
                        // reader can start typing rather than tabbing past Close.
                        autoFocus={field.name === "email"}
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete}
                        disabled={state === "sending"}
                        className={control}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-5 min-h-[78px]">
                  <HCaptcha
                    key={captchaKey}
                    sitekey={endpoint.captchaSiteKey}
                    reCaptchaCompat={false}
                    theme={theme}
                    onVerify={setToken}
                    onExpire={() => setToken("")}
                    onError={() => setToken("")}
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <button
                    type="submit"
                    disabled={state === "sending" || !token}
                    className={`${actionClass("primary")} disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-line disabled:text-fg-3`}
                  >
                    {state === "sending" ? interest.sending : interest.submit}
                  </button>
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-3">
                    {token ? interest.assurance : interest.awaitingCaptcha}
                  </p>
                </div>

                {state === "error" && (
                  <div
                    role="alert"
                    className="mt-4 rounded-panel border border-warn/45 bg-ground p-4 text-[14.5px] text-fg-2"
                  >
                    {interest.failed}{" "}
                    <a href={`mailto:${interest.fallbackEmail}`} className="text-survey underline">
                      {interest.fallbackEmail}
                    </a>
                    <span className="mt-1.5 block font-mono text-[10.5px] text-fg-3">{error}</span>
                  </div>
                )}
              </form>
            )}
          </div>
          </>
        )}
      </dialog>
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
    <button type="button" onClick={open} className={`${actionClass(tone)} ${className}`}>
      {children ?? interest.cta}
    </button>
  );
}
