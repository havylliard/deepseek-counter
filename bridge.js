(() => {
  'use strict';

  const ORIGINAL_FETCH = window.fetch;

  window.fetch = async (...args) => {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
    const opts = args[1] || {};
    const method = (opts.method || 'GET').toUpperCase();

    // Detectar envio de mensagem (chat completions)
    if (method === 'POST' && url.includes('/chat/completions')) {
      window.postMessage({ type: 'DEEPSEEK_GENERATION_START' }, '*');
    }

    const response = await ORIGINAL_FETCH.apply(window, args);

    // Tentar capturar a conversa completa quando carregar histórico
    if (url.includes('/chat/history') || url.includes('/conversation')) {
      const cloned = response.clone();
      try {
        const data = await cloned.json();
        window.postMessage({ type: 'DEEPSEEK_CONVERSATION', data }, '*');
      } catch (e) {}
    }

    return response;
  };

  // Capturar mudanças de URL (SPA)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    window.postMessage({ type: 'DEEPSEEK_URL_CHANGE' }, '*');
  };
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    window.postMessage({ type: 'DEEPSEEK_URL_CHANGE' }, '*');
  };
  window.addEventListener('popstate', () => {
    window.postMessage({ type: 'DEEPSEEK_URL_CHANGE' }, '*');
  });
})();