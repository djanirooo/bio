/**
 * الأستاذ مشماش عبدالرزاق - Portfolio & Academy Lead Generator
 * High Performance Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initTabs();
  initHashRouting();
  initCourseSelectButtons();
});

/* ===================================================================
   1. Real-time Scroll Progress Bar
=================================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

/* ===================================================================
   2. Interactive Tab Switching
=================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');
      activateTab(targetId);
      
      if (history.pushState) {
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
}

function activateTab(tabId) {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  let targetFound = false;
  tabPanels.forEach(panel => {
    if (panel.id === tabId) {
      panel.classList.add('active');
      targetFound = true;
    } else {
      panel.classList.remove('active');
    }
  });

  if (!targetFound) return;

  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  // Smooth scroll to tabs if viewport is past them
  const tabsNav = document.querySelector('.portfolio-tabs-nav');
  if (tabsNav) {
    const rect = tabsNav.getBoundingClientRect();
    if (rect.top < 0) {
      tabsNav.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/* ===================================================================
   3. URL Hash Navigation
=================================================================== */
function initHashRouting() {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    activateTab(hash);
  }
}

/* ===================================================================
   4. Connect Course & Academy Buttons to Form
=================================================================== */
function initCourseSelectButtons() {
  const selectTriggers = document.querySelectorAll('[data-select-course]');
  selectTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseName = btn.getAttribute('data-select-course');
      const targetPurpose = btn.getAttribute('data-purpose') || 'دورة تدريبية';

      activateTab('contact');

      // Set purpose
      const purposeSelect = document.getElementById('form-purpose');
      if (purposeSelect) {
        purposeSelect.value = targetPurpose;
      }

      // Prepopulate message
      const msgArea = document.getElementById('form-details');
      if (msgArea) {
        msgArea.value = `أرغب في الاستفسار والتسجيل بخصوص: ${courseName}`;
        msgArea.focus();
      }

      // Scroll to form smoothly
      const formEl = document.getElementById('contact-form-card');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

/* ===================================================================
   5. Frictionless Message Dispatch (WhatsApp & Email)
=================================================================== */
window.sendViaWhatsApp = function(event) {
  if (event) event.preventDefault();

  const name = document.getElementById('form-name').value.trim();
  const phone = document.getElementById('form-phone').value.trim();
  const purpose = document.getElementById('form-purpose').value;
  const details = document.getElementById('form-details').value.trim();

  if (!name || !phone) {
    showToast('يرجى ملء الاسم الكامل ورقم الهاتف أولاً');
    document.getElementById('form-name').focus();
    return;
  }

  const messageText = 
`السلام عليكم أستاذ عبدالرزاق،
أنا: ${name}
رقم الهاتف: ${phone}
نوع الطلب: ${purpose}
------------------------
تفاصيل الرسالة:
${details || 'أود الاستفسار والتواصل معكم مباشرة بخصوص التكوين/الشراكة.'}`;

  const encoded = encodeURIComponent(messageText);
  const waUrl = `https://wa.me/213796593630?text=${encoded}`;
  
  showToast('جاري فتح واتساب لإرسال رسالتك...');
  window.open(waUrl, '_blank');
};

window.sendViaEmail = function(event) {
  if (event) event.preventDefault();

  const name = document.getElementById('form-name').value.trim();
  const phone = document.getElementById('form-phone').value.trim();
  const purpose = document.getElementById('form-purpose').value;
  const details = document.getElementById('form-details').value.trim();

  if (!name || !phone) {
    showToast('يرجى ملء الاسم الكامل ورقم الهاتف أولاً');
    document.getElementById('form-name').focus();
    return;
  }

  const subject = encodeURIComponent(`[طلب موقع Portfolio]: ${purpose} - ${name}`);
  const body = encodeURIComponent(
`الاسم الكامل: ${name}
رقم الهاتف: ${phone}
نوع الطلب: ${purpose}

تفاصيل الطلب:
${details}
`
  );

  const mailUrl = `mailto:profinfo101@gmail.com?subject=${subject}&body=${body}`;
  showToast('جاري فتح البريد الإلكتروني...');
  window.location.href = mailUrl;
};

/* ===================================================================
   6. Toast Notification
=================================================================== */
let toastTimer;
function showToast(text) {
  let toast = document.getElementById('portfolio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--cyan-neon);"></i> <span>${text}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
