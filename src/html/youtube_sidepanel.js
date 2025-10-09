chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
  const url = tabs[0].url;

  const playlistId = new URL(url).searchParams.get("list");

  if (!playlistId) return;

  chrome.storage.sync.get(["apiToken", "apiUrl"], ({ apiToken, apiUrl }) => {
    if (!apiToken || !apiUrl) return;

    const endpoint = new URL(
      `${apiUrl}/extension/youtube-playlist-missing-videos/${apiToken}/${playlistId}`
    );

    const frame = document.getElementById("sidepanel");
    frame.src = endpoint;
  });
});
