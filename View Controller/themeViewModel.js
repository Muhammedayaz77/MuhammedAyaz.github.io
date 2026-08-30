const ThemeViewModel = {
    getSavedTheme() {
        return localStorage.getItem("portfolioTheme") || "dark";
    },

    saveTheme(theme) {
        localStorage.setItem("portfolioTheme", theme);
    },

    applyTheme(theme) {
        const isLight = theme === "light";
        const body = document.body;
        const label = document.getElementById("themeLabel");
        const icon = document.getElementById("themeIcon");
        const toggle = document.getElementById("themeToggle");
        const hint = document.getElementById("themeHint");

        body.classList.toggle("light", isLight);
        label.textContent = isLight ? "Light" : "Dark";
        icon.textContent = isLight ? "🌙" : "☀️";
        toggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );
        hint.textContent = isLight ? "Switch to Dark Theme" : "Classic if Dark Theme";
    },

    toggle() {
        const nextTheme = this.getSavedTheme() === "dark" ? "light" : "dark";
        this.saveTheme(nextTheme);
        this.applyTheme(nextTheme);
    },

    initialize() {
        const toggle = document.getElementById("themeToggle");

        if (!toggle) {
            return;
        }

        this.applyTheme(this.getSavedTheme());
        toggle.addEventListener("click", () => this.toggle());
    }
};

ThemeViewModel.initialize();
