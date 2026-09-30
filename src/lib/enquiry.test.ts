import { describe, expect, it } from "vitest";
import { form } from "@/data/site";
import { submissionBody } from "./enquiry";

/** The fields a filled form actually carries, captcha field included. */
function filled(token = "hcaptcha-token"): FormData {
  const fields = new FormData();
  fields.set("name", "A Dean");
  fields.set("role", "Principal");
  fields.set("college", "An Institute of Technology");
  fields.set("email", "dean@example.ac.in");
  fields.set("phone", "");
  fields.set("message", "");
  // hCaptcha renders this itself, inside the form.
  fields.set("h-captcha-response", token);
  return fields;
}

describe("submissionBody", () => {
  it("sends the captcha token exactly once", () => {
    // The bug this file exists for. The widget's own hidden field already put
    // the token in, and appending it again made Web3Forms reject every
    // submission with "Could not validate hCaptcha".
    const body = submissionBody(filled(), "hcaptcha-token");
    expect(body.getAll("h-captcha-response")).toHaveLength(1);
    expect(body.get("h-captcha-response")).toBe("hcaptcha-token");
  });

  it("sends every other key exactly once too", () => {
    const body = submissionBody(filled(), "t");
    for (const key of new Set(body.keys())) {
      expect(body.getAll(key), `${key} is duplicated`).toHaveLength(1);
    }
  });

  it("prefers the verified token over whatever the field held", () => {
    // The component only enables the button once it has a token it saw
    // arrive, so that one wins over a stale value left in the markup.
    const body = submissionBody(filled("stale"), "fresh");
    expect(body.get("h-captcha-response")).toBe("fresh");
  });

  it("carries the fields the reader filled in", () => {
    const body = submissionBody(filled(), "t");
    expect(body.get("name")).toBe("A Dean");
    expect(body.get("college")).toBe("An Institute of Technology");
    expect(body.get("email")).toBe("dean@example.ac.in");
  });

  it("keeps an empty optional field rather than dropping it", () => {
    // Web3Forms renders what it is given. An absent phone is fine; a phone
    // that silently vanishes makes a delivered email hard to read against
    // the form that produced it.
    const body = submissionBody(filled(), "t");
    expect(body.has("phone")).toBe(true);
    expect(body.get("phone")).toBe("");
  });

  it("adds the routing Web3Forms needs", () => {
    const body = submissionBody(filled(), "t");
    expect(body.get("access_key")).toBe(form.key);
    expect(body.get("subject")).toBeTruthy();
    expect(body.get("from_name")).toBe("Origan");
  });

  it("does not mutate the form's own fields", () => {
    const fields = filled();
    submissionBody(fields, "t");
    expect(fields.has("access_key")).toBe(false);
  });
});
