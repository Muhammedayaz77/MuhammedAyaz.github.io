const ThemeViewModel = {
    themeKey: "portfolioTheme",
    legacyThemeKey: "theme",

    getSavedTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);

        if (savedTheme === "light" || savedTheme === "dark") {
            return savedTheme;
        }

        return localStorage.getItem(this.legacyThemeKey) === "light" ? "light" : "dark";
    },

    saveTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
        localStorage.setItem(this.legacyThemeKey, theme);
    },

    applyTheme(theme) {
        const isLight = theme === "light";
        const body = document.body;
        const label = document.getElementById("themeLabel");
        const icon = document.getElementById("themeIcon");
        const toggle = document.getElementById("themeToggle");
        const hint = document.getElementById("themeHint");

        body.classList.toggle("light", isLight);

        if (label) {
            label.textContent = isLight ? "Light" : "Dark";
        }

        if (icon) {
            icon.textContent = isLight ? "🌙" : "☀️";
        }

        if (toggle) {
            toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
        }

        if (hint) {
            hint.textContent = isLight ? "Switch to Dark Theme" : "Switch to Light Theme";
        }
    },

    toggle() {
        const nextTheme = this.getSavedTheme() === "dark" ? "light" : "dark";
        this.saveTheme(nextTheme);
        this.applyTheme(nextTheme);
    },

    initialize() {
        const savedTheme = this.getSavedTheme();
        this.saveTheme(savedTheme);
        this.applyTheme(savedTheme);

        const toggle = document.getElementById("themeToggle");
        if (toggle) {
            toggle.addEventListener("click", () => this.toggle());
        }

        window.addEventListener("pageshow", () => this.applyTheme(this.getSavedTheme()));
        window.addEventListener("storage", (event) => {
            if (event.key === this.themeKey || event.key === this.legacyThemeKey) {
                this.applyTheme(this.getSavedTheme());
            }
        });
    }
};

ThemeViewModel.initialize();
