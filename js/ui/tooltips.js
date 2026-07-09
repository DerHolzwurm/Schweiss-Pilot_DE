let helpTexts = {};
let activeButton = null;

function hideTooltip() {
  const tooltip = document.getElementById('helpTooltip');
  if (!tooltip) return;
  tooltip.classList.add('hidden');
  tooltip.innerHTML = '';
  if (activeButton) activeButton.setAttribute('aria-expanded', 'false');
  activeButton = null;
}

function showTooltip(button) {
  const tooltip = document.getElementById('helpTooltip');
  const key = button.dataset.help;
  const item = helpTexts[key];
  if (!tooltip || !item) return;

  const rect = button.getBoundingClientRect();
  tooltip.innerHTML = `<strong>${item.title}</strong><p>${item.text}</p>`;
  tooltip.classList.remove('hidden');

  const top = window.scrollY + rect.bottom + 8;
  const left = Math.min(
    window.scrollX + rect.left,
    window.scrollX + document.documentElement.clientWidth - 312
  );
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${Math.max(12, left)}px`;

  if (activeButton && activeButton !== button) activeButton.setAttribute('aria-expanded', 'false');
  activeButton = button;
  activeButton.setAttribute('aria-expanded', 'true');
}

function toggleTooltip(button) {
  if (activeButton === button) hideTooltip();
  else showTooltip(button);
}

export function initTooltips(texts) {
  helpTexts = texts || {};
  document.querySelectorAll('[data-help]').forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      toggleTooltip(button);
    });
    button.addEventListener('mouseenter', () => showTooltip(button));
    button.addEventListener('focus', () => showTooltip(button));
  });

  document.addEventListener('click', hideTooltip);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') hideTooltip();
  });
  window.addEventListener('resize', hideTooltip);
  window.addEventListener('scroll', hideTooltip, { passive: true });
}
