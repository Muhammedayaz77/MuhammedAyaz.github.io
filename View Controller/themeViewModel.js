const ThemeViewModel = {
    themeKey: "portfolioTheme",
    legacyThemeKey: "theme",
    initialized: false,

    getSavedTheme() {
        const saved = localStorage.getItem(this.themeKey);
        if (saved === "light" || saved === "dark") return saved;
        const legacy = localStorage.getItem(this.legacyThemeKey);
        if (legacy === "light" || legacy === "dark") return legacy;
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    },

    saveTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
        localStorage.setItem(this.legacyThemeKey, theme);
    },

    applyTheme(theme) {
        const light = theme === "light";
        document.documentElement.dataset.theme = theme;
        document.body.classList.toggle("light", light);

        const label = document.getElementById("themeLabel");
        const icon = document.getElementById("themeIcon");
        const toggle = document.getElementById("themeToggle");
        const hint = document.getElementById("themeHint");

        if (label) label.textContent = light ? "Light" : "Dark";
        if (icon) icon.textContent = light ? "☾" : "☼";
        if (toggle) {
            toggle.setAttribute("aria-pressed", String(!light));
            toggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
            toggle.title = light ? "Dark mode" : "Light mode";
        }
        if (hint) hint.textContent = light ? "Switch to Dark Theme" : "Switch to Light Theme";
    },

    toggle() {
        const current = document.body.classList.contains("light") ? "light" : "dark";
        const next = current === "dark" ? "light" : "dark";
        this.saveTheme(next);
        this.applyTheme(next);
    },

    initialize() {
        if (this.initialized) return;
        this.initialized = true;
        this.applyTheme(this.getSavedTheme());

        const toggle = document.getElementById("themeToggle");
        if (toggle) {
            toggle.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.toggle();
            });
        }

        window.addEventListener("pageshow", () => this.applyTheme(this.getSavedTheme()));
        window.addEventListener("storage", (event) => {
            if (event.key === this.themeKey || event.key === this.legacyThemeKey) {
                this.applyTheme(this.getSavedTheme());
            }
        });
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ThemeViewModel.initialize(), { once: true });
} else {
    ThemeViewModel.initialize();
}