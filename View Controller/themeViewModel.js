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

    applyCopyCorrections() {
        const corrections = new Map([
            ["Get In Touch", "Get in Touch"],
            ["A career spanning iOS development, software engineering and business ownership.", "My career spans iOS development, software engineering and business ownership."],
            ["12+ years of engineering and product experience.", "12+ years of engineering and product-development experience."],
            ["Years Experience", "Years of Experience"],
            ["Today's medicals, contact details, call action and automatic call-event recording with activity safeguards.", "Today’s medical contacts, call actions, and automatic call-event recording with activity safeguards."],
            ["employee work", "employee workflows"],
            ["Built to grow into a stronger developer package.", "Built to grow into a stronger developer package."],
            ["Write once. Reuse across projects.", "Write once. Reuse across projects."],
            ["Simple stack with clear separation.", "A simple stack with clear separation."],
            ["Simple structure, consistent quality.", "A simple structure with consistent quality."]
        ]);

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
            let value = node.nodeValue;
            corrections.forEach((replacement, source) => {
                if (value.includes(source)) value = value.split(source).join(replacement);
            });
            node.nodeValue = value;
        });
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
        this.applyCopyCorrections();

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
