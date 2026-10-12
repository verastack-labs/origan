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
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const id = useId();

  const open = useCallback(() => {
    setMounted(true);
    // The widget inside follows the page's theme, read at open rather than at
    // mount, because the reader may have switched since.
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    // The dialog element is always in the page; only its contents wait for
    // the first open. An earlier version mounted the whole dialog on demand
    // and opened it in the next frame, which on a first click ran before
    // React had attached it: the first click did nothing, the second worked.
    const el = dialog.current;
    if (el && !el.open) el.showModal();
  }, []);

  const close = useCallback(() => {
    dialog.current?.close();
  }, []);

  // The page behind must not scroll while the dialog is up, and a click on
  // the backdrop closes it, the way a sheet laid over a drawing is lifted off.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;

    const onClose = () => {
      document.documentElement.style.overflow = "";
    };
    const onClick = (event: MouseEvent) => {
      if (event.target === el) el.close();
    };
    const observer = new MutationObserver(() => {
      document.documentElement.style.overflow = el.open ? "hidden" : "";
    });

    el.addEventListener("close", onClose);
    el.addEventListener("click", onClick);
    observer.observe(el, { attributes: true, attributeFilter: ["open"] });
    return () => {
      el.removeEventListener("close", onClose);
      el.removeEventListener("click", onClick);
      observer.disconnect();
      document.documentElement.style.overflow = "";
    };
  }, []);

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
      {children}

      <dialog
        ref={dialog}
        aria-labelledby={`${id}-title`}
        className="register m-auto w-[min(100%-32px,520px)] rounded-panel border border-line bg-panel p-0 text-fg shadow-none backdrop:bg-ground/70 backdrop:backdrop-blur-[3px]"
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
