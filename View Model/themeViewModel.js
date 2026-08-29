const ThemeViewModel = {
    getSavedTheme() {
        return localStorage.getItem('portfolioTheme') || 'dark';
    },
    saveTheme(theme) {
        localStorage.setItem('portfolioTheme', theme);
    },
    applyTheme(theme) {
        document.body.classList.toggle('light', theme === 'light');
        document.getElementById('themeLabel').textContent = theme === 'light' ? 'Light' : 'Dark';
        document.getElementById('themeIcon').textContent = theme === 'light' ? '🌙' : '☀️';
        document.getElementById('themeToggle').setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
        document.getElementById('themeHint').textContent = theme === 'light' ? 'Switch to Dark Theme' : 'Classic if Dark Theme';
    },
    toggle() {
        const nextTheme = this.getSavedTheme() === 'dark' ? 'light' : 'dark';
        this.saveTheme(nextTheme);
        this.applyTheme(nextTheme);
    },
    initialize() {
        this.applyTheme(this.getSavedTheme());
        document.getElementById('themeToggle').addEventListener('click', () => this.toggle());
    }
};

ThemeViewModel.initialize();
