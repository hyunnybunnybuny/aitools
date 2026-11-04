/**
 * Host half of dsh-deepseek-web.
 *
 * All behavior lives in the browser half (`lib/client.js`): the right-sidebar
 * tab, its Electron webview, the login-session backup, and the selection to
 * Markdown copy. The Loader still needs a host plugin body so the package can
 * be composed as a normal entry.
 */

/** Host plugin body — no host-side behavior. */
export function apply() {}
