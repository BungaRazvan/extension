function getPlaylistVidoesTitles() {
  const playlistName = document.title.replaceAll(" - YouTube", "").trim();

  console.log(playlistName);
  const videos = document.querySelectorAll("ytd-playlist-video-renderer");
  const titles = [];

  for (let video of videos) {
    if (!video) {
      continue;
    }

    titles.push(
      video.children[1].children[0].children[1].children[0].textContent
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
  const dislike_btns = document.querySelectorAll(
    "#actions #actions-inner #menu"
  );

  if (dislike_btns.length == 0) {
    return;
  }

  newDiv.innerHTML = `
  <div id="loop-btn-style" class="loop-btn-style">
  <button
  id="custom-button-loop"
  class="custom-button-loop"
  aria-label="Loop Video"
>
  <svg
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    class="style-scope yt-icon"
    style="pointer-events: none; width: 80%"
    id="custom-loop-icon-disabled"
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
    id="custom-loop-icon-active"
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
</div>
`;

  dislike_btns[0].append(newDiv);
}

function addBackupIcon(newDiv) {
  const yt_menu = document.querySelectorAll(
    ".page-header-view-model-wiz__page-header-flexible-actions.yt-flexible-actions-view-model-wiz"
  );

  if (yt_menu.length == 0) {
    return;
  }

  newDiv.innerHTML = `
  <button
  id="button"
  style="style-scope yt-icon-button"
  class="custom-button-backup yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--overlay yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
  aria-label="Backup"
>
  <svg viewBox="0 0 24 24">
    <path
      d="M 6 2 C 4.895 2 4 2.895 4 4 L 4 20 C 4 21.105 4.895 22 6 22 L 11.078125 22 C 10.719125 21.381 10.444719 20.71 10.261719 20 L 6 20 L 6 16 L 10.261719 16 C 10.444719 15.29 10.719125 14.619 11.078125 14 L 6 14 L 6 10 L 18 10 C 18.692 10 19.36 10.096719 20 10.261719 L 20 4 C 20 2.895 19.105 2 18 2 L 6 2 z M 6 4 L 18 4 L 18 8 L 6 8 L 6 4 z M 18 12 C 14.698375 12 12 14.698375 12 18 C 12 19.397061 12.486939 20.684418 13.292969 21.707031 L 12 23 L 16 23 L 16 19 L 14.716797 20.283203 C 14.266287 19.637225 14 18.853382 14 18 C 14 15.779625 15.779625 14 18 14 C 20.220375 14 22 15.779625 22 18 C 22 20.220375 20.220375 22 18 22 L 18 24 C 21.301625 24 24 21.301625 24 18 C 24 14.698375 21.301625 12 18 12 z"
    ></path>
  </svg>
</button>
  `;

  yt_menu[1].children[0].append(newDiv);
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
  document
    .querySelector("#custom-loop-icon-disabled")
    .classList.toggle("d-none");
  document.querySelector("#custom-loop-icon-active").classList.toggle("d-none");
}

function removeShorts() {
  const shorts = document.querySelectorAll(
    "#title-container.style-scope.ytd-reel-shelf-renderer"
  );

  if (!shorts.length) {
    return;
  }

  shorts[0].parentElement.style.display = "none";
}

setInterval(() => {
  if (checkUrl("/playlist?list=")) {
    const isBackupExists =
      document.getElementsByClassName("custom-button-backup").length == 0;

    if (!isBackupExists) {
      return;
    }

    const newDiv = document.createElement("div");
    newDiv.classList.add(
      "yt-flexible-actions-view-model-wiz__action",
      "yt-flexible-actions-view-model-wiz__action--row-action",
      "yt-flexible-actions-view-model-wiz__action--icon-only-button"
    );

    addBackupIcon(newDiv);
    newDiv.addEventListener("click", () => getPlaylistVidoesTitles());
  }

  if (checkUrl("/watch?v=")) {
    removeShorts();

    const isLoopVideoButton =
      document.getElementsByClassName("custom-button-loop").length == 0;

    if (!isLoopVideoButton) {
      return;
    }

    const newDiv = document.createElement("div");

    newDiv.classList.add(
      "custom-button-loop-container"
      // "yt-spec-button-shape-next",
      // "yt-spec-button-shape-next--tonal",
      // "yt-spec-button-shape-next--mono",
      // "yt-spec-button-shape-next--size-m",
      // "yt-spec-button-shape-next--icon-leading",
      // "yt-spec-button-shape-next--enable-backdrop-filter-experiment"
    );

    addLoopVideoIcon(newDiv);

    const loopBtn = document.querySelector("#loop-btn-style");

    if (loopBtn) {
      loopBtn.addEventListener("click", () => loopVideo(newDiv));
    }
  }
}, 1000);
