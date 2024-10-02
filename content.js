// Initially load the target language and source language and start translation
chrome.storage.sync.get(["targetLang"], async ({ targetLang }) => {
  // initializeTranslation(targetLang); // Call a function to handle translation
});

// Function to initialize and handle translation
async function initializeTranslation(targetLang) {
  const DEEPL_API_KEY = "887cd0ca-6e26-4e24-8a53-77c67f90dda7:fx";

  console.log(`Target language: ${targetLang}`);

  // Function to translate text using DeepL
  async function translateText(text, targetLang) {
    const params = new URLSearchParams({
      auth_key: DEEPL_API_KEY, // DeepL API Key
      text: text, // The text to translate
      target_lang: targetLang, // The target language, e.g., "EN", "DE"
    });

    try {
      const response = await fetch(
        `https://api-free.deepl.com/v2/translate?${params}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (response.ok) {
        return data.translations[0].text; // The translated text
      } else {
        console.error("DeepL API Error:", data.message);
        return text; // Fallback to original text in case of error
      }
    } catch (error) {
      console.error("Translation failed:", error);
      return text; // Fallback to original text in case of error
    }
  }

  // Function to handle message translation in chat
  async function translateChat() {
    const chatMessages = document.querySelectorAll(
      ".message-in .selectable-text span, .message-out .selectable-text span"
    );
    for (const message of chatMessages) {
      const originalText = message.textContent.trim();

      if (
        !message.hasAttribute("data-translated") &&
        targetLang !== "EN-GB" &&
        originalText.length > 0
      ) {
        try {
          const translatedText = await translateText(originalText, targetLang);
          console.log(`Translated message: ${translatedText}`);
          message.textContent = translatedText;
          message.setAttribute("data-translated", "true");
        } catch (error) {
          console.error("Translation failed:", error);
        }
      }
    }
  }

  translateChat();
}

// Listen for messages from popup.js to update the target and source languages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateLanguage") {
    console.log(`New target language: ${message.targetLang}}`);

    // Clear previous translations before reinitializing
    const chatMessages = document.querySelectorAll(
      ".message-in .selectable-text span, .message-out .selectable-text span"
    );
    for (const message of chatMessages) {
      message.removeAttribute("data-translated");
    }

    // Reinitialize translation with the new languages
    initializeTranslation(message.targetLang);
  }
});
