
document.documentElement.classList.add('js-ready');

// Mobile navigation
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuButton.textContent = isOpen ? '✕' : '☰';
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuButton.textContent = '☰';
  }));
}


const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
});


const themeButton = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('nexora-theme');
if (savedTheme === 'light') document.documentElement.dataset.theme = 'light';
function updateThemeButton() {
  if (!themeButton) return;
  const light = document.documentElement.dataset.theme === 'light';
  themeButton.textContent = light ? '☾ Dark' : '☀ Light';
  themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
}
updateThemeButton();
if (themeButton) themeButton.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  if (nextTheme === 'light') document.documentElement.dataset.theme = 'light';
  else delete document.documentElement.dataset.theme;
  localStorage.setItem('nexora-theme', nextTheme);
  updateThemeButton();
});


const revealTargets = document.querySelectorAll('.section, .feature-card, .service-card, .project-card, .person-card, .cta-section, .dark-band, .mission-band');
revealTargets.forEach(item => item.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(item => revealObserver.observe(item));
} else {
  revealTargets.forEach(item => item.classList.add('is-visible'));
}


const projectCards = [...document.querySelectorAll('.project-card[data-category]')];
const searchInput = document.querySelector('#project-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchStatus = document.querySelector('.search-status');
let activeFilter = 'all';
function filterProjects() {
  if (!projectCards.length) return;
  const term = (searchInput?.value || '').trim().toLowerCase();
  let visibleCount = 0;
  projectCards.forEach(card => {
    const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchesText = card.textContent.toLowerCase().includes(term);
    const visible = matchesCategory && matchesText;
    card.classList.toggle('is-hidden', !visible);
    if (visible) visibleCount++;
  });
  if (searchStatus) searchStatus.textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'} found`;
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
  filterProjects();
}));
searchInput?.addEventListener('input', filterProjects);
filterProjects();


const contactForm = document.querySelector('.form-panel form');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    let feedback = contactForm.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('p');
      feedback.className = 'form-feedback';
      feedback.setAttribute('role', 'status');
      contactForm.appendChild(feedback);
    }
    feedback.textContent = 'Thank you! The form passed its checks. This demonstration website does not send messages yet.';
    contactForm.reset();
  });
}
