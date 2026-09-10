const PortfolioViewModel = {
    initializeRecruiterActions() {
        if (typeof PortfolioModel === "undefined") return;
        const heroButtons = document.querySelector(".hero .buttons");
        if (heroButtons && !document.getElementById("recruiterLinks")) {
            const links = document.createElement("div");
            links.id = "recruiterLinks";
            links.className = "recruiter-links";
            links.innerHTML = `<a class="btn btn-secondary" href="${PortfolioModel.profile.linkedIn}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a class="btn btn-secondary" href="${PortfolioModel.profile.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><span class="availability-badge" aria-label="${PortfolioModel.profile.availability}"><span aria-hidden="true"></span>${PortfolioModel.profile.availability}</span>`;
            heroButtons.appendChild(links);
        }
        document.querySelectorAll(".company-logo").forEach((image) => {
            const label = image.getAttribute("alt") || "Company";
            const initials = PortfolioModel.companyLogos[label] || label.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
            const logo = document.createElement("div");
            logo.className = "company-logo-text";
            logo.setAttribute("role", "img");
            logo.setAttribute("aria-label", label);
            logo.textContent = initials;
            image.replaceWith(logo);
        });
    },

    initializeExperienceHighlights() {
        if (typeof PortfolioModel === "undefined") return;
        const cards = [...document.querySelectorAll(".experience-card")];
        cards.forEach((card) => {
            if (card.querySelector(".experience-highlight")) return;
            const companyText = card.querySelector("p")?.textContent?.trim();
            const item = PortfolioModel.experienceHighlights.find((entry) => companyText?.includes(entry.company.split(",")[0]));
            if (!item) return;
            const highlight = document.createElement("p");
            highlight.className = "experience-highlight";
            highlight.textContent = item.text;
            card.appendChild(highlight);
        });
    },

    initializeRecruiterSkills() {
        if (typeof PortfolioModel === "undefined") return;
        const section = document.querySelector("#skills");
        if (!section || section.querySelector("#recruiterSkillCloud")) return;
        const cloud = document.createElement("div");
        cloud.id = "recruiterSkillCloud";
        cloud.className = "recruiter-skill-cloud";
        cloud.setAttribute("aria-label", "Recruiter skill keywords");
        cloud.innerHTML = PortfolioModel.recruiterSkills.map((skill) => `<span class="skill">${skill}</span>`).join("");
        section.appendChild(cloud);
    },

    initializeSEO() {
        if (typeof PortfolioModel === "undefined") return;
        const seo = PortfolioModel.seo;
        document.title = seo.title;
        const metaValues = {
            'meta[name="description"]': seo.description,
            'meta[name="keywords"]': seo.keywords,
            'meta[property="og:title"]': seo.title,
            'meta[property="og:description"]': seo.description,
            'meta[property="og:image"]': seo.image,
            'meta[name="twitter:title"]': seo.title,
            'meta[name="twitter:description"]': seo.description,
            'meta[name="twitter:image"]': seo.image
        };
        Object.entries(metaValues).forEach(([selector, value]) => {
            const meta = document.querySelector(selector);
            if (meta) meta.setAttribute("content", value);
        });
        if (!document.getElementById("portfolioStructuredData")) {
            const script = document.createElement("script");
            script.id = "portfolioStructuredData";
            script.type = "application/ld+json";
            script.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: PortfolioModel.profile.name,
                jobTitle: PortfolioModel.profile.role,
                url: "https://muhammedayaz77.github.io/MuhammedAyaz.github.io/",
                image: seo.image,
                sameAs: [PortfolioModel.profile.github, PortfolioModel.profile.linkedIn, "https://stackoverflow.com/users/1105403/muhammed-ayaz"],
                knowsAbout: PortfolioModel.recruiterSkills
            });
            document.head.appendChild(script);
        }
    },

    initializeBlogSearch() {
        const searchInput = document.getElementById("blogSearch");
        const cards = [...document.querySelectorAll("[data-blog-card]")];
        const filterButtons = [...document.querySelectorAll("[data-blog-filter]")];
        if (!searchInput || cards.length === 0) return;
        let activeFilter = "all";
        const filterCards = () => {
            const query = searchInput.value.trim().toLowerCase();
            cards.forEach((card) => {
                const text = card.textContent.toLowerCase();
                const category = card.dataset.category || "";
                card.hidden = !((!query || text.includes(query)) && (activeFilter === "all" || category === activeFilter));
            });
        };
        searchInput.addEventListener("input", filterCards);
        filterButtons.forEach((button) => button.addEventListener("click", () => {
            activeFilter = button.dataset.blogFilter || "all";
            filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
            filterCards();
        }));
    },

    initializeResumeViewer() {
        const modal = document.getElementById("resumeModal");
        const openButton = document.getElementById("viewResumeButton");
        const closeButton = document.getElementById("resumeModalClose");
        if (!modal || !openButton || !closeButton) return;
        let lastFocusedElement = null;
        const close = () => {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
            if (lastFocusedElement) lastFocusedElement.focus();
        };
        openButton.addEventListener("click", () => {
            lastFocusedElement = document.activeElement;
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
            closeButton.focus();
        });
        closeButton.addEventListener("click", close);
        modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
        document.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal.classList.contains("is-open")) close(); });
    },

    async initializeContactForm() {
        const form = document.getElementById("contactForm");
        const status = document.getElementById("contactStatus");
        const submitButton = form?.querySelector('button[type="submit"]');
        if (!form || !status || typeof PortfolioModel === "undefined") return;
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }
            const name = form.elements.name.value.trim();
            const email = form.elements.email.value.trim();
            const subject = form.elements.subject.value.trim();
            const message = form.elements.message.value.trim();
            if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Sending…"; }
            status.textContent = "Sending your message…";
            status.classList.add("is-visible");
            try {
                const response = await fetch(`https://formsubmit.co/ajax/${PortfolioModel.profile.email}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({ name, email, subject, message, _subject: subject, _template: "table" })
                });
                const result = await response.json();
                if (!response.ok || result.success === "false") throw new Error(result.message || "Submission failed");
                status.textContent = "Message sent successfully. Thank you!";
                form.reset();
            } catch (error) {
                status.textContent = `Online submission failed. Please email ${PortfolioModel.profile.email} directly.`;
            } finally {
                if (submitButton) { submitButton.disabled = false; submitButton.textContent = "Send Message →"; }
            }
        });
    },

    initializeNavigation() {
        document.querySelectorAll("a[href^='#']").forEach((link) => link.addEventListener("click", () => {
            const targetId = link.getAttribute("href");
            if (targetId && targetId.length > 1) history.replaceState(null, "", targetId);
        }));
    },

    initialize() {
        this.initializeRecruiterActions();
        this.initializeExperienceHighlights();
        this.initializeRecruiterSkills();
        this.initializeSEO();
        this.initializeBlogSearch();
        this.initializeResumeViewer();
        this.initializeContactForm();
        this.initializeNavigation();
    }
};

const loadPortfolioModel = () => {
    if (typeof PortfolioModel !== "undefined") return PortfolioViewModel.initialize();
    const script = document.createElement("script");
    script.src = "../Models/portfolioModel.js";
    script.onload = () => PortfolioViewModel.initialize();
    script.onerror = () => console.error("Unable to load PortfolioModel");
    document.head.appendChild(script);
};

document.addEventListener("DOMContentLoaded", loadPortfolioModel);
