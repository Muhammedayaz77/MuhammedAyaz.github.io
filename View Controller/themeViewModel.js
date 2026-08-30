const ThemeViewModel = {
    themeKey: "portfolioTheme",
    legacyThemeKey: "theme",

    getSavedTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);

        if (savedTheme === "light" || savedTheme === "dark") {
            return savedTheme;
        }

        return localStorage.getItem(this.legacyThemeKey) === "light"
            ? "light"
            : "dark";
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
            toggle.setAttribute(
                "aria-label",
                isLight ? "Switch to dark theme" : "Switch to light theme"
            );
        }

        if (hint) {
            hint.textContent = isLight
                ? "Switch to Dark Theme"
                : "Classic if Dark Theme";
        }
    },

    toggle() {
        const nextTheme = this.getSavedTheme() === "dark" ? "light" : "dark";
        this.saveTheme(nextTheme);
        this.applyTheme(nextTheme);
    },

    addScrollStyles() {
        if (document.getElementById("scrollControlsStyles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "scrollControlsStyles";
        style.textContent = `
            .scroll-controls {
                position: fixed;
                inset: 0;
                z-index: 1000;
                pointer-events: none;
            }

            .scroll-button {
                position: fixed;
                right: 20px;
                width: 52px;
                height: 52px;
                border: 1px solid rgba(255, 255, 255, 0.14);
                border-radius: 16px;
                background: rgba(16, 17, 29, 0.92);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 25px;
                font-weight: 700;
                line-height: 1;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease, border-color 0.2s ease;
                pointer-events: auto;
            }

            .scroll-button--top {
                top: 92px;
            }

            .scroll-button--bottom {
                bottom: 24px;
            }

            .scroll-button.is-hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transform: scale(0.88);
            }

            .scroll-button:hover {
                transform: translateY(-2px);
                border-color: rgba(139, 92, 246, 0.55);
            }

            body.light .scroll-button {
                background: rgba(255, 255, 255, 0.94);
                color: #111827;
                border-color: rgba(17, 24, 39, 0.13);
                box-shadow: 0 8px 24px rgba(17, 24, 39, 0.12);
            }

            @media (max-width: 600px) {
                .scroll-button {
                    right: 14px;
                    width: 50px;
                    height: 50px;
                    border-radius: 15px;
                }

                .scroll-button--top {
                    top: 88px;
                }

                .scroll-button--bottom {
                    bottom: 18px;
                }
            }
        `;

        document.head.appendChild(style);
    },

    updateScrollVisibility(topButton, bottomButton) {
        const documentElement = document.documentElement;
        const scrollTop = window.scrollY || documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const documentHeight = Math.max(
            documentElement.scrollHeight,
            document.body ? document.body.scrollHeight : 0
        );
        const atTop = scrollTop <= 24;
        const atBottom = scrollTop + viewportHeight >= documentHeight - 24;

        topButton.classList.toggle("is-hidden", atTop);
        bottomButton.classList.toggle("is-hidden", atBottom);
    },

    createScrollControls() {
        if (document.getElementById("scrollControls")) {
            return;
        }

        this.addScrollStyles();

        const controls = document.createElement("div");
        controls.id = "scrollControls";
        controls.className = "scroll-controls";
        controls.setAttribute("aria-label", "Page scroll controls");

        const topButton = document.createElement("button");
        topButton.type = "button";
        topButton.className = "scroll-button scroll-button--top";
        topButton.setAttribute("aria-label", "Scroll to top");
        topButton.title = "Scroll to top";
        topButton.textContent = "↑";

        const bottomButton = document.createElement("button");
        bottomButton.type = "button";
        bottomButton.className = "scroll-button scroll-button--bottom";
        bottomButton.setAttribute("aria-label", "Scroll to bottom");
        bottomButton.title = "Scroll to bottom";
        bottomButton.textContent = "↓";

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

        const update = () => this.updateScrollVisibility(topButton, bottomButton);
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        window.addEventListener("pageshow", update);
        update();
    },

    initialize() {
        this.saveTheme(this.getSavedTheme());
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
            if (
                event.key === this.themeKey ||
                event.key === this.legacyThemeKey
            ) {
                this.applyTheme(this.getSavedTheme());
            }
        });
    }
};

ThemeViewModel.initialize();
