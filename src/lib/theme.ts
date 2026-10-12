/**
 * Shared between the toggle and the layout. Kept out of the toggle's module
 * because that one is a client module, and a plain value imported from a
 * client module into a server component arrives as a reference, not a string.
 */
export const THEME_KEY = "origan-theme";

/** Inlined into `<head>` and run before first paint. */
export const themeScript = `try{if(localStorage.getItem(${JSON.stringify(THEME_KEY)})==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;
