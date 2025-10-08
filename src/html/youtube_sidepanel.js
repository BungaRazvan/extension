// import { BASE_URL } from "../utils.js";

const BASE_URL = "http://localhost:8000";

chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
  console.log(tabs);
  const url = tabs[0].url;

  const playlistId = new URL(url).searchParams.get("list");

  console.log({ playlistId });
  if (!playlistId) return;

  chrome.storage.sync.get(["apiToken", "apiUrl"], ({ apiToken, apiUrl }) => {
    console.log(apiUrl);
    if (!apiToken || !apiUrl) return;

    const endpoint = new URL(
      `${apiUrl}/extension/youtube-playlist-missing-videos/${apiToken}/${playlistId}`
    );

    const frame = document.getElementById("sidepanel");
    frame.src = endpoint;
  });
});
