const ScrollControlsViewModel = {
    topThreshold: 24,
    bottomThreshold: 24,

    getState() {
        const documentElement = document.documentElement;
        const scrollTop = window.scrollY || documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const documentHeight = Math.max(
            documentElement.scrollHeight,
            document.body ? document.body.scrollHeight : 0
        );

        return {
            atTop: scrollTop <= this.topThreshold,
            atBottom: scrollTop + viewportHeight >= documentHeight - this.bottomThreshold
        };
    },

    update(topButton, bottomButton) {
        const { atTop, atBottom } = this.getState();
        topButton.classList.toggle("is-hidden", atTop);
        bottomButton.classList.toggle("is-hidden", atBottom);
    },

    createButton(label, className, symbol, action) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `scroll-button ${className}`;
        button.setAttribute("aria-label", label);
        button.title = label;
        button.textContent = symbol;
        button.addEventListener("click", action);
        return button;
    },

    initialize() {
        if (document.getElementById("scrollControls")) {
            return;
        }

        const controls = document.createElement("div");
        controls.id = "scrollControls";
        controls.className = "scroll-controls";
        controls.setAttribute("aria-label", "Page scroll controls");

        const topButton = this.createButton(
            "Scroll to top",
            "scroll-button--top",
            "↑",
            () => window.scrollTo({ top: 0, behavior: "smooth" })
        );

        const bottomButton = this.createButton(
            "Scroll to bottom",
            "scroll-button--bottom",
            "↓",
            () => window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth"
            })
        );

        controls.append(topButton, bottomButton);
        document.body.appendChild(controls);

        const update = () => this.update(topButton, bottomButton);
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        window.addEventListener("pageshow", update);
        window.addEventListener("load", update);

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", update);
        }

        update();
    }
};

ScrollControlsViewModel.initialize();
