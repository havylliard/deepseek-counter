# 🔢 DeepSeek Counter — Compteur de Tokens Moderne avec Interface Dégradée

<p align="center">
  <img src="icons/deepseek.png" alt="Logo DeepSeek" width="200">
</p>

**DeepSeek Counter** est une extension de navigateur qui ajoute un compteur de tokens en temps réel, un minuteur de cache et une belle barre dégradée (vert → rouge) directement sur l'interface de DeepSeek (`chat.deepseek.com`). Développée à partir de zéro pour offrir une expérience propre et visuellement agréable.

![Capture d'écran de l'extension](./screenshot.png)

---

## 🌐 Lire ce document dans d'autres langues

- [English](./README.md)
- [Português (Brasil)](./README.pt-BR.md)
- [Español](./README.es.md)
- [简体中文](./README.zh-CN.md)
- [हिन्दी](./README.hi.md)
- [Deutsch](./README.de.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)
- [Русский](./README.ru.md)
- [العربية](./README.ar.md)

---

## 🚀 Fonctionnalités

- 🔢 **Compteur de tokens cumulé** – additionne les tokens de tous les messages de la conversation actuelle (estimation basée sur le tokenizer `o200k_base`). Le total est stocké dans `sessionStorage`, donc il n'est pas réinitialisé lors du rechargement de la page.
- 🎯 **Barre dégradée et point blanc** – la barre a un dégradé fixe (vert → rouge) et un **point blanc** qui se déplace pour indiquer le pourcentage utilisé (limite de référence de 200 000 tokens).
- ⏳ **Minuteur de cache** – indique combien de temps la conversation restera en cache (5 minutes à partir de la dernière réponse de l'assistant). Les messages en cache sont moins chers et plus rapides.
- 🌗 **Adaptation automatique au thème** – le compteur s'adapte au thème clair ou sombre du système (couleur du texte, fond de l'infobulle, etc.).
- 📌 **Positionnement fixe** – le compteur se trouve dans le **coin supérieur droit** (distance ajustable), sans chevaucher les boutons de l'interface.
- 🔄 **Mise à jour en temps réel** – chaque nouveau message envoyé ou reçu met à jour le compteur instantanément.

---

## 🤔 Comment les tokens sont calculés sur DeepSeek ?

Comme les autres modèles de langage, DeepSeek divise le texte en **tokens** – des unités qui peuvent être des mots, des parties de mots ou des caractères spéciaux. Le nombre de tokens affecte directement le coût de calcul et l'utilisation de la fenêtre de contexte.

### 📊 Limite de contexte (référence)

- DeepSeek a une limite de contexte maximale de **1 million de tokens** (1 000 000).
- Cependant, le tokenizer utilisé dans cette extension (`o200k_base`) a été conçu à l'origine pour les modèles OpenAI et **ne correspond pas exactement à la tokenisation native de DeepSeek**.
- Par conséquent, nous utilisons une **limite de référence de 200 000 tokens** (uniquement pour l'échelle visuelle de la barre). Le décompte numérique reste une **estimation approximative**, utile pour avoir une idée de la consommation.

### ⚙️ Comment l'extension compte les tokens

1. **Extraction des messages** – Le script `content.js` identifie chaque bloc de texte envoyé par vous et par l'assistant à l'aide de classes CSS stables (`.ds-message`, `.fbb737a4`, etc.).
2. **Tokenisation** – Chaque nouveau message est traité par le tokenizer `o200k_base.js`, qui renvoie un nombre approximatif de tokens.
3. **Accumulation** – Les tokens de tous les messages de la conversation actuelle sont additionnés et stockés dans `sessionStorage`. Ainsi, même si vous rechargez la page, le total cumulé n'est pas perdu.
4. **Mise à jour en temps réel** – Chaque fois qu'un message est envoyé ou reçu, le compteur se met automatiquement à jour (en utilisant `MutationObserver` et `setInterval`).

### 📈 Comprendre la barre dégradée et le point blanc

- La **barre dégradée** représente l'échelle de **0% à 100%** de la limite de référence (200 000 tokens).  
  - **Vert** au début (0%) → **Rouge** à la fin (100%).
- Le **point blanc** se déplace le long de la barre, montrant exactement le pourcentage de tokens déjà utilisés dans la conversation actuelle.
- Sous la barre, vous voyez le **nombre absolu de tokens** (ex: `~61 332 tokens`).

### ⏱️ Minuteur de cache

- Chaque fois que l'assistant répond, un **minuteur de 5 minutes** démarre.  
- Pendant cette période, la conversation est considérée comme « en cache », ce qui signifie que les interactions ultérieures devraient être plus rapides et moins coûteuses.  
- Le compteur indique exactement le temps restant avant l'expiration du cache.

---

## 🛠️ Installation

### Chrome / Edge / autres navigateurs Chromium

1. **Téléchargez les fichiers de l'extension** (clonez ce dépôt ou téléchargez le ZIP et extrayez‑le dans un dossier).
2. Allez sur `chrome://extensions` (ou `edge://extensions`).
3. Activez le **Mode développeur** (interrupteur en haut à droite).
4. Cliquez sur **"Charger l'extension non empaquetée"**.
5. Sélectionnez le **dossier** dans lequel vous avez sauvegardé les fichiers de l'extension.
6. Terminé ! L'extension apparaîtra dans la liste. Rendez‑vous sur `chat.deepseek.com` et voyez le compteur en action.

### Firefox (installation temporaire)

1. Allez sur `about:debugging`.
2. Cliquez sur **"Ce Firefox"**.
3. Cliquez sur **"Charger un module complémentaire temporaire"**.
4. Sélectionnez n'importe quel fichier dans le dossier de l'extension (par exemple `manifest.json`).
5. L'extension sera chargée. Pour une utilisation permanente, vous devez signer l'extension.

---

## ⚙️ Comment ça fonctionne (technique)

- **`content.js`** – Extrait les messages du DOM de DeepSeek en utilisant des sélecteurs stables (`.ds-message`, `.fbb737a4`). Chaque nouveau message est tokenisé et les tokens sont accumulés dans `sessionStorage`.
- **`ui.js`** – Injecte un conteneur fixe dans le `body` avec `position: fixed`, fond semi‑transparent, barre dégradée, point blanc et info‑bulles qui s'adaptent au thème clair/sombre.
- **`o200k_base.js`** – Tokenizer (MIT) – utilisé uniquement pour le comptage approximatif. Tout le crédit de ce fichier revient au projet [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer).
- **Mises à jour** – `MutationObserver` surveille les changements du DOM et `setInterval` (toutes les 2 secondes) maintient les données à jour.

---

## 🔒 Confidentialité

- ✅ Toutes les données restent **localement** dans votre navigateur (`sessionStorage`).
- ✅ Aucune donnée n'est envoyée à des serveurs externes.
- ✅ L'extension n'exécute du code que sur le domaine `chat.deepseek.com`.
- ✅ Aucun système de suivi ou de télémétrie n'est utilisé.

---

## 🙏 Crédits

- 🧮 **Tokenizer** – [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) (MIT) – fichier `o200k_base.js`.
- 🎨 **Traduction, design visuel et intégration DeepSeek** – [@havylliard](https://github.com/havylliard) (dégradé, point blanc, positionnement, adaptation au thème clair/sombre, support multilingue).
- 💡 **Inspiration architecturale** – [Claude Counter](https://github.com/she-llac/claude-counter) a servi de référence, mais tout le code d'extraction des messages, la logique d'accumulation et l'interface ont été écrits **de zéro** pour DeepSeek.

---

## 📄 Licence

MIT

---

## ❤️ Note de l'auteur

Cette extension est née du besoin d'un compteur de tokens simple, élégant et fonctionnel pour DeepSeek, car la plateforme n'offre pas encore cette fonctionnalité nativement.  

**Bonne continuation et excellents prompts !** 🚀