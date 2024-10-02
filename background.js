chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ targetLang: "EN-GB" }, () => {
    console.log("Default target and source languages set to English.");
  });
});
