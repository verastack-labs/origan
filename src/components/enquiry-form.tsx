"use client";

import { useId, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { form as endpoint } from "@/data/site";
import { submissionBody } from "@/lib/enquiry";
import { enquiry } from "@/data/content";

type State = "idle" | "sending" | "sent" | "error";

const control =
  "w-full rounded-control border border-line bg-ground px-3.5 py-3 text-[15.5px] text-fg transition-colors placeholder:text-fg-3 focus:border-survey-2 disabled:opacity-60";

/**
 * The one place on this site that asks the reader for something.
 *
 * Submitted over fetch rather than as a native POST, so a dean who fills this
 * in stays on the page they were reading instead of being handed a third
 * party's thank-you screen. The static export has no server, which is the
 * whole reason the endpoint is external.
 *
 * Fields are deliberately few. This is a relationship sale: the form's job is
 * to start a conversation, not to qualify a lead, and every extra required
 * field is a reason to close the tab.
 */
export function EnquiryForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const captcha = useRef<HCaptcha>(null);
  const id = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending" || !token) return;

    setState("sending");
    setError("");

    const data = submissionBody(new FormData(event.currentTarget), token);

    try {
      const response = await fetch(endpoint.endpoint, { method: "POST", body: data });
      const body = await response.json();

      if (!response.ok || !body.success) {
        throw new Error(body.message || `Request failed with ${response.status}`);
      }
      setState("sent");
    } catch (cause) {
      // The reader is not owed the exception, but they are owed a way through:
      // the message below gives them the address to write to directly.
      setError(cause instanceof Error ? cause.message : "Unknown error");
      setState("error");
      // A token is single use. Without this reset, a second attempt after any
      // failure is rejected as a replay and the reader is stuck in a loop.
      captcha.current?.resetCaptcha();
      setToken("");
    }
  }

  if (state === "sent") {
    return (
      <div
        className="mt-7 max-w-[560px] rounded-panel border border-survey-2 bg-panel p-[clamp(22px,3vw,34px)]"
        role="status"
      >
        <p className="notation">Received</p>
        <p className="mt-3 text-[17px] text-fg">{enquiry.sent}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 max-w-[560px]" noValidate={false}>
      {/* Web3Forms drops any submission that fills this in. It is hidden from
          sight and from assistive technology, so only a script finds it. */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-[18px] sm:grid-cols-2">
        {enquiry.fields.map((field) => (
          <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
            <label
              htmlFor={`${id}-${field.name}`}
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.11em] text-fg-3"
            >
              {field.label}
              {!field.required && <span className="text-fg-3"> (optional)</span>}
            </label>

            {field.lines ? (
              <textarea
                id={`${id}-${field.name}`}
                name={field.name}
                rows={field.lines}
                required={field.required}
                placeholder={field.placeholder}
                disabled={state === "sending"}
                className={control}
              />
            ) : (
              <input
                id={`${id}-${field.name}`}
                name={field.name}
                type={field.type ?? "text"}
                required={field.required}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                disabled={state === "sending"}
                className={control}
              />
            )}
          </div>
        ))}
      </div>

      {/* hCaptcha. Web3Forms verifies the token server side, so this is the
          check that actually protects the inbox; the honeypot above only
          catches the laziest scripts. The widget is rendered rather than
          script-injected so React owns when it mounts and resets. */}
      <div className="mt-6">
        <HCaptcha
          ref={captcha}
          sitekey={endpoint.captchaSiteKey}
          reCaptchaCompat={false}
          theme="dark"
          onVerify={setToken}
          onExpire={() => setToken("")}
          onError={() => setToken("")}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit"
          disabled={state === "sending" || !token}
          className="inline-flex items-center gap-2.5 rounded-control bg-survey px-[22px] py-[13px] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-survey-ink transition-[background-color,transform] duration-200 ease-survey hover:-translate-y-px hover:bg-survey/85 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-line disabled:text-fg-3"
        >
          {state === "sending" ? enquiry.sending : enquiry.submit}
        </button>

        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-3">
          {token ? enquiry.assurance : enquiry.awaitingCaptcha}
        </p>
      </div>

      {/* Polite rather than assertive: it should not interrupt someone still
          correcting a field above it. */}
      <p aria-live="polite" className="sr-only">
        {state === "sending" ? enquiry.sending : ""}
      </p>

      {state === "error" && (
        <div
          role="alert"
          className="mt-5 rounded-panel border border-warn/45 bg-panel p-[18px] text-[15px] text-fg-2"
        >
          {enquiry.failed}{" "}
          <a href={`mailto:${enquiry.fallbackEmail}`} className="text-survey underline">
            {enquiry.fallbackEmail}
          </a>
          <span className="mt-2 block font-mono text-[10.5px] text-fg-3">{error}</span>
        </div>
      )}
    </form>
  );
}
