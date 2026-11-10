/**
 * مشماش عبدالرزاق - Bio & Portfolio Interactive Controller
 * Cloudflare Pages Optimized
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTabs();
  initModals();
  initCopyButtons();
  initHashNavigation();
});

/* ===================================================================
   1. Theme Management (Dark / Light Mode)
=================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  const currentTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme, themeIcon);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme, themeIcon);
      showToast(newTheme === 'dark' ? 'تم تفعيل الوضع المظلم' : 'تم تفعيل الوضع الفاتح');
    });
  }
}

function updateThemeIcon(theme, icon) {
  if (!icon) return;
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

/* ===================================================================
   2. Interactive Tab Switching
=================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');
      activateTab(targetId);
      
      // Update browser hash without jump
      if (history.pushState) {
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
}

function activateTab(tabId) {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  tabPanels.forEach(panel => {
    const isActive = panel.id === tabId;
    panel.classList.toggle('active', isActive);
  });

  // Scroll smoothly to the tabs area if viewport is low
  const tabsWrapper = document.querySelector('.tabs-wrapper');
  if (tabsWrapper) {
    const rect = tabsWrapper.getBoundingClientRect();
    if (rect.top < 0) {
      tabsWrapper.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/* ===================================================================
   3. URL Hash Navigation
=================================================================== */
function initHashNavigation() {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    activateTab(hash);
  }
}

/* ===================================================================
   4. Copy to Clipboard
=================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-copy-label') || 'النص';
      
      navigator.clipboard.writeText(text).then(() => {
        showToast(`تم نسخ ${label} بنجاح: ${text}`);
      }).catch(() => {
        // Fallback
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast(`تم نسخ ${label} بنجاح!`);
      });
    });
  });
}

/* ===================================================================
   5. Modals Management (QR Code & Quick Share)
=================================================================== */
function initModals() {
  const qrTrigger = document.getElementById('qr-trigger');
  const qrModal = document.getElementById('qr-modal');
  const modalCloses = document.querySelectorAll('.modal-close, .modal-overlay');

  if (qrTrigger && qrModal) {
    qrTrigger.addEventListener('click', () => {
      // Dynamic QR Code generation using QuickChart QR API
      const qrImg = document.getElementById('qr-image');
      const currentUrl = window.location.href;
      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}&margin=10`;
      }
      qrModal.classList.add('active');
    });
  }

  modalCloses.forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close')) {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }
  });
}

/* ===================================================================
   6. Toast Notification System
=================================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-primary)"></i> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ===================================================================
   7. CV Print / Export PDF Handler
=================================================================== */
window.printCV = function() {
  // Ensure all tabs are visible in print mode
  window.print();
};

