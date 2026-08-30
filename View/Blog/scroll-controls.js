(() => {
    "use strict";

    const THEME_KEY = "portfolioTheme";
    const LEGACY_THEME_KEY = "theme";
    const TOP_THRESHOLD = 24;
    const BOTTOM_THRESHOLD = 24;

    const addStyles = () => {
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
                top: 16px;
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
                    top: 12px;
                }

                .scroll-button--bottom {
                    bottom: 18px;
                }
            }
        `;

        document.head.appendChild(style);
    };

    const getScrollState = () => {
        const documentElement = document.documentElement;
        const scrollTop = window.scrollY || documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const documentHeight = Math.max(
            documentElement.scrollHeight,
            document.body ? document.body.scrollHeight : 0
        );
        const atTop = scrollTop <= TOP_THRESHOLD;
        const atBottom = scrollTop + viewportHeight >= documentHeight - BOTTOM_THRESHOLD;

        return { atTop, atBottom };
    };

    const updateButtonVisibility = (topButton, bottomButton) => {
        const { atTop, atBottom } = getScrollState();
        topButton.classList.toggle("is-hidden", atTop);
        bottomButton.classList.toggle("is-hidden", atBottom);
    };

    const createButton = (label, title, className, action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `scroll-button ${className}`;
        button.setAttribute("aria-label", label);
        button.title = title;
        button.textContent = className.includes("top") ? "↑" : "↓";
        button.addEventListener("click", action);
        return button;
    };

    const initializeScrollControls = () => {
        const existing = document.getElementById("scrollControls");
        if (existing) {
            const topButton = existing.querySelector(".scroll-button--top");
            const bottomButton = existing.querySelector(".scroll-button--bottom");
            if (topButton && bottomButton) {
                updateButtonVisibility(topButton, bottomButton);
            }
            return;
        }

        const controls = document.createElement("div");
        controls.id = "scrollControls";
        controls.className = "scroll-controls";
        controls.setAttribute("aria-label", "Page scroll controls");

        const topButton = createButton(
            "Scroll to top",
            "Scroll to top",
            "scroll-button--top",
            () => window.scrollTo({ top: 0, behavior: "smooth" })
        );

        const bottomButton = createButton(
            "Scroll to bottom",
            "Scroll to bottom",
            "scroll-button--bottom",
            () => window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth"
            })
        );

        controls.append(topButton, bottomButton);
        document.body.appendChild(controls);

        const update = () => updateButtonVisibility(topButton, bottomButton);
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        window.addEventListener("pageshow", update);
        update();
    };

    const getSavedTheme = () => {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === "light" || savedTheme === "dark") {
            return savedTheme;
        }

        const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);
        return legacyTheme === "light" ? "light" : "dark";
    };

    const syncThemeKeys = (theme) => {
        localStorage.setItem(THEME_KEY, theme);
        localStorage.setItem(LEGACY_THEME_KEY, theme);
    };

    const restoreTheme = () => {
        const theme = getSavedTheme();
        const isLight = theme === "light";
        const label = document.getElementById("themeLabel");
        const icon = document.getElementById("themeIcon");
        const toggle = document.getElementById("themeToggle");
        const hint = document.getElementById("themeHint");

        document.body.classList.toggle("light", isLight);
        syncThemeKeys(theme);

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
    };

    const syncThemeAfterToggle = () => {
        const toggle = document.getElementById("themeToggle");
        if (!toggle) {
            return;
        }

        toggle.addEventListener("click", () => {
            window.setTimeout(() => {
                syncThemeKeys(document.body.classList.contains("light") ? "light" : "dark");
            }, 0);
        });
    };

    addStyles();
    initializeScrollControls();
    restoreTheme();
    syncThemeAfterToggle();

    window.addEventListener("pageshow", restoreTheme);
    window.addEventListener("storage", (event) => {
        if (event.key === THEME_KEY || event.key === LEGACY_THEME_KEY) {
            restoreTheme();
        }
    });
})();
