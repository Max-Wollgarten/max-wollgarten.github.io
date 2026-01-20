(() => {
  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);

  const fab = $("uiFab"), panel = $("uiPanel"), closeBtn = $("uiClose");
  const themeToggle = $("themeToggle"), themeLabel = $("themeLabel");
  const fontSlider = $("fontSlider"), fontValue = $("fontValue");
  const resetBtn = $("uiReset");

  const prefersDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
  const effectiveTheme = () => root.getAttribute("data-theme") || (prefersDark() ? "dark" : "light");

  const sync = () => {
    const isDark = effectiveTheme() === "dark";
    themeToggle.setAttribute("aria-pressed", isDark);
    themeLabel.textContent = isDark ? "Dark" : "Light";

    const s = parseFloat(getComputedStyle(root).getPropertyValue("--font-scale")) || 1;
    fontSlider.value = s;
    fontValue.textContent = `${Math.round(s * 100)}%`;
  };

  const open = () => {
    sync();
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    fab.setAttribute("aria-expanded", "true");
    document.body.classList.add("panel-open");
  };

  const close = () => {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    fab.setAttribute("aria-expanded", "false");
    document.body.classList.remove("panel-open");
  };

  const setTheme = (t) => {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch {}
    sync();
  };

  const setScale = (s) => {
    root.style.setProperty("--font-scale", s);
    try { localStorage.setItem("fontScale", s); } catch {}
    sync();
  };

  // init font (theme is set in <head>)
  try {
    const f = localStorage.getItem("fontScale");
    if (f) root.style.setProperty("--font-scale", f);
  } catch {}
  sync();

  fab.addEventListener("click", () => (panel.classList.contains("is-open") ? close() : open()));
  closeBtn.addEventListener("click", close);

  addEventListener("keydown", (e) => e.key === "Escape" && close());
  addEventListener("click", (e) => panel.classList.contains("is-open") && !panel.contains(e.target) && !fab.contains(e.target) && close());

  themeToggle.addEventListener("click", () => setTheme(effectiveTheme() === "dark" ? "light" : "dark"));
  fontSlider.addEventListener("input", () => setScale(fontSlider.value));

  resetBtn.addEventListener("click", () => {
    try { localStorage.removeItem("theme"); localStorage.removeItem("fontScale"); } catch {}
    root.setAttribute("data-theme", prefersDark() ? "dark" : "light");
    root.style.setProperty("--font-scale", "1");
    sync();
  });
})();
