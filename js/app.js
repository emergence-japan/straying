// app.js - Straying Project version

// Global state
let currentSection = 'welcome';

// Global surveyData structure
// データは保存しないが、既存のparticipant.jsなどがエラーにならないよう枠だけ用意
if (typeof window.surveyData === 'undefined') {
  window.surveyData = {
    language: localStorage.getItem('appLanguage') || 'ja',
    preSurvey: {},
    gamePlay: {}, // ゲームデータは空
    postSurvey: {}
  };
}

function initializeApp() {
  // We handle initial section showing in game.html's DOMContentLoaded
  // to skip the welcome screen if participant info is ready.
  
  const currentSectionEl = document.getElementById(currentSection);
  if (currentSectionEl && currentSection === 'welcome') {
    currentSectionEl.classList.add('fade-in');
  }
}

function navigateTo(sectionId) {
  // Hide current section
  const currentSectionEl = document.getElementById(currentSection);
  if (currentSectionEl) {
    currentSectionEl.classList.remove('active');
    currentSectionEl.classList.add('fade-out');
  }

  // Show new section after short delay
  setTimeout(() => {
    if (currentSectionEl) {
      currentSectionEl.classList.remove('fade-out');
    }

    const newSection = document.getElementById(sectionId);
    if (newSection) {
      newSection.classList.add('active', 'fade-in');
      newSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      currentSection = sectionId;

      // Remove fade-in class after animation
      setTimeout(() => {
        newSection.classList.remove('fade-in');
      }, 500);
      
      // Initialize section-specific logic if needed
      onSectionShow(sectionId);
    }
  }, 300);
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.screen').forEach(section => {
    section.classList.remove('active');
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    currentSection = sectionId;
    onSectionShow(sectionId);
  }
}

function onSectionShow(sectionId) {
    // Hooks for specific section initialization
    // 今回は特別な初期化ロジックは不要
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
