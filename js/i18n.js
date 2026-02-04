class I18n {
    constructor(translations) {
        this.translations = translations;
        this.currentLang = localStorage.getItem('appLanguage') || 'ja';
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key;
            }
        }
        return value;
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('appLanguage', lang);
            this.updateDOM();
        }
    }

    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation !== key) {
                if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                     element.placeholder = translation;
                } else {
                     element.textContent = translation;
                }
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
             if (translation !== key) {
                element.placeholder = translation;
            }
        });
    }
}

// Make it available globally if needed, or module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18n };
} else {
    window.I18n = I18n;
}
