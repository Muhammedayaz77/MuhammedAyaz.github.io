// Compatibility loader for legacy blog pages.
(() => {
    if (window.ScrollControlsViewModel) {
        window.ScrollControlsViewModel.initialize();
        return;
    }

    const script = document.createElement("script");
    script.src = "../../View Controller/scrollControlsViewModel.js";
    script.async = false;
    document.head.appendChild(script);
})();
