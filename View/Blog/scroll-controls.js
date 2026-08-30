(() => {
    "use strict";

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

    initializeScrollControls();
})();
