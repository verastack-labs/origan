"use client";

import dynamic from "next/dynamic";
import { useId, useState } from "react";
import { X } from "lucide-react";
import { form as endpoint } from "@/data/site";
import { isContact } from "@/lib/contact";
import { submissionBody } from "@/lib/enquiry";
import { actionClass } from "./action";
import { BenchmarkMark } from "./benchmark-mark";
import { accented } from "./heading-pair";

/**
 * One dialog form, driven by a block of copy from `content.ts`. The interest
 * list and the student referral are the same machine with different fields:
 * the native `<dialog>`, the hCaptcha, Web3Forms through `submissionBody`, and
 * the same idle / sending / sent / error states.
 *
 * Opening, closing, focus return, Escape and the inert page behind all belong
 * to the provider in `interest.tsx`, which mounts one of these per form.
 */
const HCaptcha = dynamic(() => import("@hcaptcha/react-hcaptcha"), { ssr: false });

type State = "idle" | "sending" | "sent" | "error";

export type DialogField = {
  readonly name: string;
  readonly label: string;
  readonly type?: string;
  readonly placeholder?: string;
  readonly autoComplete?: string;
  /** Required unless this says otherwise. */
  readonly required?: boolean;
  /** Takes an email or a phone number, checked loosely. */
  readonly contact?: boolean;
  /** Two lines rather than one, for a placeholder too long for a phone. */
  readonly multiline?: boolean;
};

export type DialogCopy = {
  readonly notation: string;
  readonly heading: string;
  readonly sub: string;
  readonly subject: string;
  readonly fields: readonly DialogField[];
  readonly contactInvalid?: string;
  readonly submit: string;
  readonly sending: string;
  readonly sentHeading: string;
  readonly sent: string;
  readonly done: string;
  readonly assurance: string;
  readonly awaitingCaptcha: string;
  readonly failed: string;
  readonly fallbackEmail: string;
};

const control =
  "w-full rounded-control border border-line bg-ground px-3.5 py-3 text-[15.5px] text-fg transition-colors placeholder:text-fg-3 focus:border-survey-2 disabled:opacity-60";

export function FormDialog({
  copy,
  isOpen,
  theme,
  onClose,
}: {
  copy: DialogCopy;
  isOpen: boolean;
  theme: "light" | "dark";
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const id = useId();

  // Contents, and with them the captcha script, load on first open.
  if (isOpen && !mounted) setMounted(true);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending" || !token) return;

    setState("sending");
    setError("");

    const data = submissionBody(new FormData(event.currentTarget), token, copy.subject);

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
    <>
      {/* Not a native modal. `showModal()` lifts a dialog into the browser's
          top layer, above everything, and makes the rest of the document
          inert: the hCaptcha challenge, appended to <body>, then opened
          underneath the dialog and could not be clicked. Positioned here at a
          z-index below hCaptcha's own, the challenge sits on top as it should. */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="register-backdrop fixed inset-0 z-[60] bg-ground/70 backdrop-blur-[3px]"
        />
      )}
      <dialog
        open={isOpen}
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="register fixed inset-0 z-[61] m-auto h-fit max-h-[calc(100dvh-32px)] w-[min(100%-32px,520px)] overflow-y-auto rounded-panel border border-line bg-panel p-0 text-fg"
      >
        {mounted && (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
              <span className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-2">
                <span className="text-survey">
                  <BenchmarkMark size={13} />
                </span>
                {copy.notation}
              </span>
              <button
                type="button"
                onClick={onClose}
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
                    {copy.sentHeading}
                  </h2>
                  <p className="mt-3 text-[16px] text-fg-2">{copy.sent}</p>
                  <button type="button" onClick={onClose} className={`${actionClass("secondary")} mt-6`}>
                    {copy.done}
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  <h2 id={`${id}-title`} className="text-[clamp(22px,3vw,28px)] font-bold tracking-[-0.03em]">
                    {accented(copy.heading)}
                  </h2>
                  <p className="mt-2.5 text-[15.5px] text-fg-2">{copy.sub}</p>

                  <input
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <div className="mt-6 grid gap-4">
                    {copy.fields.map((field, index) => {
                      const required = field.required !== false;
                      return (
                        <div key={field.name}>
                          <label
                            htmlFor={`${id}-${field.name}`}
                            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.11em] text-fg-3"
                          >
                            {field.label}
                            {!required && <span className="normal-case tracking-normal"> (optional)</span>}
                          </label>
                          {field.multiline ? (
                            <textarea
                              id={`${id}-${field.name}`}
                              name={field.name}
                              rows={2}
                              required={required}
                              placeholder={field.placeholder}
                              autoComplete={field.autoComplete}
                              disabled={state === "sending"}
                              className={`${control} resize-none`}
                            />
                          ) : (
                          <input
                            id={`${id}-${field.name}`}
                            name={field.name}
                            type={field.type ?? "text"}
                            required={required}
                            // The first field takes focus when the dialog opens, so a
                            // reader can start typing rather than tabbing past Close.
                            autoFocus={index === 0}
                            placeholder={field.placeholder}
                            autoComplete={field.autoComplete}
                            disabled={state === "sending"}
                            onChange={
                              field.contact
                                ? (e) => {
                                    const input = e.currentTarget;
                                    input.setCustomValidity(
                                      input.value === "" || isContact(input.value)
                                        ? ""
                                        : (copy.contactInvalid ?? "Enter an email address or a phone number."),
                                    );
                                  }
                                : undefined
                            }
                            className={control}
                          />
                          )}
                        </div>
                      );
                    })}
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
                      {state === "sending" ? copy.sending : copy.submit}
                    </button>
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-3">
                      {token ? copy.assurance : copy.awaitingCaptcha}
                    </p>
                  </div>

                  {state === "error" && (
                    <div
                      role="alert"
                      className="mt-4 rounded-panel border border-warn/45 bg-ground p-4 text-[14.5px] text-fg-2"
                    >
                      {copy.failed}{" "}
                      <a href={`mailto:${copy.fallbackEmail}`} className="text-survey underline">
                        {copy.fallbackEmail}
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
    </>
  );
}
