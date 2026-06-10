# 🔢 DeepSeek Counter — Contador de Tokens con Interfaz Moderna

<p align="center">
  <img src="icons/deepseek.png" alt="Logo de DeepSeek" width="200">
</p>

**DeepSeek Counter** es una extensión para navegador que añade un contador de tokens en tiempo real, temporizador de caché y una hermosa barra con gradiente (verde → rojo) directamente en la interfaz de DeepSeek (`chat.deepseek.com`). Desarrollada desde cero para ofrecer una experiencia limpia y visualmente atractiva.

![Captura de pantalla de la extensión](./screenshot.png)

---

## 🌐 Lee este documento en otros idiomas

- [English](./README.md)
- [Português (Brasil)](./README.pt-BR.md)
- [简体中文](./README.zh-CN.md)
- [हिन्दी](./README.hi.md)
- [Français](./README.fr.md)
- [Deutsch](./README.de.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)
- [Русский](./README.ru.md)
- [العربية](./README.ar.md)

---

## 🚀 Características

- 🔢 **Contador acumulado de tokens** – suma los tokens de todos los mensajes de la conversación actual (estimación basada en el tokenizador `o200k_base`). El total se almacena en `sessionStorage`, por lo que no se reinicia al recargar la página.
- 🎯 **Barra de gradiente y punto blanco** – la barra tiene un gradiente fijo (verde → rojo) y un **punto blanco** que se mueve para indicar el porcentaje usado (límite de referencia de 200.000 tokens).
- ⏳ **Temporizador de caché** – muestra cuánto tiempo permanecerá en caché la conversación (5 minutos desde la última respuesta del asistente). Los mensajes en caché son más baratos y rápidos.
- 🌗 **Adaptación automática al tema** – el contador se ajusta al tema claro u oscuro del sistema (color del texto, fondo del tooltip, etc.).
- 📌 **Posicionamiento fijo** – el contador se sitúa en la **esquina superior derecha** (distancia ajustable), sin superponer ningún botón de la interfaz.
- 🔄 **Actualización en tiempo real** – cada nuevo mensaje enviado o recibido actualiza el contador instantáneamente.

---

## 🤔 Cómo se calculan los tokens en DeepSeek

Al igual que otros modelos de lenguaje, DeepSeek divide el texto en **tokens** – unidades que pueden ser palabras, partes de palabras o caracteres especiales. La cantidad de tokens afecta directamente el coste computacional y el uso de la ventana de contexto.

### 📊 Límite de contexto (referencia)

- DeepSeek tiene un contexto máximo de **1 millón de tokens** (1.000.000).
- Sin embargo, el tokenizador usado en esta extensión (`o200k_base`) fue originalmente diseñado para modelos de OpenAI y **no refleja exactamente la tokenización nativa de DeepSeek**.
- Por lo tanto, usamos un **límite de referencia de 200.000 tokens** (solo para la escala visual de la barra). El recuento numérico sigue siendo una **estimación aproximada**, útil para tener una noción del consumo.

### ⚙️ Cómo la extensión cuenta los tokens

1. **Captura de mensajes** – El script `content.js` identifica cada bloque de texto enviado por ti y por el asistente usando clases CSS estables (`.ds-message`, `.fbb737a4`, etc.).
2. **Tokenización** – Cada nuevo mensaje es procesado por el tokenizador `o200k_base.js`, que devuelve un número aproximado de tokens.
3. **Acumulación** – Los tokens de todos los mensajes de la conversación actual se suman y se almacenan en `sessionStorage`. Así, incluso si recargas la página, el total acumulado no se pierde.
4. **Actualización en tiempo real** – Siempre que se envía o recibe un mensaje, el contador se actualiza automáticamente (usando `MutationObserver` y `setInterval`).

### 📈 Entendiendo la barra y el punto blanco

- La **barra de gradiente** representa la escala de **0% a 100%** del límite de referencia (200.000 tokens).  
  - **Verde** al inicio (0%) → **Rojo** al final (100%).
- El **punto blanco** se mueve sobre la barra, mostrando exactamente el porcentaje de tokens ya utilizados en la conversación actual.
- Debajo de la barra ves el **recuento absoluto de tokens** (ej: `~61.332 tokens`).

### ⏱️ Temporizador de caché

- Cada vez que el asistente responde, se inicia un **temporizador de 5 minutos**.  
- Durante ese período, la conversación se considera "en caché", lo que significa que las interacciones posteriores deberían ser más rápidas y económicas.  
- El contador muestra exactamente el tiempo que queda hasta que expire la caché.

---

## 🛠️ Instalación

### Chrome / Edge / otros navegadores Chromium

1. **Descarga los archivos de la extensión** (clona este repositorio o descarga el ZIP y extráelo en una carpeta).
2. Ve a `chrome://extensions` (o `edge://extensions`).
3. Activa el **Modo de desarrollador** (interruptor en la esquina superior derecha).
4. Haz clic en **"Cargar descomprimida"**.
5. Selecciona la **carpeta** donde guardaste los archivos de la extensión.
6. ¡Listo! La extensión aparecerá en la lista. Ahora ve a `chat.deepseek.com` y comprueba que el contador funciona.

### Firefox (instalación temporal)

1. Ve a `about:debugging`.
2. Haz clic en **"Este Firefox"**.
3. Haz clic en **"Cargar extensión temporal"**.
4. Selecciona cualquier archivo dentro de la carpeta de la extensión (ej: `manifest.json`).
5. La extensión se cargará. Para un uso permanente, necesitas firmar la extensión.

---

## ⚙️ Cómo funciona (técnicamente)

- **`content.js`** – Extrae los mensajes del DOM de DeepSeek usando selectores estables (`.ds-message`, `.fbb737a4`). Cada nuevo mensaje es tokenizado y los tokens se acumulan en `sessionStorage`.
- **`ui.js`** – Inyecta un contenedor fijo en el `body` con `position: fixed`, fondo semitransparente, barra de gradiente, punto blanco y tooltips que se adaptan al tema claro/oscuro.
- **`o200k_base.js`** – Tokenizador (MIT) – utilizado solo para el recuento aproximado. Todo el crédito de este archivo pertenece al proyecto [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer).
- **Actualizaciones** – `MutationObserver` vigila los cambios en el DOM y `setInterval` (cada 2 segundos) mantiene los datos actualizados.

---

## 🔒 Privacidad

- ✅ Todos los datos permanecen **localmente** en tu navegador (`sessionStorage`).
- ✅ No se envía ningún dato a servidores externos.
- ✅ La extensión solo ejecuta código en el dominio `chat.deepseek.com`.
- ✅ No se utiliza ningún sistema de rastreo o telemetría.

---

## 🙏 Créditos

- 🧮 **Tokenizador** – [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) (MIT) – archivo `o200k_base.js`.
- 🎨 **Traducción, diseño visual e integración con DeepSeek** – [@havylliard](https://github.com/havylliard) (gradiente, punto blanco, posicionamiento, adaptación de tema claro/oscuro, soporte multilenguaje).
- 💡 **Inspiración arquitectural** – El [Claude Counter](https://github.com/she-llac/claude-counter) sirvió como referencia, pero todo el código de extracción de mensajes, lógica de acumulación e interfaz fue escrito **desde cero** para DeepSeek.

---

## 📄 Licencia

MIT

---

## ❤️ Nota del autor

Esta extensión nació de la necesidad de tener un contador de tokens sencillo, bonito y funcional para DeepSeek, ya que la plataforma aún no ofrece esta herramienta de forma nativa.  

**¡Felices conversaciones y buenos prompts!** 🚀