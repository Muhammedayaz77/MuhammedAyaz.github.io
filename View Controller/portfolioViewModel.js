const PortfolioViewModel = {
    initializeBlogSearch() {
        const searchInput = document.getElementById("blogSearch");
        const cards = [...document.querySelectorAll("[data-blog-card]")];
        const filterButtons = [...document.querySelectorAll("[data-blog-filter]")];

        if (!searchInput || cards.length === 0) {
            return;
        }

        let activeFilter = "all";

        const filterCards = () => {
            const query = searchInput.value.trim().toLowerCase();

            cards.forEach((card) => {
                const text = card.textContent.toLowerCase();
                const category = card.dataset.category || "";
                const matchesSearch = !query || text.includes(query);
                const matchesCategory = activeFilter === "all" || category === activeFilter;
                card.hidden = !(matchesSearch && matchesCategory);
            });
        };

        searchInput.addEventListener("input", filterCards);

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                activeFilter = button.dataset.blogFilter || "all";
                filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
                filterCards();
            });
        });
    },

    initializeResumeViewer() {
        const modal = document.getElementById("resumeModal");
        const openButton = document.getElementById("viewResumeButton");
        const closeButton = document.getElementById("resumeModalClose");

        if (!modal || !openButton || !closeButton) {
            return;
        }

        const close = () => {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
        };

        openButton.addEventListener("click", () => {
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        });

        closeButton.addEventListener("click", close);

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                close();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modal.classList.contains("is-open")) {
                close();
            }
        });
    },

    initializeContactForm() {
        const form = document.getElementById("contactForm");
        const status = document.getElementById("contactStatus");

        if (!form || !status) {
            return;
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const name = form.elements.name.value.trim();
            const email = form.elements.email.value.trim();
            const subject = form.elements.subject.value.trim();
            const message = form.elements.message.value.trim();
            const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
            const mailto = `mailto:muhammedayaz77@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            status.textContent = "Opening your email app…";
            status.classList.add("is-visible");
            window.location.href = mailto;
        });
    },

    initializeNavigation() {
        document.querySelectorAll("a[href^='#']").forEach((link) => {
            link.addEventListener("click", () => {
                const targetId = link.getAttribute("href");
                if (targetId && targetId.length > 1) {
                    history.replaceState(null, "", targetId);
                }
            });
        });
    },

    initialize() {
        this.initializeBlogSearch();
        this.initializeResumeViewer();
        this.initializeContactForm();
        this.initializeNavigation();
    }
};

document.addEventListener("DOMContentLoaded", () => PortfolioViewModel.initialize());
