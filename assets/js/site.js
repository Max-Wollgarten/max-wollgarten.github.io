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

  function getTheme() {
    return root.getAttribute("data-theme"); // "light" | "dark" | null
  }

  function setTheme(theme) {
    if (!theme) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    try {
      if (theme) localStorage.setItem("theme", theme);
      else localStorage.removeItem("theme");
    } catch (e) {}
    syncUI();
  }

  function setFontScale(scale) {
    root.style.setProperty("--font-scale", String(scale));
    try {
      localStorage.setItem("fontScale", String(scale));
    } catch (e) {}
    syncUI();
  }

  function openPanel() {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    fab.setAttribute("aria-expanded", "true");
  }

  function closePanel() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    fab.setAttribute("aria-expanded", "false");
  }

  function syncUI() {
    const theme = getTheme() || "auto";

    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeLabel.textContent = theme === "dark" ? "Dark" : "Light";

    const scale = parseFloat(getComputedStyle(root).getPropertyValue("--font-scale")) || 1;
    fontSlider.value = String(scale);
    fontValue.textContent = `${Math.round(scale * 100)}%`;
  }

  // Init saved settings (if not already applied in head)
  try {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedFont = localStorage.getItem("fontScale");
    if (!getTheme()) root.setAttribute("data-theme", savedTheme);
    if (savedFont) root.style.setProperty("--font-scale", savedFont);
  } catch (e) {
    if (!getTheme()) root.setAttribute("data-theme", "light");
  }

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
    const t = getTheme();
    setTheme(t === "dark" ? "light" : "dark");
  });

  fontSlider.addEventListener("input", () => {
    setFontScale(fontSlider.value);
  });

  resetBtn.addEventListener("click", () => {
    setTheme("light");
    setFontScale(1);
    try {
      localStorage.setItem("theme", "light");
      localStorage.removeItem("fontScale");
    } catch (e) {}
  });

  syncUI();
})();
