# 🔢 DeepSeek Counter — Modern Token Counter with Gradient UI

<p align="center">
  <img src="icons/deepseek.png" alt="DeepSeek Logo" width="200">
</p>

**DeepSeek Counter** is a browser extension that adds a real‑time token counter, cache timer, and a beautiful gradient bar (green → red) directly to the DeepSeek interface (`chat.deepseek.com`). Built from scratch to provide a clean and visually appealing experience.

![Screenshot of the extension](./screenshot.png)

---

## 🌐 Read this document in other languages

- [Português (Brasil)](./README.pt-BR.md)
- [Español](./README.es.md)
- [简体中文](./README.zh-CN.md)
- [हिन्दी](./README.hi.md)
- [Français](./README.fr.md)
- [Deutsch](./README.de.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)
- [Русский](./README.ru.md)
- [العربية](./README.ar.md)

---

## 🚀 Features

- 🔢 **Accumulated token counter** – sums up the tokens of all messages in the current conversation (estimate based on the `o200k_base` tokenizer). The total is stored in `sessionStorage`, so it doesn't reset when you reload the page.
- 🎯 **Gradient bar and white dot** – the bar has a fixed green‑to‑red gradient and a **white dot** that moves to indicate the used percentage (reference limit of 200,000 tokens).
- ⏳ **Cache timer** – shows how long the conversation will stay cached (5 minutes from the last assistant reply). Cached messages are cheaper and faster.
- 🌗 **Automatic theme adaptation** – the counter adjusts to your system's light or dark theme (text color, tooltip background, etc.).
- 📌 **Fixed positioning** – the counter sits in the **top‑right corner** (distance adjustable) without overlapping any UI buttons.
- 🔄 **Real‑time updates** – every new message sent or received updates the counter instantly.

---

## 🤔 How tokens are calculated for DeepSeek

Like other language models, DeepSeek splits text into **tokens** – units that can be words, parts of words, or special characters. The number of tokens directly affects computational cost and context window usage.

### 📊 Context limit (reference)

- DeepSeek has a maximum context of **1 million tokens** (1,000,000).
- However, the tokenizer used in this extension (`o200k_base`) was originally designed for OpenAI models and **does not exactly match DeepSeek’s native tokenization**.
- Therefore we use a **reference limit of 200,000 tokens** (only for the visual bar scale). The numeric count is still an **approximation**, useful to get a sense of consumption.

### ⚙️ How the extension counts tokens

1. **Message extraction** – The `content.js` script identifies each text block sent by you and the assistant using stable CSS classes (`.ds-message`, `.fbb737a4`, etc.).
2. **Tokenization** – Each new message is processed by the `o200k_base.js` tokenizer, which returns an approximate token count.
3. **Accumulation** – Tokens from all messages of the current conversation are summed and stored in `sessionStorage`. Even if you reload the page, the accumulated total is preserved.
4. **Real‑time update** – Whenever a new message is sent or received, the counter updates automatically (using `MutationObserver` and `setInterval`).

### 📈 Understanding the bar and the white dot

- The **gradient bar** represents the scale from **0% to 100%** of the reference limit (200,000 tokens).  
  - **Green** at the start (0%) → **Red** at the end (100%).
- The **white dot** moves along the bar, showing exactly the percentage of tokens already used in the current conversation.
- Below the bar you see the **absolute token count** (e.g. `~61,332 tokens`).

### ⏱️ Cache timer

- Whenever the assistant replies, a **5‑minute timer** starts.  
- During that period, the conversation is considered "cached", meaning further interactions should be faster and cheaper.  
- The counter shows exactly how much time remains until the cache expires.

---

## 🛠️ Installation

### Chrome / Edge / other Chromium browsers

1. **Download the extension files** (clone this repository or download the ZIP and extract it to a folder).
2. Go to `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode** (toggle in the top‑right corner).
4. Click **"Load unpacked"**.
5. Select the **folder** where you saved the extension files.
6. Done! The extension will appear in the list. Now go to `chat.deepseek.com` and see the counter in action.

### Firefox (temporary installation)

1. Go to `about:debugging`.
2. Click **"This Firefox"**.
3. Click **"Load Temporary Add‑on"**.
4. Select any file inside the extension folder (e.g. `manifest.json`).
5. The extension will be loaded. For permanent use you need to sign the extension.

---

## ⚙️ How It Works (Technical)

- **`content.js`** – Extracts messages from the DeepSeek DOM using stable selectors (`.ds-message`, `.fbb737a4`). Each new message is tokenized and tokens are accumulated in `sessionStorage`.
- **`ui.js`** – Injects a fixed container into the `body` with `position: fixed`, semi‑transparent background, gradient bar, white dot, and tooltips that adapt to the light/dark theme.
- **`o200k_base.js`** – Tokenizer (MIT) – used only for the approximate count. All credit for this file belongs to the [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) project.
- **Updates** – `MutationObserver` watches for DOM changes and `setInterval` (every 2 seconds) keeps the data fresh.

---

## 🔒 Privacy

- ✅ All data stays **locally** in your browser (`sessionStorage`).
- ✅ No data is sent to external servers.
- ✅ The extension only runs code on the domain `chat.deepseek.com`.
- ✅ No tracking or telemetry is used.

---

## 🙏 Credits

- 🧮 **Tokenizer** – [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) (MIT) – file `o200k_base.js`.
- 🎨 **Translation, visual design and DeepSeek integration** – [@havylliard](https://github.com/havylliard) (gradient, white dot, positioning, light/dark theme adaptation, multi‑language support).
- 💡 **Architectural inspiration** – The [Claude Counter](https://github.com/she-llac/claude-counter) served as a reference, but all message extraction, accumulation logic, and UI code were written **from scratch** for DeepSeek.

---

## 📄 License

MIT

---

## ❤️ Author’s Note

This extension was born out of the need for a simple, beautiful and functional token counter for DeepSeek, since the platform does not yet offer such a feature natively.  

**Happy prompting and great conversations!** 🚀
