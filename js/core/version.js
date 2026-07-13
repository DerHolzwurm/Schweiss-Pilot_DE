function textOrFallback(value, fallback = '–') {
  return value === undefined || value === null || value === '' ? fallback : value;
}

function formatStatus(version) {
  if (version.release === true) return 'Release';
  return textOrFallback(version.status, 'Development');
}

function statusClass(version) {
  return version.release === true ? 'release' : 'development';
}

export function renderVersion(version) {
  const appName = textOrFallback(version.name, 'SchweißPilot');
  const appVersion = textOrFallback(version.version);
  const build = textOrFallback(version.build);
  const branch = textOrFallback(version.branch);
  const status = formatStatus(version);
  const releaseText = version.release === true ? 'ja' : 'nein';
  const releaseDate = textOrFallback(version.date);

  document.querySelectorAll('[data-version]').forEach(el => {
    el.textContent = appVersion;
  });

  const footerAppName = document.getElementById('footerAppName');
  const footerBuild = document.getElementById('footerBuild');
  const footerStatus = document.getElementById('footerStatus');

  if (footerAppName) footerAppName.textContent = appName;
  if (footerBuild) footerBuild.textContent = `Build ${build}`;
  if (footerStatus) footerStatus.textContent = status;

  const details = document.getElementById('versionDetails');
  if (details) {
    details.innerHTML = `
      <dl class="info-grid">
        <dt>Name</dt><dd>${appName}</dd>
        <dt>Version</dt><dd>${appVersion}</dd>
        <dt>Build</dt><dd>${build}</dd>
        <dt>Branch</dt><dd>${branch}</dd>
        <dt>Status</dt><dd><span class="status-pill ${statusClass(version)}">${status}</span></dd>
        <dt>Release</dt><dd>${releaseText}</dd>
        <dt>Stand</dt><dd>${releaseDate}</dd>
      </dl>
    `;
  }

  const infoContent = document.getElementById('appInfoContent');
  if (infoContent) {
    infoContent.innerHTML = `
      <dl class="info-grid">
        <dt>Name</dt><dd>${appName}</dd>
        <dt>Version</dt><dd>${appVersion}</dd>
        <dt>Build</dt><dd>${build}</dd>
        <dt>Branch</dt><dd>${branch}</dd>
        <dt>Status</dt><dd><span class="status-pill ${statusClass(version)}">${status}</span></dd>
        <dt>Release</dt><dd>${releaseText}</dd>
        <dt>Stand</dt><dd>${releaseDate}</dd>
      </dl>
    `;
  }
}

export function initVersionDialog() {
  const dialog = document.getElementById('appInfoDialog');
  const openButtons = [
    document.getElementById('appInfoBtn'),
    document.getElementById('footerVersionBtn')
  ].filter(Boolean);
  const closeButton = document.getElementById('appInfoClose');

  if (!dialog) return;

  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    });
  });

  closeButton?.addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}
