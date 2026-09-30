import { form } from "@/data/site";

/**
 * Build the body posted to Web3Forms from the form's own fields.
 *
 * This exists as a separate function because getting it wrong looked exactly
 * like getting it right. The hCaptcha widget renders its own hidden
 * `h-captcha-response` field inside the form, so `new FormData(form)` already
 * carries the token. Appending the token again produced two entries, and
 * Web3Forms answered every such submission with "Could not validate hCaptcha.
 * Please try later" — an error that reads like an outage at their end or an
 * expired token, and sends you looking anywhere but at your own payload.
 *
 * Everything here is `set`, never `append`, so each key appears exactly once
 * whether or not the widget supplied it.
 */
export function submissionBody(fields: FormData, token: string): FormData {
  const body = new FormData();

  for (const [key, value] of fields) {
    body.set(key, value);
  }

  body.set("h-captcha-response", token);
  body.set("access_key", form.key);
  body.set("subject", "Origan enquiry from a college");
  body.set("from_name", "Origan");

  return body;
}
