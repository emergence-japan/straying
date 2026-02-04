class LanguageSwitcher {
    constructor(i18n, container) {
        this.i18n = i18n;
        this.container = container;
    }

    render() {
        if (!this.container) return;

        const currentLang = this.i18n.currentLang;
        this.container.innerHTML = `
            <div class="language-switcher">
                <button class="lang-btn ${currentLang === 'ja' ? 'active' : ''}" data-lang="ja">JP</button>
                <span class="divider">/</span>
                <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            </div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        this.container.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.i18n.setLanguage(lang);
                this.render(); // Re-render to update active state
            });
        });
    }
}

// Make it available globally if needed, or module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LanguageSwitcher };
} else {
    window.LanguageSwitcher = LanguageSwitcher;
}
