// import { BASE_URL } from "../utils.js";

const BASE_URL = "http://localhost:8000";

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const url = tabs[0].url;

  const playlistId = new URL(url).searchParams.get("list");

  if (playlistId) {
    const frame = document.getElementById("sidepanel");
    frame.src = `${BASE_URL}/extension/youtube-playlist-missing-videos/${playlistId}`;
  }
});
