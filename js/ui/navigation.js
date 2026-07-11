export function initNavigation() {
  document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(`screen-${target}`).classList.add('active');
    });
  });
}
