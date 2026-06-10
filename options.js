document.getElementById('save').addEventListener('click', () => {
  const language = document.getElementById('language').value;
  chrome.storage.sync.set({ language: language }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Language saved! Reload DeepSeek page to see changes.';
    setTimeout(() => { status.textContent = ''; }, 3000);
  });
});

// Carrega o idioma salvo (padrão: inglês)
chrome.storage.sync.get(['language'], (result) => {
  if (result.language) {
    document.getElementById('language').value = result.language;
  } else {
    document.getElementById('language').value = 'en';
  }
});