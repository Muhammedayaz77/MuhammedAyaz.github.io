// Backward-compatible loader for older blog pages.
// New pages should load View Controller/scrollControlsViewModel.js directly.
(() => {
    if (window.ScrollControlsViewModel) {
        window.ScrollControlsViewModel.initialize();
    }
})();
