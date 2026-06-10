(() => {
  'use strict';

  const CC = window.DeepSeekCounter = window.DeepSeekCounter || {};

  const translations = {
    en: {
      tokensLabel: 'tokens',
      cacheLabel: 'cached for',
      tooltipTokens: 'Approximate tokens (200k limit).\nGradient bar: green (0%) → red (100%).\nDot shows current percentage.',
      tooltipCache: 'Active cache based on the last assistant response.\nCached messages are cheaper.'
    },
    pt_BR: {
      tokensLabel: 'tokens',
      cacheLabel: 'cache por',
      tooltipTokens: 'Tokens aproximados (limite 200k).\nBarra gradiente: verde (0%) → vermelho (100%).\nBolinha mostra o percentual atual.',
      tooltipCache: 'Cache ativo baseado na última resposta do assistente.\nMensagens em cache são mais baratas.'
    },
    zh_CN: {
      tokensLabel: '令牌',
      cacheLabel: '缓存时间',
      tooltipTokens: '近似令牌数（上限 200k）。\n渐变条：绿色（0%）→红色（100%）。\n圆点显示当前百分比。',
      tooltipCache: '基于助手最后回复的活动缓存。\n缓存消息更便宜。'
    },
    es: {
      tokensLabel: 'tokens',
      cacheLabel: 'en caché por',
      tooltipTokens: 'Tokens aproximados (límite 200k).\nBarra gradiente: verde (0%) → rojo (100%).\nEl punto muestra el porcentaje actual.',
      tooltipCache: 'Caché activo basado en la última respuesta del asistente.\nLos mensajes en caché son más baratos.'
    },
    hi: {
      tokensLabel: 'टोकन',
      cacheLabel: 'कैश समय',
      tooltipTokens: 'अनुमानित टोकन (200k सीमा)।\nग्रेडिएंट बार: हरा (0%) → लाल (100%)।\nडॉट वर्तमान प्रतिशत दिखाता है।',
      tooltipCache: 'अंतिम सहायक प्रतिक्रिया के आधार पर सक्रिय कैश।\nकैश किए गए संदेश सस्ते होते हैं।'
    },
    fr: {
      tokensLabel: 'tokens',
      cacheLabel: 'en cache pour',
      tooltipTokens: 'Jetons approximatifs (limite 200k).\nBarre dégradée : vert (0%) → rouge (100%).\nLe point indique le pourcentage actuel.',
      tooltipCache: 'Cache actif basé sur la dernière réponse de l’assistant.\nLes messages en cache sont moins chers.'
    },
    de: {
      tokensLabel: 'Token',
      cacheLabel: 'gecached für',
      tooltipTokens: 'Ungefähre Token (200k Limit).\nFarbverlauf: grün (0%) → rot (100%).\nPunkt zeigt aktuellen Prozentsatz.',
      tooltipCache: 'Aktiver Cache basierend auf der letzten Antwort des Assistenten.\nGecachte Nachrichten sind günstiger.'
    },
    ja: {
      tokensLabel: 'トークン',
      cacheLabel: 'キャッシュ時間',
      tooltipTokens: '概算トークン（上限200k）。\nグラデーションバー：緑（0%）→赤（100%）。\nドットが現在の割合を示します。',
      tooltipCache: 'アシスタントの最後の応答に基づくアクティブキャッシュ。\nキャッシュされたメッセージはより安価です。'
    },
    ko: {
      tokensLabel: '토큰',
      cacheLabel: '캐시 시간',
      tooltipTokens: '추정 토큰 (200k 제한).\n그라데이션 바: 녹색(0%) → 빨간색(100%).\n점은 현재 비율을 표시합니다.',
      tooltipCache: '마지막 어시스턴트 응답 기반 활성 캐시.\n캐시된 메시지는 더 저렴합니다.'
    },
    ru: {
      tokensLabel: 'токенов',
      cacheLabel: 'в кэше',
      tooltipTokens: 'Примерное количество токенов (лимит 200k).\nГрадиентная шкала: зелёный (0%) → красный (100%).\nТочка показывает текущий процент.',
      tooltipCache: 'Активный кэш на основе последнего ответа ассистента.\nКэшированные сообщения дешевле.'
    },
    ar: {
      tokensLabel: 'رموز',
      cacheLabel: 'مخبأ لـ',
      tooltipTokens: 'رموز تقريبية (حد 200 ألف).\nشريط متدرج: أخضر (0%) ← أحمر (100%).\nالنقطة تظهر النسبة المئوية الحالية.',
      tooltipCache: 'ذاكرة تخزين مؤقت نشطة بناءً على آخر رد من المساعد.\nالرسائل المخبأة أرخص.'
    }
  };

  let currentLang = 'en';

  function formatSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  function makeTooltip(text) {
    const tip = document.createElement('div');
    tip.className = 'ds-tooltip';
    tip.textContent = text;
    document.body.appendChild(tip);
    return tip;
  }

  function setupTooltip(element, tooltip, { topOffset = 10 } = {}) {
    if (!element || !tooltip) return;
    if (element.hasAttribute('data-tooltip-setup')) return;
    element.setAttribute('data-tooltip-setup', 'true');
    element.classList.add('ds-tooltip-trigger');

    let pressTimer, hideTimer;
    const show = () => {
      const rect = element.getBoundingClientRect();
      tooltip.style.opacity = '1';
      const tipRect = tooltip.getBoundingClientRect();
      let left = rect.left + rect.width / 2;
      if (left + tipRect.width / 2 > window.innerWidth) left = window.innerWidth - tipRect.width / 2 - 10;
      if (left - tipRect.width / 2 < 0) left = tipRect.width / 2 + 10;
      let top = rect.top - tipRect.height - topOffset;
      if (top < 10) top = rect.bottom + 10;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.style.transform = 'translateX(-50%)';
    };
    const hide = () => {
      tooltip.style.opacity = '0';
      clearTimeout(hideTimer);
    };
    element.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        pressTimer = setTimeout(() => { show(); hideTimer = setTimeout(hide, 3000); }, 500);
      }
    });
    element.addEventListener('pointerup', () => clearTimeout(pressTimer));
    element.addEventListener('pointercancel', () => { clearTimeout(pressTimer); hide(); });
    element.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(); });
    element.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hide(); });
  }

  class CounterUI {
    constructor() {
      this.container = null;
      this.tokensSpan = null;
      this.cacheSpan = null;
      this.tokensMarker = null;
    }

    initialize() {
      chrome.storage.sync.get(['language'], (result) => {
        if (result.language && translations[result.language]) {
          currentLang = result.language;
        } else {
          currentLang = 'en';
        }
        this._buildUI();
        this._injectStyles();
        this._attachToBody();
        this._setupTooltips();
      });
    }

    _buildUI() {
      this.container = document.createElement('div');
      this.container.className = 'ds-counter-container';

      this.tokensSpan = document.createElement('span');
      this.tokensSpan.className = 'ds-tokens';

      this.cacheSpan = document.createElement('span');
      this.cacheSpan.className = 'ds-cache';

      this.container.appendChild(this.tokensSpan);
      this.container.appendChild(this.cacheSpan);
    }

    _injectStyles() {
      if (document.getElementById('ds-counter-styles')) return;
      const style = document.createElement('style');
      style.id = 'ds-counter-styles';
      style.textContent = `
        .ds-counter-container {
          position: fixed;
          top: 12px;
          right: 8%;
          z-index: 999999;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 6px 16px;
          border-radius: 40px;
          font-size: 13px;
          font-family: system-ui, -apple-system, sans-serif;
          background: rgba(20,20,25,0.85);
          backdrop-filter: blur(12px);
          color: #f5f5f5;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        @media (prefers-color-scheme: light) {
          .ds-counter-container {
            background: rgba(245,245,245,0.9);
            color: #111;
            border-color: rgba(0,0,0,0.1);
          }
        }
        .ds-tokens, .ds-cache {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .ds-bar {
          position: relative;
          width: 100px;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(to right, #4caf50, #ffeb3b, #f44336);
          border: 1px solid rgba(255,255,255,0.3);
        }
        .ds-bar-marker {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 0%;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 2px rgba(0,0,0,0.5);
          transition: left 0.2s ease;
        }
        .ds-tooltip {
          position: fixed;
          z-index: 1000000;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          background: #1e1e1e;
          color: white;
          white-space: pre-line;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
        }
        @media (prefers-color-scheme: light) {
          .ds-tooltip {
            background: #f0f0f0;
            color: #111;
            border: 1px solid #ccc;
          }
        }
        .ds-tooltip-trigger {
          cursor: help;
        }
      `;
      document.head.appendChild(style);
    }

    _attachToBody() {
      document.body.appendChild(this.container);
    }

    _setupTooltips() {
      const tokenTip = makeTooltip(translations[currentLang].tooltipTokens);
      const cacheTip = makeTooltip(translations[currentLang].tooltipCache);
      setupTooltip(this.tokensSpan, tokenTip, { topOffset: 8 });
      setupTooltip(this.cacheSpan, cacheTip, { topOffset: 8 });
    }

    setTokens(totalTokens) {
      if (typeof totalTokens !== 'number') {
        this.tokensSpan.innerHTML = '';
        return;
      }
      const pct = Math.min(100, (totalTokens / 200000) * 100);
      const label = translations[currentLang].tokensLabel;
      this.tokensSpan.innerHTML = `<span>~${totalTokens.toLocaleString()} ${label}</span>`;

      let bar = this.tokensSpan.querySelector('.ds-bar');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'ds-bar';
        const marker = document.createElement('div');
        marker.className = 'ds-bar-marker';
        bar.appendChild(marker);
        this.tokensSpan.appendChild(bar);
        this.tokensMarker = marker;
      } else {
        this.tokensMarker = bar.querySelector('.ds-bar-marker');
      }
      if (this.tokensMarker) {
        this.tokensMarker.style.left = `${pct}%`;
      }
    }

    setCacheTime(secondsLeft) {
      if (secondsLeft > 0) {
        const label = translations[currentLang].cacheLabel;
        this.cacheSpan.innerHTML = `<span>${label} </span><span>${formatSeconds(secondsLeft)}</span>`;
      } else {
        this.cacheSpan.innerHTML = '';
      }
    }

    setPendingCache(pending) {
      this.cacheSpan.style.opacity = pending ? '0.6' : '1';
    }
  }

  CC.ui = { CounterUI };
  window.DeepSeekCounter = CC;
})();