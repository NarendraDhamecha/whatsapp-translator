document.getElementById("save-btn").addEventListener("click", () => {
  const selectedLang = document.getElementById("language-select").value;

  // Save selected language and source language in chrome.storage.sync
  chrome.storage.sync.set({ targetLang: selectedLang }, () => {
    console.log(`Target language set to ${selectedLang}.`);

    // Send a message to content.js to update the language
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "updateLanguage",
        targetLang: selectedLang,
      });
    });
  });
});
