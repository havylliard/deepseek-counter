# 🔢 DeepSeek Counter — Contador de Tokens com Interface Moderna

<p align="center">
  <img src="icons/deepseek.png" alt="Logo DeepSeek" width="200">
</p>

**DeepSeek Counter** é uma extensão para navegador que adiciona um contador de tokens em tempo real, timer de cache e uma bela barra com gradiente (verde → vermelho) diretamente na interface do DeepSeek (`chat.deepseek.com`). Desenvolvida do zero para oferecer uma experiência limpa e visualmente agradável.

![Captura de tela da extensão](./screenshot.png)

---

## 🌐 Leia este documento em outros idiomas

- [English](./README.md)
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

## 🚀 Funcionalidades

- 🔢 **Contador de tokens acumulados** – soma os tokens de todas as mensagens da conversa atual (estimativa baseada no tokenizador `o200k_base`). O total é armazenado em `sessionStorage`, portanto não zera ao recarregar a página.
- 🎯 **Barra de gradiente e bolinha branca** – a barra tem gradiente fixo (verde → vermelho) e uma **bolinha branca** que se move indicando o percentual usado (limite de referência de 200.000 tokens).
- ⏳ **Timer de cache** – mostra quanto tempo a conversa permanecerá em cache (5 minutos a partir da última resposta do assistente). Mensagens em cache são mais baratas e rápidas.
- 🌗 **Adaptação automática ao tema** – o contador se ajusta ao tema claro ou escuro do sistema (cor do texto, fundo do tooltip etc.).
- 📌 **Posicionamento fixo** – o contador fica no **canto superior direito** (distância ajustável), sem sobrepor nenhum botão da interface.
- 🔄 **Atualização em tempo real** – cada nova mensagem enviada ou recebida atualiza o contador instantaneamente.

---

## 🤔 Como os tokens são calculados no DeepSeek?

Assim como outros modelos de linguagem, o DeepSeek divide o texto em **tokens** – unidades que podem ser palavras, partes de palavras ou caracteres especiais. A quantidade de tokens afeta diretamente o custo computacional e o uso da janela de contexto.

### 📊 Limite de contexto (referência)

- O DeepSeek tem um contexto máximo de **1 milhão de tokens** (1.000.000).
- Porém, o tokenizador usado nesta extensão (`o200k_base`) foi originalmente desenvolvido para modelos da OpenAI e **não reflete exatamente a tokenização nativa do DeepSeek**.
- Portanto, usamos um **limite de referência de 200.000 tokens** (apenas para a escala visual da barra). A contagem numérica continua sendo uma **estimativa aproximada**, útil para ter uma noção do consumo.

### ⚙️ Como a extensão conta os tokens

1. **Captura de mensagens** – O script `content.js` identifica cada bloco de texto enviado por você e pelo assistente usando classes CSS estáveis (`.ds-message`, `.fbb737a4` etc.).
2. **Tokenização** – Cada nova mensagem é processada pelo tokenizador `o200k_base.js`, que retorna um número aproximado de tokens.
3. **Acumulação** – Os tokens de todas as mensagens da conversa atual são somados e armazenados em `sessionStorage`. Assim, mesmo que você recarregue a página, o total acumulado não é perdido.
4. **Atualização em tempo real** – Sempre que uma mensagem é enviada ou recebida, o contador se atualiza automaticamente (usando `MutationObserver` e `setInterval`).

### 📈 Entendendo a barra e a bolinha

- A **barra de gradiente** representa a escala de **0% a 100%** do limite de referência (200.000 tokens).  
  - **Verde** no início (0%) → **Vermelho** no final (100%).
- A **bolinha branca** se move sobre a barra, mostrando exatamente o percentual de tokens já utilizados na conversa atual.
- Abaixo da barra, você vê a **contagem absoluta de tokens** (ex: `~61.332 tokens`).

### ⏱️ Timer de cache

- Sempre que o assistente responde, um **timer de 5 minutos** é iniciado.  
- Durante esse período, a conversa é considerada "em cache", o que significa que novas interações tendem a ser mais rápidas e baratas.  
- O contador mostra exatamente quanto tempo falta para o cache expirar.

---

## 🛠️ Instalação

### Chrome / Edge / outros navegadores Chromium

1. **Baixe os arquivos da extensão** (clone este repositório ou baixe o ZIP e extraia para uma pasta).
2. Acesse `chrome://extensions` (ou `edge://extensions`).
3. Ative o **Modo do desenvolvedor** (interruptor no canto superior direito).
4. Clique em **"Carregar sem compactação"**.
5. Selecione a **pasta** onde você salvou os arquivos da extensão.
6. Pronto! A extensão aparecerá na lista. Agora acesse `chat.deepseek.com` e veja o contador funcionando.

### Firefox (instalação temporária)

1. Acesse `about:debugging`.
2. Clique em **"Este Firefox"** (ou "This Firefox").
3. Clique em **"Carregar extensão temporária"**.
4. Selecione qualquer arquivo dentro da pasta da extensão (ex: `manifest.json`).
5. A extensão será carregada. Para uso permanente, você precisa assinar a extensão.

---

## ⚙️ Como funciona (tecnicamente)

- **`content.js`** – Extrai as mensagens do DOM do DeepSeek usando seletores estáveis (`.ds-message`, `.fbb737a4`). Cada nova mensagem é tokenizada e os tokens são acumulados em `sessionStorage`.
- **`ui.js`** – Injeta um container fixo no `body` com `position: fixed`, fundo semitransparente, barra gradiente, bolinha branca e tooltips que se adaptam ao tema claro/escuro.
- **`o200k_base.js`** – Tokenizador (MIT) – usado apenas para a contagem aproximada. Todo o crédito deste arquivo pertence ao projeto [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer).
- **Atualizações** – `MutationObserver` monitora mudanças no DOM e `setInterval` (a cada 2 segundos) mantém os dados atualizados.

---

## 🔒 Privacidade

- ✅ Todos os dados permanecem **localmente** no seu navegador (`sessionStorage`).
- ✅ Nenhum dado é enviado para servidores externos.
- ✅ A extensão só executa código no domínio `chat.deepseek.com`.
- ✅ Nenhum sistema de rastreamento ou telemetria é utilizado.

---

## 🙏 Créditos

- 🧮 **Tokenizador** – [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) (MIT) – arquivo `o200k_base.js`.
- 🎨 **Tradução, design visual e integração com DeepSeek** – [@havylliard](https://github.com/havylliard) (gradiente, bolinha, posicionamento, adaptação de tema claro/escuro, suporte multilíngue).
- 💡 **Inspiração arquitetural** – O [Claude Counter](https://github.com/she-llac/claude-counter) serviu como referência, mas todo o código de extração de mensagens, lógica de acumulação e interface foi escrito **do zero** para o DeepSeek.

---

## 📄 Licença

MIT

---

## ❤️ Nota do autor

Esta extensão nasceu da necessidade de ter um contador de tokens simples, bonito e funcional para o DeepSeek, já que a plataforma ainda não oferece essa ferramenta nativamente.  

**Boas conversas e bons prompts!** 🚀