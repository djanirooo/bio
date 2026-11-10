/**
 * الأستاذ مشماش عبدالرزاق - أستاذ متخصص في الإعلام الآلي درجة 1 (PSEP 1)
 * White & Tech Blue Portfolio Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initScrollSpy();
  initScrollAnimations();
  initFormTriggers();
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
   2. Scroll Reveal & Skill Bars Animation
=================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // If this element contains skill fills, animate them
        const skillFills = entry.target.querySelectorAll('.skill-fill');
        skillFills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-width');
          if (targetWidth) {
            fill.style.width = targetWidth;
          }
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ===================================================================
   3. Scroll Spy (Highlight Active Nav Link)
=================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], div[id].section-block');
  const navLinks = document.querySelectorAll('.nav-menu-links a');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ===================================================================
   4. Quick Selection Triggers
=================================================================== */
function initFormTriggers() {
  const triggers = document.querySelectorAll('[data-target-purpose]');
  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const purpose = btn.getAttribute('data-target-purpose');
      const details = btn.getAttribute('data-target-details') || '';

      const purposeSelect = document.getElementById('form-purpose');
      if (purposeSelect) {
        purposeSelect.value = purpose;
      }

      const detailsInput = document.getElementById('form-details');
      if (detailsInput && details) {
        detailsInput.value = details;
        detailsInput.focus();
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ===================================================================
   5. Frictionless Dispatch (WhatsApp & Email)
=================================================================== */
window.sendViaWhatsApp = function(event) {
  if (event) event.preventDefault();

  const name = document.getElementById('form-name').value.trim();
  const phone = document.getElementById('form-phone').value.trim();
  const purpose = document.getElementById('form-purpose').value;
  const details = document.getElementById('form-details').value.trim();

  if (!name || !phone) {
    showNotice('يرجى ملء الاسم ورقم الهاتف أولاً');
    document.getElementById('form-name').focus();
    return;
  }

  const messageText = 
`السلام عليكم أستاذ عبدالرزاق،
الاسم / المؤسسة: ${name}
رقم الهاتف: ${phone}
نوع الطلب: ${purpose}
------------------------
تفاصيل الرسالة:
${details || 'أود التواصل والتنسيق معكم بخصوص التكوين / الشراكة.'}`;

  const encoded = encodeURIComponent(messageText);
  const waUrl = `https://wa.me/213796593630?text=${encoded}`;
  
  showNotice('جاري فتح واتساب لإرسال رسالتك...');
  window.open(waUrl, '_blank');
};

window.sendViaEmail = function(event) {
  if (event) event.preventDefault();

  const name = document.getElementById('form-name').value.trim();
  const phone = document.getElementById('form-phone').value.trim();
  const purpose = document.getElementById('form-purpose').value;
  const details = document.getElementById('form-details').value.trim();

  if (!name || !phone) {
    showNotice('يرجى ملء الاسم ورقم الهاتف أولاً');
    document.getElementById('form-name').focus();
    return;
  }

  const subject = encodeURIComponent(`[طلب تواصل]: ${purpose} - ${name}`);
  const body = encodeURIComponent(
`الاسم الكامل: ${name}
رقم الهاتف: ${phone}
نوع الطلب: ${purpose}

تفاصيل الطلب:
${details}
`
  );

  const mailUrl = `mailto:profinfo101@gmail.com?subject=${subject}&body=${body}`;
  showNotice('جاري فتح تطبيق البريد...');
  window.location.href = mailUrl;
};

/* ===================================================================
   6. Toast Notice
=================================================================== */
let toastTimer;
function showNotice(text) {
  let toast = document.getElementById('portfolio-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolio-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle" style="color: #38bdf8;"></i> <span>${text}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
