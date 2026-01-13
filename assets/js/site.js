(function () {
  const root = document.documentElement;

  const fab = document.getElementById("uiFab");
  const panel = document.getElementById("uiPanel");
  const closeBtn = document.getElementById("uiClose");

  const themeToggle = document.getElementById("themeToggle");
  const themeLabel = document.getElementById("themeLabel");

  const fontSlider = document.getElementById("fontSlider");
  const fontValue = document.getElementById("fontValue");

  const resetBtn = document.getElementById("uiReset");

  const prefersDark = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  function getThemeAttr() {
    return root.getAttribute("data-theme"); // "light" | "dark" | null
  }

  // effektives Theme = Attribut wenn vorhanden, sonst OS
  function getEffectiveTheme() {
    const t = getThemeAttr();
    return t ? t : (prefersDark() ? "dark" : "light");
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    syncUI();
  }

  function setFontScale(scale) {
    root.style.setProperty("--font-scale", String(scale));
    try { localStorage.setItem("fontScale", String(scale)); } catch (e) {}
    syncUI();
  }

  function openPanel() {
    syncUI();
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    fab.setAttribute("aria-expanded", "true");
    document.body.classList.add("panel-open");
  }

  function closePanel() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    fab.setAttribute("aria-expanded", "false");
    document.body.classList.remove("panel-open");
  }

  function syncUI() {
    const effective = getEffectiveTheme();
    const isDark = effective === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeLabel.textContent = isDark ? "Dark" : "Light";

    const scale =
      parseFloat(getComputedStyle(root).getPropertyValue("--font-scale")) || 1;
    fontSlider.value = String(scale);
    fontValue.textContent = `${Math.round(scale * 100)}%`;
  }

  // Init: Theme NICHT überschreiben – das macht schon dein <head>-Script.
  // Nur FontScale aus localStorage ziehen und UI syncen.
  try {
    const savedFont = localStorage.getItem("fontScale");
    if (savedFont) root.style.setProperty("--font-scale", savedFont);
  } catch (e) {}

  syncUI();

  // Events
  fab.addEventListener("click", () => {
    if (panel.classList.contains("is-open")) closePanel();
    else openPanel();
  });

  closeBtn.addEventListener("click", closePanel);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });

  document.addEventListener("click", (e) => {
    if (!panel.classList.contains("is-open")) return;
    if (panel.contains(e.target) || fab.contains(e.target)) return;
    closePanel();
  });

  themeToggle.addEventListener("click", () => {
    const effective = getEffectiveTheme();
    setTheme(effective === "dark" ? "light" : "dark");
  });

  fontSlider.addEventListener("input", () => {
    setFontScale(fontSlider.value);
  });

  resetBtn.addEventListener("click", () => {
    // Theme zurück auf OS
    try { localStorage.removeItem("theme"); } catch (e) {}
    const osTheme = prefersDark() ? "dark" : "light";
    root.setAttribute("data-theme", osTheme);

    // Font zurück
    try { localStorage.removeItem("fontScale"); } catch (e) {}
    root.style.setProperty("--font-scale", "1");

    syncUI();
  });
})();
