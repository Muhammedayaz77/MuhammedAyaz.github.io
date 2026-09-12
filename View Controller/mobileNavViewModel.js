const MobileNavViewModel = {
  initialize() {
    const nav = document.querySelector("nav");
    const links = document.querySelector(".nav-links");
    if (!nav || !links) return;

    let button = document.getElementById("mobileMenuToggle");
    if (!button) {
      button = document.createElement("button");
      button.id = "mobileMenuToggle";
      button.className = "mobile-menu-toggle";
      button.type = "button";
      button.setAttribute("aria-controls", "portfolioMobileMenu");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation menu");
      button.innerHTML = "<span></span><span></span><span></span>";
      nav.appendChild(button);
    }

    let menu = document.getElementById("portfolioMobileMenu");
    if (!menu) {
      menu = document.createElement("div");
      menu.id = "portfolioMobileMenu";
      menu.className = "mobile-menu";
      menu.setAttribute("aria-hidden", "true");

      // Copy anchors only. Copying the original <li> nodes caused browser
      // list markers to appear in the mobile menu.
      const anchors = [...links.querySelectorAll("a")];
      menu.innerHTML = anchors.map((anchor, index) => {
        const clone = anchor.cloneNode(true);
        clone.setAttribute("data-menu-index", String(index + 1).padStart(2, "0"));
        return clone.outerHTML;
      }).join("");

      document.body.appendChild(menu);
    }

    const close = () => {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation menu");
      button.classList.remove("is-open");
    };

    const open = () => {
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Close navigation menu");
      button.classList.add("is-open");
    };

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      menu.classList.contains("is-open") ? close() : open();
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", close);
    });

    document.addEventListener("click", (event) => {
      if (!menu.classList.contains("is-open")) return;
      if (!menu.contains(event.target) && !button.contains(event.target)) close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) close();
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => MobileNavViewModel.initialize(), { once: true });
} else {
  MobileNavViewModel.initialize();
}
