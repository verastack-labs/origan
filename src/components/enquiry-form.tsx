"use client";

import { useId, useState } from "react";
import dynamic from "next/dynamic";
import { form as endpoint } from "@/data/site";
import { submissionBody } from "@/lib/enquiry";
import { enquiry } from "@/data/content";

type State = "idle" | "sending" | "sent" | "error";

/**
 * Loaded only once a reader touches the form.
 *
 * hCaptcha costs about 64KB of wrapper plus its own third-party script and an
 * iframe, and it was being paid on every page load by every visitor, almost
 * none of whom ever fill this in. Deferring it is the single biggest thing on
 * this site's mobile performance. `ssr: false` because it cannot render on a
 * server that does not exist in a static export anyway.
 */
const HCaptcha = dynamic(() => import("@hcaptcha/react-hcaptcha"), { ssr: false });

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
  /**
   * The reader has engaged with the form, so the captcha is now worth its
   * weight. Set on first focus rather than on submit: the widget needs to be
   * mounted and solved before the button can enable, so waiting until they
   * press it would strand them.
   */
  const [engaged, setEngaged] = useState(false);
  /**
   * Bumped to remount the widget after a failed send. A token is single use,
   * so without a fresh one the second attempt is rejected as a replay and the
   * reader is stuck in a loop. Remounting is what the widget's own reset does,
   * and it needs no ref, which `next/dynamic` does not forward cleanly anyway.
   */
  const [captchaKey, setCaptchaKey] = useState(0);
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
      setCaptchaKey((n) => n + 1);
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
    <form
      onSubmit={onSubmit}
      className="mt-7 max-w-[560px]"
      noValidate={false}
      onFocusCapture={() => setEngaged(true)}
      onPointerDownCapture={() => setEngaged(true)}
    >
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
          script-injected so React owns when it mounts and resets.

          The box keeps its height whether or not the widget has loaded, so
          arriving at the form does not shift the button out from under a
          thumb that was already reaching for it. */}
      <div className="mt-6 min-h-[78px]">
        {engaged ? (
          <HCaptcha
            key={captchaKey}
            sitekey={endpoint.captchaSiteKey}
            reCaptchaCompat={false}
            theme="dark"
            onVerify={setToken}
            onExpire={() => setToken("")}
            onError={() => setToken("")}
          />
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-3">
            {enquiry.captchaPending}
          </p>
        )}
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
