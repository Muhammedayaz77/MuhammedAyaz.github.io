const ScrollControlsViewModel = {
    topThreshold: 8,
    bottomThreshold: 8,

    getScrollElement() {
        return document.scrollingElement || document.documentElement;
    },

    getState() {
        const scrollElement = this.getScrollElement();
        const scrollTop = window.scrollY || scrollElement.scrollTop || 0;
        const viewportHeight = window.innerHeight;
        const documentHeight = Math.max(
            scrollElement.scrollHeight,
            document.documentElement.scrollHeight,
            document.body ? document.body.scrollHeight : 0
        );
        const maxScrollTop = Math.max(0, documentHeight - viewportHeight);

        return {
            atTop: scrollTop <= this.topThreshold,
            atBottom: scrollTop >= maxScrollTop - this.bottomThreshold
        };
    },

    update(topButton, bottomButton) {
        const { atTop, atBottom } = this.getState();
        topButton.classList.toggle("is-hidden", atTop);
        bottomButton.classList.toggle("is-hidden", atBottom);
    },

    scrollToTop() {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    },

    scrollToBottom() {
        const scrollElement = this.getScrollElement();
        const documentHeight = Math.max(
            scrollElement.scrollHeight,
            document.documentElement.scrollHeight,
            document.body ? document.body.scrollHeight : 0
        );
        const bottom = Math.max(0, documentHeight - window.innerHeight);
        window.scrollTo({ top: bottom, left: 0, behavior: "smooth" });
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
            () => this.scrollToTop()
        );

        const bottomButton = this.createButton(
            "Scroll to bottom",
            "scroll-button--bottom",
            "↓",
            () => this.scrollToBottom()
        );

        controls.append(topButton, bottomButton);
        document.body.appendChild(controls);

        const update = () => {
            window.requestAnimationFrame(() => this.update(topButton, bottomButton));
        };

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        window.addEventListener("pageshow", update);
        window.addEventListener("load", update);
        document.addEventListener("DOMContentLoaded", update);

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", update);
        }

        update();
    }
};

ScrollControlsViewModel.initialize();
