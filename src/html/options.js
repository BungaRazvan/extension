document.addEventListener("DOMContentLoaded", () => {
  const tokenInput = document.getElementById("apiToken");
  const apiInput = document.getElementById("apiUrl");

  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");

  // Load saved token on page load
  chrome.storage.sync.get(["apiToken", "apiUrl"], ({ apiToken, apiUrl }) => {
    if (apiToken) {
      tokenInput.value = apiToken;
    }

    if (apiUrl) {
      apiInput.value = apiUrl;
    }
  });

  // Save token when button is clicked
  saveBtn.addEventListener("click", () => {
    const token = tokenInput.value.trim();
    const apiUrl = apiInput.value.trim();
    if (!token) {
      status.textContent = "Please enter a valid token.";
      status.style.color = "red";
      return;
    }

    chrome.storage.sync.set({ apiToken: token, apiUrl }, () => {
      status.textContent = "Settings saved!";
      status.style.color = "green";
    });
  });
});
