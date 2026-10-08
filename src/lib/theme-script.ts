/* Sin "use client": el layout (servidor) necesita el texto del script. */

export const THEME_KEY = "soltura-theme";

/** Se ejecuta en <head> antes de pintar: evita el parpadeo de tema */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
