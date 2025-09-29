async function fetchPlaylist(url) {
  const res = await fetch("http://localhost:8000/list_songs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  console.log(data.songs);
}

var query = { active: true, currentWindow: true };
