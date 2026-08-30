(() => {
    "use strict";

    const addStyles = () => {
        if (document.getElementById("scrollControlsStyles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "scrollControlsStyles";
        style.textContent = `
            .scroll-controls {
                position: fixed;
                right: 20px;
                bottom: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .scroll-button {
                width: 44px;
                height: 44px;
                border: 1px solid rgba(255, 255, 255, 0.14);
                border-radius: 14px;
                background: rgba(16, 17, 29, 0.92);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
                backdrop-filter: blur(10px);
                transition: transform 0.25s ease, border-color 0.25s ease;
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
                .scroll-controls {
                    right: 12px;
                    bottom: 12px;
                    gap: 8px;
                }

                .scroll-button {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                }
            }
        `;

        document.head.appendChild(style);
    };

    const createButton = (label, title, action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "scroll-button";
        button.setAttribute("aria-label", label);
        button.title = title;
        button.textContent = label.includes("top") ? "↑" : "↓";
        button.addEventListener("click", action);
        return button;
    };

    const initializeScrollControls = () => {
        if (document.getElementById("scrollControls")) {
            return;
        }

        const controls = document.createElement("div");
        controls.id = "scrollControls";
        controls.className = "scroll-controls";
        controls.setAttribute("aria-label", "Page scroll controls");

        const topButton = createButton(
            "Scroll to top",
            "Scroll to top",
            () => window.scrollTo({ top: 0, behavior: "smooth" })
        );

        const bottomButton = createButton(
            "Scroll to bottom",
            "Scroll to bottom",
            () => window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth"
            })
        );

        controls.append(topButton, bottomButton);
        document.body.appendChild(controls);
    };

    const restoreTheme = () => {
        const theme = localStorage.getItem("portfolioTheme") || "dark";
        const isLight = theme === "light";
        const label = document.getElementById("themeLabel");
        const icon = document.getElementById("themeIcon");
        const toggle = document.getElementById("themeToggle");
        const hint = document.getElementById("themeHint");

        document.body.classList.toggle("light", isLight);

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

    addStyles();
    initializeScrollControls();
    restoreTheme();

    window.addEventListener("pageshow", restoreTheme);
    window.addEventListener("storage", (event) => {
        if (event.key === "portfolioTheme") {
            restoreTheme();
        }
    });
})();
