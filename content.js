(() => {
  'use strict';
  console.log('🔵 DeepSeek Counter: content.js carregado');

  const CC = window.DeepSeekCounter = window.DeepSeekCounter || {};
  if (CC.started) return;
  CC.started = true;

  const tokenizer = window.GPTTokenizer_o200k_base;
  if (!tokenizer) {
    console.error('❌ Tokenizer não encontrado');
    return;
  }
  console.log('✅ Tokenizer OK');

  const CACHE_WINDOW_MS = 5 * 60 * 1000;
  const STORAGE_KEY = 'ds_counter_total_tokens';
  let accumulatedTokens = parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10);

  function countTokens(text) {
    if (!text) return 0;
    try { return tokenizer.countTokens(text); } catch { return 0; }
  }

  function extractNewMessages() {
    const messages = document.querySelectorAll('.ds-message');
    const newMessages = [];
    for (const el of messages) {
      if (el.hasAttribute('data-cc-processed')) continue;
      el.setAttribute('data-cc-processed', 'true');
      let content = '';
      const contentDiv = el.querySelector('.fbb737a4, .markdown, .prose');
      if (contentDiv) content = contentDiv.innerText.trim();
      else content = el.innerText.trim();
      if (content) newMessages.push({ content });
    }
    return newMessages;
  }

  function updateAccumulatedTokens() {
    const newMessages = extractNewMessages();
    let added = 0;
    for (const msg of newMessages) added += countTokens(msg.content);
    if (added > 0) {
      accumulatedTokens += added;
      sessionStorage.setItem(STORAGE_KEY, accumulatedTokens.toString());
      console.log(`➕ +${added} tokens. Total: ${accumulatedTokens}`);
    }
    return accumulatedTokens;
  }

  function getLastAssistantTime() {
    const timeEl = document.querySelector('time, [data-timestamp], .timestamp');
    if (!timeEl) return Date.now();
    const ts = timeEl.getAttribute('data-timestamp') || timeEl.getAttribute('datetime') || timeEl.innerText;
    const parsed = Date.parse(ts);
    return isNaN(parsed) ? Date.now() : parsed;
  }

  function computeMetrics() {
    const totalTokens = updateAccumulatedTokens();
    const lastTime = getLastAssistantTime();
    const cachedUntil = lastTime + CACHE_WINDOW_MS;
    return { totalTokens, cachedUntil };
  }

  let ui = null;
  const waitUI = setInterval(() => {
    if (window.DeepSeekCounter?.ui?.CounterUI && !ui) {
      ui = new window.DeepSeekCounter.ui.CounterUI();
      ui.initialize();
      clearInterval(waitUI);
      console.log('✅ UI inicializada');
      const metrics = computeMetrics();
      ui.setTokens(metrics.totalTokens);
      ui.setCacheTime(Math.ceil((metrics.cachedUntil - Date.now()) / 1000));
    }
  }, 500);

  function updateUI() {
    if (!ui) return;
    const metrics = computeMetrics();
    ui.setTokens(metrics.totalTokens);
    ui.setCacheTime(Math.ceil((metrics.cachedUntil - Date.now()) / 1000));
  }

  setInterval(updateUI, 2000);
  const observer = new MutationObserver(() => updateUI());
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', () => setTimeout(updateUI, 1000));
})();