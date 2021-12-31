const newDiv = document.createElement("div");
console.log("run");

newDiv.addEventListener("click", () => {
  const playlistName = document.getElementById("text-displayed").innerText;
  const videos = document.querySelectorAll("ytd-playlist-video-renderer");
  const titles = getVidoesTitles(videos);

  const file = new File(
    [JSON.stringify({ [playlistName]: titles })],
    "foo.json",
    {
      type: "application/json",
    }
  );

  const fileUrl = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = fileUrl;
  anchor.download = "foo.json";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(fileUrl);
});

function getVidoesTitles(videos) {
  const titles = [];

  for (let video of videos) {
    titles.push(
      video.children[1].children[0].children[1].textContent
        .replaceAll("\n", "")
        .replaceAll(/ +(?= )/g, "")
        .replaceAll("•", "")
        .trim()
    );
  }

  return titles;
}

function addBackupIcon() {
  const yt_menu = document.querySelector(
    "div#menu.style-scope.ytd-playlist-sidebar-primary-info-renderer"
  );

  newDiv.innerHTML = `
  <button id="button" style="style-scope yt-icon-button" class="custom-button-backup" aria-label="Backup">
  <svg viewBox="0 0 24 24"><path d="M 6 2 C 4.895 2 4 2.895 4 4 L 4 20 C 4 21.105 4.895 22 6 22 L 11.078125 22 C 10.719125 21.381 10.444719 20.71 10.261719 20 L 6 20 L 6 16 L 10.261719 16 C 10.444719 15.29 10.719125 14.619 11.078125 14 L 6 14 L 6 10 L 18 10 C 18.692 10 19.36 10.096719 20 10.261719 L 20 4 C 20 2.895 19.105 2 18 2 L 6 2 z M 6 4 L 18 4 L 18 8 L 6 8 L 6 4 z M 18 12 C 14.698375 12 12 14.698375 12 18 C 12 19.397061 12.486939 20.684418 13.292969 21.707031 L 12 23 L 16 23 L 16 19 L 14.716797 20.283203 C 14.266287 19.637225 14 18.853382 14 18 C 14 15.779625 15.779625 14 18 14 C 20.220375 14 22 15.779625 22 18 C 22 20.220375 20.220375 22 18 22 L 18 24 C 21.301625 24 24 21.301625 24 18 C 24 14.698375 21.301625 12 18 12 z"></path></svg>
  </button>
  `;

  yt_menu.children[0].children[0].append(newDiv);
}

setInterval(() => {
  if (
    !window.location.href.includes("https://www.youtube.com/playlist?list=")
  ) {
    return;
  }

  const backupExists =
    document.getElementsByClassName("custom-button-backup").length == 0;

  if (!backupExists) {
    return;
  }

  addBackupIcon();
}, 0);

// chrome.storage.local.set({ key: "testsssss" }, function () {});

// chrome.storage.local.get(["key"], function (result) {
//   console.log("Value currently is " + result.key);
// });
