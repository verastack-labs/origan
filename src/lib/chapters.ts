/**
 * The lesson sidebar's collapsed or expanded state.
 *
 * Kept apart from the sidebar component, which is a client module, so the
 * layout (a server component) can import the plain values. The state lives on
 * `<html data-chapters>`, outside React, and the stylesheet reads it from
 * there. That is what lets an inline script set it before first paint, the
 * same way the theme is applied, so a reader who collapsed the sidebar never
 * sees it open and then snap shut.
 */
export const CHAPTERS_KEY = "origan:rust-dsa:chapters";

/** Inlined into `<head>` and run before first paint. Expanded is the default. */
export const chaptersScript = `try{if(localStorage.getItem(${JSON.stringify(CHAPTERS_KEY)})==="collapsed")document.documentElement.dataset.chapters="collapsed"}catch(e){}`;
