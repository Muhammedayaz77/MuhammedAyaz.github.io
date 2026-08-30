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

        if (label) {
            label.textContent = isLight ? "Light" : "Dark";
        }

        if (icon) {
            icon.textContent = isLight ? "🌙" : "☀️";
        }

        if (toggle) {
            toggle.setAttribute(
                "aria-label",
                isLight ? "Switch to dark theme" : "Switch to light theme"
            );
        }

        if (hint) {
            hint.textContent = isLight ? "Switch to Dark Theme" : "Classic if Dark Theme";
        }
    },

    toggle() {
        const nextTheme = this.getSavedTheme() === "dark" ? "light" : "dark";
        this.saveTheme(nextTheme);
        this.applyTheme(nextTheme);
    },

    createScrollControls() {
        if (document.getElementById("scrollControls")) {
            return;
        }

        const controls = document.createElement("div");
        controls.id = "scrollControls";
        controls.className = "scroll-controls";
        controls.setAttribute("aria-label", "Page scroll controls");

        const topButton = document.createElement("button");
        topButton.type = "button";
        topButton.className = "scroll-button";
        topButton.setAttribute("aria-label", "Scroll to top");
        topButton.title = "Scroll to top";
        topButton.innerHTML = "↑";

        const bottomButton = document.createElement("button");
        bottomButton.type = "button";
        bottomButton.className = "scroll-button";
        bottomButton.setAttribute("aria-label", "Scroll to bottom");
        bottomButton.title = "Scroll to bottom";
        bottomButton.innerHTML = "↓";

        topButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        bottomButton.addEventListener("click", () => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth"
            });
        });

        controls.append(topButton, bottomButton);
        document.body.appendChild(controls);
    },

    initialize() {
        this.applyTheme(this.getSavedTheme());
        this.createScrollControls();

        const toggle = document.getElementById("themeToggle");

        if (toggle) {
            toggle.addEventListener("click", () => this.toggle());
        }

        window.addEventListener("pageshow", () => {
            this.applyTheme(this.getSavedTheme());
        });

        window.addEventListener("storage", (event) => {
            if (event.key === "portfolioTheme") {
                this.applyTheme(this.getSavedTheme());
            }
        });
    }
};

ThemeViewModel.initialize();
