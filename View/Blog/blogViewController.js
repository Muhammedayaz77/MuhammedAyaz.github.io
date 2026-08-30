const BlogViewController = {
    articles: [
        { slug: "designing-scalable-ios-architecture.html", title: "Designing Scalable iOS Architecture", category: "Architecture", tags: ["Swift", "MVVM", "Clean Architecture"] },
        { slug: "swift-concurrency.html", title: "Swift Concurrency in Production", category: "Swift", tags: ["Swift", "Concurrency", "Actors"] },
        { slug: "ios-performance.html", title: "iOS Performance", category: "Performance", tags: ["Performance", "Instruments", "Optimization"] },
        { slug: "swiftui-real-world.html", title: "SwiftUI Real-World Applications", category: "SwiftUI", tags: ["SwiftUI", "Swift", "Architecture"] },
        { slug: "uikit-development-production.html", title: "UIKit Development: Lessons From Production", category: "UIKit", tags: ["UIKit", "iOS", "Production"] },
        { slug: "ios-interview-questions-answers.html", title: "iOS Interview Questions & Answers", category: "Interview", tags: ["Interview", "Swift", "iOS"] }
    ],

    calculateReadingTime() {
        const article = document.querySelector(".article");
        const target = document.getElementById("readingTime");
        if (!article || !target) {
            return;
        }

        const words = article.textContent.trim().split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.ceil(words / 220));
        target.textContent = `${minutes} min read`;
    },

    addMetadata() {
        const path = window.location.pathname.split("/").pop();
        const article = this.articles.find((item) => item.slug === path);
        if (!article) {
            return;
        }

        const eyebrow = document.querySelector(".eyebrow");
        if (eyebrow) {
            eyebrow.insertAdjacentHTML("afterend", `<div class="blog-tags">${article.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>`);
        }

        const meta = document.querySelector(".meta");
        if (meta && !document.getElementById("readingTime")) {
            meta.insertAdjacentHTML("beforeend", '<span>•</span><span id="readingTime">Reading time</span>');
        }
    },

    addArticleNavigation() {
        const path = window.location.pathname.split("/").pop();
        const index = this.articles.findIndex((item) => item.slug === path);
        const article = document.querySelector(".article");
        if (!article || index === -1) {
            return;
        }

        const previous = this.articles[index - 1];
        const next = this.articles[index + 1];
        const navigation = document.createElement("nav");
        navigation.className = "article-navigation";
        navigation.setAttribute("aria-label", "Article navigation");
        navigation.innerHTML = `
            ${previous ? `<a href="${previous.slug}" class="article-nav-card"><small>Previous</small><strong>← ${previous.title}</strong></a>` : "<span></span>"}
            ${next ? `<a href="${next.slug}" class="article-nav-card article-nav-card--next"><small>Next</small><strong>${next.title} →</strong></a>` : "<span></span>"}
        `;
        article.appendChild(navigation);
    },

    addRelatedArticles() {
        const path = window.location.pathname.split("/").pop();
        const current = this.articles.find((item) => item.slug === path);
        const article = document.querySelector(".article");
        if (!article || !current) {
            return;
        }

        const related = this.articles
            .filter((item) => item.slug !== current.slug)
            .map((item) => ({ item, score: item.tags.filter((tag) => current.tags.includes(tag)).length }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        const section = document.createElement("section");
        section.className = "related-articles";
        section.innerHTML = `<h2>Related articles</h2><div class="related-grid">${related.map(({ item }) => `
            <a href="${item.slug}" class="related-card"><span>${item.category}</span><strong>${item.title}</strong><small>${item.tags.join(" • ")}</small></a>
        `).join("")}</div>`;
        article.appendChild(section);
    },

    initialize() {
        this.addMetadata();
        this.calculateReadingTime();
        this.addArticleNavigation();
        this.addRelatedArticles();
    }
};

document.addEventListener("DOMContentLoaded", () => BlogViewController.initialize());
