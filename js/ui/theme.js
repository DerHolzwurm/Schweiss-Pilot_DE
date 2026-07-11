export function initTheme() {
  const button = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  document.body.classList.toggle('light', saved === 'light');
  button.textContent = saved === 'light' ? 'Light Mode' : 'Dark Mode';
  button.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    button.textContent = isLight ? 'Light Mode' : 'Dark Mode';
  });
}
