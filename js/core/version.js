export function renderVersion(version) {
  document.querySelectorAll('[data-version]').forEach(el => { el.textContent = version.version; });
  const details = document.getElementById('versionDetails');
  if (details) {
    details.innerHTML = `<p><b>${version.name}</b> ${version.version}</p><p>Codename: ${version.codename}<br>Branch: ${version.branch}<br>Release: ${version.released}</p>`;
  }
}
