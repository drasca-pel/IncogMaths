// src/installPrompt.js

let deferredPrompt = null;

export function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    deferredPrompt = event;

    window.dispatchEvent(
      new CustomEvent("incog-install-available")
    );
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;

    window.dispatchEvent(
      new CustomEvent("incog-app-installed")
    );
  });
}

export async function showInstallPrompt() {
  if (!deferredPrompt) {
    return false;
  }

  deferredPrompt.prompt();

  const result = await deferredPrompt.userChoice;

  deferredPrompt = null;

  return result.outcome === "accepted";
}