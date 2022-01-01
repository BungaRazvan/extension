function getPlaylistVidoesTitles() {
  const playlistName = document.getElementById("text-displayed").innerText;
  const videos = document.querySelectorAll("ytd-playlist-video-renderer");
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

  // Clean up
  document.body.removeChild(anchor);
  URL.revokeObjectURL(fileUrl);
}

function addLoopVideoIcon(newDiv) {
  const info_bar = document.querySelector(
    "div#info.style-scope.ytd-video-primary-info-renderer"
  );

  if (!info_bar) {
    return;
  }

  newDiv.innerHTML = `
  <button
  id="button"
  style="style-scope yt-icon-button"
  class="custom-button-loop"
  aria-label="Loop Video"
>
  <svg
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    class="style-scope yt-icon"
    style="pointer-events: none; width: 80%"
  >
    <g class="style-scope yt-icon">
      <path
        d="M21,13h1v5L3.93,18.03l2.62,2.62l-0.71,0.71L1.99,17.5l3.85-3.85l0.71,0.71l-2.67,2.67L21,17V13z M3,7l17.12-0.03 l-2.67,2.67l0.71,0.71l3.85-3.85l-3.85-3.85l-0.71,0.71l2.62,2.62L2,6v5h1V7z"
        class="style-scope yt-icon"
      ></path>
    </g>
  </svg>
  <svg
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    class="style-scope yt-icon d-none"
    style="pointer-events: none; width: 80%"
  >
    <g class="style-scope yt-icon">
      <path
        d="M20,14h2v5L5.84,19.02l1.77,1.77l-1.41,1.41L1.99,18l4.21-4.21l1.41,1.41l-1.82,1.82L20,17V14z M4,7l14.21-0.02l-1.82,1.82 l1.41,1.41L22.01,6l-4.21-4.21l-1.41,1.41l1.77,1.77L2,5v6h2V7z"
        class="style-scope yt-icon"
      ></path>
    </g>
  </svg>
</button>
<p>Loop Video</p>
`;

  info_bar.children[2].children[0].children[0].children[0].append(newDiv);
}

function addBackupIcon(newDiv) {
  const yt_menu = document.querySelector(
    "div#menu.style-scope.ytd-playlist-sidebar-primary-info-renderer"
  );

  if (!yt_menu) {
    return;
  }

  newDiv.innerHTML = `
  <button
  id="button"
  style="style-scope yt-icon-button"
  class="custom-button-backup"
  aria-label="Backup"
>
  <svg viewBox="0 0 24 24">
    <path
      d="M 6 2 C 4.895 2 4 2.895 4 4 L 4 20 C 4 21.105 4.895 22 6 22 L 11.078125 22 C 10.719125 21.381 10.444719 20.71 10.261719 20 L 6 20 L 6 16 L 10.261719 16 C 10.444719 15.29 10.719125 14.619 11.078125 14 L 6 14 L 6 10 L 18 10 C 18.692 10 19.36 10.096719 20 10.261719 L 20 4 C 20 2.895 19.105 2 18 2 L 6 2 z M 6 4 L 18 4 L 18 8 L 6 8 L 6 4 z M 18 12 C 14.698375 12 12 14.698375 12 18 C 12 19.397061 12.486939 20.684418 13.292969 21.707031 L 12 23 L 16 23 L 16 19 L 14.716797 20.283203 C 14.266287 19.637225 14 18.853382 14 18 C 14 15.779625 15.779625 14 18 14 C 20.220375 14 22 15.779625 22 18 C 22 20.220375 20.220375 22 18 22 L 18 24 C 21.301625 24 24 21.301625 24 18 C 24 14.698375 21.301625 12 18 12 z"
    ></path>
  </svg>
</button>
  `;

  yt_menu.children[0].children[0].append(newDiv);
}

function checkUrl(str) {
  return window.location.href.includes(str);
}

function loopVideo(newDiv) {
  const video = document.querySelector("video");

  if (!video) {
    return;
  }

  video.loop = !video.loop;
  newDiv.children[0].children[0].classList.toggle("d-none");
  newDiv.children[0].children[1].classList.toggle("d-none");
}

setInterval(() => {
  if (checkUrl("/playlist?list=")) {
    const isbackupExists =
      document.getElementsByClassName("custom-button-backup").length == 0;

    if (!isbackupExists) {
      return;
    }

    const newDiv = document.createElement("div");

    addBackupIcon(newDiv);
    newDiv.addEventListener("click", () => getPlaylistVidoesTitles());
  }

  if (checkUrl("/watch?v=")) {
    const isloopVideoButton =
      document.getElementsByClassName("custom-button-loop").length == 0;

    if (!isloopVideoButton) {
      return;
    }

    const newDiv = document.createElement("div");
    newDiv.classList.add("custom-button-loop-container");

    addLoopVideoIcon(newDiv);
    newDiv.addEventListener("click", () => loopVideo(newDiv));
  }
}, 1000);
