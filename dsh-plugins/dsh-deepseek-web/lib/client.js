window.__ModuleLoader__.load({
	id: "dsh-deepseek-web",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const React = require("react");
		const h = React.createElement;

		/** Implementation identity: also the tab type id and slot key. */
		const PLUGIN_ID = "dsh-deepseek-web";
		/** Left-sidebar global panel id; also the key of its main-area page. */
		const PANEL_ID = "dsh-deepseek-web";
		/** Page tab kind opened from the right Sidebar guide. */
		const TAB_KIND = "deepseek-web";
		/** The only page this plugin hosts. */
		const CHAT_URL = "https://chat.deepseek.com/";
		/** Main-process guest lease storage account (process-lifetime partition). */
		const WORKSPACE_KEY = "dsh-deepseek-web";
		/** App-origin backup of the webview's login session. */
		const BACKUP_KEY = "dsh.deepseek-web.session.v1";
		/** Injected stylesheet element id. */
		const STYLE_ID = "dsh-deepseek-web-css";

		/** Locally stored token probe; DeepSeek keeps its session in localStorage. */
		const TOKEN_SCRIPT =
			'(() => { try { const raw = localStorage.getItem("userToken"); if (!raw) return false; let token = raw; try { const parsed = JSON.parse(raw); token = typeof parsed === "string" ? parsed : parsed && parsed.value; } catch (error) {} if (typeof token !== "string" || token.length < 20 || /^(null|undefined)$/i.test(token)) return false; if (location.pathname.indexOf("/sign_in") === 0) return false; return true; } catch (error) { return false; } })()';

		/** Read every small localStorage value, keeping auth-like keys first. */
		const SNAPSHOT_SCRIPT = `(() => {
			try {
				if (location.origin !== "https://chat.deepseek.com") return null;
				const ls = {};
				let total = 0;
				const important = [];
				const rest = [];
				for (let i = 0; i < localStorage.length; i++) {
					const key = localStorage.key(i);
					if (typeof key !== "string") continue;
					if (/token|auth|user|login|account|session/i.test(key)) important.push(key);
					else rest.push(key);
				}
				const take = (key) => {
					try {
						const value = localStorage.getItem(key);
						if (value == null || value.length > 262144) return;
						if (total + key.length + value.length > 2097152) return;
						ls[key] = value;
						total += key.length + value.length;
					} catch (error) {}
				};
				important.forEach(take);
				rest.forEach(take);
				const cookies = [];
				try {
					const parts = document.cookie ? document.cookie.split("; ") : [];
					for (const part of parts) {
						const at = part.indexOf("=");
						if (at > 0) cookies.push([part.slice(0, at), part.slice(at + 1)]);
					}
				} catch (error) {}
				return { v: 1, origin: location.origin, href: location.href, ls: ls, cookies: cookies, at: Date.now() };
			} catch (error) {
				return null;
			}
		})()`;

		/** Remember the last non-collapsed guest selection so a toolbar click survives focus changes. */
		const SELECTION_CAPTURE_SCRIPT = `(() => {
			try {
				if (window.__dshDeepSeekSelection) return true;
				const state = { range: null };
				window.__dshDeepSeekSelection = state;
				const remember = () => {
					try {
						const selection = window.getSelection();
						if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
							state.range = selection.getRangeAt(0).cloneRange();
						}
					} catch (error) {}
				};
				document.addEventListener("selectionchange", remember, true);
				document.addEventListener("mouseup", remember, true);
				document.addEventListener("keyup", remember, true);
				return true;
			} catch (error) {
				return false;
			}
		})()`;

		/** Return the selected fragment as HTML plus plain text. */
		const COPY_SELECTION_SCRIPT = `(() => {
			try {
				let range = null;
				const selection = window.getSelection();
				if (selection && !selection.isCollapsed && selection.rangeCount > 0) range = selection.getRangeAt(0);
				const remembered = window.__dshDeepSeekSelection;
				if (!range && remembered && remembered.range) range = remembered.range;
				if (!range) return null;
				const holder = document.createElement("div");
				holder.appendChild(range.cloneContents());
				const html = holder.innerHTML;
				const text = holder.textContent || "";
				if (!html.trim() && !text.trim()) return null;
				return { html: html, text: text };
			} catch (error) {
				return null;
			}
		})()`;

		const CSS = `
.dsh-dsw-root{position:relative;display:flex;flex-direction:column;height:100%;min-height:0;color:var(--dsw-alias-label-primary,#1f1f1f);background:var(--dsw-alias-bg-base,#fff);font:var(--dsw-font-xs-13,13px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif)}
.dsh-dsw-toolbar{display:flex;align-items:center;gap:8px;flex:none;padding:6px 8px;border-bottom:.5px solid var(--dsw-alias-border-l3,rgba(0,0,0,.12));flex-wrap:wrap}
.dsh-dsw-brand{display:inline-flex;align-items:center;gap:6px;font-weight:600;white-space:nowrap;min-width:0}
.dsh-dsw-brand svg{flex:none;color:var(--dsw-alias-state-business-primary,#4d6bfe)}
.dsh-dsw-brand span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-dsw-pill{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--dsw-alias-label-secondary,#666);background:var(--dsw-alias-bg-layer-1,#f5f5f5);border-radius:999px;padding:2px 8px;white-space:nowrap;max-width:220px;overflow:hidden;text-overflow:ellipsis}
.dsh-dsw-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-label-tertiary,#999);flex:none}
.dsh-dsw-dot.on{background:var(--dsw-alias-state-success-primary,#22a06b)}
.dsh-dsw-dot.off{background:var(--dsw-alias-state-warn-primary,#e0a100)}
.dsh-dsw-actions{margin-left:auto;display:flex;gap:4px;flex-wrap:wrap}
.dsh-dsw-btn{appearance:none;border:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));background:var(--dsw-alias-bg-layer-1,#f7f7f8);color:var(--dsw-alias-label-primary,#1f1f1f);border-radius:6px;padding:3px 8px;font-size:11px;line-height:18px;cursor:pointer;white-space:nowrap}
.dsh-dsw-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06))}
.dsh-dsw-btn:disabled{opacity:.45;cursor:default}
.dsh-dsw-btn.primary{background:var(--dsw-alias-state-business-primary,#4d6bfe);border-color:transparent;color:#fff}
.dsh-dsw-btn.primary:hover:not(:disabled){background:var(--dsw-alias-state-business-primary,#4d6bfe);filter:brightness(1.05)}
.dsh-dsw-viewport{position:relative;flex:1 1 auto;min-height:0;display:flex;background:#fff}
.dsh-dsw-stage{position:absolute;inset:0;display:flex;min-height:0}
.dsh-dsw-webview{flex:1 1 auto;width:100%;height:100%;min-height:0;border:0;background:#fff;-webkit-app-region:no-drag;display:flex}
html:has([data-dockkit-pointer]) .dsh-dsw-webview{pointer-events:none}
.dsh-dsw-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;color:var(--dsw-alias-label-secondary,#666);background:var(--dsw-alias-bg-base,#fff);font-size:12px;line-height:1.6;pointer-events:none}
.dsh-dsw-foot{flex:none;padding:5px 10px;border-top:.5px solid var(--dsw-alias-border-l3,rgba(0,0,0,.12));color:var(--dsw-alias-label-tertiary,#888);font-size:10.5px;line-height:1.45;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.dsh-dsw-foot .grow{flex:1 1 auto}
.dsh-dsw-toast{position:absolute;left:50%;bottom:42px;transform:translateX(-50%);max-width:calc(100% - 24px);padding:7px 12px;border-radius:8px;background:var(--dsw-alias-label-primary,#1f1f1f);color:var(--dsw-alias-bg-base,#fff);font-size:11.5px;line-height:1.5;box-shadow:0 4px 16px rgba(0,0,0,.2);z-index:5}
.dsh-dsw-fallback{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:24px;text-align:center;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary,#666)}
.dsh-dsw-fallback strong{color:var(--dsw-alias-label-primary,#1f1f1f);font-size:13px}
`;

		/** Inject the plugin stylesheet once per application page. */
		function ensureStyle() {
			if (document.getElementById(STYLE_ID)) return;
			const style = document.createElement("style");
			style.id = STYLE_ID;
			style.textContent = CSS;
			document.head.appendChild(style);
		}

		/** Remove the stylesheet on plugin unload. */
		function removeStyle() {
			const style = document.getElementById(STYLE_ID);
			if (style) style.remove();
		}

		/** The guide card glyph. */
		function DeepSeekIcon(props) {
			const size = (props && props.size) || 18;
			return h(
				"svg",
				{
					width: size,
					height: size,
					viewBox: "0 0 24 24",
					fill: "none",
					"aria-hidden": "true",
					focusable: "false"
				},
				h("path", {
					d: "M4.2 5.6h15.6v9.9a2.4 2.4 0 0 1-2.4 2.4H9.1l-4.1 2.5a.6.6 0 0 1-.8-.5V5.6Z",
					stroke: "currentColor",
					strokeWidth: "1.6",
					strokeLinejoin: "round"
				}),
				h("path", {
					d: "M8 9.1h8M8 12.3h5.2",
					stroke: "currentColor",
					strokeWidth: "1.6",
					strokeLinecap: "round"
				})
			);
		}

		/** Whether a stored `userToken` value carries a real token instead of the signed-out placeholder. */
		function tokenValue(raw) {
			if (typeof raw !== "string" || raw.length === 0) return "";
			let value = raw;
			try {
				const parsed = JSON.parse(raw);
				value = typeof parsed === "string" ? parsed : parsed && parsed.value;
			} catch (error) {}
			return typeof value === "string" && value.length >= 20 && !/^(null|undefined)$/i.test(value) ? value : "";
		}

		/** Whether a snapshot still holds a usable token. */
		function backupHasToken(raw) {
			if (!raw) return false;
			try {
				const backup = JSON.parse(raw);
				return !!backup && !!backup.ls && !!tokenValue(backup.ls.userToken);
			} catch (error) {
				return false;
			}
		}

		/** Read the app-origin login backup, if one exists. */
		function readBackup() {
			try {
				return localStorage.getItem(BACKUP_KEY);
			} catch (error) {
				return null;
			}
		}

		/** Whether a guest URL belongs to the hosted page. */
		function isChatUrl(url) {
			return typeof url === "string" && url.indexOf("https://chat.deepseek.com") === 0;
		}

		/** Read a webview URL without throwing on a destroyed guest. */
		function guestUrl(element) {
			try {
				return typeof element.getURL === "function" ? element.getURL() : "";
			} catch (error) {
				return "";
			}
		}

		/** Human-readable error text for status lines. */
		function describeError(error) {
			if (error === null || error === undefined) return "알 수 없는 오류";
			if (typeof error === "string") return error;
			if (typeof error === "object" && typeof error.message === "string") return error.message;
			return String(error);
		}

		/** Copy through the async clipboard, falling back to the legacy command. */
		async function copyText(text) {
			try {
				if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
					await navigator.clipboard.writeText(text);
					return true;
				}
			} catch (error) {}
			try {
				const area = document.createElement("textarea");
				area.value = text;
				area.setAttribute("readonly", "");
				area.style.position = "fixed";
				area.style.top = "-1000px";
				area.style.opacity = "0";
				document.body.appendChild(area);
				area.select();
				const copied = document.execCommand("copy");
				area.remove();
				return copied;
			} catch (error) {
				return false;
			}
		}

		/**
		 * Convert a selected DOM fragment to Markdown.
		 * Handles the structures DeepSeek renders: headings, emphasis, code fences,
		 * lists, tables, quotes, KaTeX annotations, links, and images.
		 */
		function htmlToMarkdown(html) {
			const SKIP = new Set([
				"SCRIPT",
				"STYLE",
				"NOSCRIPT",
				"TEMPLATE",
				"BUTTON",
				"SVG",
				"CANVAS",
				"VIDEO",
				"AUDIO",
				"TEXTAREA",
				"INPUT",
				"SELECT",
				"OPTION"
			]);
			const BLOCK = new Set([
				"P",
				"DIV",
				"SECTION",
				"ARTICLE",
				"HEADER",
				"FOOTER",
				"MAIN",
				"ASIDE",
				"FIGURE",
				"FIGCAPTION",
				"FORM",
				"FIELDSET",
				"DETAILS",
				"SUMMARY",
				"ADDRESS"
			]);

			const doc = new DOMParser().parseFromString(String(html || ""), "text/html");

			function absoluteUrl(value) {
				try {
					return new URL(value, "https://chat.deepseek.com/").href;
				} catch (error) {
					return value;
				}
			}

			function fenceFor(text) {
				let fence = "```";
				const runs = text.match(/`{3,}/g);
				if (runs) {
					for (const run of runs) {
						if (run.length >= fence.length) fence = "`".repeat(run.length + 1);
					}
				}
				return fence;
			}

			function renderChildren(node) {
				let out = "";
				const children = node.childNodes;
				for (let index = 0; index < children.length; index += 1) out += render(children[index]);
				return out;
			}

			function renderList(node, ordered) {
				const lines = [];
				let itemIndex = 1;
				for (const item of node.children) {
					if (!item || item.tagName !== "LI") continue;
					const nested = [];
					let body = "";
					for (const child of item.childNodes) {
						if (child.nodeType === 1 && (child.tagName === "UL" || child.tagName === "OL")) nested.push(child);
						else body += render(child);
					}
					body = body.replace(/\s+/g, " ").trim();
					lines.push((ordered ? itemIndex + ". " : "- ") + body);
					for (const sub of nested) {
						const subMarkdown = renderList(sub, sub.tagName === "OL").trim();
						if (subMarkdown) lines.push(subMarkdown.split("\n").map((line) => "  " + line).join("\n"));
					}
					itemIndex += 1;
				}
				return "\n\n" + lines.join("\n") + "\n\n";
			}

			function renderTable(node) {
				const rows = [];
				const tableRows = node.querySelectorAll("tr");
				for (const row of tableRows) {
					const cells = [];
					for (const cell of row.children) {
						if (cell.tagName !== "TD" && cell.tagName !== "TH") continue;
						cells.push(renderChildren(cell).replace(/\s+/g, " ").replace(/\|/g, "\\|").trim());
					}
					if (cells.length) rows.push(cells);
				}
				if (!rows.length) return "";
				const width = Math.max.apply(
					null,
					rows.map((row) => row.length)
				);
				const pad = (row) => {
					const copy = row.slice();
					while (copy.length < width) copy.push("");
					return copy;
				};
				const head = pad(rows[0]);
				const body = rows.slice(1).map(pad);
				const separator = head.map(() => "---");
				return (
					"\n\n| " +
					head.join(" | ") +
					" |\n| " +
					separator.join(" | ") +
					" |" +
					(body.length ? "\n" + body.map((row) => "| " + row.join(" | ") + " |").join("\n") : "") +
					"\n\n"
				);
			}

			function render(node) {
				if (node.nodeType === 3) return node.nodeValue.replace(/\s+/g, " ");
				if (node.nodeType !== 1) return "";
				const tag = node.tagName;
				if (SKIP.has(tag)) return "";

				if (node.classList && node.classList.contains("katex-display")) {
					const annotation = node.querySelector('annotation[encoding="application/x-tex"]');
					if (annotation) return "\n\n$$" + annotation.textContent + "$$\n\n";
				}
				if (node.classList && node.classList.contains("katex")) {
					const annotation = node.querySelector('annotation[encoding="application/x-tex"]');
					if (annotation) return "$" + annotation.textContent + "$";
				}

				switch (tag) {
					case "BR":
						return "\n";
					case "HR":
						return "\n\n---\n\n";
					case "H1":
					case "H2":
					case "H3":
					case "H4":
					case "H5":
					case "H6": {
						const level = Number(tag.charAt(1));
						return "\n\n" + "#".repeat(level) + " " + renderChildren(node).trim() + "\n\n";
					}
					case "P":
						return "\n\n" + renderChildren(node).trim() + "\n\n";
					case "STRONG":
					case "B":
						return "**" + renderChildren(node).trim() + "**";
					case "EM":
					case "I":
						return "*" + renderChildren(node).trim() + "*";
					case "DEL":
					case "S":
					case "STRIKE":
						return "~~" + renderChildren(node).trim() + "~~";
					case "MARK":
						return "==" + renderChildren(node).trim() + "==";
					case "SUP":
						return "^" + renderChildren(node).trim() + "^";
					case "SUB":
						return "~" + renderChildren(node).trim() + "~";
					case "CODE": {
						if (node.closest && node.closest("pre")) return node.textContent;
						const text = node.textContent;
						const ticks = text.indexOf("`") >= 0 ? "``" : "`";
						return ticks + text + ticks;
					}
					case "PRE": {
						const code = node.querySelector("code") || node;
						const text = code.textContent.replace(/\n+$/, "");
						let language = "";
						const match = (code.className || "").match(/language-([A-Za-z0-9_+-]+)/);
						if (match) language = match[1];
						const fence = fenceFor(text);
						return "\n\n" + fence + language + "\n" + text + "\n" + fence + "\n\n";
					}
					case "A": {
						const href = absoluteUrl(node.getAttribute("href") || "");
						const label = renderChildren(node).trim() || href;
						if (!href || href.indexOf("javascript:") === 0) return label;
						return "[" + label + "](" + href + ")";
					}
					case "IMG": {
						const src = node.getAttribute("src") || "";
						if (!src || src.indexOf("data:") === 0) return "";
						return "![" + (node.getAttribute("alt") || "") + "](" + absoluteUrl(src) + ")";
					}
					case "UL":
						return renderList(node, false);
					case "OL":
						return renderList(node, true);
					case "LI":
						return renderChildren(node);
					case "BLOCKQUOTE": {
						const content = renderChildren(node).trim().replace(/\n{3,}/g, "\n\n");
						return (
							"\n\n" +
							content
								.split("\n")
								.map((line) => (line ? "> " + line : ">"))
								.join("\n") +
							"\n\n"
						);
					}
					case "TABLE":
						return renderTable(node);
					case "SUMMARY":
						return "\n\n**" + renderChildren(node).trim() + "**\n\n";
					case "DETAILS":
						return "\n\n" + renderChildren(node).trim() + "\n\n";
					default:
						if (BLOCK.has(tag)) return "\n\n" + renderChildren(node).trim() + "\n\n";
						return renderChildren(node);
				}
			}

			let markdown = renderChildren(doc.body);
			markdown = markdown
				.replace(/\u00a0/g, " ")
				.replace(/[ \t]+\n/g, "\n")
				.replace(/\n{3,}/g, "\n\n")
				.trim();
			return markdown;
		}

		/**
		 * Read the login backup into a fresh guest origin and reload when it changed.
		 * DeepSeek keeps `userToken` in localStorage rather than in cookies, so this
		 * restores the login across app restarts even though the guest partition is
		 * process-lifetime only.
		 */
		async function restoreBackup(element, force) {
			const raw = readBackup();
			if (!raw) return false;
			let backup;
			try {
				backup = JSON.parse(raw);
			} catch (error) {
				return false;
			}
			if (!backup || typeof backup.ls !== "object" || backup.ls === null) return false;
			const payload = JSON.stringify({
				ls: backup.ls,
				cookies: Array.isArray(backup.cookies) ? backup.cookies : []
			})
				.replace(/\u2028/g, "\\u2028")
				.replace(/\u2029/g, "\\u2029");
			const script =
				"(() => { try {" +
				'if (' +
				(force ? "false" : 'sessionStorage.getItem("dsh:restore") === "1"') +
				') return "skip";' +
				"const data = " +
				payload +
				";" +
				"let wrote = 0;" +
				"const keys = Object.keys(data.ls || {});" +
				"for (let i = 0; i < keys.length; i++) {" +
				"const key = keys[i];" +
				"try { if (localStorage.getItem(key) !== data.ls[key]) { localStorage.setItem(key, data.ls[key]); wrote += 1; } } catch (error) {}" +
				"}" +
				"const cookies = data.cookies || [];" +
				"for (let i = 0; i < cookies.length; i++) {" +
				'try { document.cookie = cookies[i][0] + "=" + cookies[i][1] + "; path=/; secure; samesite=lax"; } catch (error) {}' +
				"}" +
				'sessionStorage.setItem("dsh:restore", "1");' +
				'return wrote > 0 ? "restored" : "unchanged";' +
				'} catch (error) { return "error"; } })()';
			let result;
			try {
				result = await element.executeJavaScript(script, true);
			} catch (error) {
				return false;
			}
			return result === "restored" || result === "unchanged";
		}

		function DeepSeekWebView(props) {
			const tab = props.tab;
			const hostRef = React.useRef(null);
			const elementRef = React.useRef(null);
			const leaseRef = React.useRef(null);
			const disposedRef = React.useRef(false);
			const restoredRef = React.useRef(false);
			const toastTimerRef = React.useRef(null);

			const [phase, setPhase] = React.useState("starting");
			const [status, setStatus] = React.useState("웹뷰를 준비하는 중…");
			const [loggedIn, setLoggedIn] = React.useState(null);
			const [savedAt, setSavedAt] = React.useState(null);
			const [toast, setToast] = React.useState(null);
			const [busy, setBusy] = React.useState("");

			const showToast = React.useCallback((text) => {
				setToast(text);
				if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
				toastTimerRef.current = window.setTimeout(() => {
					setToast(null);
					toastTimerRef.current = null;
				}, 4500);
			}, []);

			React.useEffect(() => {
				return () => {
					if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
				};
			}, []);

			/** Store the guest's localStorage session in the app origin. */
			const saveSnapshot = React.useCallback(
				async (element, manual) => {
					if (!element) return false;
					let data;
					try {
						data = await element.executeJavaScript(SNAPSHOT_SCRIPT, true);
					} catch (error) {
						if (manual) showToast("세션을 읽지 못했습니다: " + describeError(error));
						return false;
					}
					if (!data || typeof data.ls !== "object" || data.ls === null) {
						if (manual) showToast("아직 저장할 세션이 없습니다");
						return false;
					}
					const hasToken = !!tokenValue(data.ls.userToken);
					if (!hasToken) {
						const existing = readBackup();
						if (existing && backupHasToken(existing)) {
							if (manual) showToast("현재 로그인되어 있지 않아 기존 세션을 그대로 유지했습니다");
							return false;
						}
						if (!manual && existing) return false;
						if (Object.keys(data.ls).length === 0) {
							if (manual) showToast("아직 저장할 세션이 없습니다");
							return false;
						}
					}
					try {
						localStorage.setItem(BACKUP_KEY, JSON.stringify(data));
					} catch (error) {
						if (manual) showToast("로컬 저장소에 세션을 쓰지 못했습니다");
						return false;
					}
					setSavedAt(data.at);
					setLoggedIn(hasToken);
					if (manual) showToast(hasToken ? "로그인 세션을 저장했습니다" : "세션을 저장했습니다(로그인 토큰 없음)");
					return true;
				},
				[showToast]
			);

			/** Re-check the guest token without disturbing the page. */
			const refreshLoginState = React.useCallback(async (element) => {
				if (!element || disposedRef.current) return;
				let hasToken = false;
				try {
					hasToken = (await element.executeJavaScript(TOKEN_SCRIPT, true)) === true;
				} catch (error) {
					return;
				}
				setLoggedIn(hasToken);
				if (hasToken) setStatus("로그인됨 · 세션 자동 저장");
			}, []);

			/** Load the chat page into the detached guest. */
			const openChat = React.useCallback((element) => {
				if (!element) return;
				try {
					const pending = element.loadURL(CHAT_URL);
					if (pending && typeof pending.catch === "function") pending.catch(() => {});
				} catch (error) {
					setPhase("error");
					setStatus("페이지를 열지 못했습니다: " + describeError(error));
				}
			}, []);

			const reload = React.useCallback(() => {
				const element = elementRef.current;
				if (!element) return;
				try {
					if (isChatUrl(guestUrl(element))) element.reload();
					else openChat(element);
				} catch (error) {
					openChat(element);
				}
			}, [openChat]);

			React.useEffect(() => {
				const actions = tab && tab.actions;
				if (!actions || typeof actions.bindCommands !== "function") return;
				return actions.bindCommands({ refresh: reload });
			}, [tab && tab.actions, reload]);

			React.useEffect(() => {
				const carrier = globalThis.dshDesktop;
				const bridge = carrier && carrier.protocolVersion === 1 ? carrier.browser : undefined;
				if (!bridge) {
					setPhase("unsupported");
					setStatus("DSH 데스크톱 앱에서만 웹뷰를 열 수 있습니다.");
					return;
				}
				const host = hostRef.current;
				if (!host) {
					setPhase("error");
					setStatus("웹뷰 자리를 찾지 못했습니다.");
					return;
				}

				disposedRef.current = false;
				restoredRef.current = false;
				let cancelled = false;
				const cleanups = [];

				(async () => {
					let reservation;
					try {
						reservation = await bridge.acquire(WORKSPACE_KEY);
					} catch (error) {
						if (!cancelled) {
							setPhase("error");
							setStatus("웹뷰를 시작하지 못했습니다: " + describeError(error));
						}
						return;
					}
					if (cancelled) {
						bridge.release(reservation.lease).catch(() => {});
						return;
					}
					leaseRef.current = reservation.lease;

					const element = document.createElement("webview");
					element.className = "dsh-dsw-webview";
					element.setAttribute("name", reservation.lease);
					element.setAttribute("partition", reservation.partition);
					element.setAttribute("allowpopups", "");
					element.setAttribute("src", "about:blank#" + reservation.lease);
					elementRef.current = element;

					if (typeof element.loadURL !== "function") {
						setPhase("unsupported");
						setStatus("이 DSH 데스크톱 버전에서는 웹뷰 태그를 사용할 수 없습니다.");
						element.remove();
						bridge.release(reservation.lease).catch(() => {});
						return;
					}

					const dismiss = () => {
						if (disposedRef.current || elementRef.current !== element) return;
						setPhase("ready");
					};

					const handleReady = async () => {
						if (disposedRef.current || elementRef.current !== element) return;
						const url = guestUrl(element);
						if (!url || url.indexOf("about:blank") === 0) {
							setPhase("loading");
							setStatus("chat.deepseek.com 여는 중…");
							window.setTimeout(() => {
								if (!disposedRef.current && elementRef.current === element) openChat(element);
							}, 60);
							return;
						}
						if (url.indexOf("chrome-error://") === 0) {
							setPhase("error");
							setStatus("페이지를 불러오지 못했습니다. 새로고침하거나 외부 브라우저에서 열어 보세요.");
							return;
						}

						setPhase("ready");
						dismiss();

						try {
							await element.executeJavaScript(SELECTION_CAPTURE_SCRIPT, true);
						} catch (error) {}

						let hasToken = false;
						try {
							hasToken = (await element.executeJavaScript(TOKEN_SCRIPT, true)) === true;
						} catch (error) {}
						setLoggedIn(hasToken);
						setStatus(hasToken ? "로그인됨 · 세션 자동 저장" : "로그인 필요 — 아래 웹뷰에서 로그인하세요");

						if (isChatUrl(url)) {
							let restored = false;
							if (!hasToken && !restoredRef.current) {
								restoredRef.current = true;
								try {
									restored = await restoreBackup(element, false);
								} catch (error) {}
								if (restored && !disposedRef.current) {
									setStatus("저장된 로그인 세션을 복원하는 중…");
									openChat(element);
									return;
								}
							}
							window.setTimeout(() => {
								void refreshLoginState(element);
							}, 4000);
							window.setTimeout(() => {
								void saveSnapshot(element, false);
							}, 2500);
							window.setTimeout(() => {
								void saveSnapshot(element, false);
							}, 9000);
						}
					};

					const onStart = () => {
						if (disposedRef.current) return;
						if (phase !== "ready") setStatus("불러오는 중…");
					};
					const onStop = () => {
						if (disposedRef.current || elementRef.current !== element) return;
						setPhase("ready");
						window.setTimeout(() => {
							void refreshLoginState(element);
							void saveSnapshot(element, false);
						}, 1500);
					};
					const onNavigate = () => {
						if (disposedRef.current) return;
						window.setTimeout(() => {
							void saveSnapshot(element, false);
						}, 2000);
					};
					const onFail = (event) => {
						if (disposedRef.current || !event || !event.isMainFrame || event.errorCode === -3) return;
						setPhase("error");
						setStatus(
							"페이지를 불러오지 못했습니다 (" +
								event.errorCode +
								"): " +
								(event.errorDescription || "") +
								" — 새로고침하거나 외부 브라우저에서 열어 보세요."
						);
					};
					const onGone = () => {
						if (disposedRef.current) return;
						setPhase("error");
						setStatus("웹뷰 프로세스가 종료되었습니다. 탭을 닫았다 다시 열어 주세요.");
					};
					const onNewWindowRequested = bridge.onOpenRequested(reservation.lease, (url) => {
						try {
							window.open(url, "_blank", "noopener");
						} catch (error) {}
					});
					if (onNewWindowRequested) cleanups.push(onNewWindowRequested);

					element.addEventListener("dom-ready", handleReady);
					element.addEventListener("did-start-loading", onStart);
					element.addEventListener("did-stop-loading", onStop);
					element.addEventListener("did-navigate", onNavigate);
					element.addEventListener("did-fail-load", onFail);
					element.addEventListener("render-process-gone", onGone);
					element.addEventListener("destroyed", onGone);
					cleanups.push(() => {
						element.removeEventListener("dom-ready", handleReady);
						element.removeEventListener("did-start-loading", onStart);
						element.removeEventListener("did-stop-loading", onStop);
						element.removeEventListener("did-navigate", onNavigate);
						element.removeEventListener("did-fail-load", onFail);
						element.removeEventListener("render-process-gone", onGone);
						element.removeEventListener("destroyed", onGone);
					});

					host.appendChild(element);
					setPhase("loading");
					setStatus("chat.deepseek.com 여는 중…");

					const interval = window.setInterval(() => {
						if (!disposedRef.current && elementRef.current === element) void saveSnapshot(element, false);
					}, 30000);
					cleanups.push(() => window.clearInterval(interval));
				})();

				return () => {
					cancelled = true;
					disposedRef.current = true;
					for (const cleanup of cleanups) {
						try {
							cleanup();
						} catch (error) {}
					}
					const element = elementRef.current;
					const lease = leaseRef.current;
					elementRef.current = null;
					leaseRef.current = null;
					(async () => {
						try {
							if (element) await saveSnapshot(element, false);
						} catch (error) {}
						try {
							if (element) element.remove();
						} catch (error) {}
						try {
							if (lease) await bridge.release(lease);
						} catch (error) {}
					})();
				};
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [tab && tab.id]);

			const copySelection = async () => {
				const element = elementRef.current;
				if (!element) return;
				setBusy("copy");
				try {
					const selection = await element.executeJavaScript(COPY_SELECTION_SCRIPT, true);
					if (!selection) {
						showToast("웹채팅에서 질문과 답변을 먼저 드래그해 선택하세요");
						return;
					}
					const markdown = htmlToMarkdown(selection.html) || String(selection.text || "").trim();
					if (!markdown) {
						showToast("선택한 영역에서 텍스트를 찾지 못했습니다");
						return;
					}
					const copied = await copyText(markdown);
					if (copied) showToast("Markdown " + markdown.length.toLocaleString() + "자 복사됨 — DSH 입력창에 붙여넣으세요");
					else showToast("클립보드에 복사하지 못했습니다. 다시 시도해 주세요");
				} catch (error) {
					showToast("복사 실패: " + describeError(error));
				} finally {
					setBusy("");
				}
			};

			const saveClicked = async () => {
				const element = elementRef.current;
				if (!element) return;
				setBusy("save");
				try {
					await saveSnapshot(element, true);
				} finally {
					setBusy("");
				}
			};

			const restoreClicked = async () => {
				const element = elementRef.current;
				if (!element) return;
				setBusy("restore");
				try {
					await element.executeJavaScript(
						'(() => { try { sessionStorage.removeItem("dsh:restore"); return true; } catch (error) { return false; } })()',
						true
					);
					const restored = await restoreBackup(element, true);
					if (restored) {
						showToast("저장된 로그인 세션을 복원했습니다");
						openChat(element);
					} else {
						showToast("저장된 로그인 세션이 없습니다. 먼저 로그인한 뒤 [저장]을 눌러 주세요");
					}
				} catch (error) {
					showToast("복원 실패: " + describeError(error));
				} finally {
					setBusy("");
				}
			};

			const openExternal = () => {
				try {
					window.open(CHAT_URL, "_blank", "noopener");
				} catch (error) {}
			};

			const ready = phase === "ready";
			const statusClass = loggedIn === true ? "on" : loggedIn === false ? "off" : "";
			const savedLabel = savedAt ? new Date(savedAt).toLocaleTimeString() : "없음";

			if (phase === "unsupported") {
				return h(
					"div",
					{ className: "dsh-dsw-root" },
					h(
						"div",
						{ className: "dsh-dsw-toolbar" },
						h("div", { className: "dsh-dsw-brand" }, h(DeepSeekIcon, { size: 18 }), h("span", null, "DeepSeek Chat")),
						h("div", { className: "dsh-dsw-actions" }, h("button", { className: "dsh-dsw-btn", onClick: openExternal, type: "button" }, "외부 브라우저에서 열기"))
					),
					h(
						"div",
						{ className: "dsh-dsw-fallback" },
						h("strong", null, "이 화면에서는 웹뷰를 열 수 없습니다"),
						h("span", null, "DSH 데스크톱 앱의 오른쪽 사이드바에서 이 탭을 열면 chat.deepseek.com이 웹뷰로 표시됩니다."),
						h("button", { className: "dsh-dsw-btn primary", onClick: openExternal, type: "button" }, "외부 브라우저에서 열기")
					)
				);
			}

			return h(
				"div",
				{ className: "dsh-dsw-root" },
				h(
					"div",
					{ className: "dsh-dsw-toolbar" },
					h("div", { className: "dsh-dsw-brand" }, h(DeepSeekIcon, { size: 18 }), h("span", null, "DeepSeek Chat")),
					h(
						"span",
						{ className: "dsh-dsw-pill", title: status },
						h("span", { className: "dsh-dsw-dot " + statusClass }),
						loggedIn === true ? "로그인됨" : loggedIn === false ? "로그인 필요" : "세션 확인 중"
					),
					h(
						"div",
						{ className: "dsh-dsw-actions" },
						h(
							"button",
							{
								className: "dsh-dsw-btn primary",
								type: "button",
								disabled: !ready || busy === "copy",
								onClick: copySelection,
								title: "웹채팅에서 선택한 질문·답변을 Markdown으로 복사"
							},
							busy === "copy" ? "복사 중…" : "선택 복사"
						),
						h("button", { className: "dsh-dsw-btn", type: "button", disabled: !ready, onClick: reload, title: "새로고침" }, "새로고침"),
						h(
							"button",
							{
								className: "dsh-dsw-btn",
								type: "button",
								disabled: !ready || busy === "save",
								onClick: saveClicked,
								title: "현재 로그인 세션을 로컬에 저장"
							},
							busy === "save" ? "저장 중…" : "저장"
						),
						h(
							"button",
							{
								className: "dsh-dsw-btn",
								type: "button",
								disabled: !ready || busy === "restore",
								onClick: restoreClicked,
								title: "저장된 로그인 세션을 다시 적용"
							},
							"복원"
						),
						h("button", { className: "dsh-dsw-btn", type: "button", onClick: openExternal, title: "시스템 브라우저에서 열기" }, "외부")
					)
				),
				h(
					"div",
					{ className: "dsh-dsw-viewport" },
					h("div", { className: "dsh-dsw-stage", ref: hostRef }),
					!ready ? h("div", { className: "dsh-dsw-overlay" }, status) : null
				),
				h(
					"div",
					{ className: "dsh-dsw-foot" },
					h("span", { className: "grow" }, "웹채팅에서 질문·답변을 드래그 → [선택 복사] → DSH 입력창에 붙여넣기"),
					h("span", { title: "앱을 다시 열어도 유효한 로그인 세션은 자동 복원됩니다" }, "세션 저장 " + savedLabel)
				),
				toast ? h("div", { className: "dsh-dsw-toast", role: "status" }, toast) : null
			);
		}

		/** Right-sidebar tab body: the shared webview plus the tab's refresh command. */
		function DeepSeekWebBody(props) {
			const { tab } = props.useTabInfo();
			return h(DeepSeekWebView, { tab });
		}

		/** Left-sidebar global panel: the same webview, without tab-specific commands. */
		function DeepSeekPanel() {
			return h(DeepSeekWebView, { tab: undefined });
		}

		/** Left-sidebar row glyph. */
		function DeepSeekPanelIcon(props) {
			return h(DeepSeekIcon, { size: (props && props.size) || 16 });
		}

		/** Client plugin body: left-sidebar panel, right-sidebar tab, and guide entry. */
		function apply(ctx) {
			ensureStyle();
			ctx.effect(() => () => removeStyle(), "dsh-deepseek-web: styles");
			ctx.effect(
				() =>
					ctx.slots.inject("sidebar.panellist", () =>
						ctx.slots.register(
							{
								name: "sidebar.panellist",
								id: PANEL_ID,
								order: 10,
								label: "DeepSeek Chat"
							},
							DeepSeekPanelIcon
						)
					),
				"dsh-deepseek-web: left sidebar entry"
			);
			ctx.effect(
				() =>
					ctx.slots.inject("main", () =>
						ctx.slots.register(
							{
								name: "main",
								key: PANEL_ID
							},
							DeepSeekPanel
						)
					),
				"dsh-deepseek-web: left sidebar page"
			);
			ctx.effect(
				() =>
					ctx.sidebarRightTabs.register({
						id: PLUGIN_ID,
						kind: TAB_KIND,
						priority: "extension",
						keepMounted: true,
						title: () => "DeepSeek Chat",
						guide: [
							{
								id: "open",
								order: 35,
								title: () => "DeepSeek Chat",
								description: () => "chat.deepseek.com을 열고 선택한 질문·답변을 Markdown으로 복사합니다",
								icon: DeepSeekIcon
							}
						]
					}),
				"dsh-deepseek-web: tab type"
			);
			ctx.effect(
				() =>
					ctx.slots.register(
						{
							name: "sidebar.right.pane.tab",
							key: PLUGIN_ID
						},
						DeepSeekWebBody
					),
				"dsh-deepseek-web: tab body"
			);
		}

		exports.apply = apply;
		exports.inject = ["slots", "sidebarRightTabs"];
		return module.exports;
	}
});
