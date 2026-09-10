const ThemeViewModel = {
    themeKey: "portfolioTheme",
    legacyThemeKey: "theme",

    getSavedTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") return savedTheme;
        const legacy = localStorage.getItem(this.legacyThemeKey);
        if (legacy === "light" || legacy === "dark") return legacy;
        return "system";
    },

    getEffectiveTheme(theme) {
        if (theme !== "system") return theme;
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    },

    saveTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
        localStorage.setItem(this.legacyThemeKey, theme === "system" ? "system" : theme);
    },

    applyTheme(theme) {
        const effectiveTheme = this.getEffectiveTheme(theme);
        const isLight = effectiveTheme === "light";
        const body = document.body;
        const label = document.getElementById("themeLabel");
        const icon = document.getElementById("themeIcon");
        const toggle = document.getElementById("themeToggle");
        const hint = document.getElementById("themeHint");

        body.classList.toggle("light", isLight);
        if (label) label.textContent = theme === "system" ? "System" : isLight ? "Light" : "Dark";
        if (icon) icon.textContent = theme === "system" ? "⚙️" : isLight ? "🌙" : "☀️";
        if (toggle) toggle.setAttribute("aria-label", theme === "system" ? "Theme follows system appearance" : isLight ? "Switch to dark theme" : "Switch to light theme");
        if (hint) hint.textContent = theme === "system" ? "System theme" : isLight ? "Switch to Dark Theme" : "Switch to Light Theme";
    },

    toggle() {
        const saved = this.getSavedTheme();
        const nextTheme = saved === "system" ? "dark" : saved === "dark" ? "light" : "system";
        this.saveTheme(nextTheme);
        this.applyTheme(nextTheme);
    },

    initialize() {
        const savedTheme = this.getSavedTheme();
        this.saveTheme(savedTheme);
        this.applyTheme(savedTheme);

        const toggle = document.getElementById("themeToggle");
        if (toggle) toggle.addEventListener("click", () => this.toggle());

        const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
        mediaQuery.addEventListener?.("change", () => {
            if (this.getSavedTheme() === "system") this.applyTheme("system");
        });
        window.addEventListener("pageshow", () => this.applyTheme(this.getSavedTheme()));
        window.addEventListener("storage", (event) => {
            if (event.key === this.themeKey || event.key === this.legacyThemeKey) this.applyTheme(this.getSavedTheme());
        });
    }
};

ThemeViewModel.initialize();
